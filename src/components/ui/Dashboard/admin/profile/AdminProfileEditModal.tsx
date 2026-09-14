"use client";

import { useState } from "react";
import { User, Phone, X, Sparkles, Check, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { TAdmin } from "@/src/types/admin";
import { useUpdateAdminProfileMutation } from "@/src/redux/features/user/userApi";

interface AdminProfileEditModalProps {
  adminProfile: TAdmin | null;
  isModalOpen: boolean;
  onCloseModal: () => void;
  onProfileUpdatedSuccess?: () => void;
}

interface AdminProfileFormValues {
  name: string;
  phone: string;
}

const AdminProfileEditModal = ({
  adminProfile,
  isModalOpen,
  onCloseModal,
  onProfileUpdatedSuccess,
}: AdminProfileEditModalProps) => {
  const [updateAdminProfile, { isLoading: isUpdatingProfile }] =
    useUpdateAdminProfileMutation();

  const [formValues, setFormValues] = useState<AdminProfileFormValues>({
    name: adminProfile?.name || "",
    phone: adminProfile?.phone || "",
  });

  if (!isModalOpen || !adminProfile) return null;

  const handleInputChange = (
    fieldIdentifier: keyof AdminProfileFormValues,
    updatedValue: string
  ) => {
    setFormValues((previousFormValues) => ({
      ...previousFormValues,
      [fieldIdentifier]: updatedValue,
    }));
  };

  const handleFormSubmit = async (formSubmitEvent: React.FormEvent) => {
    formSubmitEvent.preventDefault();

    try {
      const updatedAdminPayload = {
        name: formValues.name.trim(),
        phone: formValues.phone.trim(),
      };

      const mutationResponse = await updateAdminProfile({
        id: adminProfile._id,
        data: updatedAdminPayload,
      }).unwrap();

      if (mutationResponse?.success) {
        toast.success(
          mutationResponse?.message || "Admin profile updated successfully!",
          { autoClose: 2000 }
        );
        if (onProfileUpdatedSuccess) {
          onProfileUpdatedSuccess();
        }
        onCloseModal();
      }
    } catch (mutationErrorResponse: unknown) {
      const backendErrorMessage =
        (mutationErrorResponse as { data?: { message?: string } })?.data
          ?.message || "Failed to update admin profile. Please try again.";
      toast.error(backendErrorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#170d2f] border border-white/10 w-full max-w-lg max-h-[90vh] rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative text-slate-100">
        {/* Top glowing accent border ray */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge badge-warning badge-sm font-black text-slate-950">
                <Sparkles className="w-3 h-3" />
                Settings
              </span>
              <h3 className="text-xl font-black tracking-tight text-white">
                Edit Admin Profile
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Update operator name and administrative contact hotline.
            </p>
          </div>

          <button
            type="button"
            onClick={onCloseModal}
            className="btn btn-sm btn-circle btn-ghost bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form
          onSubmit={handleFormSubmit}
          className="relative z-10 overflow-y-auto flex-1 p-6 space-y-5"
        >
          {/* Identity Group */}
          <div className="space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Administrator Details</span>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Administrator Name
                </label>
                <input
                  type="text"
                  required
                  value={formValues.name}
                  onChange={(inputChangeEvent) =>
                    handleInputChange("name", inputChangeEvent.target.value)
                  }
                  placeholder="e.g. AMARZONE1"
                  className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-sm"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Phone / Direct Line
                </label>
                <input
                  type="text"
                  required
                  value={formValues.phone}
                  onChange={(inputChangeEvent) =>
                    handleInputChange("phone", inputChangeEvent.target.value)
                  }
                  placeholder="e.g. +8801711000001"
                  className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-sm"
                />
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">
                  Official Email (System Account Primary)
                </label>
                <input
                  type="email"
                  disabled
                  value={adminProfile.email}
                  className="input input-bordered w-full bg-white/5 border-white/10 text-slate-400 cursor-not-allowed rounded-xl text-sm"
                />
                <span className="text-[10px] text-slate-500">
                  Email address is linked to system authentication and cannot be changed here.
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCloseModal}
              disabled={isUpdatingProfile}
              className="btn btn-sm btn-ghost border border-white/15 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="btn btn-sm gap-2 font-black shadow-lg shadow-amber-500/20 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-0 rounded-xl"
            >
              {isUpdatingProfile ? (
                <span className="loading loading-spinner loading-xs text-slate-950" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>{isUpdatingProfile ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfileEditModal;
