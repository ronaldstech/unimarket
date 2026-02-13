import React from 'react';
import { Search, Filter, School } from 'lucide-react';

export default function ProductFilters({
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterSchool,
    setFilterSchool,
    filterStock,
    setFilterStock,
    categories
}) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-white/5 p-4 rounded-3xl border border-border/10 shadow-sm">
            <div className="relative group flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Find assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-secondary/30 border border-transparent focus:bg-background rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:text-muted-foreground/50 text-sm"
                />
            </div>

            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <div className="relative min-w-[140px]">
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-secondary/30 rounded-xl text-xs font-bold uppercase tracking-wider appearance-none focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                <div className="relative min-w-[140px]">
                    <School size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <select
                        value={filterSchool}
                        onChange={(e) => setFilterSchool(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-secondary/30 rounded-xl text-xs font-bold uppercase tracking-wider appearance-none focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                    >
                        <option value="All">All Schools</option>
                        <option value="unima">UNIMA</option>
                        <option value="mubas">MUBAS</option>
                        <option value="luanar">LUANAR</option>
                        <option value="must">MUST</option>
                        <option value="kuhes">KUHES</option>
                        <option value="mznuni">MZUNI</option>
                    </select>
                </div>

                <div className="relative min-w-[140px]">
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <select
                        value={filterStock}
                        onChange={(e) => setFilterStock(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-secondary/30 rounded-xl text-xs font-bold uppercase tracking-wider appearance-none focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                    >
                        <option value="All">All Stock</option>
                        <option value="Low">Low Stock</option>
                        <option value="OutOfStock">Out of Stock</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
