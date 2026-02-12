import React from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const isLight = theme === 'light';

    return (
        <button
            onClick={toggleTheme}
            className={`
                fixed bottom-32 left-8 z-[100] p-5 rounded-[2.2rem] 
                transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
                group lg:bottom-12 overflow-visible border
                ${isLight
                    ? 'bg-black border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-primary/20'
                    : 'bg-white border-black/5 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-luxury/20'}
            `}
            aria-label="Toggle Theme"
        >
            {/* Background Glow (Opposite Color) */}
            <div className={`
                absolute inset-0 rounded-[2.2rem] opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-2xl -z-10
                ${isLight ? 'bg-primary' : 'bg-luxury'}
            `} />

            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: 15, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10"
                >
                    {isLight ? (
                        /* In Light Mode: Show the Moon (Target: Dark) */
                        <div className="relative">
                            <Moon size={20} className="text-white fill-white/10" strokeWidth={2} />
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute -top-1 -right-1 text-primary"
                            >
                                <Sparkles size={8} />
                            </motion.div>
                        </div>
                    ) : (
                        /* In Dark Mode: Show the Sun (Target: Light) */
                        <div className="relative">
                            <Sun size={20} className="text-black fill-black/5" strokeWidth={2} />
                            <motion.div
                                layoutId="sun-glow-core"
                                className="absolute inset-0 bg-luxury/20 blur-md rounded-full -z-10"
                            />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Inverted Tooltip */}
            <div className={`
                absolute left-full ml-6 px-5 py-2.5 rounded-2xl
                text-[8px] font-black uppercase tracking-[0.3em]
                pointer-events-none whitespace-nowrap
                transition-all duration-500 transform
                opacity-0 translate-x-[-12px] group-hover:opacity-100 group-hover:translate-x-0
                ${isLight ? 'bg-white text-black' : 'bg-black text-white'}
                shadow-2xl border border-white/10
            `}>
                <span className="relative z-10">
                    {isLight ? 'Activate Obsidian' : 'Restore Alabaster'}
                </span>
                <div className={`
                    absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rotate-45
                    ${isLight ? 'bg-white' : 'bg-black'}
                `} />
            </div>

            {/* Subtle "Rim Light" animation on hover */}
            <motion.div
                autoFocus
                className={`
                    absolute inset-0 rounded-[2.2rem] border-2 opacity-0 group-hover:opacity-100 transition-all duration-700
                    ${isLight ? 'border-primary/40' : 'border-luxury/40'}
                `}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            />
        </button>
    );
}
