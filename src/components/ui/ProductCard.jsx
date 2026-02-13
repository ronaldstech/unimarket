import { Plus, Heart, ShoppingBag, Eye, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onQuickView }) {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={handleClick}
            className="group relative flex flex-col bg-card rounded-xl overflow-hidden transition-all duration-500 hover:shadow-premium border border-border/50 dark:border-white/10 cursor-pointer"
        >
            {/* Image Container */}
            <div
                className="relative aspect-[4/5] overflow-hidden bg-secondary/30 protect-image"
                onContextMenu={(e) => e.preventDefault()}
            >
                <img
                    src={product.image}
                    alt={product.name}
                    draggable="false"
                    className="w-full h-full object-cover transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
                />

                {/* Overlay with Actions */}
                <div className="absolute inset-0 bg-black/10 dark:bg-black/40 transition-opacity duration-500" />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    {product.isPromotion && (
                        <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/20 flex items-center gap-2">
                            <Zap size={12} fill="currentColor" />
                            {product.promotionLabel || "Promo"}
                        </span>
                    )}
                    {product.isNew && (
                        <span className="px-3 py-1 rounded-full bg-white dark:bg-black text-[10px] font-black uppercase tracking-widest shadow-soft text-foreground">
                            New
                        </span>
                    )}
                    {product.discount && !product.isPromotion && (
                        <span className="px-3 py-1 rounded-full bg-luxury text-white text-[10px] font-black uppercase tracking-widest shadow-soft">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                {/* Top Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="w-10 h-10 rounded-full glass-thick flex items-center justify-center bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-black transition-all shadow-soft group/fav"
                    >
                        <Heart size={18} className="text-foreground/70 dark:text-white/70 group-hover/fav:text-red-500 group-hover/fav:fill-red-500 transition-all" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                        className="w-10 h-10 rounded-full glass-thick flex items-center justify-center bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-black transition-all shadow-soft translate-x-0 transition-all duration-500"
                    >
                        <Eye size={18} className="text-foreground/70 dark:text-white/70 hover:text-primary transition-colors" />
                    </button>
                </div>

            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-1 bg-card">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5 text-luxury">
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground ml-1">(24)</span>
                    </div>
                    {/* Stock Status Badge */}
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        In Stock
                    </span>
                </div>

                <div className="mb-1">
                    {product.school && (
                        <p className="text-[9px] font-black text-luxury uppercase tracking-[0.2em] mb-1">
                            {product.school}
                        </p>
                    )}
                    <h3 className="font-black text-base tracking-tight line-clamp-2 leading-tight text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </div>

                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black mb-3">
                    {product.category}
                </p>

                <div className="mt-auto flex items-baseline gap-2">
                    <span className="text-xl font-black tracking-tighter text-foreground">
                        {product.variants && product.variants.length > 0 ? (
                            (() => {
                                const prices = product.variants.map(v => parseInt(v.price) || 0).filter(p => p > 0);
                                if (prices.length === 0) return `MWK ${Number(product.price).toLocaleString()}`;
                                const min = Math.min(...prices);
                                const max = Math.max(...prices);
                                return min === max ? `MWK ${min.toLocaleString()}` : `MWK ${min.toLocaleString()} - ${max.toLocaleString()}`;
                            })()
                        ) : (
                            `MWK ${Number(product.price).toLocaleString()}`
                        )}
                    </span>
                    {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through opacity-40">
                            MWK {Number(product.originalPrice).toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
