import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AuthForm() {
    const { login, register } = useAuth();
    const [searchParams] = useSearchParams();
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        phone: '',
        school: 'MUBAS',
        referralCode: ''
    });

    // Check for referral code in URL
    useEffect(() => {
        const refCode = searchParams.get('ref');
        if (refCode) {
            setIsRegistering(true);
            setFormData(prev => ({ ...prev, referralCode: refCode }));
        }
    }, [searchParams]);

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

    return (
        <div className="container py-32 px-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
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
                            <>
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
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Phone</label>
                                    <input
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-secondary/30 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-border transition-all font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Institution</label>
                                    <div className="relative">
                                        <select
                                            name="school"
                                            required
                                            value={formData.school}
                                            onChange={handleChange}
                                            className="w-full bg-secondary/30 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-border transition-all font-bold text-sm appearance-none"
                                        >
                                            <option value="MUBAS">MUBAS</option>
                                            <option value="UNIMA">UNIMA</option>
                                            <option value="LUANAR">LUANAR</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                            <ChevronRight size={16} className="rotate-90" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Referral Code (Optional)</label>
                                    <input
                                        name="referralCode"
                                        value={formData.referralCode}
                                        onChange={handleChange}
                                        placeholder="Enter Code"
                                        className="w-full bg-luxury/5 border border-luxury/20 rounded-2xl py-4 px-6 focus:bg-white focus:border-luxury transition-all font-bold text-sm text-luxury-dark placeholder:text-luxury/30"
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Identity</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-secondary/30 border border-transparent rounded-2xl py-4 px-6 pl-12 focus:bg-white focus:border-border transition-all font-bold text-sm"
                                    placeholder="user@unimarket.com"
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Passkey</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-secondary/30 border border-transparent rounded-2xl py-4 px-6 pl-12 focus:bg-white focus:border-border transition-all font-bold text-sm"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 mt-8"
                        >
                            {loading ? "Processing..." : (isRegistering ? "Initialize Account" : "Authenticate")}
                            {!loading && <ChevronRight size={18} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                        >
                            {isRegistering ? "Already have a terminal ID?" : "Request New Access Protocol"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
