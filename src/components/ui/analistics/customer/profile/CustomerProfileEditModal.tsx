"use client";

import { useState } from "react";
import { User, Phone, MapPin, X, Sparkles, Check } from "lucide-react";
import { toast } from "react-toastify";
import { TCustomer } from "@/src/types/customer";
import { useUpdateCustomerProfileMutation } from "@/src/redux/features/user/userApi";

interface CustomerProfileEditModalProps {
  customerProfile: TCustomer | null;
  isModalOpen: boolean;
  onCloseModal: () => void;
  onProfileUpdatedSuccess?: () => void;
}

interface CustomerProfileFormValues {
  name: string;
  phone: string;
  street: string;
  state: string;
  postalCode: string;
  country: string;
}

const CustomerProfileEditModal = ({
  customerProfile,
  isModalOpen,
  onCloseModal,
  onProfileUpdatedSuccess,
}: CustomerProfileEditModalProps) => {
  const [updateCustomerProfile, { isLoading: isUpdatingProfile }] =
    useUpdateCustomerProfileMutation();

  const [formValues, setFormValues] = useState<CustomerProfileFormValues>({
    name: customerProfile?.name || "",
    phone: customerProfile?.phone || "",
    street: customerProfile?.address?.street || "",
    state: customerProfile?.address?.state || "",
    postalCode: customerProfile?.address?.postalCode || "",
    country: customerProfile?.address?.country || "",
  });

  if (!isModalOpen || !customerProfile) return null;

  const handleInputChange = (
    fieldIdentifier: keyof CustomerProfileFormValues,
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
      const updatedCustomerPayload = {
        name: formValues.name.trim(),
        phone: formValues.phone.trim(),
        address: {
          street: formValues.street.trim(),
          state: formValues.state.trim(),
          postalCode: formValues.postalCode.trim(),
          country: formValues.country.trim(),
        },
      };

      const mutationResponse = await updateCustomerProfile({
        id: customerProfile._id,
        data: updatedCustomerPayload,
      }).unwrap();

      if (mutationResponse?.success) {
        toast.success(
          mutationResponse?.message || "Profile updated successfully!",
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
          ?.message || "Failed to update profile. Please try again.";
      toast.error(backendErrorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#170d2f] border border-white/10 w-full max-w-xl max-h-[90vh] rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative text-slate-100">
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
                Edit Profile Details
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Update your name, contact phone, and delivery destination.
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
          {/* Personal Information Group */}
          <div className="space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Personal Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formValues.name}
                    onChange={(inputChangeEvent) =>
                      handleInputChange("name", inputChangeEvent.target.value)
                    }
                    placeholder="e.g. Akhi Akter"
                    className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formValues.phone}
                    onChange={(inputChangeEvent) =>
                      handleInputChange("phone", inputChangeEvent.target.value)
                    }
                    placeholder="e.g. +8801712345679"
                    className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">
                Email Address (System Identifier)
              </label>
              <input
                type="email"
                disabled
                value={customerProfile.email}
                className="input input-bordered w-full bg-white/5 border-white/10 text-slate-400 cursor-not-allowed rounded-xl text-sm"
              />
              <span className="text-[10px] text-slate-500">
                Email address is tied to your login account and cannot be changed here.
              </span>
            </div>
          </div>

          {/* Shipping Address Group */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Default Delivery Address</span>
            </div>

            <div className="space-y-3">
              {/* Street Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formValues.street}
                  onChange={(inputChangeEvent) =>
                    handleInputChange("street", inputChangeEvent.target.value)
                  }
                  placeholder="e.g. Market Street"
                  className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-sm"
                />
              </div>

              {/* State, Postal Code, Country */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={formValues.state}
                    onChange={(inputChangeEvent) =>
                      handleInputChange("state", inputChangeEvent.target.value)
                    }
                    placeholder="e.g. California"
                    className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Postal / ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formValues.postalCode}
                    onChange={(inputChangeEvent) =>
                      handleInputChange(
                        "postalCode",
                        inputChangeEvent.target.value
                      )
                    }
                    placeholder="e.g. 94103"
                    className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formValues.country}
                    onChange={(inputChangeEvent) =>
                      handleInputChange("country", inputChangeEvent.target.value)
                    }
                    placeholder="e.g. USA"
                    className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-sm"
                  />
                </div>
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

export default CustomerProfileEditModal;
