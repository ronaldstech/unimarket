import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Search, Filter, Download, Calendar, User, Phone, Mail, CheckCircle, Clock, XCircle, CreditCard, DollarSign } from 'lucide-react';

export default function Redemptions() {
    const [redemptions, setRedemptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchRedemptions();
    }, []);

    const fetchRedemptions = async () => {
        try {
            const redemptionsRef = collection(db, 'redemptions');
            // Try ensuring query is efficient, but for now just get all
            const q = query(redemptionsRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const redemptionsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
            }));
            setRedemptions(redemptionsData);
        } catch (error) {
            console.error("Error fetching redemptions:", error);
            // Fallback if index is missing or other error
            try {
                const redemptionsRef = collection(db, 'redemptions');
                const querySnapshot = await getDocs(redemptionsRef);
                const redemptionsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
                }));
                // Manually sort if query failed
                redemptionsData.sort((a, b) => b.createdAt - a.createdAt);
                setRedemptions(redemptionsData);
            } catch (retryError) {
                console.error("Retry failed:", retryError);
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredRedemptions = redemptions.filter(item => {
        const matchesSearch = (
            item.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phoneNumber?.includes(searchTerm) ||
            item.transactionId?.toString().includes(searchTerm) ||
            item.billerReceipt?.includes(searchTerm)
        );
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const exportRedemptions = () => {
        const headers = ["Date", "User Name", "Email", "Phone", "Transaction ID", "Biller Receipt", "Points Redeemed", "Airtime Amount", "Status"];
        const csvContent = [
            headers.join(","),
            ...filteredRedemptions.map(item => [
                item.createdAt?.toISOString(),
                item.userName,
                item.userEmail,
                item.phoneNumber,
                item.transactionId,
                item.billerReceipt,
                item.pointsRedeemed,
                item.airtimeAmount,
                item.status
            ].map(field => `"${field || ''}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "redemptions_export.csv");
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
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Redemption History</h1>
                        <p className="text-muted-foreground font-medium">
                            Track and manage all point redemptions and airtime transactions.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={exportRedemptions}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors text-xs font-black uppercase tracking-widest"
                        >
                            <Download size={16} />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by user, phone, or transaction ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-border/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:text-muted-foreground/50"
                        />
                    </div>
                    <div className="md:col-span-4">
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full bg-white dark:bg-black/20 border border-border/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 1L5 5L9 1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Redemptions Table/List */}
                {/* Redemptions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredRedemptions.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-white dark:bg-white/5 border border-border-500/10 rounded-3xl p-6 hover:shadow-premium hover:border-primary/20 transition-all duration-300 flex flex-col gap-6"
                            >
                                {/* Header: User & Status */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors ring-1 ring-border/50">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-sm uppercase tracking-wider truncate max-w-[120px]" title={item.userName}>{item.userName || 'Unknown'}</h3>
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                                                <Phone size={10} />
                                                <span>{item.phoneNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`p-1.5 rounded-full ${item.status === 'completed' || item.success
                                        ? 'bg-emerald-500/10 text-emerald-500'
                                        : item.status === 'pending'
                                            ? 'bg-amber-500/10 text-amber-500'
                                            : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {item.status === 'completed' || item.success ? <CheckCircle size={16} /> : <Clock size={16} />}
                                    </div>
                                </div>

                                {/* Body: Transaction Info */}
                                <div className="space-y-3 py-4 border-t border-border/5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</span>
                                        <div className="flex items-center gap-1.5 font-black text-foreground">
                                            <DollarSign size={12} className="text-emerald-500" />
                                            <span>MWK {item.airtimeAmount}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Points</span>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                            <CreditCard size={12} />
                                            <span>{item.pointsRedeemed} pts</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Receipt</span>
                                        <span className="font-mono text-[10px] bg-secondary/50 px-2 py-0.5 rounded text-muted-foreground">{item.billerReceipt || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Footer: ID & Date */}
                                <div className="mt-auto flex items-end justify-between text-[10px] text-muted-foreground font-medium">
                                    <div className="flex flex-col gap-1">
                                        <span className="opacity-50 uppercase tracking-widest text-[9px]">Trans ID</span>
                                        <span className="font-mono text-foreground/80">{item.transactionId}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-60">
                                        <Calendar size={10} />
                                        <span>
                                            {item.createdAt?.toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredRedemptions.length === 0 && (
                        <div className="text-center py-20 col-span-full">
                            <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-muted-foreground" size={24} />
                            </div>
                            <h3 className="text-lg font-black text-foreground mb-2">No Redemptions Found</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                No redemption records found matching your criteria.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
