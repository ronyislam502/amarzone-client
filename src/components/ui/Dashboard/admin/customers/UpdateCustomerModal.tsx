"use client";

import { Users, Sparkles, X, MapPin } from "lucide-react";
import { useUpdateCustomerMutation } from "@/redux/features/customer/customerApi";
import { TCustomer } from "@/types/customer";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";
import AZForm from "../../../shared/form/AZFrom";
import AZInput from "../../../shared/form/AZInput";

interface UpdateCustomerModalProps {
  customer: TCustomer | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const UpdateCustomerModal = ({
  customer,
  isOpen,
  onClose,
  onSuccess,
}: UpdateCustomerModalProps) => {
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

  if (!isOpen || !customer) return null;

  const onSubmit = async (data: FieldValues) => {
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        address: {
          street: data.street || customer.address?.street || "",
          state: data.state || customer.address?.state || "",
          postalCode: data.postalCode || customer.address?.postalCode || "",
          country: data.country || customer.address?.country || "",
        },
      };

      const res = await updateCustomer({
        id: customer._id,
        data: payload,
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Customer profile updated successfully!", {
          autoClose: 1000,
        });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update customer");
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

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white shadow"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="relative z-10 p-6 pb-4 border-b border-white/10 bg-white/[0.02]">
          <div className="badge badge-warning gap-1.5 px-3 py-1.5 text-xs font-semibold mb-2 bg-amber-400/20 border-amber-400/30 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Account Governance</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            Update Customer Profile
          </h2>
          <p className="text-slate-300/80 text-xs mt-1">
            Modify consumer personal name, contact phone, and registered shipping address.
          </p>
        </div>

        {/* Form Body */}
        <div className="relative z-10 overflow-y-auto p-6 flex-1 text-xs [&_.input]:bg-[#120824] [&_.input]:border-white/15 [&_.input]:text-slate-200 [&_.input]:placeholder:text-slate-500 [&_.input:focus]:border-amber-400 [&_.label-text]:text-slate-300 [&_.label-text]:font-bold [&_.label-text]:text-xs">
          <AZForm
            key={customer._id}
            defaultValues={{
              name: customer.name || "",
              phone: customer.phone || "",
              street: customer.address?.street || "",
              state: customer.address?.state || "",
              postalCode: customer.address?.postalCode || "",
              country: customer.address?.country || "",
            }}
            onSubmit={onSubmit}
          >
            <div className="space-y-4">
              <AZInput
                label="Customer Full Name"
                name="name"
                type="text"
                placeholder="e.g. Akhi Akter"
              />

              <AZInput
                label="Telephone / Mobile Phone"
                name="phone"
                type="text"
                placeholder="+8801712345679"
              />

              <div className="pt-3 border-t border-white/10 space-y-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Default Shipping Address</span>
                </div>

                <AZInput
                  label="Street Address"
                  name="street"
                  type="text"
                  placeholder="Market Street"
                />

                <div className="grid grid-cols-2 gap-3">
                  <AZInput
                    label="State / Province"
                    name="state"
                    type="text"
                    placeholder="California"
                  />
                  <AZInput
                    label="Postal Code"
                    name="postalCode"
                    type="text"
                    placeholder="94103"
                  />
                </div>

                <AZInput
                  label="Country"
                  name="country"
                  type="text"
                  placeholder="USA"
                />
              </div>

              {/* Footer Actions */}
              <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm btn-ghost font-bold text-slate-300 hover:bg-white/10 rounded-xl"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 px-6 rounded-xl border-none transition-all active:scale-95 cursor-pointer"
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

export default UpdateCustomerModal;
