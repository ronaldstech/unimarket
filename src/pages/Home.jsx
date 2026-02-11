import { ArrowRight, Star, Shield, Zap, TrendingUp, Award, Clock, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

export default function Home() {
    return (
        <div className="flex flex-col gap-32 pb-32 overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-40 overflow-hidden">
                {/* Ambient Background Elements */}
                <div className="absolute inset-0 mesh-gradient-luxury opacity-40 -z-10" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxury/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[160px] animate-pulse" />

                <div className="container relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-5xl mx-auto text-center"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-thick border border-border/50 mb-10 shadow-soft">
                            <Star size={14} className="text-luxury fill-luxury" />
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-primary/60">The New Era of Exchange</span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-7xl md:text-[10rem] font-black mb-10 tracking-tighter leading-[0.8] text-glow-sm"
                        >
                            Refined <br />
                            <span className="text-luxury italic font-medium">Objects</span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed font-medium"
                        >
                            UniMarket connects visionary makers with collectors of the extraordinary.
                            Discover pieces that define your personal legacy.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap justify-center gap-6"
                        >
                            <Link to="/browse" className="bg-primary text-primary-foreground px-12 py-6 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-4 hover:scale-105 hover:shadow-premium transition-all active:scale-95 group">
                                Explore The Catalog <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="glass-thick px-12 py-6 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all border border-border/50 active:scale-95 shadow-soft">
                                Become a Maker
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Curated Eras Section */}
            <section className="container px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-luxury" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-luxury">Design Selection</span>
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">Curated <br /> <span className="text-primary/20 italic">Perspectives</span></h2>
                    </div>
                    <Link to="/browse" className="flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] group border-b-2 border-transparent hover:border-primary transition-all pb-2">
                        View All Collections <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: "Technical Minimalism", desc: "Productivity as an art form.", img: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80", tag: "Tech" },
                        { title: "Bespoke Atelier", desc: "Expressive conceptual fashion.", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80", tag: "Fashion" },
                        { title: "Living Architecture", desc: "Objects that define space.", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80", tag: "Home" },
                    ].map((cat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="group relative h-[600px] rounded-[3rem] overflow-hidden cursor-pointer shadow-premium"
                        >
                            <img src={cat.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={cat.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                            <div className="absolute top-8 left-8">
                                <span className="px-5 py-2 rounded-full glass-dark text-[10px] font-black uppercase tracking-widest text-white border border-white/10 uppercase">
                                    {cat.tag}
                                </span>
                            </div>

                            <div className="absolute inset-x-10 bottom-10 text-white">
                                <h3 className="text-4xl font-black mb-3 tracking-tighter">{cat.title}</h3>
                                <p className="text-white/60 mb-8 font-medium">{cat.desc}</p>
                                <button className="flex items-center gap-3 font-black text-xs uppercase tracking-widest group/btn border-b border-white/20 pb-2 hover:border-white transition-all">
                                    Shop Collection <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Industrial Integrity (Trust Section) */}
            <section className="bg-primary pt-32 pb-40 text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 mesh-gradient-luxury opacity-5" />
                <div className="container px-6 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                        <p className="text-[10px] font-black tracking-[0.8em] uppercase mb-16 opacity-30">Global Standard Verification</p>
                        <div className="flex flex-wrap justify-center gap-16 md:gap-32 opacity-20 grayscale invert">
                            <Award size={64} strokeWidth={1} />
                            <Shield size={64} strokeWidth={1} />
                            <TrendingUp size={64} strokeWidth={1} />
                            <Clock size={64} strokeWidth={1} />
                            <Zap size={64} strokeWidth={1} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Innovation Section (Why Us) */}
            <section className="container px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-32 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-px w-12 bg-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Philosophy</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 leading-[0.9]">Beyond The <br /> <span className="text-luxury italic">Protocol</span></h2>
                        <div className="space-y-16">
                            {[
                                { icon: <Zap className="text-luxury" />, title: "Real-Time Authenticity", desc: "Our neural verification engine ensures every object is verified before it ever manifests on the platform." },
                                { icon: <Shield className="text-primary" />, title: "Escrow Logic", desc: "Trade with Absolute confidence. Funds are only released upon successful verification of physical receipt." },
                                { icon: <Award className="text-luxury" />, title: "Elite Concierge", desc: "A 24/7 dedicated support layer ready to assist with complex sourcing and global logistics." },
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-10 group">
                                    <div className="flex-shrink-0 w-20 h-20 rounded-[2rem] bg-secondary/50 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white group-hover:shadow-soft border border-border/30">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black mb-3 tracking-tight">{feature.title}</h3>
                                        <p className="text-muted-foreground text-lg leading-relaxed font-medium">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-10 bg-luxury/5 rounded-[4rem] blur-3xl opacity-50 -z-10 group-hover:opacity-100 transition-opacity" />
                        <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-premium">
                            <img
                                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80"
                                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                                alt="Innovation"
                            />
                            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                        </div>

                        {/* Floating Metric */}
                        <div className="absolute -bottom-10 -left-10 glass-thick p-8 rounded-3xl shadow-premium border border-border inline-flex flex-col gap-2">
                            <span className="text-4xl font-black tracking-tighter text-primary">99.8%</span>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Integrity Score</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
