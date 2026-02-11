import React from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CreditCard, ShieldCheck, Truck, ChevronRight, Info, ExternalLink, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const taxRate = 0.04;
    const deliveryFee = 0;
    const taxAmount = cartTotal * taxRate;
    const totalValuation = cartTotal + taxAmount + deliveryFee;

    const formatCurrency = (amount) => {
        return `MWK ${Number(amount).toLocaleString()}`;
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            alert("Please login to proceed with checkout.");
            navigate('/profile');
            return;
        }

        setIsProcessing(true);

        // Generates a 18-20 digit numeric reference
        const tx_ref = `${Date.now()}${Math.floor(100000 + Math.random() * 900000)}`;

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: 'Bearer sec-live-Bg66AXsH6yJAskyTguhXjrzH06O62L6H'
            },
            body: JSON.stringify({
                currency: 'MWK',
                amount: totalValuation.toString(),
                tx_ref: tx_ref,
                first_name: user.firstname || 'Member',
                last_name: user.lastname || 'Guest',
                email: user.email,
                callback_url: 'https://unimarket-mw.com/callback',
                return_url: 'https://unimarket-mw.com/return_url'
            })
        };

        try {
            // 1. Create Order record in Firestore
            await addDoc(collection(db, "orders"), {
                user: {
                    address: user.address || "",
                    email: user.email,
                    firstname: user.firstname || 'Member',
                    lastname: user.lastname || 'Guest',
                    phone: user.phone || 'Guest',
                    userId: user.uid
                },
                items: cart,
                subtotal: cartTotal,
                tax: taxAmount,
                deliveryFee: deliveryFee,
                total: totalValuation,
                tx_ref: tx_ref,
                status: 'pending',
                deliveryStatus: 'pending',
                createdAt: serverTimestamp(),
            });

            const response = await fetch('https://api.paychangu.com/payment', options);
            const data = await response.json();

            if (data.status === 'success' && data.data?.checkout_url) {
                toast.success('Redirecting to Payment Gateway...', {
                    icon: <ExternalLink size={18} className="text-emerald-500" />
                });
                window.location.href = data.data.checkout_url;
            } else {
                throw new Error(data.message || 'Payment initiation failed');
            }
        } catch (err) {
            console.error(err);
            toast.error("Checkout Failed: " + err.message, {
                icon: <AlertCircle size={18} className="text-red-500" />
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
            {/* Ambient Background Element */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link
                            to="/browse"
                            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all mb-8 group"
                        >
                            <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all">
                                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            </div>
                            Return to Gallery
                        </Link>
                        <h3 className="text-4xl md:text-5xl font-black tracking-tightest leading-[0.85] uppercase">
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 italic">Cart</span>
                        </h3>
                    </motion.div>
                </header>

                {cart.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/50 backdrop-blur-xl rounded-[3rem] p-24 text-center border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]"
                    >
                        <div className="w-24 h-24 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-inner">
                            <ShoppingBag size={40} className="text-primary/20" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase">Registry Clear</h2>
                        <p className="text-muted-foreground mb-12 max-w-sm mx-auto text-lg">
                            Your collection is currently void. Ready to acquire new objects?
                        </p>
                        <Link
                            to="/browse"
                            className="inline-flex items-center gap-4 bg-primary text-primary-foreground px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                        >
                            Begin Sourcing <ChevronRight size={18} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        {/* Cart Items List */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="lg:col-span-7 space-y-4"
                        >
                            <AnimatePresence mode="popLayout">
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        variants={itemVariants}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        className="bg-white hover:bg-white/80 border border-black/5 p-4 rounded-[2rem] flex items-center gap-6 group transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-black/5"
                                    >
                                        <div className="w-40 h-40 rounded-[1.5rem] overflow-hidden bg-secondary shrink-0 relative">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-2 py-0.5 rounded-full bg-secondary text-[9px] font-black uppercase tracking-wider text-primary/60">{item.category}</span>
                                            </div>
                                            <h3 className="text-2xl font-black tracking-tight uppercase truncate mb-1">{item.name}</h3>
                                            <p className="text-primary font-bold text-xl tabular-nums mb-4">{formatCurrency(item.price)}</p>

                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center bg-secondary/50 rounded-full p-1 border border-black/5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-all shadow-sm"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-10 text-center font-black text-sm tabular-nums">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-all shadow-sm"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Summary Sidebar */}
                        <aside className="lg:col-span-5 sticky top-32">
                            <div className="bg-white rounded-[3rem] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-black/5">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/40">Statement</h3>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-emerald-600 uppercase">Live Rates</span>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-12">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-muted-foreground font-medium">Subtotal</span>
                                        <span className="text-xl font-black tabular-nums">{formatCurrency(cartTotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-muted-foreground font-medium">Tax (4%)</span>
                                        <span className="text-sm font-black tabular-nums">{formatCurrency(taxAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-muted-foreground font-medium">Logistics</span>
                                        <span className="text-sm font-black text-emerald-500 tabular-nums">{formatCurrency(deliveryFee)}</span>
                                    </div>
                                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8" />
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-xs font-black uppercase tracking-widest block mb-1">Total Valuation</span>
                                            <div className="flex items-center gap-1.5 text-muted-foreground/40">
                                                <Info size={10} />
                                                <span className="text-[9px] font-bold uppercase">Final Amount</span>
                                            </div>
                                        </div>
                                        <span className="text-5xl font-black tracking-tighter tabular-nums">{formatCurrency(totalValuation)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="w-full bg-black text-white py-8 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-primary transition-all shadow-2xl shadow-black/20 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? 'Processing Index...' : 'Secure Checkout'}
                                    {!isProcessing && <CreditCard size={20} className="group-hover:translate-x-1 transition-transform" />}
                                </button>

                                <div className="mt-8 grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-2xl border border-white/50">
                                        <ShieldCheck size={20} className="text-primary/60" />
                                        <span className="text-[8px] font-black uppercase tracking-widest leading-tight">Authenticity<br />Guaranteed</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-2xl border border-white/50">
                                        <Truck size={20} className="text-primary/60" />
                                        <span className="text-[8px] font-black uppercase tracking-widest leading-tight">Global<br />Protocol</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}