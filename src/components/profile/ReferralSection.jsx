
import React, { useState } from 'react';
import { Award, Gift, Copy, CreditCard, X, Calculator, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ReferralSection() {
    const { user } = useAuth();
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [redeemPoints, setRedeemPoints] = useState(50);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate max redeemable points (rounded down to nearest 10)
    const maxPoints = Math.floor((user?.points || 0) / 10) * 10;
    // Calculate airtime value (10 points = 50 MWK)
    const airtimeValue = (redeemPoints / 10) * 50;

    const copyReferralLink = () => {
        const code = user?.myReferralCode || 'PENDING';
        const link = `${window.location.host}/profile?ref=${code}`;
        navigator.clipboard.writeText(link);
        toast.success('Referral Link Copied!', {
            icon: <Copy size={16} />
        });
    };

    const handleRedeemClick = () => {
        if ((user?.points || 0) < 50) {
            toast.error('Minimum 50 points required to redeem.');
            return;
        }
        setRedeemPoints(50); // Reset to min
        setPhoneNumber(user?.phone || ''); // Pre-fill from Firestore
        setIsRedeeming(true);
    };

    const confirmRedemption = async () => {
        // Validate phone number
        if (!phoneNumber || phoneNumber.length < 9) {
            toast.error('Please enter a valid phone number.');
            return;
        }

        setIsProcessing(true);
        const loadingToast = toast.loading('Processing redemption...');

        try {
            // Call PayChangu API to send airtime
            const response = await fetch('https://api.paychangu.com/bills/buy-airtime', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer sec-live-Bg66AXsH6yJAskyTguhXjrzH06O62L6H'
                },
                body: JSON.stringify({
                    phone: phoneNumber,
                    amount: airtimeValue.toString(),
                    reference: user.uid
                })
            });

            const result = await response.json();

            // Check for success based on actual API response structure
            if (response.ok && result.success === true) {
                // Deduct points from user
                await updateDoc(doc(db, 'users', user.uid), {
                    points: increment(-redeemPoints)
                });

                // Create redemption record for admin tracking
                await addDoc(collection(db, 'redemptions'), {
                    userId: user.uid,
                    userName: `${user.firstname} ${user.lastname}`,
                    userEmail: user.email,
                    phoneNumber: phoneNumber,
                    pointsRedeemed: redeemPoints,
                    airtimeAmount: airtimeValue,
                    status: 'completed',
                    transactionId: result.data?.transaction?.id,
                    billerReceipt: result.data?.transaction?.receipt?.['Biller Receipt'],
                    apiResponse: result,
                    createdAt: serverTimestamp()
                });

                toast.success(`MWK ${airtimeValue} airtime sent to ${phoneNumber}!`, {
                    id: loadingToast,
                    duration: 5000,
                    icon: <CreditCard size={18} className="text-emerald-500" />
                });

                setIsRedeeming(false);
            } else {
                throw new Error(result.message || 'Redemption failed');
            }
        } catch (error) {
            console.error('Redemption Error:', error);

            // Log failed attempt for admin review
            try {
                await addDoc(collection(db, 'redemptions'), {
                    userId: user.uid,
                    userName: `${user.firstname} ${user.lastname}`,
                    userEmail: user.email,
                    phoneNumber: phoneNumber,
                    pointsRedeemed: redeemPoints,
                    airtimeAmount: airtimeValue,
                    status: 'failed',
                    errorMessage: error.message,
                    createdAt: serverTimestamp()
                });
            } catch (logError) {
                console.error('Failed to log redemption error:', logError);
            }

            toast.error('Redemption failed. Please try again or contact support.', {
                id: loadingToast
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div className="bg-gradient-to-br from-luxury to-luxury/80 p-8 rounded-[2rem] text-white shadow-xl shadow-luxury/20 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 opacity-20 rotate-12">
                    <Award size={180} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                                <Gift size={24} className="text-white" />
                            </div>
                            <span className="font-black uppercase tracking-widest text-xs bg-black/20 px-3 py-1 rounded-full">Referral Program</span>
                        </div>
                    </div>

                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">My Points Level</h3>
                    <div className="text-5xl font-black mb-6 tracking-tighter">{user?.points || 0}<span className="text-lg opacity-60 font-medium ml-2">PTS</span></div>

                    <p className="text-sm font-medium opacity-90 mb-6 leading-relaxed max-w-xs">
                        Share your unique link. Earn 10 points for every new scholar that joins the market.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between gap-4 border border-white/10 group cursor-pointer" onClick={copyReferralLink}>
                            <div className="truncate font-mono text-xs opacity-80 select-all">
                                {`${window.location.host}/profile?ref=${user?.myReferralCode || '...'}`}
                            </div>
                            <div className="shrink-0 p-2 bg-white text-luxury rounded-lg group-hover:scale-105 transition-transform">
                                <Copy size={16} />
                            </div>
                        </div>

                        <button
                            onClick={handleRedeemClick}
                            className="bg-white text-luxury font-black uppercase tracking-widest text-xs p-4 rounded-xl hover:bg-emerald-400 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-lg"
                        >
                            <CreditCard size={16} />
                            Redeem Points
                        </button>
                    </div>
                </div>
            </div>

            {/* Redemption Modal */}
            <AnimatePresence>
                {isRedeeming && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-card rounded-[2rem] p-8 max-w-sm w-full shadow-premium border border-border/20 relative"
                        >
                            <button
                                onClick={() => setIsRedeeming(false)}
                                disabled={isProcessing}
                                className="absolute top-4 right-4 p-2 bg-muted rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-luxury/10 text-luxury rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Calculator size={32} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-foreground">Redeem Airtime</h3>
                                <p className="text-xs text-muted-foreground font-medium mt-1">Convert your points to airtime</p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-muted p-6 rounded-2xl text-center space-y-1">
                                    <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">You Receive</div>
                                    <div className="text-4xl font-black text-luxury tracking-tighter">MWK {airtimeValue}</div>
                                    <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 inline-block px-2 py-1 rounded-full border border-emerald-500/20">For {redeemPoints} PTS</div>
                                </div>

                                {/* Phone Number Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Phone Number</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="0990944406"
                                            className="w-full bg-muted border border-border/20 rounded-xl px-4 py-3 pl-10 text-sm font-bold focus:ring-2 ring-luxury/10 outline-none text-foreground"
                                            disabled={isProcessing}
                                        />
                                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    </div>
                                </div>

                                {/* Points Slider */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold px-1 text-muted-foreground">
                                        <span>50 PTS</span>
                                        <span>{maxPoints} PTS</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max={Math.max(50, maxPoints)}
                                        step="10"
                                        value={redeemPoints}
                                        onChange={(e) => setRedeemPoints(parseInt(e.target.value))}
                                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-luxury"
                                        disabled={isProcessing}
                                    />
                                </div>

                                <button
                                    onClick={confirmRedemption}
                                    disabled={isProcessing}
                                    className="w-full bg-luxury text-white py-4 rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-luxury/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? 'Processing...' : 'Confirm Redemption'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
