'use client';

import {
  ShoppingBag,
  Sparkles,
  Building2,
  Layers,
  ListCheck,
  Tag,
  Flame,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProductMutation } from '@/redux/features/product/productApi';
import { useAllDepartmentsQuery } from '@/redux/features/department/departmentApi';
import { useAllCategoriesQuery } from '@/redux/features/category/categoryApi';
import { toast } from 'react-toastify';
import { FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import AZForm from '../../../shared/form/AZFrom';
import AZInput from '../../../shared/form/AZInput';
import AZSelect from '../../../shared/form/AZSelect';
import { productSchema } from '@/src/schema/Product';
import { TDepartment } from '@/src/types/department';
import { TCategory } from '@/src/types/category';
import { ChangeEvent, KeyboardEvent, useState, useMemo } from 'react';
import Image from 'next/image';

export interface CreateProductFormProps {
  onSuccess?: () => void;
}

const CreateProduct = ({ onSuccess }: CreateProductFormProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [featureInput, setFeatureInput] = useState<string>('');
  const [features, setFeatures] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [isBestSeller, setIsBestSeller] = useState<boolean>(false);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const { data: departmentsData, isLoading: isDeptLoading } = useAllDepartmentsQuery({
    limit: 0,
  });
  const { data: categoriesData, isLoading: isCatLoading } = useAllCategoriesQuery({
    limit: 0,
  });
  const router = useRouter();

  const departments: TDepartment[] = departmentsData?.data || [];
  const allCategories: TCategory[] = categoriesData?.data || [];

  const departmentOptions = useMemo(() => {
    return departments.map((dept: TDepartment) => ({
      key: dept._id,
      value: dept._id,
      label: `${dept.name}`,
    }));
  }, [departments]);

  const filteredCategories = useMemo(() => {
    if (!selectedDepartment) return allCategories;
    return allCategories.filter((cat: TCategory) => {
      const deptId =
        typeof cat.department === 'object' ? cat.department?._id : cat.department;
      return deptId === selectedDepartment;
    });
  }, [allCategories, selectedDepartment]);

  const categoryOptions = useMemo(() => {
    return filteredCategories.map((cat: TCategory) => ({
      key: cat._id,
      value: cat._id,
      label: `${cat.name}`,
    }));
  }, [filteredCategories]);

  // Feature item handlers
  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures((prev) => [...prev, trimmed]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  // Tag item handlers
  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (idx: number) => {
    setTags((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Product image size must be less than 5MB');
        return;
      }
      setImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  // onSubmit strictly constructs fields matching server TProduct interface
  const onSubmit = async (data: FieldValues) => {
    const finalFeatures =
      features.length > 0
        ? features
        : featureInput.trim()
          ? [featureInput.trim()]
          : [data.title.trim()];

    const finalTags =
      tags.length > 0
        ? tags
        : tagInput.trim()
          ? [tagInput.trim().toLowerCase()]
          : ['general', data.brand.trim().toLowerCase()];

    // Strictly fields defined on server TProduct:
    // department, category, title, features, thumbnail, brand, tags, isBestSeller
    const productData = {
      department: data.department,
      category: data.category,
      title: data.title.trim(),
      brand: data.brand.trim(),
      features: finalFeatures,
      tags: finalTags,
      isBestSeller: Boolean(isBestSeller),
    };

    const formData = new FormData();
    try {
      formData.append('data', JSON.stringify(productData));
      if (image) {
        formData.append('image', image);
      }
      const res = await createProduct(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message || 'Product created successfully!', {
          autoClose: 1000,
        });
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/admin/products');
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto text-slate-100">
      {/* Header */}
      <div className="text-center sm:text-left mb-6">
        <div className="badge badge-warning gap-1.5 px-3 py-1.5 text-xs font-black shadow mb-3 text-slate-950">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Catalog Governance</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span>Create Product</span>
        </h2>
        <p className="text-slate-400 text-xs mt-1.5">
          Register a new master product listing in the catalog
        </p>
      </div>

      {/* Form */}
      <AZForm
        resolver={zodResolver(productSchema)}
        onSubmit={onSubmit}
      >
        <div className="space-y-4">
          {/* Taxonomy: Department & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AZSelect
              label="Department"
              name="department"
              icon={<Building2 className="w-3.5 h-3.5 text-amber-400" />}
              size="sm"
              options={departmentOptions}
              placeholder="Select department"
              disabled={isDeptLoading}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              selectClassName="bg-[#120824] border-white/15 text-slate-200 focus:border-amber-400 rounded-xl text-xs"
            />
            <AZSelect
              label="Category"
              name="category"
              icon={<Layers className="w-3.5 h-3.5 text-sky-400" />}
              size="sm"
              options={categoryOptions}
              placeholder={
                !selectedDepartment
                  ? 'Select department first'
                  : 'Select category'
              }
              disabled={isCatLoading}
              selectClassName="bg-[#120824] border-white/15 text-slate-200 focus:border-amber-400 rounded-xl text-xs"
            />
          </div>

          {/* Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AZInput
              label="Product Title"
              name="title"
              type="text"
              size="sm"
              placeholder="e.g. Sony WH-1000XM5 Headphones"
              inputClassName="bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
            />
            <AZInput
              label="Brand Name"
              name="brand"
              type="text"
              size="sm"
              placeholder="e.g. Sony, Apple, Nike"
              inputClassName="bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
            />
          </div>

          {/* Product Image / Thumbnail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="form-control w-full">
              <label className="label mb-1">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Product Thumbnail
                </span>
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImage}
                className="file-input file-input-bordered w-full h-11 rounded-2xl bg-[#120824] border-white/15 text-slate-200 text-xs file:bg-amber-400 file:text-slate-950 file:border-none file:font-bold"
              />
            </div>

            <div className="form-control w-full">
              <label className="label mb-1">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Thumbnail Preview
                </span>
              </label>
              <div className="w-full h-11 rounded-2xl overflow-hidden">
                {imagePreview ? (
                  <div className="flex items-center gap-3 w-full h-full px-3 bg-[#120824] rounded-2xl border border-white/15">
                    <Image
                      src={imagePreview}
                      alt="Product thumbnail"
                      height={32}
                      width={32}
                      className="w-8 h-8 object-cover rounded-lg border border-amber-400/50 shrink-0"
                    />
                    <span className="text-xs text-slate-300 truncate font-medium">
                      {image?.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full px-3 bg-[#120824]/60 rounded-2xl border border-dashed border-white/15 text-slate-400 text-xs">
                    No image chosen
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Input & Badges */}
          <div className="space-y-1.5 pt-1">
            <label className="label py-0">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <ListCheck className="w-3.5 h-3.5 text-amber-400" />
                Key Product Features
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="e.g. 30-hour battery life with rapid charging"
                className="input input-sm flex-1 font-medium bg-[#120824] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="btn btn-sm btn-outline gap-1 font-bold border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-slate-950 rounded-xl transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto">
                {features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="badge gap-1.5 py-2.5 px-2.5 text-xs font-semibold bg-[#120824] border border-white/15 text-slate-200 rounded-lg"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="max-w-[200px] truncate">{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tags Input & Badges */}
          <div className="space-y-1.5">
            <label className="label py-0">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-sky-400" />
                Discovery Tags
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Type tag and press Enter (e.g. wireless, bluetooth)"
                className="input input-sm flex-1 font-medium bg-[#120824] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn btn-sm btn-outline gap-1 font-bold border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-slate-950 rounded-xl transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Tag
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="badge gap-1 py-2 px-2 text-[11px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded-lg"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="hover:text-rose-400 transition-colors ml-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Best Seller Toggle */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between mt-2">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                Mark as Best Seller
              </div>
              <p className="text-[10px] text-slate-400">
                Promote this product prominently across recommendations.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="toggle toggle-warning toggle-sm"
            />
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="mt-6">
          <button
            className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
            type="submit"
            disabled={isCreating}
          >
            {isCreating ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </AZForm>
    </div>
  );
};

export default CreateProduct;
export { CreateProduct as CreateProductModal };
