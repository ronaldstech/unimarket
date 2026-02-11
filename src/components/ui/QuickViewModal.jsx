import { X, ShoppingBag, Heart, Star, ShieldCheck, Truck, Share2, Copy, Check, Zap, ArrowRight, Smartphone } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function QuickViewModal({ product, isOpen, onClose }) {
    const { user } = useAuth();
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeFinish, setActiveFinish] = useState(0);

    if (!product) return null;

    const shareUrl = `${window.location.origin}/product/${product.id}${user?.myReferralCode ? `?ref=${user.myReferralCode}` : ''}`;
    const shareText = `Securing the ${product.name} at UniMarket. Index: MWK ${Number(product.price).toLocaleString()}`;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'UniMarket Index', text: shareText, url: shareUrl });
            } catch (err) { console.log(err); }
        } else {
            setShowShareMenu(!showShareMenu);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Registry Link Secured');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12 overflow-hidden">
                    {/* Atmospheric Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                    />

                    {/* Modal Architecture */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.98 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-6xl h-full md:h-auto md:max-h-[85vh] bg-white md:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden"
                    >
                        {/* 1. Immersive Visual Section */}
                        <div className="md:w-[55%] bg-[#f4f4f4] relative overflow-hidden group">
                            <motion.img
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1.2, delay: 0.2 }}
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            {/* Brand Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            <div className="absolute top-8 left-8 flex flex-col gap-2">
                                {product.isNew && (
                                    <span className="bg-black text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full backdrop-blur-md">
                                        Edition 01 / New
                                    </span>
                                )}
                                <span className="bg-white/90 backdrop-blur-md text-black text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-black/5 shadow-xl">
                                    {product.category}
                                </span>
                            </div>

                            <button onClick={onClose} className="md:hidden absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white">
                                <X size={24} />
                            </button>
                        </div>

                        {/* 2. Intelligence Section */}
                        <div className="md:w-[45%] p-8 md:p-16 flex flex-col overflow-y-auto scrollbar-hide bg-white">
                            <header className="mb-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-1.5 text-luxury">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                        <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Trusted Archive</span>
                                    </div>
                                    <button onClick={onClose} className="hidden md:flex text-muted-foreground/20 hover:text-primary transition-colors">
                                        <X size={28} strokeWidth={1} />
                                    </button>
                                </div>

                                <h2 className="text-5xl font-black tracking-tightest uppercase leading-[0.85] mb-6">
                                    {product.name.split(' ').map((word, i) => (
                                        <span key={i} className={i === 1 ? 'text-primary italic' : ''}>{word} </span>
                                    ))}
                                </h2>

                                <div className="flex items-center gap-6">
                                    <div className="text-4xl font-black tracking-tighter tabular-nums">
                                        {Number(product.price).toLocaleString()}
                                        <span className="text-xs ml-2 text-muted-foreground font-bold">MWK</span>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg border border-emerald-100">
                                        In Stock
                                    </div>
                                </div>
                            </header>

                            <div className="space-y-10">
                                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                                    A masterful fusion of technological precision and aesthetic purity. Crafted for the modern index, this object represents the zenith of our design philosophy.
                                </p>

                                {/* Physical Options */}
                                <div className="flex items-center justify-between p-6 rounded-3xl bg-secondary/30 border border-black/[0.03]">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Color Variant</h4>
                                        <div className="flex gap-4">
                                            {['#000', '#eee', '#c5a358'].map((color, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setActiveFinish(i)}
                                                    className={`w-8 h-8 rounded-full border-4 transition-all ${activeFinish === i ? 'border-primary scale-110' : 'border-transparent scale-100'}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Material</h4>
                                        <span className="text-xs font-black uppercase">Brushed Alloy</span>
                                    </div>
                                </div>

                                {/* Primary Interaction Bar */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <button className="flex-[4] bg-black text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-primary transition-all active:scale-[0.98] shadow-2xl shadow-black/10">
                                            Add to Index <ArrowRight size={16} />
                                        </button>
                                        <button className="flex-1 bg-secondary rounded-2xl flex items-center justify-center hover:bg-white border border-transparent hover:border-black/5 transition-all">
                                            <Heart size={20} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={handleShare} className="py-4 bg-white border border-black/5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all group">
                                            <Share2 size={14} className="group-hover:rotate-12 transition-transform" /> Share Invitation
                                        </button>
                                        <button onClick={copyLink} className="py-4 bg-white border border-black/5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">
                                            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                            {copied ? 'Copied' : 'Registry URL'}
                                        </button>
                                    </div>
                                </div>

                                {/* Trust Metrics */}
                                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-black/5">
                                    <div className="flex items-center gap-4">
                                        <ShieldCheck size={20} className="text-primary/40" />
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest">Secured</p>
                                            <p className="text-[10px] font-bold text-muted-foreground">Lifetime Warranty</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Zap size={20} className="text-primary/40" />
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest">Rapid</p>
                                            <p className="text-[10px] font-bold text-muted-foreground">Malawi Express</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}