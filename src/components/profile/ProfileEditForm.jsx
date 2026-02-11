import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileEditForm({ isEditing, setIsEditing }) {
    const { user, updateUserProfile } = useAuth();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        phone: '',
        school: 'MUBAS'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                phone: user.phone || '',
                school: user.school || 'MUBAS'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await updateUserProfile(user.uid, formData);
        setLoading(false);
        if (success) setIsEditing(false);
    };

    return (
        <AnimatePresence>
            {isEditing && (
                <motion.form
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    onSubmit={handleSubmit}
                    className="overflow-hidden"
                >
                    <div className="glass p-6 rounded-[2rem] border border-border/10 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground pl-2">First Name</label>
                                <input
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-border/20 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 ring-primary/10 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground pl-2">Last Name</label>
                                <input
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-border/20 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 ring-primary/10 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground pl-2">Phone</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-border/20 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 ring-primary/10 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground pl-2">Institution</label>
                                <div className="relative">
                                    <select
                                        name="school"
                                        value={formData.school}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-border/20 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 ring-primary/10 outline-none appearance-none"
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
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </motion.form>
            )}
        </AnimatePresence>
    );
}
