import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Search, Plus, Edit2, X, Save, ImageIcon, Loader, CloudUpload, Package, LayoutGrid, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ id: '', name: '', imageUrl: '', imageUrl_original: '' });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'data', 'stock', 'categories'));
            const categoriesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                id: category.id,
                name: category.name,
                imageUrl: category.imageUrl || '',
                imageUrl_original: category.imageUrl_original || category.imageUrl || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({ id: '', name: '', imageUrl: '' });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadToast = toast.loading("Uploading image...");
        setUploading(true);

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await fetch('https://unimarket-mw.com/api/upload.php', {
                method: 'POST',
                body: uploadData
            });
            const data = await response.json();

            if (data.optimizedUrl && data.originalUrl) {
                setFormData(prev => ({
                    ...prev,
                    imageUrl: data.optimizedUrl,
                    imageUrl_original: data.originalUrl
                }));
                toast.success("Image uploaded successfully", { id: uploadToast });
            } else {
                throw new Error(data.error || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(`Upload failed: ${error.message}`, { id: uploadToast });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            if (editingCategory) {
                // Update existing
                const categoryRef = doc(db, 'data', 'stock', 'categories', editingCategory.id);
                await updateDoc(categoryRef, {
                    name: formData.name,
                    imageUrl: formData.imageUrl,
                    imageUrl_original: formData.imageUrl_original || formData.imageUrl
                });
                toast.success("Category updated successfully");
            } else {
                // Create new with custom ID
                if (!formData.id.trim()) {
                    toast.error("Category ID is required");
                    setSubmitLoading(false);
                    return;
                }
                const categoryRef = doc(db, 'data', 'stock', 'categories', formData.id.toLowerCase().replace(/\s+/g, '-'));
                await setDoc(categoryRef, {
                    name: formData.name,
                    imageUrl: formData.imageUrl,
                    imageUrl_original: formData.imageUrl_original || formData.imageUrl
                });
                toast.success("Category created successfully");
            }

            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error("Failed to save category");
        } finally {
            setSubmitLoading(false);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 px-6 pb-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Categories</h1>
                        <p className="text-muted-foreground font-medium">
                            Manage product categories and catalog structure.
                        </p>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-premium text-xs font-black uppercase tracking-widest"
                    >
                        <Plus size={16} strokeWidth={3} />
                        <span>Add Category</span>
                    </button>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 rounded-3xl border border-border/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <LayoutGrid size={64} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Total Categories</p>
                            <h3 className="text-3xl font-black text-foreground">{categories.length}</h3>
                            <div className="flex items-center gap-2 mt-2 text-primary text-xs font-bold">
                                <Tag size={14} />
                                <span>Active Classifications</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative group max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-black/20 border border-border/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:text-muted-foreground/50"
                    />
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredCategories.map((cat, index) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-white dark:bg-white/5 border border-border/10 rounded-3xl p-4 hover:shadow-premium hover:border-primary/20 transition-all duration-300 flex flex-col gap-4"
                            >
                                <div className="aspect-[4/3] w-full bg-secondary/30 rounded-2xl overflow-hidden relative">
                                    {cat.imageUrl ? (
                                        <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                            <ImageIcon size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                    <button
                                        onClick={() => handleOpenModal(cat)}
                                        className="absolute bottom-4 right-4 p-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black pointer-events-auto"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>

                                <div className="px-2 pb-2">
                                    <h3 className="font-black text-lg tracking-tight uppercase truncate" title={cat.name}>{cat.name}</h3>
                                    <p className="text-[10px] font-mono text-muted-foreground mt-1 truncate bg-secondary/50 px-2 py-1 rounded w-fit">ID: {cat.id}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Edit/Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[61] bg-card border border-border/10 rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh] premium-scrollbar"
                        >
                            <div className="flex items-center justify-between mb-8 sticky top-0 bg-card z-10 pb-4 border-b border-border/10">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-wide">
                                        {editingCategory ? 'Edit Category' : 'New Category'}
                                    </h2>
                                    <p className="text-xs text-muted-foreground font-medium mt-1">Configure category details.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                        Category ID {editingCategory && '(Read-only)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        disabled={!!editingCategory}
                                        placeholder="e.g. electronics-gadgets"
                                        className="w-full bg-secondary/30 border border-border/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm disabled:opacity-50"
                                    />
                                    {!editingCategory && (
                                        <p className="text-[10px] text-muted-foreground ml-1">
                                            Unique identifier in URL-friendly format (e.g., 'smart-phones').
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Electronics & Gadgets"
                                        required
                                        className="w-full bg-secondary/30 border border-border/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                        Category Image
                                    </label>
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
                                    {formData.imageUrl && (
                                        <div className="mt-4 aspect-video w-full rounded-2xl overflow-hidden bg-secondary/30 border border-border/10 relative group shadow-sm">
                                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <p className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-lg border border-white/20">Image Selected</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-border/10 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitLoading || uploading}
                                        className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-premium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
                                    >
                                        {submitLoading ? (
                                            <Loader size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                <span>Save Category</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
