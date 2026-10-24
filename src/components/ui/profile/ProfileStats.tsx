'use client';

import React from 'react';
import {
    ShieldCheck,
    Store,
    Users,
    Activity,
    Lock,
    PackageCheck,
    DollarSign,
    HeartHandshake,
    Sparkles,
    MapPin,
    Zap,
    CheckCircle2,
} from 'lucide-react';
import { TUserProfile, TUserRole } from '@/types/profile';
import AZStats, { TAZStat } from '@/components/shared/AZStats';

interface ProfileStatsProps {
    profile: TUserProfile;
    role: TUserRole;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ profile, role }) => {
    let stats: TAZStat[] = [];

    switch (role) {
        case 'SUPER_ADMIN':
        case 'ADMIN':
            stats = [
                {
                    label: 'Governance Level',
                    value: role === 'SUPER_ADMIN' ? 'Root Admin' : 'Staff Admin',
                    description: 'Full Platform Authority',
                    descriptionIcon: <CheckCircle2 className="w-3 h-3 text-success shrink-0" />,
                    icon: <ShieldCheck className="w-6 h-6" />,
                    lineColor: 'via-amber-400/80',
                    glowColor: 'from-amber-500/20',
                    valueColor: 'text-amber-400',
                    iconWrapperColor: 'bg-amber-400/10',
                    iconBorderColor: 'border-amber-400/20',
                    iconColor: 'text-amber-400',
                },
                {
                    label: 'Platform Health',
                    value: '99.8%',
                    description: 'Optimal SLA Operations',
                    descriptionIcon: <Activity className="w-3 h-3 text-success shrink-0" />,
                    icon: <Activity className="w-6 h-6" />,
                    lineColor: 'via-emerald-400/80',
                    glowColor: 'from-emerald-500/20',
                    valueColor: 'text-emerald-400',
                    iconWrapperColor: 'bg-emerald-400/10',
                    iconBorderColor: 'border-emerald-400/20',
                    iconColor: 'text-emerald-400',
                },
                {
                    label: 'Access Control',
                    value: 'RBAC Active',
                    description: 'Audit & Moderation',
                    descriptionIcon: <Users className="w-3 h-3 text-secondary shrink-0" />,
                    icon: <Users className="w-6 h-6" />,
                    lineColor: 'via-purple-400/80',
                    glowColor: 'from-purple-500/20',
                    valueColor: 'text-purple-400',
                    iconWrapperColor: 'bg-purple-400/10',
                    iconBorderColor: 'border-purple-400/20',
                    iconColor: 'text-purple-400',
                },
                {
                    label: 'Security Protocol',
                    value: 'Encrypted',
                    description: 'Token Verified Session',
                    descriptionIcon: <Lock className="w-3 h-3 text-cyan-400 shrink-0" />,
                    icon: <Lock className="w-6 h-6" />,
                    lineColor: 'via-cyan-400/80',
                    glowColor: 'from-cyan-500/20',
                    valueColor: 'text-cyan-400',
                    iconWrapperColor: 'bg-cyan-400/10',
                    iconBorderColor: 'border-cyan-400/20',
                    iconColor: 'text-cyan-400',
                },
            ];
            break;

        case 'VENDOR':
            stats = [
                {
                    label: 'Merchant Status',
                    value: 'Verified',
                    description: 'Active Marketplace Partner',
                    descriptionIcon: <CheckCircle2 className="w-3 h-3 text-success shrink-0" />,
                    icon: <Store className="w-6 h-6" />,
                    lineColor: 'via-warning/80',
                    glowColor: 'from-warning/20',
                    valueColor: 'text-warning',
                    iconWrapperColor: 'bg-warning/10',
                    iconBorderColor: 'border-warning/20',
                    iconColor: 'text-warning',
                },
                {
                    label: 'Fulfillment SLA',
                    value: '99.8%',
                    description: 'On-Time Dispatch Rate',
                    descriptionIcon: <PackageCheck className="w-3 h-3 text-emerald-400 shrink-0" />,
                    icon: <PackageCheck className="w-6 h-6" />,
                    lineColor: 'via-emerald-400/80',
                    glowColor: 'from-emerald-500/20',
                    valueColor: 'text-emerald-400',
                    iconWrapperColor: 'bg-emerald-400/10',
                    iconBorderColor: 'border-emerald-400/20',
                    iconColor: 'text-emerald-400',
                },
                {
                    label: 'Payout Channel',
                    value: 'Connected',
                    description: 'Automated Settlement Ready',
                    descriptionIcon: <DollarSign className="w-3 h-3 text-info shrink-0" />,
                    icon: <DollarSign className="w-6 h-6" />,
                    lineColor: 'via-info/80',
                    glowColor: 'from-info/20',
                    valueColor: 'text-info',
                    iconWrapperColor: 'bg-info/10',
                    iconBorderColor: 'border-info/20',
                    iconColor: 'text-info',
                },
                {
                    label: 'Storefront',
                    value: 'Live',
                    description: 'Public Brand Catalog',
                    descriptionIcon: <Zap className="w-3 h-3 text-accent shrink-0" />,
                    icon: <Zap className="w-6 h-6" />,
                    lineColor: 'via-accent/80',
                    glowColor: 'from-accent/20',
                    valueColor: 'text-accent',
                    iconWrapperColor: 'bg-accent/10',
                    iconBorderColor: 'border-accent/20',
                    iconColor: 'text-accent',
                },
            ];
            break;

        case 'CUSTOMER':
        default:
            const destination = profile.address?.country || profile.address?.state || 'Configured';
            stats = [
                {
                    label: 'Membership Tier',
                    value: 'Prime Club',
                    description: 'Exclusive Platform Perks',
                    descriptionIcon: <Sparkles className="w-3 h-3 text-warning shrink-0" />,
                    icon: <Sparkles className="w-6 h-6" />,
                    lineColor: 'via-amber-400/80',
                    glowColor: 'from-amber-500/20',
                    valueColor: 'text-amber-400',
                    iconWrapperColor: 'bg-amber-400/10',
                    iconBorderColor: 'border-amber-400/20',
                    iconColor: 'text-amber-400',
                },
                {
                    label: 'Buyer Protection',
                    value: '100% Safe',
                    description: 'Full Amarzone Guarantee',
                    descriptionIcon: <HeartHandshake className="w-3 h-3 text-emerald-400 shrink-0" />,
                    icon: <HeartHandshake className="w-6 h-6" />,
                    lineColor: 'via-emerald-400/80',
                    glowColor: 'from-emerald-500/20',
                    valueColor: 'text-emerald-400',
                    iconWrapperColor: 'bg-emerald-400/10',
                    iconBorderColor: 'border-emerald-400/20',
                    iconColor: 'text-emerald-400',
                },
                {
                    label: 'Default Address',
                    value: destination,
                    description: profile.address?.street ? 'Home Delivery Ready' : 'Add Details',
                    descriptionIcon: <MapPin className="w-3 h-3 text-sky-400 shrink-0" />,
                    icon: <MapPin className="w-6 h-6" />,
                    lineColor: 'via-sky-400/80',
                    glowColor: 'from-sky-500/20',
                    valueColor: 'text-sky-400',
                    iconWrapperColor: 'bg-sky-400/10',
                    iconBorderColor: 'border-sky-400/20',
                    iconColor: 'text-sky-400',
                },
                {
                    label: 'Fast Checkout',
                    value: 'Activated',
                    description: 'Secured One-Click Payment',
                    descriptionIcon: <Zap className="w-3 h-3 text-indigo-400 shrink-0" />,
                    icon: <Zap className="w-6 h-6" />,
                    lineColor: 'via-indigo-400/80',
                    glowColor: 'from-indigo-500/20',
                    valueColor: 'text-indigo-400',
                    iconWrapperColor: 'bg-indigo-400/10',
                    iconBorderColor: 'border-indigo-400/20',
                    iconColor: 'text-indigo-400',
                },
            ];
            break;
    }

    return (
        <div className="mb-6">
            <AZStats stats={stats} />
        </div>
    );
};

export default ProfileStats;
