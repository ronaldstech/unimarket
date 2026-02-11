import React, { useState } from 'react';
import { Lock, ChevronRight, Share2, LogOut, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import toast from 'react-hot-toast';

export default function AccountSettings() {
    const { logout, user } = useAuth();
    const [sendingReset, setSendingReset] = useState(false);

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        setSendingReset(true);
        try {
            await sendPasswordResetEmail(auth, user.email);
            toast.success('Reset link sent to your email!');
        } catch (error) {
            console.error("Reset Error:", error);
            toast.error('Failed to send reset link.');
        } finally {
            setSendingReset(false);
        }
    };

    return (
        <div className="glass-thick p-8 rounded-[2.5rem] border border-border/30 h-full flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-6">Account Control</h3>
                <div className="space-y-4">
                    <button
                        onClick={handlePasswordReset}
                        disabled={sendingReset}
                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-secondary/50 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-secondary rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                                <KeyRound size={18} />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-sm">{sendingReset ? 'Sending...' : 'Reset Password'}</span>
                                <span className="text-[10px] text-muted-foreground">Send recovery email</span>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground/50" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-secondary/50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-secondary rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                                <Share2 size={18} />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-sm">Connected Apps</span>
                                <span className="text-[10px] text-muted-foreground">Manage access</span>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground/50" />
                    </button>
                </div>
            </div>

            <button
                onClick={logout}
                className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-3 mt-8"
            >
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </div>
    );
}
