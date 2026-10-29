"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { X, MessageSquare, Store, Shield, Search, User, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";
import { TConversation } from "@/types/chat";
import { useCreateConversationMutation } from "@/redux/features/chat/chatApi";
import { useAllVendorsQuery } from "@/redux/features/vendor/vendorApi";
import { useAllAdminsQuery } from "@/redux/features/admin/adminApi";
import { useAllCustomersQuery } from "@/redux/features/customer/customerApi";
import { useMyOrdersQuery } from "@/redux/features/order/orderApi";
import AZInput from "@/components/shared/form/AZInput";

export type TNewConvTab = "vendors" | "customers" | "support" | "manual";

interface TVendorEntry {
  _id: string;
  name?: string;
  storeName?: string;
  email?: string;
  logo?: string;
  avatar?: string;
  user?: { _id?: string; name?: string; email?: string } | string;
}

interface TCustomerEntry {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
  user?: { _id?: string; name?: string; email?: string } | string;
  orderCount?: number;
}

interface TAdminEntry {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
  user?: { _id?: string; name?: string; email?: string } | string;
}

const DEFAULT_SUPPORT_AGENTS: TAdminEntry[] = [
  {
    _id: "6a8c1ace47fd0d55edf33890",
    name: "Amarzone Official Support",
    email: "amarzone1@gmail.com",
    user: {
      _id: "6a8c1ace47fd0d55edf3388e",
      name: "AMARZONE1",
      email: "amarzone1@gmail.com",
    },
  },
  {
    _id: "6abd67151b89b65e181da310",
    name: "Customer Support Desk (Rony)",
    email: "ronyislam1074@gmail.com",
    user: {
      _id: "6abd67151b89b65e181da30e",
      name: "Rony Islam",
      email: "ronyislam1074@gmail.com",
    },
  },
];

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (conversation: TConversation) => void;
  currentUserId: string;
  defaultTab?: TNewConvTab;
  allowedTabs?: TNewConvTab[];
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUserId,
  defaultTab = "vendors",
  allowedTabs = ["vendors", "support", "manual"],
}) => {
  const [activeTab, setActiveTab] = useState<TNewConvTab>(defaultTab);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevDefaultTab, setPrevDefaultTab] = useState(defaultTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [manualId, setManualId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Sync activeTab when modal opens or defaultTab changes without effect setState
  if (isOpen !== prevIsOpen || defaultTab !== prevDefaultTab) {
    setPrevIsOpen(isOpen);
    setPrevDefaultTab(defaultTab);
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }

  const [createConversationApi] = useCreateConversationMutation();

  // Load vendors list (up to 250 to ensure all vendors like Sonargaon Weavers Guild are included)
  const { data: vendorsResponse, isLoading: isLoadingVendors } = useAllVendorsQuery(
    { limit: 250 },
    { skip: !isOpen || activeTab !== "vendors" }
  );

  // Load support admins list
  const { data: adminsResponse, isLoading: isLoadingAdmins } = useAllAdminsQuery(
    { limit: 20 },
    { skip: !isOpen || activeTab !== "support" }
  );

  // Load customers list (up to 250 to ensure all customers like Akhi are included)
  const { data: customersResponse, isLoading: isLoadingCustomers } = useAllCustomersQuery(
    { limit: 250 },
    { skip: !isOpen || activeTab !== "customers" }
  );

  // Load user orders to discover direct buyers / vendors
  const { data: ordersResponse } = useMyOrdersQuery(
    { limit: 100 },
    { skip: !isOpen }
  );

  const resolveCustomerUserId = (cust: TCustomerEntry): string => {
    if (cust.user) {
      if (typeof cust.user === "object" && cust.user._id && /^[0-9a-fA-F]{24}$/.test(cust.user._id)) {
        return cust.user._id;
      }
      if (typeof cust.user === "string" && /^[0-9a-fA-F]{24}$/.test(cust.user)) {
        return cust.user;
      }
    }
    return cust._id;
  };

  const resolveVendorUserId = (vendor: TVendorEntry): string => {
    if (vendor.user) {
      if (typeof vendor.user === "object" && vendor.user._id && /^[0-9a-fA-F]{24}$/.test(vendor.user._id)) {
        return vendor.user._id;
      }
      if (typeof vendor.user === "string" && /^[0-9a-fA-F]{24}$/.test(vendor.user)) {
        return vendor.user;
      }
    }
    return vendor._id;
  };

  const resolveAdminUserId = (admin: TAdminEntry): string => {
    if (admin.user) {
      if (typeof admin.user === "object" && admin.user._id && /^[0-9a-fA-F]{24}$/.test(admin.user._id)) {
        return admin.user._id;
      }
      if (typeof admin.user === "string" && /^[0-9a-fA-F]{24}$/.test(admin.user)) {
        return admin.user;
      }
    }
    return admin._id;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleManualIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualId(e.target.value.trim());
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleClearManualId = () => {
    setManualId("");
  };

  const handleCreate = async (
    recipientUserId: string,
    conversationType: "NORMAL" | "SUPPORT" = "NORMAL"
  ) => {
    if (!recipientUserId || recipientUserId === currentUserId) {
      toast.warning("Please select another user to chat with.");
      return;
    }

    try {
      setIsCreating(true);
      const res = await createConversationApi({
        participants: [recipientUserId],
        conversationType,
      }).unwrap();

      if (res?.data) {
        toast.success("Conversation opened!");
        onSuccess(res.data);
        onClose();
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } | string; message?: string };
      const msg =
        (typeof errorObj?.data === "string" ? errorObj.data : null) ||
        (typeof errorObj?.data === "object" ? errorObj?.data?.message : null) ||
        errorObj?.message ||
        "Could not create conversation";
      toast.error(msg);
    } finally {
      setIsCreating(false);
    }
  };

  // Map of customer emails from orders
  const orderCustomers = useMemo(() => {
    const list: TCustomerEntry[] = [];
    const seenEmails = new Set<string>();
    const orders = ordersResponse?.data || [];
    for (const ord of orders) {
      if (ord.customer && ord.customer.email && !seenEmails.has(ord.customer.email)) {
        seenEmails.add(ord.customer.email);
        list.push({
          _id: ord.customer._id,
          name: ord.customer.name,
          email: ord.customer.email,
          user: ord.customer._id, // order.customer._id references User model
          orderCount: 1,
        });
      }
    }
    return list;
  }, [ordersResponse?.data]);

  const vendorsList = useMemo(() => {
    return (vendorsResponse?.data || []) as TVendorEntry[];
  }, [vendorsResponse?.data]);

  const adminsList = useMemo(() => {
    const list: TAdminEntry[] = [];
    const seen = new Set<string>();

    const rawList = (adminsResponse?.data || []) as TAdminEntry[];
    for (const a of rawList) {
      if (a?.email && !seen.has(a.email.toLowerCase())) {
        seen.add(a.email.toLowerCase());
        list.push(a);
      }
    }

    for (const def of DEFAULT_SUPPORT_AGENTS) {
      if (def?.email && !seen.has(def.email.toLowerCase())) {
        seen.add(def.email.toLowerCase());
        list.push(def);
      }
    }

    return list;
  }, [adminsResponse?.data]);

  // Merge directory customers with order buyers
  const customersList = useMemo(() => {
    const rawList = (customersResponse?.data || []) as TCustomerEntry[];
    const map = new Map<string, TCustomerEntry>();

    // Add order buyers first
    for (const oc of orderCustomers) {
      if (oc.email) {
        map.set(oc.email.toLowerCase(), oc);
      }
    }

    // Add directory customers
    for (const c of rawList) {
      const key = (c.email || c._id).toLowerCase();
      if (!map.has(key)) {
        map.set(key, c);
      } else {
        const existing = map.get(key)!;
        map.set(key, { ...c, ...existing });
      }
    }

    return Array.from(map.values());
  }, [customersResponse?.data, orderCustomers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-base-100 rounded-3xl border border-base-content/10 shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-base-content/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-base-content">New Conversation</h3>
              <p className="text-[11px] text-base-content/50">
                Connect with vendors, customers, or platform support
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm text-base-content/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        {allowedTabs.length > 1 && (
          <div className="flex border-b border-base-content/5 px-4 pt-2 gap-2 bg-base-200/40">
            {allowedTabs.includes("vendors") && (
              <button
                type="button"
                onClick={() => setActiveTab("vendors")}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === "vendors"
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/60 hover:text-base-content"
                  }`}
              >
                <Store className="w-3.5 h-3.5" />
                Vendors
              </button>
            )}
            {allowedTabs.includes("customers") && (
              <button
                type="button"
                onClick={() => setActiveTab("customers")}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === "customers"
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/60 hover:text-base-content"
                  }`}
              >
                <User className="w-3.5 h-3.5" />
                Customers
              </button>
            )}
            {allowedTabs.includes("support") && (
              <button
                type="button"
                onClick={() => setActiveTab("support")}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === "support"
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/60 hover:text-base-content"
                  }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Support
              </button>
            )}
            {allowedTabs.includes("manual") && (
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === "manual"
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/60 hover:text-base-content"
                  }`}
              >
                <User className="w-3.5 h-3.5" />
                Direct ID
              </button>
            )}
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 flex-1 overflow-y-auto">
          {activeTab === "vendors" && (
            <div className="space-y-3">
              <AZInput
                name="searchVendors"
                placeholder="Search vendors by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                icon={<Search className="w-4 h-4 text-warning" />}
                clearable={Boolean(searchTerm)}
                onClear={handleClearSearch}
                className="text-xs"
              />

              {isLoadingVendors ? (
                <div className="p-8 text-center">
                  <span className="loading loading-spinner loading-sm text-primary" />
                </div>
              ) : vendorsList.length === 0 ? (
                <p className="text-xs text-base-content/50 text-center py-6">
                  No registered vendors found.
                </p>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {vendorsList
                    .filter((v) => {
                      const name = v.name || v.storeName || (typeof v.user === "object" ? v.user?.name : "") || "";
                      const email = v.email || (typeof v.user === "object" ? v.user?.email : "") || "";
                      const q = searchTerm.toLowerCase();
                      return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
                    })
                    .map((vendor) => {
                      const userId = resolveVendorUserId(vendor);
                      const storeName = vendor.name || vendor.storeName || "Vendor Store";
                      const email =
                        vendor.email || (typeof vendor.user === "object" ? vendor.user?.email : "") || "";
                      const logo = vendor.logo || (typeof vendor.user === "object" ? (vendor.user as any)?.logo : undefined) || vendor.avatar;

                      return (
                        <div
                          key={vendor._id}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-base-200/60 transition-colors border border-base-content/5"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shrink-0 overflow-hidden relative text-amber-400">
                              {logo ? (
                                <Image
                                  src={logo}
                                  alt={storeName}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <Store className="w-4 h-4 text-amber-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-base-content truncate">
                                {storeName}
                              </h4>
                              <p className="text-[10px] text-base-content/50 truncate">
                                {email}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCreate(userId, "NORMAL")}
                            disabled={isCreating}
                            className="btn btn-primary btn-xs rounded-lg shadow-sm"
                          >
                            Chat
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {activeTab === "customers" && (
            <div className="space-y-3">
              <AZInput
                name="searchCustomers"
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                icon={<Search className="w-4 h-4 text-warning" />}
                clearable={Boolean(searchTerm)}
                onClear={handleClearSearch}
                className="text-xs"
              />

              {isLoadingCustomers ? (
                <div className="p-8 text-center">
                  <span className="loading loading-spinner loading-sm text-primary" />
                </div>
              ) : customersList.length === 0 ? (
                <p className="text-xs text-base-content/50 text-center py-6">
                  No registered customers found.
                </p>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {customersList
                    .filter((c) => {
                      const name = c.name || (typeof c.user === "object" ? c.user?.name : "") || "";
                      const email = c.email || (typeof c.user === "object" ? c.user?.email : "") || "";
                      const q = searchTerm.toLowerCase();
                      return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
                    })
                    .map((cust) => {
                      const userId = resolveCustomerUserId(cust);
                      const name = cust.name || (typeof cust.user === "object" ? cust.user?.name : "") || "Customer";
                      const email = cust.email || (typeof cust.user === "object" ? cust.user?.email : "") || "";
                      const avatar = cust.avatar || (typeof cust.user === "object" ? (cust.user as any)?.avatar : undefined);

                      return (
                        <div
                          key={cust._id}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-base-200/60 transition-colors border border-base-content/5"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative text-white font-bold text-xs">
                              {avatar ? (
                                <Image
                                  src={avatar}
                                  alt={name}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                name[0]?.toUpperCase() || <User className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-base-content truncate">
                                  {name}
                                </h4>
                                {cust.orderCount ? (
                                  <span className="badge badge-primary badge-outline badge-xs text-[9px] gap-0.5">
                                    <ShoppingBag className="w-2.5 h-2.5" /> Buyer
                                  </span>
                                ) : null}
                              </div>
                              <p className="text-[10px] text-base-content/50 truncate">
                                {email}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCreate(userId, "NORMAL")}
                            disabled={isCreating}
                            className="btn btn-primary btn-xs rounded-lg shadow-sm"
                          >
                            Chat
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {activeTab === "support" && (
            <div className="space-y-3">
              <p className="text-xs text-base-content/60">
                Connect directly with an Amarzone official support representative.
              </p>

              {isLoadingAdmins ? (
                <div className="p-8 text-center">
                  <span className="loading loading-spinner loading-sm text-primary" />
                </div>
              ) : adminsList.length === 0 ? (
                <p className="text-xs text-base-content/50 text-center py-6">
                  No support agents currently listed.
                </p>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {adminsList.map((admin) => {
                    const userId = resolveAdminUserId(admin);
                    const name = admin.name || (typeof admin.user === "object" ? admin.user?.name : "") || "Support Staff";
                    const email = admin.email || (typeof admin.user === "object" ? admin.user?.email : "") || "";
                    const avatar = admin.avatar || (typeof admin.user === "object" ? (admin.user as any)?.avatar : undefined);

                    return (
                      <div
                        key={admin._id}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-base-200/60 transition-colors border border-base-content/5"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 overflow-hidden relative text-primary-content font-bold text-xs">
                            {avatar ? (
                              <Image
                                src={avatar}
                                alt={name}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <Shield className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-base-content truncate">
                              {name}
                            </h4>
                            <p className="text-[10px] text-base-content/50 truncate">
                              {email}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCreate(userId, "SUPPORT")}
                          disabled={isCreating}
                          className="btn btn-primary btn-xs rounded-lg shadow-sm"
                        >
                          Chat
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "manual" && (
            <div className="space-y-3">
              <AZInput
                name="manualRecipientId"
                label="Recipient User ID"
                placeholder="Paste 24-character MongoDB User ID"
                value={manualId}
                onChange={handleManualIdChange}
                icon={<User className="w-4 h-4 text-warning" />}
                clearable={Boolean(manualId)}
                onClear={handleClearManualId}
                className="text-xs"
              />

              <button
                type="button"
                onClick={() => handleCreate(manualId)}
                disabled={!manualId || isCreating}
                className="btn btn-primary btn-sm w-full rounded-xl shadow-sm mt-2"
              >
                {isCreating ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Start Direct Conversation"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;
