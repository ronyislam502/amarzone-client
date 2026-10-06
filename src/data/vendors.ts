import vendorsRaw from "./vendorsData.json";
import { TVendor } from "@/types/vendor";

export interface VendorRecord {
  _id: string;
  user: string;
  name: string;
  email?: string;
  phone?: string;
  logo: string;
  banner: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt?: string;
}

export const ALL_VENDORS: VendorRecord[] = vendorsRaw as VendorRecord[];

// Index caches for O(1) fast lookup
const vendorById = new Map<string, VendorRecord>();
const vendorByUserId = new Map<string, VendorRecord>();
const vendorByName = new Map<string, VendorRecord>();

for (const v of ALL_VENDORS) {
  if (v._id) {
    vendorById.set(v._id, v);
    vendorById.set(v._id.toLowerCase(), v);
  }
  if (v.user) {
    vendorByUserId.set(v.user, v);
    vendorByUserId.set(v.user.toLowerCase(), v);
  }
  if (v.name) {
    vendorByName.set(v.name.toLowerCase().trim(), v);
  }
}

/**
 * Find vendor metadata by vendor _id, user ID, or store name
 */
export function findVendor(identifier: string | null | undefined): VendorRecord | undefined {
  if (!identifier) return undefined;
  const key = identifier.trim().toLowerCase();

  return (
    vendorById.get(key) ||
    vendorByUserId.get(key) ||
    vendorByName.get(key) ||
    ALL_VENDORS.find(
      (v) =>
        v._id === identifier ||
        v.user === identifier ||
        v.name.toLowerCase() === key
    )
  );
}

/**
 * Get the server-compatible Vendor._id
 * (Needed because server endpoints like /vendor/:id, /ven-inventory/:id, and /service-reviews/vendor/:id
 * perform Vendor.findById(id), requiring the vendor document's _id rather than user._id)
 */
export function getActualVendorId(identifier: string): string {
  const match = findVendor(identifier);
  return match?._id || identifier;
}

/**
 * Get the User._id associated with the vendor
 */
export function getActualUserId(identifier: string): string {
  const match = findVendor(identifier);
  return match?.user || identifier;
}

/**
 * Convert a VendorRecord to a full TVendor interface object
 */
export function toTVendor(record: VendorRecord): TVendor {
  return {
    _id: record._id,
    name: record.name,
    email: record.email || "seller@amarzone.com",
    phone: record.phone || "+880 1700-000000",
    address: (record.address || {
      street: "Commercial Area",
      state: "Dhaka",
      country: "Bangladesh",
    }) as any,
    logo: record.logo,
    banner: record.banner,
    isDeleted: false,
    createdAt: record.createdAt || "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
    user: {
      _id: record.user,
      name: record.name,
      email: record.email,
      role: "VENDOR",
    } as any,
  };
}
