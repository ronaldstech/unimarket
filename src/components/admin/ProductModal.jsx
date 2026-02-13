import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader, CloudUpload, DollarSign, Plus, Trash2 } from 'lucide-react';

export default function ProductModal({
    isOpen,
    onClose,
    formData,
    setFormData,
    onSubmit,
    editingProduct,
    categories,
    uploading,
    submitLoading,
    handleImageUpload
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl z-[61] bg-card border border-border/10 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto premium-scrollbar"
                    >
                        <div className="flex items-center justify-between mb-8 sticky top-0 bg-card z-10 pb-4 border-b border-border/10">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-wide">
                                    {editingProduct ? 'Edit Asset' : 'New Asset'}
                                </h2>
                                <p className="text-xs text-muted-foreground font-medium mt-1">Fill in the details below to update the catalogue.</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Identity */}
                                <div className="space-y-4 col-span-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            placeholder="e.g. Premium Cotton T-Shirt"
                                            className="w-full bg-secondary/30 border border-border/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium text-lg placeholder:text-muted-foreground/30"
                                        />
                                    </div>
                                </div>

                                {/* Categorization */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                                    <input
                                        list="category-suggestions"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-secondary/30 border border-border/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                        placeholder="Select Category..."
                                    />
                                    <datalist id="category-suggestions">
                                        {categories.map(cat => <option key={cat} value={cat} />)}
                                    </datalist>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target School</label>
                                    <select
                                        value={formData.school}
                                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                        className="w-full bg-secondary/30 border border-border/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium appearance-none"
                                    >
                                        <option value="">Select Campus...</option>
                                        <option value="unima">UNIMA</option>
                                        <option value="mubas">MUBAS</option>
                                        <option value="luanar">LUANAR</option>
                                        <option value="must">MUST</option>
                                        <option value="kuhes">KUHES</option>
                                        <option value="mznuni">MZUNI</option>
                                    </select>
                                </div>

                                {/* Pricing Section */}
                                <div className="col-span-2 md:col-span-2 py-4 px-6 bg-secondary/10 rounded-3xl border border-dashed border-border/20">
                                    <div className="flex items-center gap-2 mb-6">
                                        <DollarSign size={16} className="text-emerald-500" />
                                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Financial Details</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ordering Cost</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">MWK</span>
                                                <input
                                                    type="number"
                                                    value={formData.orderingPrice}
                                                    onChange={(e) => setFormData({ ...formData, orderingPrice: e.target.value })}
                                                    placeholder="0.00"
                                                    className="w-full bg-white dark:bg-black/20 border border-border/10 rounded-xl pl-14 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-1">Selling Price</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-xs">MWK</span>
                                                <input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    required
                                                    placeholder="0.00"
                                                    className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl pl-14 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-black text-lg text-emerald-600 dark:text-emerald-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Retail Price</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">MWK</span>
                                                <input
                                                    type="number"
                                                    value={formData.actualPrice}
                                                    onChange={(e) => setFormData({ ...formData, actualPrice: e.target.value })}
                                                    placeholder="0.00"
                                                    className="w-full bg-white dark:bg-black/20 border border-border/10 rounded-xl pl-14 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono font-medium text-muted-foreground line-through decoration-red-500/30"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Inventory & Variants Section */}
                                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Stock Level</label>
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            required
                                            className="w-full bg-secondary/30 border border-border/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                        />
                                    </div>

                                    {/* Product Media */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Product Media</label>
                                        <div className="flex gap-4 items-center">
                                            <label className="cursor-pointer flex items-center justify-center gap-3 px-6 py-4 bg-secondary/30 border border-border/10 rounded-xl hover:bg-secondary/50 transition-all text-xs font-black uppercase tracking-widest w-full group overflow-hidden relative">
                                                {uploading ? (
                                                    <Loader size={20} className="animate-spin text-primary" />
                                                ) : (
                                                    <>
                                                        <CloudUpload size={20} className="text-primary group-hover:scale-110 transition-transform" />
                                                        <span className="group-hover:text-primary transition-colors">{formData.imageUrl ? 'Change Image' : 'Select Image'}</span>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                    disabled={uploading}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Variants Section */}
                                <div className="col-span-2 space-y-4 pt-4 border-t border-border/10">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Product Variants (Optional)</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, variants: [...(formData.variants || []), { name: '', price: '' }] })}
                                            className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2"
                                        >
                                            <Plus size={12} strokeWidth={3} />
                                            Add Option
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {formData.variants && formData.variants.map((variant, index) => (
                                            <div key={index} className="flex gap-3 items-center animate-in fade-in slide-in-from-top-1 duration-200">
                                                <input
                                                    type="text"
                                                    value={variant.name}
                                                    onChange={(e) => {
                                                        const newVariants = [...formData.variants];
                                                        newVariants[index].name = e.target.value;
                                                        setFormData({ ...formData, variants: newVariants });
                                                    }}
                                                    placeholder="Type (e.g. Hardcopy)"
                                                    className="flex-1 bg-secondary/20 border border-border/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                />
                                                <div className="relative w-32">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">MWK</span>
                                                    <input
                                                        type="number"
                                                        value={variant.price}
                                                        onChange={(e) => {
                                                            const newVariants = [...formData.variants];
                                                            newVariants[index].price = e.target.value;
                                                            setFormData({ ...formData, variants: newVariants });
                                                        }}
                                                        placeholder="0"
                                                        className="w-full bg-secondary/20 border border-border/10 rounded-xl pl-10 pr-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newVariants = formData.variants.filter((_, i) => i !== index);
                                                        setFormData({ ...formData, variants: newVariants });
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {(!formData.variants || formData.variants.length === 0) && (
                                            <p className="text-[10px] text-muted-foreground italic ml-1">No variants added. The main price will be used.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    {formData.imageUrl && (
                                        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-secondary/30 border border-border/10 relative group shadow-sm">
                                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <p className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-lg border border-white/20">Image Selected</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Brief Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        placeholder="Describe the product features..."
                                        className="w-full bg-secondary/30 border border-border/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium resize-none leading-relaxed"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/10 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitLoading || uploading}
                                    className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-premium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
                                >
                                    {submitLoading ? (
                                        <Loader size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            <span>Save Asset</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
