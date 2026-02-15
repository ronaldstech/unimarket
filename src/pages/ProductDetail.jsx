import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import {
    ShoppingBag,
    Heart,
    Star,
    ShieldCheck,
    Zap,
    ArrowLeft,
    Share2,
    Copy,
    Check,
    RefreshCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFinish, setActiveFinish] = useState(0);
    const [copied, setCopied] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    const referralCode = searchParams.get('ref');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productDoc = await getDoc(doc(db, 'data', 'stock', 'products', id));
                if (productDoc.exists()) {
                    const data = productDoc.data();
                    setProduct({
                        id: productDoc.id,
                        ...data,
                        name: data.title || "Untitled Product",
                        price: parseFloat(data.price) || 0,
                        originalPrice: parseFloat(data.actualPrice) || 0,
                        images: data.images && data.images.length > 0
                            ? data.images
                            : ["https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80"],
                        image: data.images && data.images.length > 0 ? data.images[0] : "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80"
                    });

                    // Track referral if present and different from current user
                    if (referralCode && user?.myReferralCode !== referralCode) {
                        console.log('Referral tracked:', referralCode);
                        // You can add additional tracking logic here
                    }
                } else {
                    toast.error('Product not found');
                    navigate('/browse');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, referralCode, user, navigate]);

    const handleAddToCart = () => {
        if (product) {
            const itemToAdd = {
                ...product,
                price: selectedVariant ? parseFloat(selectedVariant.price) : product.price,
                selectedVariantName: selectedVariant ? selectedVariant.name : null,
                // Create a unique cart ID so different variants of the same product count as separate items
                cartId: selectedVariant ? `${product.id}-${selectedVariant.name}` : product.id
            };
            addToCart(itemToAdd);
        }
    };

    const shareUrl = `${window.location.origin}/product/${id}${user?.myReferralCode ? `?ref=${user.myReferralCode}` : ''}`;
    const shareText = `Check out this ${product?.name} on UniMarket! MWK ${Number(product?.price).toLocaleString()}`;

    const handleCopyLink = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shareUrl);
            } else {
                // Fallback for non-secure contexts
                const textArea = document.createElement("textarea");
                textArea.value = shareUrl;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            setCopied(true);
            toast.success('Link copied!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
            toast.error('Failed to copy link');
        }
    };

    const handleShare = async () => {
        const title = 'UniMarket';
        const text = shareText;
        const url = shareUrl;

        if (navigator.share) {
            try {
                // When sharing a file, some apps (like WhatsApp) work better 
                // if the URL is part of the text rather than a separate field.
                const shareData = {
                    title,
                    text: `${text}\n\nLink: ${url}`
                };

                if (product?.images?.[selectedImage]) {
                    try {
                        const response = await fetch(product.images[selectedImage], { mode: 'cors' });
                        const blob = await response.blob();
                        // Use a very simple filename
                        const file = new File([blob], `product.jpg`, { type: 'image/jpeg' });

                        if (navigator.canShare && navigator.canShare({ files: [file] })) {
                            shareData.files = [file];
                            // If we have files, we MUST NOT have a url field for some apps to work
                        } else {
                            // If file sharing is not supported, add the url back
                            shareData.url = url;
                        }
                    } catch (imageError) {
                        console.log('Image fetch for share failed:', imageError);
                        shareData.url = url;
                    }
                } else {
                    shareData.url = url;
                }

                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                    handleCopyLink();
                }
            }
        } else {
            handleCopyLink();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCcw className="animate-spin text-primary" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Loading Product...</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <>
            <Helmet>
                <title>{`${product.name} - UniMarket`}</title>
                <meta name="description" content={`${product.name} - MWK ${Number(product.price).toLocaleString()}. Premium quality products at UniMarket.`} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="product" />
                <meta property="og:title" content={`${product.name} - UniMarket`} />
                <meta property="og:description" content={`${product.name} - MWK ${Number(product.price).toLocaleString()}. Premium quality products at UniMarket.`} />
                <meta property="og:image" content={product.image?.startsWith('http') ? product.image : `${window.location.origin}${product.image}`} />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:site_name" content="UniMarket" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${product.name} - UniMarket`} />
                <meta name="twitter:description" content={`${product.name} - MWK ${Number(product.price).toLocaleString()}. Premium quality products at UniMarket.`} />
                <meta name="twitter:image" content={product.image?.startsWith('http') ? product.image : `${window.location.origin}${product.image}`} />
            </Helmet>

            <div className="min-h-screen bg-background transition-colors duration-500">
                {/* Header */}
                <div className="container pt-24 pb-8 px-6">
                    <button
                        onClick={() => navigate('/browse')}
                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all mb-6 group"
                    >
                        <div className="p-1.5 rounded-full bg-card shadow-soft group-hover:shadow-md transition-all border border-border/10">
                            <ArrowLeft size={12} className="text-foreground" />
                        </div>
                        <span className="text-foreground/60 group-hover:text-primary">Back to Browse</span>
                    </button>

                    {referralCode && (
                        <div className="mb-6 p-4 bg-primary/5 dark:bg-luxury/5 border border-primary/10 dark:border-luxury/10 rounded-2xl">
                            <p className="text-xs font-bold text-primary dark:text-luxury">
                                🎁 Shared by a friend • Referral Code: {referralCode}
                            </p>
                        </div>
                    )}
                </div>

                {/* Product Content */}
                <div className="container px-6 pb-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                            {/* Image Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col gap-6"
                            >
                                <div
                                    className="aspect-[4/5] bg-secondary/20 rounded-[3rem] overflow-hidden relative group border border-border/10 shadow-premium protect-image"
                                    onContextMenu={(e) => e.preventDefault()}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={selectedImage}
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            src={product.images[selectedImage]}
                                            alt={product.name}
                                            draggable="false"
                                            className="w-full h-full object-cover"
                                        />
                                    </AnimatePresence>

                                    {/* Badges */}
                                    <div className="absolute top-8 left-8 flex flex-col gap-2 z-20">
                                        {product.isNew && (
                                            <span className="bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full backdrop-blur-md shadow-lg">
                                                Edition 01 / New
                                            </span>
                                        )}
                                        <span className="bg-white/90 dark:bg-card/90 backdrop-blur-md text-foreground text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-border/20 shadow-lg">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Thumbnails */}
                                {product.images.length > 1 && (
                                    <div className="flex gap-4 px-2 overflow-x-auto pb-2 premium-scrollbar">
                                        {product.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedImage(idx)}
                                                className={`relative w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0 protect-image ${selectedImage === idx
                                                    ? 'border-primary ring-4 ring-primary/10'
                                                    : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                                                    }`}
                                                onContextMenu={(e) => e.preventDefault()}
                                            >
                                                <img
                                                    src={img}
                                                    alt=""
                                                    draggable="false"
                                                    className="w-full h-full object-cover"
                                                />
                                                {selectedImage === idx && (
                                                    <div className="absolute inset-0 bg-primary/10" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Details Section */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col"
                            >
                                {product.isPromotion && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-8 p-6 rounded-[2rem] bg-primary text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                            <Zap size={80} fill="currentColor" />
                                        </div>
                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                                <Zap size={24} fill="currentColor" />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Active Promotion</h4>
                                                <p className="text-xl font-black uppercase tracking-tight">{product.promotionLabel || 'Special Offer'}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <header className="mb-10">
                                    <div className="flex items-center gap-1.5 text-luxury mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill="currentColor" />
                                        ))}
                                        <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                            Trusted Archive
                                        </span>
                                    </div>

                                    <h1 className="text-5xl lg:text-6xl font-black tracking-tightest uppercase leading-[0.85] mb-6 text-foreground">
                                        {product.name?.split(' ').map((word, i) => (
                                            <span key={i} className={i === 1 ? 'text-primary dark:text-luxury italic' : ''}>
                                                {word}{' '}
                                            </span>
                                        ))}
                                    </h1>

                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="flex items-baseline gap-4">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={selectedVariant ? selectedVariant.name : 'base'}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="text-4xl font-black tracking-tighter tabular-nums text-foreground"
                                                >
                                                    {selectedVariant
                                                        ? Number(selectedVariant.price).toLocaleString()
                                                        : Number(product.price).toLocaleString()
                                                    }
                                                    <span className="text-xs ml-2 text-muted-foreground font-bold">MWK</span>
                                                </motion.div>
                                            </AnimatePresence>
                                            {product.originalPrice > (selectedVariant ? parseFloat(selectedVariant.price) : product.price) && (
                                                <span className="text-lg text-muted-foreground line-through opacity-40 font-bold tabular-nums">
                                                    MWK {Number(product.originalPrice).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2 scale-90 origin-left">
                                            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-lg border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
                                                Secure Status
                                            </div>
                                            {product.isPromotion && (
                                                <div className="px-3 py-1 bg-primary text-primary-foreground text-[9px] font-black uppercase rounded-lg shadow-sm border border-white/10 flex items-center gap-1.5">
                                                    <Zap size={10} fill="currentColor" />
                                                    PROMO INDEX
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {product.school && (
                                        <div className="mb-6">
                                            <span className="text-xs font-black text-primary dark:text-luxury uppercase tracking-[0.3em]">
                                                {product.school}
                                            </span>
                                        </div>
                                    )}
                                </header>

                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/40 dark:text-luxury/40 ml-1">
                                            Object Narrative
                                        </h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                                            {product.description || "A masterful fusion of technological precision and aesthetic purity. Crafted for the modern index, this object represents the zenith of our design philosophy. Experience unparalleled quality and timeless design."}
                                        </p>
                                    </div>

                                    {/* Product Variants Selection */}
                                    {product.variants && product.variants.length > 0 && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between px-1">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-luxury">
                                                    Specifications
                                                </h4>
                                                <span className="text-[9px] font-bold text-muted-foreground/40 uppercase">
                                                    {product.variants.length} Variations detected
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {product.variants.map((v, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelectedVariant(v)}
                                                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-1 text-left ${selectedVariant?.name === v.name
                                                            ? "bg-primary/5 border-primary shadow-premium"
                                                            : "bg-secondary/30 border-transparent hover:border-border/50 text-muted-foreground"
                                                            }`}
                                                    >
                                                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${selectedVariant?.name === v.name ? 'text-primary' : ''}`}>
                                                            {v.name}
                                                        </span>
                                                        <span className={`text-xs font-black tabular-nums transition-colors ${selectedVariant?.name === v.name ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            MWK {Number(v.price).toLocaleString()}
                                                        </span>
                                                        {selectedVariant?.name === v.name && (
                                                            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-primary" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Info Grid - Replaces static color selection for now with more useful info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 rounded-[2rem] bg-secondary/30 border border-border/10 flex flex-col gap-2">
                                            <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
                                                Curated School
                                            </h4>
                                            <span className="text-[10px] font-black uppercase tracking-wider text-foreground">
                                                {(product.school || "Universal").toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="p-6 rounded-[2rem] bg-secondary/30 border border-border/10 flex flex-col gap-2">
                                            <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
                                                Inventory Status
                                            </h4>
                                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">
                                                {product.stock > 0 ? 'Secure Placement' : 'Exhausted Index'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleAddToCart}
                                                className="flex-[4] bg-primary text-primary-foreground py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-primary/20 hover:shadow-primary/40 relative overflow-hidden group"
                                            >
                                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                                <ShoppingBag size={18} />
                                                Add to Cart
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex-1 bg-card rounded-2xl flex items-center justify-center hover:bg-secondary border border-border/10 transition-all text-foreground"
                                            >
                                                <Heart size={20} />
                                            </motion.button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={handleShare}
                                                className="py-4 bg-card border border-border/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all group text-foreground"
                                            >
                                                <Share2 size={14} className="group-hover:rotate-12 transition-transform" />
                                                Share
                                            </button>
                                            <button
                                                onClick={handleCopyLink}
                                                className="py-4 bg-card border border-border/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all text-foreground"
                                            >
                                                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                {copied ? 'Copied' : 'Copy Link'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Trust Metrics */}
                                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/10">
                                        <div className="flex items-center gap-4">
                                            <ShieldCheck size={20} className="text-primary/40 dark:text-luxury/40" />
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-foreground">Secured</p>
                                                <p className="text-[10px] font-bold text-muted-foreground">Lifetime Warranty</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Zap size={20} className="text-primary/40 dark:text-luxury/40" />
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-foreground">Rapid</p>
                                                <p className="text-[10px] font-bold text-muted-foreground">Malawi Express</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
