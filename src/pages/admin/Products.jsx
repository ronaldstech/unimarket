import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

// New Components
import ProductStats from '../../components/admin/ProductStats';
import ProductFilters from '../../components/admin/ProductFilters';
import ProductCard from '../../components/admin/ProductCard';
import ProductModal from '../../components/admin/ProductModal';
import DeleteConfirmationModal from '../../components/admin/DeleteConfirmationModal';

export default function Products() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterSchool, setFilterSchool] = useState('All');
    const [filterStock, setFilterStock] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);

    // Delete Confirmation State
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        productId: null,
        productTitle: ''
    });

    const initialFormState = {
        title: '',
        price: '',
        actualPrice: '',
        orderingPrice: '',
        stock: '',
        category: '',
        school: '',
        description: '',
        imageUrl: '',
        imageUrl_original: '',
        variants: [], // Array of { name: '', price: '' }
        isPromotion: false,
        promotionLabel: ''
    };
    const [formData, setFormData] = useState(initialFormState);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'data', 'stock', 'products'));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'data', 'stock', 'categories'));
            const cats = querySnapshot.docs.map(doc => doc.data().name);
            setCategories(cats);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                title: product.title || '',
                price: product.price || '',
                actualPrice: product.actualPrice || '',
                orderingPrice: product.orderingPrice || '',
                stock: product.stock || '',
                category: product.category || '',
                school: product.school || '',
                description: product.description || '',
                imageUrl: product.images && product.images.length > 0 ? product.images[0] : '',
                imageUrl_original: product.images && product.images.length > 1 ? product.images[1] : (product.images && product.images.length > 0 ? product.images[0] : ''),
                variants: product.variants || [],
                isPromotion: product.isPromotion || false,
                promotionLabel: product.promotionLabel || ''
            });
        } else {
            setEditingProduct(null);
            setFormData(initialFormState);
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

        const productData = {
            title: formData.title,
            price: formData.price.toString(),
            actualPrice: formData.actualPrice.toString(),
            orderingPrice: formData.orderingPrice.toString(),
            stock: parseInt(formData.stock) || 0,
            category: formData.category,
            school: formData.school,
            description: formData.description,
            images: formData.imageUrl ? (formData.imageUrl_original ? [formData.imageUrl, formData.imageUrl_original] : [formData.imageUrl]) : [],
            variants: formData.variants || [],
            isPromotion: formData.isPromotion,
            promotionLabel: formData.promotionLabel,
            updatedAt: new Date().toISOString(),
            updatedBy: user?.uid || 'admin'
        };

        try {
            if (editingProduct) {
                const productRef = doc(db, 'data', 'stock', 'products', editingProduct.id);
                await updateDoc(productRef, productData);
                toast.success("Product updated successfully");
            } else {
                productData.createdAt = new Date().toISOString();
                productData.createdBy = user?.uid || 'admin';
                await addDoc(collection(db, 'data', 'stock', 'products'), productData);
                toast.success("Product created successfully");
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error("Failed to save product");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeleteClick = (product) => {
        setDeleteConfirmation({
            isOpen: true,
            productId: product.id,
            productTitle: product.title
        });
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation.productId) return;

        try {
            await deleteDoc(doc(db, 'data', 'stock', 'products', deleteConfirmation.productId));
            toast.success("Product deleted successfully");
            fetchProducts();
            setDeleteConfirmation({ isOpen: false, productId: null, productTitle: '' });
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
            const matchesSchool = filterSchool === 'All' || p.school === filterSchool;

            let matchesStock = true;
            const stockLevel = parseInt(p.stock) || 0;
            if (filterStock === 'Low') {
                matchesStock = stockLevel > 0 && stockLevel < 10;
            } else if (filterStock === 'OutOfStock') {
                matchesStock = stockLevel === 0;
            }

            return matchesSearch && matchesCategory && matchesSchool && matchesStock;
        });
    }, [products, searchTerm, filterCategory, filterSchool, filterStock]);

    const stats = useMemo(() => {
        const totalProducts = filteredProducts.length;
        const portfolioValue = filteredProducts.reduce((acc, p) => acc + ((parseFloat(p.price) || 0) * (parseInt(p.stock) || 0)), 0);
        const lowStock = filteredProducts.filter(p => (parseInt(p.stock) || 0) < 10).length;
        return { totalProducts, portfolioValue, lowStock };
    }, [filteredProducts]);

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
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Products Query</h1>
                        <p className="text-muted-foreground font-medium">
                            Manage inventory, pricing adjustments, and asset details.
                        </p>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-premium text-xs font-black uppercase tracking-widest"
                    >
                        <Plus size={16} strokeWidth={3} />
                        <span>Add Asset</span>
                    </button>
                </div>

                <ProductStats stats={stats} />

                <ProductFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterCategory={filterCategory}
                    setFilterCategory={setFilterCategory}
                    filterSchool={filterSchool}
                    setFilterSchool={setFilterSchool}
                    filterStock={filterStock}
                    setFilterStock={setFilterStock}
                    categories={categories}
                />

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                onEdit={handleOpenModal}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                editingProduct={editingProduct}
                categories={categories}
                uploading={uploading}
                submitLoading={submitLoading}
                handleImageUpload={handleImageUpload}
            />

            <DeleteConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                productTitle={deleteConfirmation.productTitle}
                onCancel={() => setDeleteConfirmation({ isOpen: false, productId: null, productTitle: '' })}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
