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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-base-100 border border-base-200 w-full max-w-lg max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-warning via-primary to-accent" />

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
          <div className="badge badge-warning gap-1.5 px-3 py-1.5 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Merchant Governance</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-base-content flex items-center gap-2">
            <Store className="w-6 h-6 text-warning" />
            Update Vendor Profile
          </h2>
          <p className="text-base-content/70 text-xs mt-1">
            Modify store business name, telephone, and registered address.
          </p>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 flex-1 text-xs">
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
                placeholder="e.g. Tech & Technology"
              />

              <AZInput
                label="Contact Phone"
                name="phone"
                type="text"
                placeholder="+8801711000005"
              />

              <div className="pt-2 border-t border-base-200 space-y-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-info" />
                  <span>Business Location Address</span>
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
                  className="btn btn-sm btn-warning font-bold shadow-md px-6"
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
