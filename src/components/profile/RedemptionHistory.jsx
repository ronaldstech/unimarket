import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    Download,
    RefreshCcw,
    Phone,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    Receipt
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function RedemptionHistory() {
    const { user } = useAuth();
    const [redemptions, setRedemptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState(null);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "redemptions"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedRedemptions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRedemptions(fetchedRedemptions);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        const date = timestamp.toDate();
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'failed':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return <CheckCircle2 size={14} />;
            case 'failed':
                return <XCircle size={14} />;
            default:
                return <Clock size={14} />;
        }
    };

    const generateReceipt = async (redemption) => {
        setGeneratingId(redemption.id);
        const loadingToast = toast.loading('Generating Receipt...');

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const element = document.getElementById(`receipt-${redemption.id}`);
            if (!element) throw new Error("Receipt template not found");

            const canvas = await html2canvas(element, {
                scale: 1.5,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.8);

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save(`UNIMARKET-REDEMPTION-${redemption.id.slice(0, 8)}.pdf`);

            toast.success('Receipt Downloaded Successfully', { id: loadingToast });
        } catch (err) {
            console.error(err);
            toast.error('Generation Failed', { id: loadingToast });
        } finally {
            setGeneratingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCcw className="animate-spin text-primary" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Loading History...</span>
                </div>
            </div>
        );
    }

    if (redemptions.length === 0) {
        return (
            <div className="glass-thick p-12 rounded-[2rem] text-center">
                <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Receipt size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">No Redemptions Yet</h3>
                <p className="text-sm text-muted-foreground">Your redemption history will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Redemption History</h3>

            {redemptions.map((redemption, index) => (
                <motion.div
                    key={redemption.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-thick p-6 rounded-[1.5rem] border border-border/20 hover:border-border/40 transition-all"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-luxury/10 text-luxury rounded-xl">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <div className="font-black text-lg tracking-tight">MWK {redemption.airtimeAmount}</div>
                                    <div className="text-xs text-muted-foreground font-medium">{redemption.pointsRedeemed} Points Redeemed</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone size={14} />
                                    <span className="font-mono">{redemption.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar size={14} />
                                    <span>{formatDate(redemption.createdAt)}</span>
                                </div>
                            </div>

                            {redemption.billerReceipt && (
                                <div className="text-[10px] font-mono bg-secondary/50 px-3 py-2 rounded-lg inline-block">
                                    Receipt: {redemption.billerReceipt}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 items-end">
                            <div className={`px-4 py-2 rounded-xl border font-black text-xs uppercase tracking-widest flex items-center gap-2 ${getStatusStyles(redemption.status)}`}>
                                {getStatusIcon(redemption.status)}
                                {redemption.status}
                            </div>

                            {redemption.status === 'completed' && (
                                <button
                                    onClick={() => generateReceipt(redemption)}
                                    disabled={generatingId === redemption.id}
                                    className="px-4 py-2 bg-luxury text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-luxury/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {generatingId === redemption.id ? (
                                        <>
                                            <RefreshCcw size={14} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Download size={14} />
                                            Receipt
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Hidden Receipt Template for PDF Generation */}
                    <div id={`receipt-${redemption.id}`} className="fixed -left-[9999px] w-[800px] bg-white p-12" style={{ fontFamily: 'Arial, sans-serif' }}>
                        <div style={{ border: '4px solid #000000', padding: '32px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <img src="/logo.png" alt="UniMarket Logo" style={{ width: '120px', height: 'auto', margin: '0 auto 16px auto', display: 'block' }} />
                                <h1 style={{ fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.05em', marginBottom: '8px', color: '#000000' }}>UNIMARKET</h1>
                                <div style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666' }}>Airtime Redemption Receipt</div>
                            </div>

                            <div style={{ borderTop: '2px solid #000000', borderBottom: '2px solid #000000', padding: '24px 0', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                                    <span style={{ fontWeight: '700', color: '#000000' }}>Transaction ID:</span>
                                    <span style={{ fontFamily: 'monospace', color: '#000000' }}>{redemption.transactionId || redemption.id.slice(0, 12)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                                    <span style={{ fontWeight: '700', color: '#000000' }}>Date:</span>
                                    <span style={{ color: '#000000' }}>{formatDate(redemption.createdAt)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                                    <span style={{ fontWeight: '700', color: '#000000' }}>Customer:</span>
                                    <span style={{ color: '#000000' }}>{redemption.userName}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ fontWeight: '700', color: '#000000' }}>Phone Number:</span>
                                    <span style={{ fontFamily: 'monospace', color: '#000000' }}>{redemption.phoneNumber}</span>
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#f5f5f5', padding: '24px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#000000' }}>Points Redeemed:</span>
                                    <span style={{ fontSize: '24px', fontWeight: '900', color: '#000000' }}>{redemption.pointsRedeemed} PTS</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#000000' }}>Airtime Value:</span>
                                    <span style={{ fontSize: '28px', fontWeight: '900', color: '#000000' }}>MWK {redemption.airtimeAmount}</span>
                                </div>
                            </div>

                            {redemption.billerReceipt && (
                                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#666666', marginBottom: '4px' }}>Biller Receipt</div>
                                    <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#000000' }}>{redemption.billerReceipt}</div>
                                </div>
                            )}

                            <div style={{ textAlign: 'center', fontSize: '12px', color: '#666666', borderTop: '2px dashed #cccccc', paddingTop: '24px' }}>
                                <div style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', color: '#000000' }}>Status: {redemption.status.toUpperCase()}</div>
                                <div>Thank you for using UniMarket Referral Program</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
