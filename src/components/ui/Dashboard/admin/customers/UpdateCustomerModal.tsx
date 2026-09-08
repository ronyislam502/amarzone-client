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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-base-100 border border-base-200 w-full max-w-lg max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-info via-primary to-accent" />

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
          <div className="badge badge-info gap-1.5 px-3 py-1.5 text-xs font-semibold mb-2 text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Account Governance</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-base-content flex items-center gap-2">
            <Users className="w-6 h-6 text-info" />
            Update Customer Profile
          </h2>
          <p className="text-base-content/70 text-xs mt-1">
            Modify consumer personal name, contact phone, and registered shipping address.
          </p>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 flex-1 text-xs">
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

              <div className="pt-2 border-t border-base-200 space-y-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-success" />
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
              <div className="mt-8 flex items-center justify-end gap-3 border-t border-base-200 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm btn-ghost font-bold text-base-content/70"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-sm btn-info text-white font-bold shadow-md px-6"
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
