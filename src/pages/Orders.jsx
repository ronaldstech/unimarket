import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    ChevronRight,
    RefreshCcw,
    Download,
    ExternalLink,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    ArrowLeft,
    ShoppingBag,
    Search,
    Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState(null);
    const [generatingId, setGeneratingId] = useState(null);
    const receiptRef = React.useRef(null);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "orders"),
            where("user.userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(fetchedOrders);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const verifyPayment = async (order) => {
        setVerifyingId(order.id);
        const loadingToast = toast.loading('Verifying Payment Status...');

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer sec-live-Bg66AXsH6yJAskyTguhXjrzH06O62L6H'
            }
        };

        try {
            const res = await fetch(`https://api.paychangu.com/verify-payment/${order.tx_ref}`, options);
            const data = await res.json();

            console.log('Verification Response:', data);

            if (data.status === 'success') {
                const paymentStatus = data.data.status; // 'success', 'failed', 'pending'

                // Update Firestore
                await updateDoc(doc(db, "orders", order.id), {
                    status: paymentStatus
                });

                if (paymentStatus === 'success') {
                    toast.success('Payment Verified Successfully', { id: loadingToast });
                } else if (paymentStatus === 'failed') {
                    toast.error('Payment Failed', { id: loadingToast });
                } else {
                    toast.loading('Payment still pending...', { id: loadingToast, duration: 2000 });
                }
            } else {
                toast.error('Verification failed: ' + (data.message || 'Unknown error'), { id: loadingToast });
            }
        } catch (err) {
            console.error(err);
            toast.error('Connection Error', { id: loadingToast });
        } finally {
            setVerifyingId(null);
        }
    };

    const formatCurrency = (amount) => {
        return `MWK ${Number(amount).toLocaleString()}`;
    };

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
            case 'success':
            case 'completed':
                return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'failed':
            case 'cancelled':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    const generateReceipt = async (order) => {
        setGeneratingId(order.id);
        const loadingToast = toast.loading('Generating Secure Receipt...');

        try {
            // Give time for the template to render in the DOM
            await new Promise(resolve => setTimeout(resolve, 500));

            const element = document.getElementById(`receipt-${order.id}`);
            if (!element) throw new Error("Receipt template not found");

            const canvas = await html2canvas(element, {
                scale: 1.5, // Reduced scale for file size optimization while keeping clarity
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            // Switch to JPEG with 0.8 quality for significant size reduction
            const imgData = canvas.toDataURL('image/jpeg', 0.8);

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true // Enable jsPDF internal compression
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save(`UNIMARKET-RECEIPT-${order.id.slice(0, 8)}.pdf`);

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCcw className="animate-spin text-primary" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Accessing Registry...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-4 md:px-8 lg:px-12 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link to="/profile" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all mb-6 group">
                            <div className="p-1.5 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all">
                                <ArrowLeft size={12} />
                            </div>
                            Terminal Profile
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tightest leading-[0.85] uppercase">
                            Operational <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 italic">History</span>
                        </h1>
                    </motion.div>
                </header>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-thick p-20 text-center rounded-[3rem] border border-border/30 shadow-premium"
                    >
                        <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag className="text-muted-foreground" size={32} />
                        </div>
                        <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter">No Records Found</h2>
                        <p className="text-muted-foreground max-w-xs mx-auto text-sm font-medium mb-12">
                            Your transaction registry is currently void.
                        </p>
                        <Link to="/browse" className="inline-flex items-center gap-4 bg-primary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                            Initialize Procurement <ChevronRight size={18} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-thick rounded-[2rem] border border-border/10 shadow-soft overflow-hidden group hover:border-primary/20 transition-all duration-500"
                            >
                                <div className="p-6">
                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3 pb-3 border-b border-border/10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Registry ID:</span>
                                                    <span className="text-[10px] font-black tracking-widest uppercase truncate max-w-[100px] md:max-w-none">{order.id}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-muted-foreground/60">
                                                    <Clock size={10} />
                                                    <span className="text-[9px] font-bold uppercase tracking-wider">{formatDate(order.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 items-center">
                                            <div className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusStyles(order.status)}`}>
                                                {order.status === 'success' ? <CheckCircle2 size={12} /> : order.status === 'failed' ? <XCircle size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                                {order.status}
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusStyles(order.deliveryStatus)}`}>
                                                <Truck size={12} />
                                                {order.deliveryStatus}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                                        {order.items?.map((item, i) => (
                                            <div key={i} className="flex gap-3 p-3 rounded-xl bg-secondary/20 border border-border/5">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0 flex flex-col justify-center">
                                                    <h4 className="text-[10px] font-black uppercase truncate mb-0.5">{item.name}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-bold text-muted-foreground/50">{item.quantity}×</span>
                                                        <span className="text-[10px] font-black text-primary">{formatCurrency(item.price)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer / Actions */}
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-3 border-t border-border/10">
                                        <div className="text-center md:text-left">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 block mb-0.5">Total Valuation</span>
                                            <p className="text-2xl font-black tracking-tighter">{formatCurrency(order.total)}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-3 items-center justify-center">
                                            <button
                                                onClick={() => verifyPayment(order)}
                                                disabled={verifyingId === order.id}
                                                className="flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-border/30 transition-all shadow-soft group/btn disabled:opacity-50"
                                            >
                                                <RefreshCcw size={14} className={verifyingId === order.id ? 'animate-spin' : 'group-hover/btn:rotate-180 transition-transform duration-500'} />
                                                Verify
                                            </button>

                                            {order.status === 'success' && (
                                                <button
                                                    onClick={() => generateReceipt(order)}
                                                    disabled={generatingId === order.id}
                                                    className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-premium disabled:opacity-50"
                                                >
                                                    {generatingId === order.id ? <RefreshCcw size={14} className="animate-spin" /> : <Download size={14} />}
                                                    {generatingId === order.id ? 'Generating...' : 'Receipt'}
                                                </button>
                                            )}

                                            <div className="p-3 rounded-xl bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 shadow-soft cursor-help group/info relative">
                                                <Clock size={16} />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-black text-white text-[7px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/info:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                    Process Time: Normal
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hidden Receipt Templates Source */}
            <ReceiptTemplates
                orders={orders}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
            />
        </div>
    );
}

{/* Hidden Receipt Templates */ }
function ReceiptTemplates({ orders, formatDate, formatCurrency }) {
    return (
        <div className="fixed top-[-9999px] left-[-9999px]">
            {orders.map(order => (
                <div
                    key={`receipt-${order.id}`}
                    id={`receipt-${order.id}`}
                    className="relative overflow-hidden"
                    style={{
                        width: '210mm',
                        minHeight: '297mm',
                        padding: '64px 64px 80px 64px', // Added bottom padding to ensure footer space
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        fontFamily: 'sans-serif',
                        display: 'flex',
                        flexDirection: 'column',
                        boxSizing: 'border-box'
                    }}
                >
                    {/* Structural: Top Border */}
                    <div
                        className="absolute top-0 left-0 right-0"
                        style={{ height: '12px', backgroundColor: '#000000' }}
                    />

                    {/* Section 1: Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '20px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}
                            >
                                <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#000000', margin: '0', letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: '1.1' }}>UNIMARKET</h2>
                                <p style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', margin: '6px 0 0', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Official E-Commerce Record</p>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '10px', fontWeight: '500', color: '#94a3b8' }}>
                                    <span>www.unimarket-mw.com</span>
                                    <span>•</span>
                                    <span>support@unimarket-mw.com</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#000000', margin: '0', letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: '1' }}>RECEIPT</h1>
                            <p style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', margin: '8px 0 0', letterSpacing: '0.15em' }}>REF: {order.id.slice(0, 16).toUpperCase()}</p>
                        </div>
                    </div>

                    {/* Section 2: Info Grid */}
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '30px' }}>
                        <div style={{ flex: 1, padding: '32px', backgroundColor: '#f9fafb', border: '1px solid #f1f5f9', borderRadius: '24px' }}>
                            <h4 style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '20px' }}>Bill To:</h4>
                            <p style={{ fontSize: '15px', fontWeight: '900', color: '#000000', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{order.user?.firstname} {order.user?.lastname}</p>
                            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', margin: '0' }}>{order.user?.email}</p>
                                <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', margin: '0' }}>{order.user?.phone}</p>
                                {order.user?.address && <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', margin: '0' }}>{order.user?.address}</p>}
                            </div>
                        </div>
                        <div style={{ flex: 1, padding: '32px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '24px' }}>
                            <h4 style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '20px' }}>Transaction Overview:</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Payment Reference</span>
                                    <span style={{ fontSize: '10px', fontWeight: '900', color: '#000000' }}>{order.tx_ref}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Execution Date</span>
                                    <span style={{ fontSize: '10px', fontWeight: '900', color: '#000000' }}>{formatDate(order.createdAt)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Terminal Status</span>
                                    <span style={{ fontSize: '10px', fontWeight: '900', color: '#059669', textTransform: 'uppercase' }}>{order.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Item Table */}
                    <div style={{ flex: '1 0 auto', marginBottom: '30px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #000000' }}>
                                    <th style={{ textAlign: 'left', padding: '0 0 24px 0', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000' }}>Item Description</th>
                                    <th style={{ textAlign: 'center', padding: '0 0 24px 0', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000' }}>Qty</th>
                                    <th style={{ textAlign: 'right', padding: '0 0 24px 0', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000' }}>Price</th>
                                    <th style={{ textAlign: 'right', padding: '0 0 24px 0', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '5px 0' }}>
                                            <span style={{ display: 'block', fontSize: '13px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', marginBottom: '6px' }}>{item.name}</span>
                                            <span style={{ fontSize: '9px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SKU: {item.id?.slice(0, 8) || 'N/A'}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', padding: '5px 0', fontSize: '12px', fontWeight: '700', color: '#000000' }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'right', padding: '5px 0', fontSize: '12px', fontWeight: '700', color: '#000000' }}>{formatCurrency(item.price)}</td>
                                        <td style={{ textAlign: 'right', padding: '5px 0', fontSize: '13px', fontWeight: '900', color: '#000000' }}>{formatCurrency(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Section 4: Financial Summary */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <div style={{ width: '360px', padding: '20px', backgroundColor: '#f9fafb', border: '1px solid #f1f5f9', borderRadius: '32px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subtotal</span>
                                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#000000' }}>{formatCurrency(order.subtotal || 0)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Regulatory Tax (4%)</span>
                                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#000000' }}>{formatCurrency(order.tax || 0)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Logistics Fee</span>
                                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#000000' }}>{formatCurrency(order.deliveryFee || 0)}</span>
                                </div>
                                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #000000', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Total Amount</span>
                                    <span style={{ fontSize: '32px', fontWeight: '900', color: '#000000', letterSpacing: '-0.03em', lineHeight: '1' }}>{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Authentication Footer */}
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '48px', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ maxWidth: '420px' }}>
                            <h5 style={{ fontSize: '10px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>Security Classification: Verified</h5>
                            <p style={{ fontSize: '9px', lineHeight: '1.6', color: '#64748b', margin: '0', fontWeight: '500' }}>
                                This document is digitally generated and serves as a formal proof of payment within the Unimarket E-Commerce ecosystem.
                                The transaction signature has been validated against our distributed procurement registry for authenticity and integrity.
                            </p>
                            <div style={{ marginTop: '32px', borderTop: '1px solid #cbd5e1', paddingTop: '8px', width: '180px' }}>
                                <p style={{ fontSize: '8px', fontWeight: '800', color: '#94a3b8', margin: '0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Authorized Signature</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div
                                style={{
                                    border: '2px dashed #cbd5e1',
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    backgroundColor: '#f8fafc',
                                    marginBottom: '16px',
                                    display: 'inline-block'
                                }}
                            >
                                <p style={{ fontSize: '9px', fontWeight: '900', color: '#475569', margin: '0', textAlign: 'center', lineHeight: '1.4', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    System Verified<br />Digital Record
                                </p>
                            </div>
                            <p style={{ fontSize: '9px', fontWeight: '900', color: '#cbd5e1', textTransform: 'uppercase', margin: '0', letterSpacing: '0.2em' }}>Unimarket Procurement Hub</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
