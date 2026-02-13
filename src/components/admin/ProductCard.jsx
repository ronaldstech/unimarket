import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, ImageIcon, Package } from 'lucide-react';

export default function ProductCard({ product, index, onEdit, onDelete }) {
    const stock = parseInt(product.stock) || 0;
    const isLowStock = stock > 0 && stock < 10;
    const isOutOfStock = stock === 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-white dark:bg-white/5 border border-border/10 rounded-3xl p-4 hover:shadow-premium hover:border-primary/20 transition-all duration-300 flex flex-col gap-4"
        >
            <div className="aspect-[4/5] w-full bg-secondary/30 rounded-2xl overflow-hidden relative">
                {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                        <ImageIcon size={48} />
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                    {isOutOfStock ? (
                        <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-sm">Out of Stock</span>
                    ) : isLowStock ? (
                        <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-sm">Low Stock</span>
                    ) : (
                        <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-sm">In Stock</span>
                    )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-100 pointer-events-none transition-opacity duration-300" />

                <div className="absolute top-3 right-3 flex gap-2 z-20 pointer-events-auto">
                    <button
                        onClick={() => onEdit(product)}
                        className="p-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white hover:text-black transition-colors"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(product)}
                        className="p-2 bg-red-500/80 backdrop-blur-md border border-red-500/20 text-white rounded-xl hover:bg-red-600 transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1 pointer-events-none z-20">
                    <div className="flex gap-2 text-[9px] font-black uppercase tracking-widest text-white/90">
                        <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-white/10">{product.category}</span>
                        <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-white/10">{product.school}</span>
                    </div>
                    <div className="text-[9px] text-white/80 font-mono mt-1 drop-shadow-md">
                        Created by: {product.createdBy || 'Unknown'}
                    </div>
                </div>
            </div>

            <div className="px-1 flex flex-col gap-2">
                <h3 className="font-black text-sm tracking-tight uppercase truncate" title={product.title}>{product.title}</h3>

                <div className="flex items-end justify-between border-t border-border/10 pt-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">
                            {product.variants && product.variants.length > 0 ? 'Price Range' : 'Selling Price'}
                        </span>
                        <span className="text-base font-black text-primary">
                            {product.variants && product.variants.length > 0 ? (
                                (() => {
                                    const prices = product.variants.map(v => parseInt(v.price) || 0).filter(p => p > 0);
                                    if (prices.length === 0) return `MWK ${parseInt(product.price).toLocaleString()}`;
                                    const min = Math.min(...prices);
                                    const max = Math.max(...prices);
                                    return min === max ? `MWK ${min.toLocaleString()}` : `MWK ${min.toLocaleString()} - ${max.toLocaleString()}`;
                                })()
                            ) : (
                                `MWK ${parseInt(product.price).toLocaleString()}`
                            )}
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        {product.actualPrice && product.actualPrice !== product.price && (
                            <span className="text-[10px] text-muted-foreground line-through decoration-red-500/50">Retail: {parseInt(product.actualPrice).toLocaleString()}</span>
                        )}
                        {product.orderingPrice && (
                            <span className="text-[9px] font-mono text-emerald-500/80">Cost: {parseInt(product.orderingPrice).toLocaleString()}</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] bg-secondary/50 px-3 py-2 rounded-lg mt-1 w-full justify-center">
                    <Package size={12} className="text-muted-foreground" />
                    <span className="font-bold uppercase tracking-wider">{product.stock} Units Available</span>
                </div>
            </div>
        </motion.div>
    );
}
