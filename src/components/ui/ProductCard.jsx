import { Plus, Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative bg-white rounded-[2rem] border border-black/5 p-4 transition-all duration-500 hover:shadow-premium hover:border-black/10"
        >
            <div className="relative aspect-[4/5] rounded-[1.5rem] bg-[#f8f8f8] overflow-hidden mb-6">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Floating Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                        <Heart size={18} className="text-muted-foreground hover:text-red-500 transition-colors" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                        <ShoppingCart size={18} className="text-muted-foreground hover:text-primary transition-colors" />
                    </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
                        <Plus size={18} /> Quick Add
                    </button>
                </div>
            </div>

            <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="inline-block px-2 py-1 rounded-md bg-accent/10 border border-accent/20 text-[10px] text-accent font-bold uppercase tracking-widest mb-2">
                            {product.category}
                        </div>
                        <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-black text-2xl tracking-tighter">${product.price}</span>
                    <span className="text-sm text-muted-foreground line-through opacity-50">
                        ${product.originalPrice ? product.originalPrice.toFixed(0) : (product.price * 1.2).toFixed(0)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
