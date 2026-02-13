import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background mesh-gradient-luxury">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-luxury/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] animate-pulse" />

            <div className="relative flex flex-col items-center gap-8">
                {/* Logo/Icon Container */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative glass-thick p-8 rounded-[2.5rem] border border-white/20 shadow-premium flex items-center justify-center">
                        <Loader2
                            className="w-12 h-12 text-primary animate-spin"
                            strokeWidth={1.5}
                        />
                    </div>
                </div>

                {/* Text Information */}
                <div className="flex flex-col items-center gap-3">
                    <h2 className="text-2xl font-bold tracking-tighter text-gradient uppercase">
                        UNIMARKET
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" />
                        <span className="text-[10px] items-center uppercase tracking-[0.3em] font-black text-muted-foreground ml-2">
                            Syncing Terminal
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center">
                <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-muted-foreground/50">
                    Advanced Luxury Commerce
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen;
