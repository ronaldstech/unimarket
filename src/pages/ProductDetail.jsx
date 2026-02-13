import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
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
                        image: data.images && data.images.length > 0
                            ? data.images[0]
                            : "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80"
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

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'UniMarket', text: shareText, url: shareUrl });
            } catch (err) {
                console.log(err);
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
                                className="relative"
                            >
                                <div className="aspect-[4/5] bg-secondary/20 rounded-[3rem] overflow-hidden relative group border border-border/10">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />

                                    {/* Badges */}
                                    <div className="absolute top-8 left-8 flex flex-col gap-2">
                                        {product.isNew && (
                                            <span className="bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full backdrop-blur-md">
                                                Edition 01 / New
                                            </span>
                                        )}
                                        <span className="bg-card backdrop-blur-md text-foreground text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-border/20 shadow-xl">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Details Section */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col"
                            >
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
                                            <div className="text-4xl font-black tracking-tighter tabular-nums text-foreground">
                                                {selectedVariant
                                                    ? Number(selectedVariant.price).toLocaleString()
                                                    : Number(product.price).toLocaleString()
                                                }
                                                <span className="text-xs ml-2 text-muted-foreground font-bold">MWK</span>
                                            </div>
                                            {product.originalPrice > (selectedVariant ? parseFloat(selectedVariant.price) : product.price) && (
                                                <span className="text-lg text-muted-foreground line-through opacity-40 font-bold tabular-nums">
                                                    MWK {Number(product.originalPrice).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-lg border border-emerald-500/20">
                                            In Stock
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

                                <div className="space-y-10">
                                    <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                                        A masterful fusion of technological precision and aesthetic purity. Crafted for the modern index,
                                        this object represents the zenith of our design philosophy. Experience unparalleled quality and timeless design.
                                    </p>

                                    {/* Product Variants Selection */}
                                    {product.variants && product.variants.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-luxury ml-1">
                                                Select Option
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {product.variants.map((v, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelectedVariant(v)}
                                                        className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedVariant?.name === v.name
                                                                ? "bg-primary text-white border-primary shadow-premium"
                                                                : "bg-secondary/30 border-transparent hover:border-border/50 text-muted-foreground hover:text-foreground"
                                                            }`}
                                                    >
                                                        {v.name} • {Number(v.price).toLocaleString()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Color Options */}
                                    <div className="flex items-center justify-between p-6 rounded-3xl bg-secondary/50 dark:bg-card border border-border/10">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                                                Color Variant
                                            </h4>
                                            <div className="flex gap-4">
                                                {['#000', '#eee', '#c5a358'].map((color, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setActiveFinish(i)}
                                                        className={`w-8 h-8 rounded-full border-4 transition-all ${activeFinish === i ? 'border-primary dark:border-luxury scale-110' : 'border-transparent scale-100'
                                                            }`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right text-foreground">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                                                Material
                                            </h4>
                                            <span className="text-xs font-black uppercase">Premium Quality</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleAddToCart}
                                                className="flex-[4] bg-primary text-primary-foreground py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:opacity-90 transition-all active:scale-[0.98] shadow-2xl shadow-primary/10"
                                            >
                                                <ShoppingBag size={18} />
                                                Add to Collection
                                            </button>
                                            <button className="flex-1 bg-card rounded-2xl flex items-center justify-center hover:bg-secondary border border-border/10 transition-all text-foreground">
                                                <Heart size={20} />
                                            </button>
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
