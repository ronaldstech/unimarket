import { Plus, Heart, ShoppingBag, Eye, Star } from 'lucide-react';
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
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="w-10 h-10 rounded-full glass-thick flex items-center justify-center bg-white/90 hover:bg-white transition-all shadow-soft group/fav"
                    >
                        <Heart size={18} className="text-foreground/70 group-hover/fav:text-red-500 group-hover/fav:fill-red-500 transition-all" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                        className="w-10 h-10 rounded-full glass-thick flex items-center justify-center bg-white/90 hover:bg-white transition-all shadow-soft opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500"
                    >
                        <Eye size={18} className="text-foreground/70 hover:text-primary transition-colors" />
                    </button>
                </div>

                {/* Bottom Quick Add */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    className="absolute bottom-4 left-4 right-4 bg-primary text-primary-foreground py-3 rounded-xl font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center gap-2 shadow-premium hover:bg-primary/90"
                >
                    <Plus size={14} strokeWidth={3} />
                    Quick Add
                </button>
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center gap-0.5 text-luxury">
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground ml-1">(24)</span>
                </div>

                <h3 className="font-black text-base tracking-tight mb-1 line-clamp-2 leading-tight">
                    {product.name}
                </h3>

                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black mb-3">
                    {product.category}
                </p>

                <div className="mt-auto flex items-baseline gap-2">
                    <span className="text-xl font-black tracking-tighter">
                        MWK {Number(product.price).toLocaleString()}
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
