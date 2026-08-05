"use client";

import React, { useState } from "react";
import { Search, Plus, Store, AlertCircle, ArrowLeft, Layers } from "lucide-react";

interface TVariantAttribute {
  type: string;
  value: string;
}

interface TVariant {
  asin: string;
  sku: string;
  attributes: TVariantAttribute[];
  thumbnail: string;
  images: string[];
}

interface TCategory {
  _id: string;
  name: string;
}

interface TParentProduct {
  _id: string;
  title: string;
  brand: string;
  description: string;
  department?: { name: string };
  category?: TCategory | string;
  variants: TVariant[];
}

export default function VendorListProductPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TParentProduct[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  // Selected state for inventory / new variant modal
  const [selectedProduct, setSelectedProduct] = useState<TParentProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<TVariant | null>(null);
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  // Variant attributes state (Key-Value pairs)
  const [attributes, setAttributes] = useState<TVariantAttribute[]>([
    { type: "Color", value: "" },
    { type: "Size", value: "" },
  ]);

  // Form states for Inventory
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shippingTime, setShippingTime] = useState("2");
  const [inventoryMessage, setInventoryMessage] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearched(true);
    fetch(`http://localhost:9000/api/v1/products/search-catalog?query=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSearchResults(data.data || []);
        }
      })
      .catch((err) => console.error("Search failed:", err))
      .finally(() => setSearching(false));
  };

  const handleListExistingVariant = (product: TParentProduct, variant: TVariant) => {
    setSelectedProduct(product);
    setSelectedVariant(variant);
    setIsAddingVariant(false);
    setInventoryMessage("");
  };

  const handleOpenAddVariant = (product: TParentProduct) => {
    setSelectedProduct(product);
    setSelectedVariant(null);
    setIsAddingVariant(true);
    setAttributes([
      { type: "Color", value: "" },
      { type: "Size", value: "" },
    ]);
  };

  const handleAddAttributeRow = () => {
    setAttributes([...attributes, { type: "", value: "" }]);
  };

  const handleRemoveAttributeRow = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, field: "type" | "value", val: string) => {
    const updated = [...attributes];
    updated[index][field] = val;
    setAttributes(updated);
  };

  const handleAddVariantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const validAttributes = attributes.filter(
      (a) => a.type.trim() !== "" && a.value.trim() !== ""
    );

    fetch(`http://localhost:9000/api/v1/products/${selectedProduct._id}/add-variant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attributes: validAttributes,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("New Variant added successfully!");
          setIsAddingVariant(false);
          setSelectedProduct(data.data);
        } else {
          alert(`Failed: ${data.message}`);
        }
      })
      .catch(() => alert("Error connecting to server."));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-slate-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Vendor Product Listing Workflow</h1>
        <p className="text-xs text-slate-500 mt-1">
          Search the catalog to prevent product duplication before listing your inventory.
        </p>
      </div>

      {/* Step 1: Catalog Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-8">
        <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-amber-500" /> Step 1: Search Product Catalog
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search by Product Name, Brand, ASIN, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            {searching ? "Searching..." : "Search Catalog"}
          </button>
        </form>
      </div>

      {/* Step 2: Search Results */}
      {searched && (
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-semibold text-slate-700">
            Catalog Results ({searchResults.length})
          </h3>

          {searchResults.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-xs text-amber-800">
              <AlertCircle className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="font-semibold text-sm">No Existing Parent Product Found</p>
              <p className="mt-1">Create a new Parent Product and its first variant to start selling.</p>
              <button
                onClick={() => alert("Redirect to Create New Product form")}
                className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create New Parent Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {searchResults.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between gap-4"
                >
                  <div>
                    <span className="text-xs uppercase font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      {prod.brand}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{prod.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{prod.description}</p>
                    
                    {/* Existing Variants list */}
                    <div className="mt-3">
                      <span className="text-xs font-medium text-slate-600">
                        Existing Variants ({prod.variants?.length || 0}):
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {prod.variants?.map((v) => (
                          <div
                            key={v.asin}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs flex items-center justify-between gap-3"
                          >
                            <div>
                              <span className="font-semibold text-slate-800">ASIN: {v.asin}</span>
                              <span className="text-slate-400 block text-[10px]">
                                {v.attributes?.map((a) => `${a.type}: ${a.value}`).join(", ") || v.sku}
                              </span>
                            </div>
                            <button
                              onClick={() => handleListExistingVariant(prod, v)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md"
                            >
                              Sell This
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-start">
                    <button
                      onClick={() => handleOpenAddVariant(prod)}
                      className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New Variant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3 (Option B): Add New Variant Modal */}
      {selectedProduct && isAddingVariant && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" /> Add New Variant for "{selectedProduct.title}"
            </h3>
            <button
              onClick={() => setIsAddingVariant(false)}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>

          <form onSubmit={handleAddVariantSubmit} className="space-y-4 text-xs">
            <div className="space-y-3">
              <label className="block font-semibold text-slate-700">Variant Attributes</label>
              {attributes.map((attr, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Attribute Type (e.g. Color, RAM)"
                    value={attr.type}
                    onChange={(e) => handleAttributeChange(idx, "type", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Attribute Value (e.g. Black, 8GB)"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(idx, "value", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  {attributes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAttributeRow(idx)}
                      className="text-red-500 font-bold px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddAttributeRow}
                className="text-amber-600 font-semibold text-xs flex items-center gap-1 hover:underline"
              >
                + Add Attribute Pair
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-xs"
              >
                Create Variant & Generate ASIN
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3 (Option A): Create Inventory Form for selected variant */}
      {selectedProduct && selectedVariant && !isAddingVariant && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-500" /> Create Inventory Listing
            </h3>
            <button
              onClick={() => setSelectedVariant(null)}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl mb-4 text-xs">
            <p className="font-semibold text-slate-800">{selectedProduct.title}</p>
            <p className="text-slate-500">
              Variant ASIN: {selectedVariant.asin} | SKU: {selectedVariant.sku}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(`Listing submitted for ASIN ${selectedVariant.asin} at $${price}`);
            }}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Price ($)</label>
                <input
                  type="number"
                  required
                  placeholder="299.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity in Stock</label>
                <input
                  type="number"
                  required
                  placeholder="50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shipping Time (Days)</label>
                <input
                  type="number"
                  required
                  value={shippingTime}
                  onChange={(e) => setShippingTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-xs"
            >
              Publish Inventory Listing
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
