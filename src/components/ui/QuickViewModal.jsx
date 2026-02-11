import { X, ShoppingBag, Heart, Star, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickViewModal({ product, isOpen, onClose }) {
    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-premium flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass-thick flex items-center justify-center hover:bg-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Gallery (Simplified for now) */}
                        <div className="md:w-1/2 bg-secondary/20 relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {product.isNew && (
                                <span className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white text-[10px] font-black uppercase tracking-widest shadow-soft">
                                    New Arrival
                                </span>
                            )}
                        </div>

                        {/* Details */}
                        <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto scrollbar-hide flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-0.5 text-luxury">
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">(24 Reviews)</span>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-black text-primary/40 uppercase tracking-[0.3em]">
                                    {product.category}
                                </span>
                                {product.school && (
                                    <>
                                        <div className="h-1 w-1 rounded-full bg-border/50" />
                                        <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">
                                            {product.school}
                                        </span>
                                    </>
                                )}
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter mb-4 leading-tight">
                                {product.name}
                            </h2>
                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="text-3xl font-black">MWK {Number(product.price).toLocaleString()}</span>
                                <span className="text-lg text-muted-foreground line-through opacity-40">
                                    MWK {Number(product.originalPrice || (product.price * 1.2)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            </div>

                            <p className="text-muted-foreground leading-relaxed mb-10 text-lg">
                                Experience the pinnacle of design and functionality. This {product.category} object is meticulously crafted for those who appreciate the extraordinary. Built to last, designed to inspire.
                            </p>

                            {/* Options Placelholder */}
                            <div className="space-y-6 mb-10">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-50">Select Finish</h4>
                                    <div className="flex gap-3">
                                        <button className="w-10 h-10 rounded-full border-2 border-primary bg-primary" />
                                        <button className="w-10 h-10 rounded-full border-2 border-transparent bg-gray-200" />
                                        <button className="w-10 h-10 rounded-full border-2 border-transparent bg-luxury" />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                <button className="flex-[2] bg-primary text-primary-foreground py-5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-premium hover:bg-primary/90 transition-colors group">
                                    <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                                    Add to Collection
                                </button>
                                <button className="flex-1 glass-thick border border-border py-5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-secondary/50 transition-colors">
                                    <Heart size={18} />
                                </button>
                            </div>

                            {/* Trust Markers */}
                            <div className="grid grid-cols-2 gap-6 mt-10 pt-10 border-t border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-primary">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">2 Year Warranty</p>
                                        <p className="text-[9px] text-muted-foreground">Certified Authentic</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-primary">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">Global Express</p>
                                        <p className="text-[9px] text-muted-foreground">3-5 Day Delivery</p>
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
