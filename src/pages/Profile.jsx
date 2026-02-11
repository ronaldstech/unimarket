import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/profile/AuthForm';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import ReferralSection from '../components/profile/ReferralSection';
import NetworkStats from '../components/profile/NetworkStats';
import AccountSettings from '../components/profile/AccountSettings';
import RedemptionHistory from '../components/profile/RedemptionHistory';

export default function Profile() {
    const { isAuthenticated, user, ensureReferralCode } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Ensure referral code exists for legacy users
    useEffect(() => {
        if (isAuthenticated && user && !user.myReferralCode) {
            ensureReferralCode(user);
        }
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return <AuthForm />;
    }

    return (
        <div className="container py-32 px-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header & Edit Form */}
                <ProfileHeader isEditing={isEditing} setIsEditing={setIsEditing} />
                <ProfileEditForm isEditing={isEditing} setIsEditing={setIsEditing} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Stats & Actions */}
                    <div className="space-y-8">
                        <ReferralSection />
                        <NetworkStats />
                    </div>

                    {/* Settings */}
                    <AccountSettings />
                </div>

                {/* Redemption History - Full Width */}
                <RedemptionHistory />
            </motion.div>
        </div>
    );
}
