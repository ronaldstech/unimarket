import { Plus, Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onQuickView }) {
    const { addToCart } = useCart();
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => onQuickView?.(product)}
            className="group relative flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-premium border border-border/50 cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
                />

                {/* Overlay with Actions */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    {product.isNew && (
                        <span className="px-3 py-1 rounded-full bg-white text-[10px] font-black uppercase tracking-widest shadow-soft">
                            New
                        </span>
                    )}
                    {product.discount && (
                        <span className="px-3 py-1 rounded-full bg-luxury text-white text-[10px] font-black uppercase tracking-widest shadow-soft">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                {/* Top Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    <button className="w-10 h-10 rounded-full glass-thick flex items-center justify-center bg-white/90 hover:bg-white transition-all shadow-soft group/fav">
                        <Heart size={18} className="text-foreground/70 group-hover/fav:text-red-500 group-hover/fav:fill-red-500 transition-all" />
                    </button>
                    <button
                        onClick={() => onQuickView?.(product)}
                        className="w-10 h-10 rounded-full glass-thick flex items-center justify-center bg-white/90 hover:bg-white transition-all shadow-soft opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500"
                    >
                        <Eye size={18} className="text-foreground/70 hover:text-primary transition-colors" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>In Stock</span>
                    </div>
                </div>

                {product.school && (
                    <div className="mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/10 inline-block">
                            {product.school}
                        </span>
                    </div>
                )}

                <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1 tracking-tight mb-2">
                    {product.name}
                </h3>

                <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="flex items-center gap-0.5 text-luxury">
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} className="opacity-30" />
                    </div>
                    <span className="text-[9px] font-black text-muted-foreground/50 tracking-widest">(4.8)</span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/10">
                    <div className="flex flex-col">
                        <span className="font-black text-lg tracking-tighter text-foreground">
                            MWK {Number(product.price).toLocaleString()}
                        </span>
                        <span className="text-[9px] text-muted-foreground line-through opacity-40">
                            MWK {Number(product.originalPrice || (product.price * 1.2)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        className="p-3.5 bg-primary text-primary-foreground hover:bg-black rounded-xl transition-all shadow-premium group/cart active:scale-95"
                    >
                        <ShoppingBag size={18} className="transition-transform group-hover/cart:scale-110" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
