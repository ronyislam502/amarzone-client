"use client";

import { Store, Sparkles, X, MapPin } from "lucide-react";
import { useUpdateVendorMutation } from "@/redux/features/vendor/vendorApi";
import { TVendor } from "@/types/vendor";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";
import AZForm from "../../../shared/form/AZFrom";
import AZInput from "../../../shared/form/AZInput";

interface UpdateVendorModalProps {
  vendor: TVendor | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const UpdateVendorModal = ({
  vendor,
  isOpen,
  onClose,
  onSuccess,
}: UpdateVendorModalProps) => {
  const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();

  if (!isOpen || !vendor) return null;

  const onSubmit = async (data: FieldValues) => {
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        address: {
          street: data.street || vendor.address?.street || "",
          state: data.state || vendor.address?.state || "",
          postalCode: data.postalCode || vendor.address?.postalCode || "",
          country: data.country || vendor.address?.country || "",
        },
      };

      const res = await updateVendor({
        id: vendor._id,
        data: payload,
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Vendor updated successfully!", {
          autoClose: 1000,
        });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update vendor");
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
            <span>Merchant Governance</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <span>Update Vendor Profile</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1.5">
            Modify store business name, telephone, and registered address.
          </p>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 flex-1 text-xs relative z-10">
          <AZForm
            key={vendor._id}
            defaultValues={{
              name: vendor.name || "",
              phone: vendor.phone || "",
              street: vendor.address?.street || "",
              state: vendor.address?.state || "",
              postalCode: vendor.address?.postalCode || "",
              country: vendor.address?.country || "",
            }}
            onSubmit={onSubmit}
          >
            <div className="space-y-4">
              <AZInput
                label="Store / Merchant Name"
                name="name"
                type="text"
                size="sm"
                placeholder="e.g. Tech & Technology"
                inputClassName="bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
              />

              <AZInput
                label="Contact Phone"
                name="phone"
                type="text"
                size="sm"
                placeholder="+8801711000005"
                inputClassName="bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
              />

              <div className="pt-3 border-t border-white/10 space-y-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>Business Location Address</span>
                </div>

                <AZInput
                  label="Street Address"
                  name="street"
                  type="text"
                  size="sm"
                  placeholder="Market Street"
                  inputClassName="bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
                />

                <div className="grid grid-cols-2 gap-3">
                  <AZInput
                    label="State / Province"
                    name="state"
                    type="text"
                    size="sm"
                    placeholder="California"
                    inputClassName="bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
                  />
                  <AZInput
                    label="Postal Code"
                    name="postalCode"
                    type="text"
                    size="sm"
                    placeholder="94103"
                    inputClassName="bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
                  />
                </div>

                <AZInput
                  label="Country"
                  name="country"
                  type="text"
                  size="sm"
                  placeholder="USA"
                  inputClassName="bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
                />
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
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </AZForm>
        </div>
      </div>
    </div>
  );
};

export default UpdateVendorModal;
