import { useState, useMemo, useEffect, useRef } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { Filter, SlidersHorizontal, Search, ChevronDown, Check, Star, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';

export default function Browse() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const { products, loading, loadingMore, error, hasMore, loadMore } = useProducts(selectedCategory);
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState(1000000); // Default to high
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [loadMore, hasMore, loadingMore, loading]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPrice = p.price <= priceRange;
            return matchesSearch && matchesPrice;
        });
    }, [products, searchQuery, priceRange]);

    const categories = ["All", "hygne", "food", "electronics", "fashion"]; // Hardcoding some or we'd need another hook to fetch all unique cats

    if (error) {
        return (
            <div className="container py-32 text-center">
                <h2 className="text-2xl font-black mb-4">Error loading objects</h2>
                <p className="text-muted-foreground">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="container py-12 px-4 min-h-screen">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/5 pb-12">
                    <div>
                        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                            <span>UniMarket</span>
                            <ChevronDown size={12} className="-rotate-90" />
                            <span className="text-primary">Catalog</span>
                        </nav>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">The Collection</h1>
                        <p className="text-muted-foreground text-xl max-w-xl">Curating the world's finest objects, so you don't have to.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-72 flex-shrink-0 space-y-12">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6">Search</h3>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Filter by name..."
                                    className="w-full bg-muted/50 border border-transparent py-3 pl-12 pr-4 rounded-2xl focus:bg-white focus:border-primary/20 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6">Categories</h3>
                            <div className="flex flex-col gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold group ${selectedCategory === cat
                                            ? "bg-primary text-primary-foreground shadow-lg"
                                            : "hover:bg-muted"
                                            }`}
                                    >
                                        <span>{cat}</span>
                                        {selectedCategory === cat && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em]">{loading ? "Loading..." : "Max Price"}</h3>
                                <span className="font-black text-primary">${priceRange === 1000000 ? "∞" : priceRange}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="100"
                                value={priceRange === 1000000 ? 10000 : priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between mt-2 text-[10px] font-black opacity-30 uppercase tracking-widest">
                                <span>$0</span>
                                <span>$10k+</span>
                            </div>
                        </div>

                        <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                            <Star className="text-luxury mb-4" />
                            <h4 className="font-black text-lg mb-2 leading-tight">Join Elite Membership</h4>
                            <p className="text-sm text-muted-foreground mb-6">Get early access to exclusive drops and zero shipping fees.</p>
                            <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all">
                                Learn More
                            </button>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-8">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                Showing {filteredProducts.length} Results
                            </p>
                            <button className="flex items-center gap-2 font-black text-xs uppercase tracking-widest px-4 py-2 border border-black/5 rounded-full hover:bg-muted transition-all">
                                <span>Sort By: Latest</span>
                                <ChevronDown size={14} />
                            </button>
                        </div>

                        <AnimatePresence mode="popLayout">
                            <motion.div
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {loading ? (
                                    Array(6).fill(0).map((_, i) => (
                                        <div key={i} className="aspect-[4/5] bg-muted rounded-[2rem] animate-pulse" />
                                    ))
                                ) : (
                                    filteredProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div ref={observerTarget} className="mt-8 flex justify-center py-8">
                            {loadingMore && (
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 size={32} className="animate-spin text-primary" />
                                    <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">Gathering More...</p>
                                </div>
                            )}
                            {!hasMore && products.length > 0 && (
                                <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground opacity-30">All Revealed</p>
                            )}
                        </div>

                        {filteredProducts.length === 0 && !loading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-32 text-center"
                            >
                                <div className="inline-block p-8 bg-muted rounded-full mb-8">
                                    <Search size={48} className="text-muted-foreground/30" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tighter mb-4">No Objects Found</h3>
                                <p className="text-muted-foreground text-lg max-w-sm mx-auto mb-8">
                                    We couldn't find anything matching your filters. Try clearing some constraints.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSearchQuery("");
                                        setPriceRange(1000);
                                    }}
                                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-black transition-all hover:scale-105 active:scale-95"
                                >
                                    Clear All Filters
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
