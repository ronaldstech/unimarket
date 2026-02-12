import { useState, useMemo, useEffect, useRef } from 'react';
import ProductCard from '../components/ui/ProductCard';
import QuickViewModal from '../components/ui/QuickViewModal';
import { SlidersHorizontal, Link, Search, ChevronDown, TrendingUp, Zap, Clock, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const HorizontalSection = ({ title, icon: Icon, products }) => {
    const scrollRef = useRef(null);

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                        <Icon size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight">{title}</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Curated Selection</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors group">
                    View All<ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto pb-8 premium-scrollbar snap-x snap-mandatory"
            >
                {products.map((product) => (
                    <div key={product.id} className="w-[280px] flex-shrink-0 snap-start">
                        <ProductCard
                            product={product}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default function Browse() {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlCategory = searchParams.get('category') || "All";
    const [selectedCategory, setSelectedCategory] = useState(urlCategory);
    const [sortOrder, setSortOrder] = useState("Featured");
    const { products, loading, loadingMore, error, hasMore, loadMore } = useProducts(selectedCategory);
    const { categories: dynamicCategories } = useCategories();
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState(100000);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const observerTarget = useRef(null);

    // Sync state with URL
    useEffect(() => {
        if (urlCategory !== selectedCategory) {
            setSelectedCategory(urlCategory);
        }
    }, [urlCategory]);

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        setSearchParams({ category: cat });
    };

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

    const filteredAndSortedProducts = useMemo(() => {
        let result = products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPrice = p.price <= priceRange;
            return matchesSearch && matchesPrice;
        });

        // Sorting Logic
        switch (sortOrder) {
            case "Price: Low to High":
                result.sort((a, b) => a.price - b.price);
                break;
            case "Price: High to Low":
                result.sort((a, b) => b.price - a.price);
                break;
            case "Newest Arrivals":
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            default:
                break;
        }

        return result;
    }, [products, searchQuery, priceRange, sortOrder]);

    const mostSelling = useMemo(() => products.slice(0, 6), [products]);
    const promotions = useMemo(() => products.filter(p => p.discount).slice(0, 6), [products]);
    const newArrivals = useMemo(() => products.filter(p => p.isNew).slice(0, 6), [products]);

    const categories = ["All", ...dynamicCategories.map(c => c.name).filter(n => n !== "All")];

    if (error) {
        return (
            <div className="container py-32 text-center text-foreground">
                <div className="inline-block p-10 bg-red-50 rounded-full mb-8">
                    <SlidersHorizontal size={48} className="text-red-500" />
                </div>
                <h2 className="text-3xl font-black mb-4">Systems Error</h2>
                <p className="text-muted-foreground text-lg mb-8">{error.message}</p>
                <button onClick={() => window.location.reload()} className="bg-primary text-white px-8 py-3 rounded-xl font-bold">
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="container py-12 px-6 min-h-screen text-foreground relative">
            {/* Ambient Background Grid */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.15] dark:opacity-[0.05]" />

            <div className="flex flex-col gap-12 relative z-10">
                {/* Header / Filter Bar */}
                <div className="space-y-12">
                    <div className="flex flex-col gap-8 pb-12 border-b border-border/10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div className="mt-12">
                                <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] mb-4 opacity-40">
                                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                                    <ChevronDown size={10} className="-rotate-90" />
                                    <span className="text-primary dark:text-luxury">Catalogue Registry</span>
                                </nav>
                                <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-foreground">
                                    Catalogue <span className="text-luxury">Registry</span>
                                </h1>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                                    Global exchange terminal / Specialized asset query
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                                <div className="relative group flex-1 md:flex-none">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={14} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search registry..."
                                        className="bg-secondary/50 dark:bg-card border border-transparent dark:border-white/5 py-4 pl-12 pr-12 rounded-2xl focus:bg-white dark:focus:bg-black focus:border-border/50 focus:outline-none transition-all font-bold text-[10px] tracking-widest uppercase w-full md:w-64 shadow-soft"
                                    />
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest shadow-soft ${isSortOpen ? 'bg-white dark:bg-black border-primary text-primary' : 'bg-secondary/50 dark:bg-card border-transparent dark:border-white/5 hover:bg-white dark:hover:bg-black hover:border-border/50 font-black'}`}
                                    >
                                        <SlidersHorizontal size={14} />
                                        <span>{sortOrder}</span>
                                        <ChevronDown size={12} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isSortOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full right-0 mt-3 w-56 glass-thick border border-border/50 shadow-premium rounded-2xl overflow-hidden z-50 p-2"
                                            >
                                                {["Featured", "Price: Low to High", "Price: High to Low", "Newest Arrivals"].map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => { setSortOrder(option); setIsSortOpen(false); }}
                                                        className={`w-full text-left px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${sortOrder === option ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Scroll Filters */}
                        <div className="flex flex-col lg:flex-row lg:items-center gap-8 pt-4">
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center gap-3 overflow-x-auto premium-scrollbar pb-4 scroll-smooth">
                                    {categories.map((cat, idx) => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategoryChange(cat)}
                                            className={`whitespace-nowrap flex items-center gap-3 px-6 py-3 rounded-xl transition-all font-black text-[10px] tracking-widest uppercase ${selectedCategory === cat
                                                ? "bg-primary text-primary-foreground shadow-premium"
                                                : "glass-light text-muted-foreground hover:text-foreground border border-transparent hover:border-border/30"
                                                }`}
                                        >
                                            <span className={`opacity-20 font-black text-[8px] ${selectedCategory === cat ? 'text-primary-foreground' : ''}`}>
                                                {idx.toString().padStart(2, '0')}
                                            </span>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-thick px-8 py-4 rounded-xl border border-border/30 dark:border-white/10 shadow-soft min-w-[320px]">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/30 dark:text-white/30">Valuation Limit</h3>
                                    <span className="font-black text-primary dark:text-luxury text-[10px] tracking-tighter">MWK {priceRange.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100000"
                                    step="500"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                    className="w-full h-1 bg-secondary dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-primary dark:accent-luxury"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="space-y-24">
                    {/* Horizontal Sections */}
                    {selectedCategory === "All" && !searchQuery && (
                        <>
                            <HorizontalSection
                                title="Most Selling"
                                icon={TrendingUp}
                                products={mostSelling}
                            />
                            <HorizontalSection
                                title="Promotions"
                                icon={Zap}
                                products={promotions}
                            />
                            <HorizontalSection
                                title="New Arrivals"
                                icon={Clock}
                                products={newArrivals}
                            />
                        </>
                    )}

                    {/* General Grid */}
                    <div className="space-y-10">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black tracking-tighter">
                                    {searchQuery || selectedCategory !== "All" ? 'Terminal Results' : 'General Archive'}
                                </h2>
                                <div className="h-4 w-px bg-border/50 hidden md:block" />
                                <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.4em]">
                                    {filteredAndSortedProducts.length} Entries Detected
                                </p>
                            </div>
                        </div>

                        <AnimatePresence mode="popLayout">
                            <motion.div
                                layout
                                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                            >
                                {loading && products.length === 0 ? (
                                    Array(8).fill(0).map((_, i) => (
                                        <div key={i} className="aspect-[4/5] bg-secondary/30 rounded-2xl animate-pulse" />
                                    ))
                                ) : (
                                    filteredAndSortedProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Infinite Scroll Trigger */}
                    <div ref={observerTarget} className="flex justify-center py-20">
                        {loadingMore && (
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-8 h-8 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Syncing Data...</p>
                            </div>
                        )}
                        {!hasMore && products.length > 0 && (
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-30">End of Transmission</p>
                        )}
                    </div>

                    {/* Empty State */}
                    {filteredAndSortedProducts.length === 0 && !loading && (
                        <div className="py-32 text-center glass-thick rounded-[3rem] border border-border/20">
                            <Search size={64} className="mx-auto mb-8 text-primary/10" />
                            <h3 className="text-3xl font-black tracking-tighter mb-4 uppercase">Void Detected</h3>
                            <p className="text-muted-foreground mb-12 max-w-xs mx-auto text-lg font-medium leading-relaxed">System failed to retrieve objects matching your parameters.</p>
                            <button
                                onClick={() => { setSearchQuery(""); handleCategoryChange("All"); }}
                                className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-premium"
                            >
                                Reset Terminal
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
