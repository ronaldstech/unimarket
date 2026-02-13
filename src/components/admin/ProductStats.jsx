import React from 'react';
import { Package, Wallet, AlertTriangle, TrendingUp, DollarSign, ClipboardList } from 'lucide-react';

export default function ProductStats({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-border/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Package size={64} />
                </div>
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Total Inventory</p>
                    <h3 className="text-3xl font-black text-foreground">{stats.totalProducts}</h3>
                    <div className="flex items-center gap-2 mt-2 text-emerald-500 text-xs font-bold">
                        <TrendingUp size={14} />
                        <span>Active Assets</span>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-border/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wallet size={64} />
                </div>
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Portfolio Value</p>
                    <h3 className="text-3xl font-black text-foreground">MWK {stats.portfolioValue.toLocaleString()}</h3>
                    <div className="flex items-center gap-2 mt-2 text-primary text-xs font-bold">
                        <DollarSign size={14} />
                        <span>Projected Revenue</span>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-border/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertTriangle size={64} className="text-amber-500" />
                </div>
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Restock Alerts</p>
                    <h3 className="text-3xl font-black text-foreground">{stats.lowStock}</h3>
                    <div className="flex items-center gap-2 mt-2 text-amber-500 text-xs font-bold">
                        <ClipboardList size={14} />
                        <span>Items Low on Stock</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
