import { User, Settings, ShoppingBag, Heart, LogOut, ChevronRight, Lock, Mail, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import React, { useState } from 'react';

export default function Profile() {
    const { user, isAuthenticated, login, register, logout } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form states
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        phone: '',
        school: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isRegistering) {
                await register(formData);
            } else {
                await login(formData.email, formData.password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: "Orders", value: user ? "12" : "0", icon: ShoppingBag },
        { label: "Wishlist", value: user ? "48" : "0", icon: Heart },
        { label: "Settings", value: user ? "Config" : "N/A", icon: Settings },
    ];

    return (
        <div className="container py-32 px-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                {!isAuthenticated ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-thick p-12 rounded-[2.5rem] border border-border/30 shadow-premium max-w-lg mx-auto"
                    >
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 mx-auto">
                            <Shield size={32} />
                        </div>
                        <h2 className="text-2xl font-black tracking-tighter text-center mb-2 uppercase">
                            {isRegistering ? "Access Registration" : "Access Protocol"}
                        </h2>
                        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">
                            {isRegistering ? "Secure Terminal Creation" : "Institutional Verification"}
                        </p>

                        <form onSubmit={handleAuth} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-500 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center mb-4">
                                    {error}
                                </div>
                            )}

                            {isRegistering && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">First Name</label>
                                        <input
                                            name="firstname"
                                            required
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            className="w-full bg-secondary/30 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-border transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Last Name</label>
                                        <input
                                            name="lastname"
                                            required
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            className="w-full bg-secondary/30 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-border transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Terminal Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={16} />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter Email"
                                        className="w-full bg-secondary/30 border border-transparent rounded-2xl py-4 pl-12 pr-6 focus:bg-white focus:border-border transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>

                            {isRegistering && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Phone</label>
                                        <input
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="08..."
                                            className="w-full bg-secondary/30 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-border transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">School</label>
                                        <input
                                            name="school"
                                            required
                                            value={formData.school}
                                            onChange={handleChange}
                                            placeholder="MUBAS, LUANAR..."
                                            className="w-full bg-secondary/30 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-border transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Terminal Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={16} />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="**********"
                                        className="w-full bg-secondary/30 border border-transparent rounded-2xl py-4 pl-12 pr-6 focus:bg-white focus:border-border transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-premium hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : isRegistering ? "Initialize Terminal" : "Establish Connection"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all py-2"
                            >
                                {isRegistering ? "Existing Operator? Sign In" : "New Operator? Create Account"}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex flex-col md:flex-row items-center gap-8 pb-12 border-b border-border/30">
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-primary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-32 h-32 rounded-3xl bg-secondary flex items-center justify-center border-2 border-white relative z-10 overflow-hidden shadow-premium">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.firstname} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={48} className="text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl font-black tracking-tighter mb-2">{user.firstname} {user.lastname}</h1>
                                <p className="text-muted-foreground font-medium mb-4">{user.email}</p>
                                <div className="flex gap-4 items-center flex-wrap justify-center md:justify-start">
                                    <span className="px-4 py-1.5 bg-secondary/50 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                                        Terminal: {user.school}
                                    </span>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Authenticated
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Grid Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, i) => (
                                <div key={i} className="glass-thick p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-all group cursor-pointer shadow-soft">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <stat.icon size={20} />
                                        </div>
                                        <ChevronRight size={16} className="text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</h3>
                                    <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="pt-8 flex flex-col gap-4">
                            <button
                                onClick={logout}
                                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-border/50 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all group"
                            >
                                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Terminate Connection
                            </button>
                            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-20">
                                Secure Authentication Protocol V2.1
                            </p>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
