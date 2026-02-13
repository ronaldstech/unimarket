import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Search, User, Mail, School, Award, Phone, Shield, Calendar, Filter, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterSchool, setFilterSchool] = useState('all');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersRef = collection(db, 'users');
            // Try ensuring query is efficient, but for now just get all
            const q = query(usersRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
            }));
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
            // Fallback if index is missing or other error
            try {
                const usersRef = collection(db, 'users');
                const querySnapshot = await getDocs(usersRef);
                const usersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
                }));
                // Manually sort if query failed
                usersData.sort((a, b) => b.createdAt - a.createdAt);
                setUsers(usersData);
            } catch (retryError) {
                console.error("Retry failed:", retryError);
            }
        } finally {
            setLoading(false);
        }
    };

    const uniqueSchools = [...new Set(users.map(user => user.school).filter(Boolean))].sort();

    const filteredUsers = users.filter(user => {
        const matchesSearch = (
            user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm)
        );
        const matchesRole = filterRole === 'all' || (filterRole === 'admin' ? user.role === 'admin' : user.role !== 'admin');
        const matchesSchool = filterSchool === 'all' || user.school === filterSchool;

        return matchesSearch && matchesRole && matchesSchool;
    });

    const getSchoolStyle = (schoolName) => {
        const school = schoolName?.toLowerCase() || '';
        if (school.includes('mubas')) return {
            border: 'border border-indigo-500/50',
            bg: 'hover:bg-indigo-300/5',
            text: 'text-indigo-500',
            badge: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
            icon: 'text-indigo-500'
        };
        if (school.includes('unima')) return {
            border: 'border border-red-300/50',
            bg: 'hover:bg-red-300/5',
            text: 'text-red-500',
            badge: 'bg-red-500/10 text-red-500 border-red-500/20',
            icon: 'text-red-500'
        };
        if (school.includes('luanar')) return {
            border: 'border border-emerald-300/50',
            bg: 'hover:bg-emerald-300/5',
            text: 'text-emerald-500',
            badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            icon: 'text-emerald-500'
        };
        return {
            border: 'border border-primary/20',
            bg: 'hover:bg-white/5',
            text: 'text-muted-foreground',
            badge: 'bg-secondary text-muted-foreground border-transparent',
            icon: 'text-muted-foreground'
        };
    };

    const exportUsers = () => {
        const headers = ["First Name", "Last Name", "Email", "Phone", "School", "Role", "Points", "Referral Code"];
        const csvContent = [
            headers.join(","),
            ...filteredUsers.map(user => [
                user.firstname,
                user.lastname,
                user.email,
                user.phone,
                user.school,
                user.role,
                user.points,
                user.myReferralCode
            ].map(field => `"${field || ''}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "users_export.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 px-6 pb-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">User Registry</h1>
                        <p className="text-muted-foreground font-medium">
                            Manage and view all registered users across the platform.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={exportUsers}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors text-xs font-black uppercase tracking-widest"
                        >
                            <Download size={16} />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-border/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:text-muted-foreground/50"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="w-full bg-white dark:bg-black/20 border border-border/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="all">All Roles</option>
                                <option value="user">Regular Users</option>
                                <option value="admin">Administrators</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 1L5 5L9 1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <div className="relative">
                            <School className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <select
                                value={filterSchool}
                                onChange={(e) => setFilterSchool(e.target.value)}
                                className="w-full bg-white dark:bg-black/20 border border-border/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="all">All Schools</option>
                                {uniqueSchools.map(school => (
                                    <option key={school} value={school}>{school}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 1L5 5L9 1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-border/10 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Users</span>
                        <div className="text-3xl font-black tracking-tighter">{filteredUsers.length}</div>
                    </div>
                    <div className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-border/10 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admins</span>
                        <div className="text-3xl font-black tracking-tighter text-luxury">
                            {filteredUsers.filter(u => u.role === 'admin').length}
                        </div>
                    </div>
                    <div className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-border/10 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">MUBAS</span>
                        <div className="text-3xl font-black tracking-tighter text-primary">
                            {filteredUsers.filter(u => u.school?.toLowerCase() === 'mubas').length}
                        </div>
                    </div>
                    <div className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-border/10 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Points</span>
                        <div className="text-3xl font-black tracking-tighter">
                            {filteredUsers.reduce((acc, curr) => acc + (curr.points || 0), 0).toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredUsers.map((user, index) => {
                            const style = getSchoolStyle(user.school);
                            return (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`group relative bg-white dark:bg-white/5 border border-border/10 rounded-3xl p-6 transition-all duration-300 ${style.border} ${style.bg}`}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-16 h-16 rounded-2xl bg-secondary overflow-hidden shadow-soft group-hover:scale-105 transition-transform ring-2 ring-offset-2 ring-transparent group-hover:ring-offset-0 ${style.text.replace('text-', 'group-hover:ring-')}`}>
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt={user.firstname} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-primary/10">
                                                    <User className="text-muted-foreground" size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${user.role === 'admin'
                                            ? 'bg-luxury/10 text-luxury border-luxury/20'
                                            : style.badge
                                            }`}>
                                            {user.role || 'User'}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-black text-lg leading-tight group-hover:text-primary transition-colors">
                                                {user.firstname} {user.lastname}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-1">
                                                <Mail size={12} />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-4 border-t border-border/5">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className={`flex items-center gap-2 transition-colors ${style.text}`}>
                                                    <School size={12} className={style.icon} />
                                                    <span className="font-black uppercase tracking-wider">{user.school || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 font-bold text-foreground">
                                                    <Award size={12} className="text-luxury" />
                                                    <span>{user.points?.toLocaleString() || 0} pts</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone size={12} />
                                                    <span className="font-medium">{user.phone || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground" title="Joined Date">
                                                    <Calendar size={12} />
                                                    <span className="font-medium">
                                                        {user.createdAt?.toLocaleDateString('en-GB', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {user.myReferralCode && (
                                                <div className="flex items-center justify-between text-xs pt-2">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Referral</span>
                                                    <span className="font-mono bg-secondary/50 px-2 py-0.5 rounded text-[10px]">{user.myReferralCode}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-muted-foreground" size={24} />
                        </div>
                        <h3 className="text-lg font-black text-foreground mb-2">No Users Found</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto">
                            We couldn't find any users matching your storage criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
