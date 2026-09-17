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
  User,
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
            <span>Personnel Onboarding</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <span>Onboard New Administrator</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1.5">
            Provision authorized administrator credentials with administrative dashboard access.
          </p>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 flex-1 text-xs relative z-10">
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
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  Admin Profile Picture (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCheck className="w-7 h-7 text-slate-500" />
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
                        className="btn btn-xs rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 gap-1.5 cursor-pointer font-bold transition-all"
                      >
                        <Upload className="w-3 h-3" />
                        {imageFile ? "Change Photo" : "Upload Photo"}
                      </label>
                      {imageFile && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="btn btn-ghost btn-xs text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
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
                size="sm"
                icon={<User className="w-4 h-4 text-amber-400/80" />}
                inputClassName="bg-slate-900/70 border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
                placeholder="e.g. Sarah Connor"
              />

              {/* Email */}
              <AZInput
                label="Login Email Address *"
                name="email"
                type="email"
                size="sm"
                icon={<Mail className="w-4 h-4 text-amber-400/80" />}
                inputClassName="bg-slate-900/70 border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
                placeholder="sarah.admin@amarzone.com"
              />

              {/* Phone */}
              <AZInput
                label="Official Contact Phone *"
                name="phone"
                type="text"
                size="sm"
                icon={<Phone className="w-4 h-4 text-amber-400/80" />}
                inputClassName="bg-slate-900/70 border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
                placeholder="+8801712345678"
              />

              {/* Password */}
              <AZInput
                label="Initial Temporary Password"
                name="password"
                type="password"
                size="sm"
                icon={<Lock className="w-4 h-4 text-amber-400/80" />}
                inputClassName="bg-slate-900/70 border-white/15 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
                placeholder="Default: admin123"
              />

              {/* Role & Privileges Callout */}
              <div className="p-3.5 rounded-2xl bg-amber-400/[0.06] border border-amber-400/20 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Key className="w-3.5 h-3.5" />
                  <span>Role & Administrative Privileges</span>
                </div>
                <div className="text-slate-400 leading-relaxed">
                  Newly onboarded administrators receive system operations privileges to manage products, categories, departments, orders, and vendors.
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm btn-ghost font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="btn btn-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 px-6 cursor-pointer border-none transition-all disabled:opacity-50"
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
