import { ArrowRight, Star, Shield, Zap, TrendingUp, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Home() {
    return (
        <div className="flex flex-col gap-32 pb-32 overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-40 overflow-hidden">
                <div className="absolute inset-0 mesh-gradient opacity-60 mask-radial -z-10" />

                <div className="container relative z-10 text-center">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-premium border border-black/5 mb-8">
                            <Star size={16} className="text-luxury fill-luxury" />
                            <span className="text-xs font-black tracking-widest uppercase">Premium Marketplace</span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-7xl md:text-9xl font-black mb-8 tracking-tight leading-[0.9] text-glow"
                        >
                            changed Your <span className="text-primary italic">Everyday</span> Objects
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed"
                        >
                            UniMarket connects visionary makers with collectors of the extraordinary.
                            Discover objects that define your legacy.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap justify-center gap-6"
                        >
                            <Link to="/browse" className="bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 hover:shadow-2xl transition-all active:scale-95 group">
                                Explore The Catalog <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="glass px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/80 transition-all border border-black/10 active:scale-95">
                                Start Selling
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Floating Preview (Simplified placeholder for visual depth) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: -5 }}
                    transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120vw] h-[400px] bg-black/5 rounded-[50%] blur-3xl -z-20"
                />
            </section>

            {/* Featured Categories */}
            <section className="container">
                <div className="flex justify-between items-end mb-16 px-4">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Curated Eras</h2>
                        <p className="text-muted-foreground text-xl">Hand-picked by our design architects.</p>
                    </div>
                    <Link to="/browse" className="hidden md:flex items-center gap-2 font-bold hover:text-primary transition-colors">
                        View All Categories <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {[
                        { title: "Essential Tech", desc: "Minimalist productivity tools.", img: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80", color: "bg-blue-500" },
                        { title: "Modern Atelier", desc: "Bespoke fashion concepts.", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80", color: "bg-purple-500" },
                        { title: "Living Spaces", desc: "Architecture for the home.", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80", color: "bg-orange-500" },
                    ].map((cat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -15 }}
                            className="group relative h-[500px] rounded-[2.5rem] overflow-hidden cursor-pointer"
                        >
                            <img src={cat.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={cat.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute inset-x-8 bottom-8 text-white">
                                <h3 className="text-3xl font-black mb-2">{cat.title}</h3>
                                <p className="text-white/70 mb-6">{cat.desc}</p>
                                <button className="flex items-center gap-2 font-bold group/btn">
                                    Shop Collection <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Trust Markers */}
            <section className="bg-primary py-24 text-primary-foreground text-center">
                <div className="container opacity-40">
                    <p className="text-xs font-black tracking-[0.5em] uppercase mb-12">Trusted by the best builders</p>
                    <div className="flex flex-wrap justify-center gap-20 grayscale invert">
                        <Award size={48} />
                        <Shield size={48} />
                        <TrendingUp size={48} />
                        <Clock size={48} />
                        <Star size={48} />
                    </div>
                </div>
            </section>

            {/* Why Us */}
            <section className="container py-20 px-4">
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">Beyond The <span className="text-accent italic">Transaction</span></h2>
                        <div className="space-y-10">
                            {[
                                { icon: <Zap className="text-yellow-500" />, title: "Instant Integrity", desc: "Our verification engine ensures every product is authentic before it ever reaches the platform." },
                                { icon: <Shield className="text-blue-500" />, title: "Vault Protection", desc: "Funds are held in escrow until you confirm delivery. Your security is non-negotiable." },
                                { icon: <Star className="text-purple-500" />, title: "Legacy Support", desc: "A 24/7 concierge team ready to assist with any inquiry, from sourcing to shipping." },
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black mb-2">{feature.title}</h3>
                                        <p className="text-muted-foreground text-lg">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-[3rem] bg-accent/5 mesh-gradient opacity-30 absolute -inset-10 -z-10 blur-2xl" />
                        <img
                            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80"
                            className="w-full aspect-square object-cover rounded-[3rem] shadow-premium"
                            alt="Process"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
