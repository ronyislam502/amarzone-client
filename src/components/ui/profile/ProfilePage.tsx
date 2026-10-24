'use client';

import { useState } from 'react';
import {
    User,
    Lock,
    Shield,
    Store,
    Sparkles,
    AlertCircle,
    RotateCcw,
} from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { useMyProfileQuery } from '@/redux/features/user/userApi';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { TProfileTab, TUserProfile, TUserRole } from '@/types/profile';
import ProfileBread from './ProfileBread';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileSecurity from './ProfileSecurity';
import ProfileRoleHub from './ProfileRoleHub';
import ProfileOverview from './ProfileOverview';
import ProfileEditModal from './ProfileEditModal';


export const ProfilePage = () => {
    // শুধুমাত্র Redux ও API থেকে ডাটা নিচ্ছি
    const authUser = useAppSelector(selectCurrentUser);
    const { data: profileResponse, isLoading, isError, refetch, isFetching } = useMyProfileQuery({});

    const [activeTab, setActiveTab] = useState<TProfileTab>('overview');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Profile data from API response
    const profile: TUserProfile | undefined = profileResponse?.data;

    // Determine current user role (API ডাটা অথবা Redux-এর authUser থেকে)
    const rawRole = profile?.user?.role || authUser?.role || 'CUSTOMER';
    const normalizedRole: TUserRole = (rawRole.toUpperCase() as TUserRole) || 'CUSTOMER';

    // Loading State
    if (isLoading) {
        return (
            <div className="w-full">
                {/* <ProfileSkeleton /> */}
            </div>
        );
    }

    // Error State
    if (isError || !profile) {
        return (
            <div className="w-full my-8">
                <div className="card relative overflow-hidden bg-[#170d2f] border border-error/30 shadow-2xl rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-error/10 border border-error/20 text-error flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-white">Unable to Load Profile</h3>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                            We encountered an issue retrieving your account details. Please verify your authentication session and try again.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="btn btn-sm btn-outline border-error/40 text-error hover:bg-error hover:text-white rounded-xl gap-2 font-bold mx-auto cursor-pointer"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Retry Loading</span>
                    </button>
                </div>
            </div>
        );
    }

    // Tab items configuration
    const getRoleTabLabel = () => {
        switch (normalizedRole) {
            case 'SUPER_ADMIN':
            case 'ADMIN':
                return {
                    label: 'Governance Hub',
                    icon: <Shield className="w-4 h-4" />,
                };
            case 'VENDOR':
                return {
                    label: 'Store & Branding',
                    icon: <Store className="w-4 h-4" />,
                };
            case 'CUSTOMER':
            default:
                return {
                    label: 'Shopping Hub',
                    icon: <Sparkles className="w-4 h-4" />,
                };
        }
    };

    const roleTabMeta = getRoleTabLabel();

    return (
        <div className="w-full text-slate-100">
            {/* Breadcrumb Navigation - customTitle রিমুভ করা হয়েছে */}
            <ProfileBread role={normalizedRole} />

            {/* Profile Hero Header */}
            <ProfileHeader
                profile={profile}
                role={normalizedRole}
                onEdit={() => setIsEditModalOpen(true)}
                onOpenSecurity={() => setActiveTab('security')}
                onRefresh={() => refetch()}
                isRefreshing={isFetching}
            />

            {/* Role-Specific Stats Strip */}
            <ProfileStats profile={profile} role={normalizedRole} />

            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6 overflow-x-auto">
                <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'overview'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <User className="w-4 h-4" />
                    <span>Profile Overview</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'security'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Lock className="w-4 h-4" />
                    <span>Security & Password</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('role_details')}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'role_details'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    {roleTabMeta.icon}
                    <span>{roleTabMeta.label}</span>
                </button>
            </div>

            {/* Tab Views */}
            <div className="transition-opacity duration-300">
                {activeTab === 'overview' && (
                    <ProfileOverview
                        profile={profile}
                        role={normalizedRole}
                        onEdit={() => setIsEditModalOpen(true)}
                    />
                )}

                {activeTab === 'security' && (
                    <ProfileSecurity
                        profile={profile}
                        role={normalizedRole}
                    />
                )}

                {activeTab === 'role_details' && (
                    <ProfileRoleHub
                        profile={profile}
                        role={normalizedRole}
                        onEdit={() => setIsEditModalOpen(true)}
                    />
                )}
            </div>

            {/* Modal for Editing Profile Info */}
            <ProfileEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
                role={normalizedRole}
                refetch={() => refetch()}
            />
        </div>
    );
};

export default ProfilePage;