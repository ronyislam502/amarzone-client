"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Share2, ShieldCheck, ZoomIn, Check } from "lucide-react";
import { ProductGalleryProps } from "./types";
import { toast } from "react-toastify";

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  allImages,
  selectedImage,
  setSelectedImage,
  productTitle,
  isPrivateLevel,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.info(!isWishlisted ? "Saved to your list" : "Removed from list", {
      position: "bottom-right",
      autoClose: 1400,
    });
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!", {
        position: "bottom-right",
        autoClose: 1800,
      });
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4 items-start lg:sticky lg:top-6 select-none">
      {/* Thumbnails Rail: Vertical on tablet/desktop, horizontal on mobile */}
      <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[520px] shrink-0 no-scrollbar w-full md:w-auto pb-2 md:pb-0">
        {allImages.length > 0 ? (
          allImages.map((imgUrl, idx) => {
            const isSelected = selectedImage === imgUrl;
            return (
              <button
                key={idx}
                type="button"
                onMouseEnter={() => setSelectedImage(imgUrl)}
                onClick={() => setSelectedImage(imgUrl)}
                aria-label={`Select product image ${idx + 1}`}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl p-1.5 border-2 transition-all shrink-0 bg-white flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? "border-[#0071dc] shadow-sm ring-2 ring-blue-100 scale-102"
                    : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
              </button>
            );
          })
        ) : (
          <div className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
            <span className="text-[10px] text-slate-400">Default</span>
          </div>
        )}
      </div>

      {/* Main Showcase Image Stage */}
      <div className="flex-1 w-full flex flex-col items-center relative">
        <div
          className="w-full h-[380px] sm:h-[460px] lg:h-[520px] bg-white p-6 sm:p-8 flex items-center justify-center border border-slate-200/90 rounded-3xl relative group overflow-hidden shadow-2xs cursor-zoom-in"
          onClick={() => setIsZoomed(!isZoomed)}
        >
          {/* Floating Actions: Share & Heart */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              aria-label="Share product"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center border border-slate-200 shadow-2xs transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleWishlist();
              }}
              aria-label="Save to list"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center border border-slate-200 shadow-2xs transition-all"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-600 hover:text-rose-500"
                }`}
              />
            </button>
          </div>

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 bg-[#cc0000] text-white text-[11px] font-black px-2.5 py-1 rounded-sm uppercase tracking-tight shadow-xs">
              <span className="text-xs">↓</span>
              <span>Rollback</span>
            </span>

            {isPrivateLevel && (
              <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-sm shadow-xs">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Direct</span>
              </span>
            )}
          </div>

          {/* Image */}
          {selectedImage ? (
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt={productTitle}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className={`object-contain transition-transform duration-300 ${
                  isZoomed ? "scale-140" : "group-hover:scale-105"
                }`}
              />
            </div>
          ) : (
            <div className="text-slate-400 font-medium text-sm">No Image Available</div>
          )}

          {/* Zoom Hint Overlay */}
          <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>{isZoomed ? "Click to reset" : "Click to zoom"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
