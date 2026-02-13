import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, increment } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Shield, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

import LoadingScreen from '../components/ui/LoadingScreen';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeSnapshot = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
            // Unsubscribe from previous snapshot listener if exists
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
            }

            if (firebaseUser) {
                // Real-time listener for user profile
                unsubscribeSnapshot = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data();

                        // Check if we need to auto-generate referral code (Backward Compatibility)
                        if (!userData.myReferralCode && userData.firstname) {
                            // This is handled by ensureReferralCode/Profile.jsx mostly, 
                            // but the snapshot will pick up changes instantly.
                        }

                        setUser({ ...firebaseUser, ...userData });
                    } else {
                        // Document might not exist yet during registration race condition, 
                        // but it will trigger again when created.
                        setUser(firebaseUser);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Auth Snapshot Error:", error);
                    setLoading(false);
                });
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, []);

    const login = async (email, password) => {
        const loadingToast = toast.loading('Authenticating Terminal...', {
            icon: <Shield size={18} className="text-primary animate-pulse" />
        });
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Connection Established', {
                id: loadingToast,
                icon: <CheckCircle size={18} className="text-emerald-500" />
            });
        } catch (error) {
            toast.error(error.message || 'Access Denied', {
                id: loadingToast,
                icon: <AlertCircle size={18} className="text-red-500" />
            });
            throw error;
        }
    };

    const register = async (userData) => {
        const { email, password, firstname, lastname, phone, school, referralCode } = userData;
        const loadingToast = toast.loading('Initializing Terminal...', {
            icon: <Shield size={18} className="text-primary animate-pulse" />
        });
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            let cleanReferralCode = null;
            if (referralCode) {
                cleanReferralCode = referralCode.trim().toUpperCase();
            }

            const newUser = {
                uid: firebaseUser.uid,
                email,
                firstname,
                lastname,
                phone,
                school,
                createdAt: serverTimestamp(),
                myReferralCode: (firstname || 'USER').slice(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000),
                points: 10,
                base_points: 0, // Fallback
                ...(cleanReferralCode && { referredBy: cleanReferralCode })
            };

            // Handle Referral Logic
            if (cleanReferralCode) {
                const q = query(collection(db, 'users'), where('myReferralCode', '==', cleanReferralCode));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const referrerDoc = querySnapshot.docs[0];
                    await updateDoc(doc(db, 'users', referrerDoc.id), {
                        points: increment(10)
                    });
                }
            }

            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            toast.success('Terminal Operational', {
                id: loadingToast,
                icon: <CheckCircle size={18} className="text-emerald-500" />
            });
            return firebaseUser;
        } catch (error) {
            toast.error(error.message || 'Initialization Failed', {
                id: loadingToast,
                icon: <AlertCircle size={18} className="text-red-500" />
            });
            throw error;
        }
    };

    const updateUserProfile = async (uid, data) => {
        const loadingToast = toast.loading('Updating Profile...');
        try {
            await updateDoc(doc(db, 'users', uid), data);

            // Update local state
            setUser(prev => ({ ...prev, ...data }));

            toast.success('Profile Updated', { id: loadingToast });
            return true;
        } catch (error) {
            console.error("Profile Update Error:", error);
            toast.error('Update Failed', { id: loadingToast });
            return false;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success('Connection Terminated', {
                icon: <LogOut size={18} className="text-red-500" />
            });
        } catch (error) {
            toast.error('Termination Failed');
            console.error('Logout error:', error);
        }
    };

    const ensureReferralCode = async (currentUser) => {
        if (!currentUser?.uid) return;

        try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                if (!data.myReferralCode) {
                    const baseName = data.firstname || 'USER';
                    const newCode = baseName.slice(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

                    await updateDoc(userRef, {
                        myReferralCode: newCode,
                        points: data.points || 0
                    });

                    setUser(prev => ({
                        ...prev,
                        myReferralCode: newCode,
                        points: data.points || 0
                    }));
                    return newCode;
                }
            }
        } catch (error) {
            console.error("Error ensuring referral code:", error);
        }
    };

    const loginWithGoogle = async () => {
        const loadingToast = toast.loading('Authenticating with Google...', {
            icon: <Shield size={18} className="text-primary animate-pulse" />
        });
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Optionally, create user doc if new
            const userRef = doc(db, 'users', result.user.uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: result.user.uid,
                    email: result.user.email,
                    firstname: result.user.displayName?.split(' ')[0] || '',
                    lastname: result.user.displayName?.split(' ')[1] || '',
                    phone: result.user.phoneNumber || '',
                    school: '',
                    createdAt: serverTimestamp(),
                    myReferralCode: (result.user.displayName?.slice(0, 3).toUpperCase() || 'USER') + Math.floor(1000 + Math.random() * 9000),
                    points: 0,
                    base_points: 0
                });
            }
            toast.success('Google Login Successful', {
                id: loadingToast,
                icon: <CheckCircle size={18} className="text-emerald-500" />
            });
        } catch (error) {
            toast.error(error.message || 'Google Login Failed', {
                id: loadingToast,
                icon: <AlertCircle size={18} className="text-red-500" />
            });
            throw error;
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserProfile,
        ensureReferralCode,
        loading,
        loginWithGoogle
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <LoadingScreen /> : children}
        </AuthContext.Provider>
    );
};
