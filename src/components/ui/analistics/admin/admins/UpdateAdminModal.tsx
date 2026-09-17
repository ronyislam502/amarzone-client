"use client";

import { Sparkles, X, UserCheck, User, Phone } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#170d2f] border border-white/10 w-full max-w-lg max-h-[90vh] rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative text-slate-100">
        {/* Top glowing accent border ray */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white shadow"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-amber-400/10 text-amber-400 border border-amber-400/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Staff Administration</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <span>Update Admin Profile</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1.5">
            Update the administrator&apos;s full display name and operational contact telephone number.
          </p>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 flex-1 text-xs relative z-10">
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
                size="sm"
                icon={<User className="w-4 h-4 text-amber-400/80" />}
                inputClassName="bg-slate-900/70 border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
                placeholder="e.g. Master Administrator"
              />

              <AZInput
                label="Telephone / Mobile Contact"
                name="phone"
                type="text"
                size="sm"
                icon={<Phone className="w-4 h-4 text-amber-400/80" />}
                inputClassName="bg-slate-900/70 border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
                placeholder="+8801712345678"
              />

              <div className="pt-2 border-t border-white/10">
                <div className="p-3.5 rounded-2xl bg-amber-400/[0.06] border border-amber-400/20 text-[11px] text-slate-300 space-y-1">
                  <div className="font-bold text-amber-400">Email Address Notice:</div>
                  <div className="text-slate-400 leading-relaxed">
                    System login email (<span className="font-mono font-bold text-amber-400">{admin.email}</span>) is linked to administrative authentication security and cannot be changed here.
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm btn-ghost font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 px-6 cursor-pointer border-none transition-all disabled:opacity-50"
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
