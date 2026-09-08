"use client";

import { useState, ChangeEvent } from "react";
import {
  UserPlus,
  Sparkles,
  X,
  Upload,
  UserCheck,
  Key,
  Mail,
  Phone,
  Lock,
  Image as ImageIcon,
} from "lucide-react";
import { useCreateAdminMutation } from "@/redux/features/admin/adminApi";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";
import AZForm from "../../../shared/form/AZFrom";
import AZInput from "../../../shared/form/AZInput";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateAdminModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateAdminModalProps) => {
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Avatar image file size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: FieldValues) => {
    if (!data.name || !data.email || !data.phone) {
      toast.error("Please fill in Name, Email, and Phone");
      return;
    }

    try {
      const adminData = {
        password: data.password || "admin123",
        admin: {
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
        },
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(adminData));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await createAdmin(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Administrator account created successfully!", {
          autoClose: 1000,
        });
        handleRemoveImage();
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to create administrator");
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
            <span>Personnel Onboarding</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-base-content flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-secondary" />
            Onboard New Administrator
          </h2>
          <p className="text-base-content/70 text-xs mt-1">
            Provision authorized administrator credentials with administrative dashboard access.
          </p>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 flex-1 text-xs">
          <AZForm
            defaultValues={{
              name: "",
              email: "",
              phone: "",
              password: "admin123",
            }}
            onSubmit={onSubmit}
          >
            <div className="space-y-4">
              {/* Avatar Upload */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="text-xs font-bold text-base-content/80 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-secondary" />
                    Admin Profile Picture (Optional)
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-base-200 border-2 border-dashed border-base-300 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCheck className="w-7 h-7 text-base-content/30" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      id="admin-image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="admin-image-upload"
                        className="btn btn-outline btn-secondary btn-xs gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        {imageFile ? "Change Photo" : "Upload Photo"}
                      </label>
                      {imageFile && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="btn btn-ghost btn-xs text-error cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-base-content/50">
                      PNG, JPG or WebP up to 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <AZInput
                label="Full Display Name *"
                name="name"
                type="text"
                placeholder="e.g. Sarah Connor"
              />

              {/* Email */}
              <AZInput
                label="Login Email Address *"
                name="email"
                type="email"
                placeholder="sarah.admin@amarzone.com"
              />

              {/* Phone */}
              <AZInput
                label="Official Contact Phone *"
                name="phone"
                type="text"
                placeholder="+8801712345678"
              />

              {/* Password */}
              <AZInput
                label="Initial Temporary Password"
                name="password"
                type="password"
                placeholder="Default: admin123"
              />

              <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/20 text-[11px] text-base-content/70 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-secondary">
                  <Key className="w-3.5 h-3.5" />
                  Role & Privileges
                </div>
                <div>
                  Newly onboarded administrators receive system operations privileges to manage products, categories, departments, orders, and vendors.
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-base-200 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm btn-ghost font-bold text-base-content/70 cursor-pointer"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="btn btn-sm btn-secondary text-white font-bold shadow-md px-6 cursor-pointer"
                >
                  {isCreating ? "Provisioning..." : "Create Administrator"}
                </button>
              </div>
            </div>
          </AZForm>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminModal;
