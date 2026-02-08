import { Search, ShoppingBag, User, Menu, X, Instagram, Twitter, Facebook, ArrowRight, ArrowUpRight, TrendingUp, Command, Circle, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Browse', path: '/browse' },
        { name: 'Featured', path: '#' },
        { name: 'New Arrivals', path: '#' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDFD] selection:bg-black selection:text-white font-sans text-sm antialiased">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-gray-50/50 rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
            </div>

            {/* System Header */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-black/5 py-3' : 'bg-transparent py-5'
                }`}>
                <div className="container px-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg">
                            <ShoppingBag size={14} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold tracking-tight text-base group-hover:opacity-70 transition-opacity">UNIMARKET</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-gray-500 hover:text-black font-medium transition-colors relative"
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute -bottom-5 left-0 right-0 h-[1px] bg-black"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100/50 rounded-md border border-transparent focus-within:border-black/10 focus-within:bg-white transition-all group w-48 focus-within:w-64">
                            <Search size={14} className="text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none outline-none text-xs font-medium w-full placeholder:text-gray-400"
                            />
                            <div className="hidden group-focus-within:flex items-center gap-1">
                                <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-500 font-mono">⌘K</span>
                            </div>
                        </div>

                        <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-md transition-colors relative">
                            <ShoppingBag size={18} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />
                        </Link>
                        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-[60px] bg-white z-40 p-6 lg:hidden border-t border-black/5"
                    >
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-medium text-gray-600 hover:text-black py-2 border-b border-gray-100"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 pt-24 pb-12">
                {children}
            </main>

            {/* Modern System Footer */}
            <footer className="border-t border-black/5 bg-white text-xs">
                {/* Status Bar */}
                <div className="border-b border-black/5 py-2">
                    <div className="container px-6 flex items-center justify-between text-gray-400 font-mono text-[10px] tracking-tight">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>SYSTEM OPERATIONAL</span>
                        </div>
                        <span>V1.0.4</span>
                    </div>
                </div>

                <div className="container px-6 py-12 md:py-16">
                    <div className="grid grid-cols-2 md:grid-cols-12 gap-y-10 md:gap-8">
                        {/* Brand Column */}
                        <div className="col-span-2 md:col-span-5 pr-8">
                            <Link to="/" className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 bg-black text-white flex items-center justify-center rounded">
                                    <ShoppingBag size={12} />
                                </div>
                                <span className="font-bold tracking-tight">UNIMARKET</span>
                            </Link>
                            <p className="text-gray-500 leading-relaxed mb-6 max-w-xs">
                                A curated interface for the exchange of premium goods. Design-driven.
                            </p>
                            <div className="flex gap-3">
                                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                    <Link key={i} to="#" className="p-2 bg-gray-50 rounded-md hover:bg-black hover:text-white transition-all">
                                        <Icon size={14} />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Link Columns */}
                        <div className="col-span-1 md:col-span-2">
                            <h4 className="font-mono text-gray-400 mb-4 uppercase tracking-wider">Index</h4>
                            <ul className="space-y-2.5 text-gray-500">
                                <li><Link to="/browse" className="hover:text-black transition-colors">Browse</Link></li>
                                <li><Link to="#" className="hover:text-black transition-colors">Collections</Link></li>
                                <li><Link to="#" className="hover:text-black transition-colors">New Arrivals</Link></li>
                                <li><Link to="#" className="hover:text-black transition-colors">Featured</Link></li>
                            </ul>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <h4 className="font-mono text-gray-400 mb-4 uppercase tracking-wider">Support</h4>
                            <ul className="space-y-2.5 text-gray-500">
                                <li><Link to="#" className="hover:text-black transition-colors">Documentation</Link></li>
                                <li><Link to="#" className="hover:text-black transition-colors">Shipping</Link></li>
                                <li><Link to="#" className="hover:text-black transition-colors">Disputes</Link></li>
                                <li><Link to="#" className="hover:text-black transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter - Compact */}
                        <div className="col-span-2 md:col-span-3">
                            <h4 className="font-mono text-gray-400 mb-4 uppercase tracking-wider">Updates</h4>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="email@address.com"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black/10 focus:ring-1 focus:ring-black/5 transition-all placeholder:text-gray-400 font-medium"
                                />
                                <button className="absolute right-1 top-1 bottom-1 px-2.5 bg-white border border-gray-100 rounded-md text-gray-500 hover:text-black hover:border-gray-200 transition-all shadow-sm">
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                            <p className="mt-3 text-[10px] text-gray-400 leading-tight">
                                By subscribing you agree to our privacy policy. No spam.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-black/5">
                    <div className="container px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 font-mono text-[10px] tracking-tight uppercase">
                        <p>© 2026 UNIMARKET / LONDON</p>
                        <div className="flex gap-6">
                            <Link to="#" className="hover:text-black transition-colors">Privacy</Link>
                            <Link to="#" className="hover:text-black transition-colors">Terms</Link>
                            <Link to="#" className="hover:text-black transition-colors">Cookies</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
