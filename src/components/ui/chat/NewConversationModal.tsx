"use client";

import React, { useState } from "react";
import { TConversation } from "@/src/types/chat";
import { useCreateConversationMutation } from "@/src/redux/features/chat/chatApi";
import { useAllVendorsQuery } from "@/src/redux/features/vendor/vendorApi";
import { useAllAdminsQuery } from "@/src/redux/features/admin/adminApi";
import { X, MessageSquare, Store, Shield, Search, User } from "lucide-react";
import { toast } from "react-toastify";

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (conversation: TConversation) => void;
  currentUserId: string;
  defaultTab?: "vendors" | "support" | "manual";
  allowedTabs?: Array<"vendors" | "support" | "manual">;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUserId,
  defaultTab = "vendors",
  allowedTabs = ["vendors", "support", "manual"],
}) => {
  const [activeTab, setActiveTab] = useState<"vendors" | "support" | "manual">(
    defaultTab
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [manualId, setManualId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Sync activeTab if defaultTab changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  const [createConversationApi] = useCreateConversationMutation();

  // Load vendors list
  const { data: vendorsResponse, isLoading: isLoadingVendors } = useAllVendorsQuery(
    { limit: 20 },
    { skip: !isOpen || activeTab !== "vendors" }
  );

  // Load support admins list
  const { data: adminsResponse, isLoading: isLoadingAdmins } = useAllAdminsQuery(
    { limit: 10 },
    { skip: !isOpen || activeTab !== "support" }
  );

  if (!isOpen) return null;

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
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Could not create conversation");
    } finally {
      setIsCreating(false);
    }
  };

  const vendorsList = vendorsResponse?.data || [];
  const adminsList = adminsResponse?.data || [];

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
                Connect with vendors or support staff
              </p>
            </div>
          </div>
          <button
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
                onClick={() => setActiveTab("vendors")}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === "vendors"
                    ? "border-primary text-primary"
                    : "border-transparent text-base-content/60 hover:text-base-content"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                Vendors
              </button>
            )}
            {allowedTabs.includes("support") && (
              <button
                onClick={() => setActiveTab("support")}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === "support"
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
                onClick={() => setActiveTab("manual")}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === "manual"
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
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search vendors..."
                  className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs bg-base-200/50"
                />
              </div>

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
                    .filter((v: any) => {
                      const name = v?.name || v?.storeName || v?.user?.name || "";
                      return name.toLowerCase().includes(searchTerm.toLowerCase());
                    })
                    .map((vendor: any) => {
                      const userId = vendor?.user?._id || vendor?.user || vendor?._id;
                      const storeName = vendor?.name || vendor?.storeName || "Vendor Store";
                      const email = vendor?.email || vendor?.user?.email || "";

                      return (
                        <div
                          key={vendor._id}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-base-200/60 transition-colors border border-base-content/5"
                        >
                          <div className="min-w-0 pr-2">
                            <h4 className="text-xs font-bold text-base-content truncate">
                              {storeName}
                            </h4>
                            <p className="text-[10px] text-base-content/50 truncate">
                              {email}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCreate(userId)}
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
                  {adminsList.map((admin: any) => {
                    const userId = admin?.user?._id || admin?.user || admin?._id;
                    const name = admin?.name || admin?.user?.name || "Support Staff";
                    const email = admin?.email || admin?.user?.email || "";

                    return (
                      <div
                        key={admin._id}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-base-200/60 transition-colors border border-base-content/5"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-bold text-base-content truncate">
                            {name}
                          </h4>
                          <p className="text-[10px] text-base-content/50 truncate">
                            {email}
                          </p>
                        </div>
                        <button
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
              <div>
                <label className="text-xs font-semibold text-base-content block mb-1">
                  Recipient User ID
                </label>
                <input
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value.trim())}
                  placeholder="Paste 24-character MongoDB User ID"
                  className="input input-sm input-bordered w-full rounded-xl text-xs bg-base-200/50"
                />
              </div>

              <button
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
