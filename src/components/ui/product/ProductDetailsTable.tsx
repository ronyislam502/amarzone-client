import React from "react";
import { TProduct, TVariant } from "@/types/product";

interface ProductDetailsTableProps {
  product: TProduct;
  selectedVariant?: TVariant;
}

export const ProductDetailsTable: React.FC<ProductDetailsTableProps> = ({
  product,
  selectedVariant,
}) => {
  const formattedDate = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "September 12, 2026";

  const specs = [
    { label: "Brand", value: product.brand || "Amarzone Basics" },
    { label: "Department", value: product.department?.name || "General" },
    { label: "Category", value: product.category?.name || "General" },
    { label: "ASIN", value: selectedVariant?.asin || "N/A" },
    { label: "Item model number / SKU", value: selectedVariant?.sku || "N/A" },
    {
      label: "Package Information",
      value:
        Array.isArray(selectedVariant?.attributes) && selectedVariant?.attributes.length > 0
          ? selectedVariant.attributes.map((a) => `${a.type}: ${a.value}`).join(", ")
          : "Standard Retail Packaging",
    },
    { label: "Date First Available", value: formattedDate },
    {
      label: "Manufacturer",
      value: product.brand ? `${product.brand} Consumer Products` : "Amarzone Certified Vendor",
    },
    {
      label: "Country of Origin",
      value: "Imported / Domestic",
    },
  ];

  return (
    <div className="py-6 border-b border-slate-200 select-none">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
        Product details
      </h2>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="table table-zebra w-full text-xs sm:text-sm">
          <tbody>
            {specs.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-100 last:border-none">
                <th className="bg-slate-50/80 w-1/3 sm:w-1/4 font-semibold text-slate-700 py-3 px-4">
                  {item.label}
                </th>
                <td className="text-slate-900 py-3 px-4 font-normal">
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetailsTable;
