"use client";

import React from "react";
import Image from "next/image";
import { Store, Shield, User as UserIcon } from "lucide-react";
import { TParticipant } from "@/types/chat";

export interface TParticipantWithDetails extends Partial<TParticipant> {
  storeName?: string;
  logo?: string;
  avatar?: string;
}

/**
 * Resolves the appropriate image URL for a participant or message sender:
 * - VENDOR: prioritizes vendor `logo` (per TVendor interface), falling back to `avatar`.
 * - ADMIN / SUPER_ADMIN: uses admin `avatar` (per TAdmin interface).
 * - CUSTOMER: uses customer `avatar` (per TCustomer interface).
 */
export const resolveParticipantImage = (
  participant?: TParticipantWithDetails | null,
  roleOverride?: string
): {
  imageUrl?: string;
  role: "VENDOR" | "ADMIN" | "SUPER_ADMIN" | "CUSTOMER" | "USER";
  isVendor: boolean;
  isSupport: boolean;
  isCustomer: boolean;
} => {
  const role = ((roleOverride || participant?.role || "CUSTOMER").toUpperCase()) as
    | "VENDOR"
    | "ADMIN"
    | "SUPER_ADMIN"
    | "CUSTOMER"
    | "USER";

  const isVendor = role === "VENDOR";
  const isSupport = role === "ADMIN" || role === "SUPER_ADMIN";
  const isCustomer = role === "CUSTOMER" || role === "USER";

  if (isVendor) {
    // Vendor interface uses `logo`
    const imageUrl = participant?.logo || participant?.avatar;
    return { imageUrl, role, isVendor, isSupport, isCustomer };
  }

  // Customer & Admin interfaces use `avatar`
  const imageUrl = participant?.avatar || participant?.logo;
  return { imageUrl, role, isVendor, isSupport, isCustomer };
};

interface ChatAvatarProps {
  participant?: TParticipantWithDetails | null;
  name?: string;
  role?: string;
  imageUrl?: string;
  size?: number; // In px, default 36
  className?: string;
  showFallbackIcon?: boolean;
}

/**
 * Reusable Avatar / Logo renderer for the Chat System:
 * - Vendor: Displays Vendor Store Logo with Store icon fallback.
 * - Customer: Displays Customer Avatar with User icon / initial fallback.
 * - Admin: Displays Admin Avatar with Shield icon fallback.
 */
export const ChatAvatar: React.FC<ChatAvatarProps> = ({
  participant,
  name,
  role,
  imageUrl: manualImageUrl,
  size = 36,
  className = "",
  showFallbackIcon = true,
}) => {
  const resolved = resolveParticipantImage(participant, role);
  const finalImage = manualImageUrl || resolved.imageUrl;
  const displayName = name || participant?.name || "User";

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center relative shrink-0 select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {finalImage ? (
        <Image
          src={finalImage}
          alt={displayName}
          width={size}
          height={size}
          className="w-full h-full object-cover rounded-full"
        />
      ) : resolved.isVendor ? (
        <div className="w-full h-full bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
          {showFallbackIcon ? (
            <Store style={{ width: Math.max(14, size * 0.45), height: Math.max(14, size * 0.45) }} />
          ) : (
            <span className="text-xs uppercase">{displayName[0] || "V"}</span>
          )}
        </div>
      ) : resolved.isSupport ? (
        <div className="w-full h-full bg-primary/20 text-primary-content flex items-center justify-center font-bold">
          {showFallbackIcon ? (
            <Shield style={{ width: Math.max(14, size * 0.45), height: Math.max(14, size * 0.45) }} />
          ) : (
            <span className="text-xs uppercase">{displayName[0] || "A"}</span>
          )}
        </div>
      ) : (
        <div className="w-full h-full bg-white/10 text-white flex items-center justify-center font-bold text-xs uppercase">
          {displayName[0] || <UserIcon style={{ width: Math.max(14, size * 0.45), height: Math.max(14, size * 0.45) }} />}
        </div>
      )}
    </div>
  );
};

