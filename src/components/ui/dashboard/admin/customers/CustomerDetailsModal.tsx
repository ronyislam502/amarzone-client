'use client';

import React from 'react';
import Image from 'next/image';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Shield,
    Sparkles,
} from 'lucide-react';
import { TCustomer } from '@/types/customer';
import AZModal from '@/components/shared/AZModal';

export interface CustomerDetailsModalProps {
    isOpen: boolean;
    customer: TCustomer | null;
    onClose: () => void;
}

const CustomerDetailsModal = ({
    isOpen,
    customer,
    onClose,
}: CustomerDetailsModalProps) => {
    if (!customer) return null;

    const isSuspended = customer.isDeleted;
    const userObj = typeof customer.user === 'object' ? customer.user : null;
    const userStatus = userObj?.status || (isSuspended ? 'blocked' : 'active');

    const createdDate = customer.createdAt
        ? new Date(customer.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : 'N/A';

    const updatedDate = customer.updatedAt
        ? new Date(customer.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : 'N/A';

    const hasAddress = Boolean(
        customer.address &&
        (customer.address.street ||
            customer.address.state ||
            customer.address.country ||
            customer.address.postalCode)
    );

    return (
        <AZModal
            isOpen={isOpen}
            onClose={onClose}
            title="Customer Record Details"
            description="Complete consumer profile overview and verification audit"
            icon={<User className="w-5 h-5 text-amber-400" />}
            size="lg"
        >
            <div className="space-y-6 py-2">
                {/* Hero Profile Card */}
                <div className="relative overflow-hidden rounded-2xl bg-[#140b2a] border border-white/10 p-5 shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-amber-400/30 overflow-hidden relative shadow-md shrink-0 flex items-center justify-center">
                            {customer.avatar ? (
                                <Image
                                    src={customer.avatar}
                                    alt={customer.name}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-amber-300 font-black text-2xl flex items-center justify-center">
                                    {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                                </div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-1 text-center sm:text-left flex-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <h3 className="text-xl font-black text-white">{customer.name}</h3>
                                <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${!isSuspended
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}
                                >
                                    {!isSuspended ? (
                                        <>
                                            <CheckCircle2 className="w-3 h-3" />
                                            Active Consumer
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="w-3 h-3" />
                                            Suspended / Inactive
                                        </>
                                    )}
                                </span>
                            </div>

                            <p className="text-xs text-amber-300/80 flex items-center justify-center sm:justify-start gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Verified Shopper Account</span>
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span className="truncate">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span>{customer.phone || 'No phone linked'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Shipping Address */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                        <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Delivery Destination</span>
                        </div>
                        {hasAddress ? (
                            <div className="text-xs text-slate-300 space-y-1">
                                <p className="font-semibold text-white">{customer.address?.street || 'No street specified'}</p>
                                <p>
                                    {[customer.address?.state, customer.address?.postalCode]
                                        .filter(Boolean)
                                        .join(', ')}
                                </p>
                                <p className="text-slate-400">{customer.address?.country || ''}</p>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 italic">No delivery address saved on profile.</p>
                        )}
                    </div>

                    {/* Account Timestamps */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                        <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Account Governance</span>
                        </div>
                        <div className="text-xs text-slate-300 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-slate-500" /> Onboarded:
                                </span>
                                <span className="font-medium text-white">{createdDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-500" /> Last Profile Sync:
                                </span>
                                <span className="font-medium text-white">{updatedDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">System Status:</span>
                                <span className="capitalize font-semibold text-slate-200">{userStatus}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="flex justify-end pt-3 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </AZModal>
    );
};

export default CustomerDetailsModal;
