import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import toast from 'react-hot-toast';
import { Shield, CheckCircle, AlertCircle, LogOut } from 'lucide-react';

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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch additional user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    setUser({ ...firebaseUser, ...userDoc.data() });
                } else {
                    setUser(firebaseUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
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
        const { email, password, firstname, lastname, phone, school } = userData;
        const loadingToast = toast.loading('Initializing Terminal...', {
            icon: <Shield size={18} className="text-primary animate-pulse" />
        });
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const newUser = {
                uid: firebaseUser.uid,
                email,
                firstname,
                lastname,
                phone,
                school,
                createdAt: serverTimestamp(),
            };

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

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
