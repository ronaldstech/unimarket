import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, productTitle, onCancel, onConfirm }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[71] bg-card border border-border/10 rounded-3xl p-6 shadow-2xl"
                    >
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                                <Trash2 size={32} />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-wide mb-2">Delete Asset?</h2>
                            <p className="text-muted-foreground text-sm font-medium mb-6">
                                Are you sure you want to delete <span className="text-foreground font-bold">"{productTitle}"</span>? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
