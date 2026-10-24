'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
    ShieldCheck,
    Store,
    User,
    Mail,
    Phone,
    Calendar,
    Edit3,
    KeyRound,
    RotateCcw,
    Sparkles,
    Check,
    Copy,
    Camera,
    Shield,
    BadgeCheck,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { TUserProfile, TUserRole } from '@/types/profile';

interface ProfileHeaderProps {
    profile: TUserProfile;
    role: TUserRole;
    onEdit: () => void;
    onOpenSecurity: () => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    profile,
    role,
    onEdit,
    onOpenSecurity,
    onRefresh,
    isRefreshing = false,
}) => {
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopyEmail = () => {
        if (!profile.email) return;
        navigator.clipboard.writeText(profile.email);
        setCopiedEmail(true);
        toast.info('Email address copied to clipboard');
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    // Role-specific badges and theme colors
    const getRoleMeta = () => {
        switch (role) {
            case 'SUPER_ADMIN':
            case 'ADMIN':
                return {
                    label: role === 'SUPER_ADMIN' ? 'Super Administrator' : 'Platform Administrator',
                    sublabel: 'Staff Governance Authority',
                    badgeClass: 'badge-warning text-slate-950 font-black',
                    avatarRing: 'ring-amber-400/80 shadow-[0_0_35px_rgba(251,191,36,0.35)]',
                    accentColor: 'text-amber-400',
                    gradientFrom: 'from-amber-500/20 via-orange-600/15',
                    icon: <ShieldCheck className="w-3.5 h-3.5" />,
                };
            case 'VENDOR':
                return {
                    label: 'Verified Merchant',
                    sublabel: 'Store Partner & Fulfillment',
                    badgeClass: 'badge-warning text-slate-950 font-black',
                    avatarRing: 'ring-emerald-400/80 shadow-[0_0_35px_rgba(52,211,153,0.35)]',
                    accentColor: 'text-emerald-400',
                    gradientFrom: 'from-emerald-500/20 via-teal-600/15',
                    icon: <Store className="w-3.5 h-3.5" />,
                };
            case 'CUSTOMER':
            default:
                return {
                    label: 'Verified Customer',
                    sublabel: 'Amarzone Shopper',
                    badgeClass: 'badge-info text-slate-950 font-black',
                    avatarRing: 'ring-sky-400/80 shadow-[0_0_35px_rgba(56,189,248,0.35)]',
                    accentColor: 'text-sky-400',
                    gradientFrom: 'from-sky-500/20 via-blue-600/15',
                    icon: <Sparkles className="w-3.5 h-3.5" />,
                };
        }
    };

    const roleMeta = getRoleMeta();

    // Determine avatar image source
    const displayAvatar =
        profile.avatar ||
        profile.logo ||
        'https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png';

    // Format joined date
    const memberSince = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        })
        : 'Active Member';

    return (
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl my-4 border border-white/10 rounded-2xl sm:rounded-3xl">
            {/* Top glowing accent border line */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

            {/* Ambient background glow orbs */}
            <div
                className={`absolute -top-16 -left-16 w-64 h-64 bg-gradient-to-br ${roleMeta.gradientFrom} to-transparent rounded-full blur-3xl pointer-events-none`}
            />
            <div className="absolute -bottom-16 right-1/4 w-64 h-64 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* High-tech dot matrix overlay */}
            <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

            {/* Dynamic Cover Banner */}
            <div className="relative h-36 sm:h-48 w-full overflow-hidden border-b border-white/10">
                {profile.banner ? (
                    <Image
                        src={profile.banner}
                        alt="Store Cover Banner"
                        fill
                        className="object-cover object-center brightness-75"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#0c0824] via-[#1f1042] to-[#12082b] relative">
                        {/* Decorative banner abstract geometric lines */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />
                        <div className="absolute bottom-3 right-5 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-slate-300">
                            <Shield className="w-3.5 h-3.5 text-amber-400" />
                            <span>Amarzone Secure Identity Vault</span>
                        </div>
                    </div>
                )}
                {/* Banner bottom dark gradient fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#170d2f] via-transparent to-transparent" />
            </div>

            {/* Main Header Content */}
            <div className="relative z-10 px-5 sm:px-8 pb-6 sm:pb-8 pt-0">
                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
                    {/* Left: Avatar + Identity Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left min-w-0">
                        {/* Avatar Container with ring & camera trigger */}
                        <div className="relative group shrink-0">
                            <div
                                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ${roleMeta.avatarRing} bg-slate-900 border-2 border-white/20 shadow-2xl relative`}
                            >
                                <Image
                                    src={displayAvatar}
                                    alt={profile.name || 'User Profile'}
                                    fill
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                    priority
                                />
                            </div>

                            {/* Camera overlay button to open edit modal */}
                            <button
                                type="button"
                                onClick={onEdit}
                                title="Change Profile Avatar / Logo"
                                className="absolute bottom-1 right-1 p-2 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg shadow-amber-400/40 transition-all hover:scale-110 cursor-pointer"
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </button>

                            {/* Online active indicator */}
                            <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-success border-2 border-[#170d2f]" />
                            </span>
                        </div>

                        {/* Text Metadata */}
                        <div className="space-y-1.5 min-w-0">
                            {/* Badges row */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span
                                    className={`badge ${roleMeta.badgeClass} gap-1.5 px-3 py-2 text-xs shadow-md`}
                                >
                                    {roleMeta.icon}
                                    <span>{roleMeta.label}</span>
                                </span>

                                <span className="badge badge-success badge-outline gap-1 font-bold text-xs bg-success/10 border-success/30 text-success">
                                    <BadgeCheck className="w-3.5 h-3.5" />
                                    <span>Verified Account</span>
                                </span>
                            </div>

                            {/* Full Name */}
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center sm:justify-start gap-2 truncate">
                                <span>{profile.name || 'User'}</span>
                            </h1>

                            {/* Contact Details & Meta */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs text-slate-300/80">
                                {/* Email with copy button */}
                                <button
                                    type="button"
                                    onClick={handleCopyEmail}
                                    className="flex items-center gap-1.5 hover:text-amber-300 transition-colors group cursor-pointer"
                                    title="Click to copy email"
                                >
                                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span className="truncate max-w-[200px] sm:max-w-xs">{profile.email}</span>
                                    {copiedEmail ? (
                                        <Check className="w-3 h-3 text-success shrink-0" />
                                    ) : (
                                        <Copy className="w-3 h-3 text-slate-500 group-hover:text-amber-300 shrink-0" />
                                    )}
                                </button>

                                {profile.phone && (
                                    <div className="flex items-center gap-1.5 text-slate-300">
                                        <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        <span>{profile.phone}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>Joined {memberSince}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                        {onRefresh && (
                            <button
                                type="button"
                                onClick={onRefresh}
                                disabled={isRefreshing}
                                className="btn btn-ghost btn-sm gap-1.5 border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer rounded-xl"
                                title="Refresh Profile Data"
                            >
                                <RotateCcw
                                    className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''
                                        }`}
                                />
                                <span className="hidden md:inline">Refresh</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={onOpenSecurity}
                            className="btn btn-ghost btn-sm gap-1.5 border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer rounded-xl"
                            title="Manage Password & Security"
                        >
                            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                            <span>Security</span>
                        </button>

                        <button
                            type="button"
                            onClick={onEdit}
                            className="btn btn-sm gap-2 font-black shadow-lg shadow-amber-500/20 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-0 transition-all rounded-xl"
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
