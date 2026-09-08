"use client";

import { Sparkles, X, UserCheck } from "lucide-react";
import { useUpdateAdminMutation } from "@/redux/features/admin/adminApi";
import { TAdmin } from "@/types/admin";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";
import AZForm from "../../../shared/form/AZFrom";
import AZInput from "../../../shared/form/AZInput";

interface UpdateAdminModalProps {
  admin: TAdmin | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const UpdateAdminModal = ({
  admin,
  isOpen,
  onClose,
  onSuccess,
}: UpdateAdminModalProps) => {
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();

  if (!isOpen || !admin) return null;

  const onSubmit = async (data: FieldValues) => {
    try {
      const payload: Record<string, any> = {};
      if (data.name) payload.name = data.name.trim();
      if (data.phone) payload.phone = data.phone.trim();

      const res = await updateAdmin({
        id: admin._id,
        data: payload,
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Admin profile updated successfully!", {
          autoClose: 1000,
        });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update admin profile");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-base-100 border border-base-200 w-full max-w-lg max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-secondary via-primary to-accent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 pb-2 border-b border-base-200/80 bg-base-200/20">
          <div className="badge badge-secondary gap-1.5 px-3 py-1.5 text-xs font-semibold mb-2 text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Staff Administration</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-base-content flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-secondary" />
            Update Admin Profile
          </h2>
          <p className="text-base-content/70 text-xs mt-1">
            Update the administrator&apos;s full display name and operational contact telephone number.
          </p>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 flex-1 text-xs">
          <AZForm
            key={admin._id}
            defaultValues={{
              name: admin.name || "",
              phone: admin.phone || "",
            }}
            onSubmit={onSubmit}
          >
            <div className="space-y-4">
              <AZInput
                label="Admin Full Name"
                name="name"
                type="text"
                placeholder="e.g. Master Administrator"
              />

              <AZInput
                label="Telephone / Mobile Contact"
                name="phone"
                type="text"
                placeholder="+8801712345678"
              />

              <div className="pt-2 border-t border-base-200">
                <div className="p-3 rounded-xl bg-base-200/50 text-[11px] text-base-content/70 space-y-1">
                  <div className="font-bold text-base-content">Email Address Notice:</div>
                  <div>
                    System login email (<span className="font-mono font-bold text-secondary">{admin.email}</span>) is linked to administrative authentication security and cannot be changed here.
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-base-200 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm btn-ghost font-bold text-base-content/70 cursor-pointer"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-sm btn-secondary text-white font-bold shadow-md px-6 cursor-pointer"
                >
                  {isUpdating ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </AZForm>
        </div>
      </div>
    </div>
  );
};

export default UpdateAdminModal;
