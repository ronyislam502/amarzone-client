'use client';

import React from 'react';
import { Home, ShieldCheck, Store, User, Sparkles } from 'lucide-react';
import { TUserRole } from '@/types/profile';
import AZBread, { TBreadcrumbItem } from '@/components/shared/AZBread';

interface ProfileBreadProps {
    role?: string;
    customTitle?: string;
}

export const ProfileBread: React.FC<ProfileBreadProps> = ({ role, customTitle }) => {
    const roleNormalized = (role?.toUpperCase() || 'CUSTOMER') as TUserRole;

    let portalLabel = 'Customer Hub';
    let portalHref = '/customer';
    let portalIcon = <User className="w-3.5 h-3.5 text-info" />;

    if (roleNormalized === 'ADMIN' || roleNormalized === 'SUPER_ADMIN') {
        portalLabel = 'Admin Governance';
        portalHref = '/admin';
        portalIcon = <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />;
    } else if (roleNormalized === 'VENDOR') {
        portalLabel = 'Vendor Operations';
        portalHref = '/vendor';
        portalIcon = <Store className="w-3.5 h-3.5 text-warning" />;
    }

    const items: TBreadcrumbItem[] = [
        {
            label: 'Home',
            href: '/',
            icon: <Home className="w-3.5 h-3.5 text-slate-400" />,
            hoverColor: 'hover:text-amber-400',
        },
        {
            label: portalLabel,
            href: portalHref,
            icon: portalIcon,
            hoverColor: 'hover:text-amber-400',
        },
        {
            label: customTitle || 'Account Profile',
            icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
        },
    ];

    return <AZBread items={items} />;
};

export default ProfileBread;
