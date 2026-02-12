import { Search, ShoppingBag, User, Menu, X, Instagram, Twitter, Facebook, ArrowRight, ArrowUpRight, TrendingUp, Command, Circle, Activity, ChevronDown, Home as HomeIcon, LayoutGrid, Info, CreditCard, Package } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '../../hooks/useCategories';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';

export default function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
    const location = useLocation();
    const { categories } = useCategories();
    const { cartCount } = useCart();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = useMemo(() => {
        const baseLinks = [
            { name: 'Home', path: '/', icon: HomeIcon },
            { name: 'Collections', path: '/browse', icon: LayoutGrid, hasDropdown: true },
            { name: 'Cart', path: '/cart', icon: ShoppingBag, isCart: true },
            ...(isAuthenticated ? [{ name: 'Orders', path: '/orders', icon: Package }] : []),
            { name: 'Profile', path: '/profile', icon: User },
            { name: 'About', path: '#', icon: Info },
        ];
        if (isAuthenticated && user?.role === 'admin') {
            // Add admin-only links
            baseLinks.splice(1, 0, // after Home
                { name: 'Users', path: '/admin/users', icon: User },
                { name: 'Products', path: '/admin/products', icon: LayoutGrid },
                { name: 'Categories', path: '/admin/categories', icon: Package },
                { name: 'Redemptions', path: '/admin/redemptions', icon: CreditCard }
            );
        }
        return baseLinks;
    }, [isAuthenticated, cartCount, user]);

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground font-sans text-sm antialiased text-foreground">
            {/* Ambient Background Lights */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-luxury/5 dark:bg-luxury/10 rounded-full blur-[120px] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-lighten animate-pulse" />
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-lighten animate-pulse" />
            </div>

            <ThemeToggle />

            {/* Desktop Sidebar */}
            <aside className="fixed top-0 left-0 bottom-0 w-72 h-full glass-thick border-r border-border/10 hidden lg:flex flex-col z-50">
                <div className="p-10 border-b border-border/10">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-white dark:bg-black ring-1 ring-border/50 flex items-center justify-center rounded-2xl shadow-soft group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                            <img src="/logo.png" alt="Unimarket Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-black tracking-tighter text-xl leading-none text-foreground uppercase">UNIMARKET</span>
                    </Link>
                </div>

                <div className="flex-1 px-6 py-12 flex flex-col gap-1.5 overflow-y-auto premium-scrollbar">
                    <h4 className="px-4 text-[9px] font-black uppercase tracking-[0.4em] mb-4 text-primary/40">Navigation</h4>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all font-black text-[11px] tracking-widest uppercase group ${location.pathname === link.path
                                ? "bg-primary text-primary-foreground shadow-premium"
                                : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent hover:border-border/30"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <link.icon size={16} strokeWidth={link.isCart ? 2.5 : 2} className={location.pathname === link.path ? "text-primary-foreground" : "text-primary/40 group-hover:text-primary"} />
                                <span>{link.name}</span>
                                {link.isCart && cartCount > 0 && (
                                    <span className="w-5 h-5 bg-luxury text-white text-[9px] rounded-full flex items-center justify-center font-black shadow-soft">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            {location.pathname === link.path ? (
                                <Circle size={6} fill="currentColor" />
                            ) : (
                                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                            )}
                        </Link>
                    ))}

                    <div className="mt-12 pt-12 border-t border-border/10">
                        <h4 className="px-4 text-[9px] font-black uppercase tracking-[0.4em] mb-8 text-primary/40">Market Registry</h4>
                        <div className="space-y-1">
                            {categories.map((cat, idx) => (
                                <Link
                                    key={cat.id || cat.name}
                                    to={`/browse?category=${cat.name}`}
                                    className="flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group/item"
                                >
                                    <span className="opacity-20 text-[9px]">{idx.toString().padStart(2, '0')}</span>
                                    <span>{cat.name}</span>
                                    <ArrowRight size={10} className="ml-auto opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-border/10">
                    <Link to="/profile" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-all group">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors overflow-hidden">
                            {isAuthenticated && user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={18} className="text-muted-foreground group-hover:text-primary" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                                {isAuthenticated ? `${user.firstname} ${user.lastname}` : "Guest Terminal"}
                            </span>
                            <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">
                                {isAuthenticated ? `ID: ${user.uid?.slice(0, 8)}` : "Secure Access Required"}
                            </span>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 lg:hidden ${scrolled ? 'glass-thick border-b border-border/50 py-4' : 'bg-transparent py-6'}`}>
                <div className="container px-8 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white ring-1 ring-border/50 flex items-center justify-center rounded-xl shadow-soft overflow-hidden">
                            <img src="/logo.png" alt="Unimarket Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-black tracking-tighter text-lg uppercase">UNIMARKET</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link to="/cart" className="p-2.5 hover:bg-secondary rounded-xl transition-colors relative">
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute top-2 right-2 min-w-[14px] h-[14px] px-1 bg-luxury text-white text-[8px] font-black rounded-full shadow-soft flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button className="p-2.5 hover:bg-secondary rounded-xl transition-colors" onClick={() => setIsMenuOpen(true)}>
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-[60] bg-primary/20 backdrop-blur-sm lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[300px] z-[61] bg-card p-10 lg:hidden flex flex-col gap-12 border-r border-border/20"
                        >
                            <div className="flex items-center justify-between">
                                <Link to="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                                    <div className="w-8 h-8 bg-white dark:bg-black ring-1 ring-border/50 flex items-center justify-center rounded-xl overflow-hidden">
                                        <img src="/logo.png" alt="Unimarket Logo" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-black tracking-tighter text-lg uppercase text-foreground">UNIMARKET</span>
                                </Link>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-secondary rounded-xl">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-8">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/30">Navigation Index</h4>
                                <div className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-4 text-2xl font-black tracking-tighter text-primary hover:text-luxury transition-colors group"
                                        >
                                            <link.icon size={24} className="group-hover:scale-110 transition-transform" />
                                            <span>{link.name}</span>
                                            {link.isCart && cartCount > 0 && (
                                                <span className="text-sm bg-luxury text-white px-3 py-1 rounded-full font-black">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto border-t border-border/10 pt-8">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/30 mb-6">Market Registry</h4>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    {categories.slice(0, 6).map((cat) => (
                                        <Link
                                            key={cat.id || cat.name}
                                            to={`/browse?category=${cat.name}`}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Surface */}
            <main className="flex-1 lg:pl-72 transition-all duration-500">
                {children}
            </main>

            {/* Refined Footer - Only visible on Home Page */}
            {location.pathname === '/home' && (
                <footer className="border-t border-border/30 bg-card lg:ml-72 transition-all duration-500">
                    {/* Meta Bar */}
                    <div className="border-b border-border/10 py-3">
                        <div className="container px-8 flex items-center justify-between text-[10px] font-black tracking-[0.2em] text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                <span>GRID OPERATIONAL</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <span>V1.0.8</span>
                                <span className="opacity-30">LATENCY: 14MS</span>
                            </div>
                        </div>
                    </div>

                    <div className="container px-8 py-20">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                            {/* Brand Cluster */}
                            <div className="md:col-span-5">
                                <Link to="/home" className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 bg-white dark:bg-black ring-1 ring-border/50 flex items-center justify-center rounded-xl overflow-hidden">
                                        <img src="/logo.png" alt="Unimarket Logo" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-black tracking-tighter text-xl text-foreground">UNIMARKET</span>
                                </Link>
                                <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-sm font-medium">
                                    A design-driven marketplace platform. Curating state-of-the-art objects for the modern collector.
                                </p>
                                <div className="flex gap-4">
                                    {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                        <Link key={i} to="#" className="w-10 h-10 bg-secondary/50 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-soft group">
                                            <Icon size={16} className="group-hover:scale-110 transition-transform" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Clusters */}
                            <div className="md:col-span-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-primary/40">Repository</h4>
                                <ul className="space-y-4 font-bold tracking-tight text-muted-foreground">
                                    <li><Link to="/browse" className="hover:text-primary transition-colors">Catalog Index</Link></li>
                                    <li><Link to="#" className="hover:text-primary transition-colors">Archive</Link></li>
                                    <li><Link to="#" className="hover:text-primary transition-colors">Makers</Link></li>
                                    <li><Link to="#" className="hover:text-primary transition-colors">Drops</Link></li>
                                </ul>
                            </div>

                            <div className="md:col-span-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-primary/40">Assistance</h4>
                                <ul className="space-y-4 font-bold tracking-tight text-muted-foreground">
                                    <li><Link to="#" className="hover:text-primary transition-colors">Protocols</Link></li>
                                    <li><Link to="#" className="hover:text-primary transition-colors">Sourcing</Link></li>
                                    <li><Link to="#" className="hover:text-primary transition-colors">Logistics</Link></li>
                                    <li><Link to="#" className="hover:text-primary transition-colors">Secure Escrow</Link></li>
                                </ul>
                            </div>

                            {/* Intelligence Subscription */}
                            <div className="md:col-span-3">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-primary/40">Market Intelligence</h4>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        placeholder="Enter terminal email"
                                        className="w-full bg-secondary/50 border border-transparent rounded-xl px-5 py-4 focus:outline-none focus:bg-white focus:border-border transition-all placeholder:text-muted-foreground/50 font-bold text-xs"
                                    />
                                    <button className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-soft">
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                                <p className="mt-5 text-[10px] text-muted-foreground/60 leading-relaxed font-medium">
                                    Receive intelligence on exclusive drops. Frequency: Minimal. Relevancy: High.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Final Legal Bar */}
                    <div className="border-t border-border/10">
                        <div className="container px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black tracking-[0.3em] text-muted-foreground uppercase opacity-40">
                            <p>© 2026 UNIMARKET / MALAWI</p>
                            <div className="flex gap-8">
                                <Link to="#" className="hover:text-primary">Legal</Link>
                                <Link to="#" className="hover:text-primary">Privacy</Link>
                                <Link to="#" className="hover:text-primary">Cookies</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            )}

            {/* Floating Cart Shortcut (FAB) */}
            <AnimatePresence>
                {cartCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 100 }}
                        className="fixed bottom-8 right-8 z-[100]"
                    >
                        <Link
                            to="/cart"
                            className="flex items-center gap-4 bg-black text-white dark:bg-white dark:text-black px-8 py-5 rounded-2xl shadow-premium hover:bg-primary dark:hover:bg-primary transition-all group active:scale-95"
                        >
                            <div className="relative">
                                <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-luxury text-white text-[10px] font-black border-2 border-black dark:border-white rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </div>
                            <div className="flex flex-col items-start pr-4 border-r border-white/20 dark:border-black/10 mr-2">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Checkout</span>
                                <span className="text-sm font-black tracking-tight">CART SUMMARY</span>
                            </div>
                            <CreditCard size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
