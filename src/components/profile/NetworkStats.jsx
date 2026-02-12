import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function NetworkStats() {
    const { user } = useAuth();
    const [referrals, setReferrals] = useState([]);
    const [isViewingNetwork, setIsViewingNetwork] = useState(false);

    useEffect(() => {
        const fetchReferrals = async () => {
            if (user?.myReferralCode) {
                try {
                    const q = query(collection(db, 'users'), where('referredBy', '==', user.myReferralCode));
                    const querySnapshot = await getDocs(q);
                    const referralList = querySnapshot.docs.map(doc => doc.data());
                    setReferrals(referralList);
                } catch (error) {
                    console.error("Error fetching referrals:", error);
                }
            }
        };

        if (user) {
            fetchReferrals();
        }
    }, [user]);

    return (
        <div className="space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4">
                {[{ label: "Network", value: referrals.length.toString(), icon: Users }].map((stat, i) => (
                    <div key={i}
                        onClick={() => stat.label === 'Network' && setIsViewingNetwork(!isViewingNetwork)}
                        className={`glass-thick p-6 rounded-[1.5rem] border border-border/10 hover:border-border/30 transition-all group cursor-pointer ${stat.label === 'Network' && isViewingNetwork ? 'ring-2 ring-primary' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-muted rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <stat.icon size={20} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-foreground">{stat.value}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                            <span className="text-[10px] font-bold text-primary opacity-60">Click to view</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Network List */}
            <AnimatePresence>
                {isViewingNetwork && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="glass-thick p-6 rounded-[2rem] border border-border/30 space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Referred Scholars</h3>
                            {referrals.length > 0 ? (
                                <div className="space-y-3">
                                    {referrals.map((refUser, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-card dark:bg-muted border border-border/10 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {refUser.firstname?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-xs text-foreground">{refUser.firstname} {refUser.lastname}</div>
                                                    <div className="text-[10px] text-muted-foreground">{refUser.school || 'Unknown'}</div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-mono opacity-50 dark:text-foreground/40">{refUser.createdAt?.seconds ? new Date(refUser.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-xs font-medium">
                                    No referrals yet. Share your link to grow your network!
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
