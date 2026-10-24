"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Share2, Search } from "lucide-react";
import { toast } from "react-toastify";

interface ProductImageGalleryProps {
  images?: string[] | string;
  thumbnail?: string;
  title: string;
  isBestSeller?: boolean;
  isPrivateLevel?: boolean;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  thumbnail,
  title,
}) => {
  // Normalize images: only use real images / thumbnail from database
  const normalizedImages: string[] = React.useMemo(() => {
    const list: string[] = [];

    if (Array.isArray(images) && images.length > 0) {
      images.forEach((img) => {
        if (typeof img === "string") {
          img.split(/\s+/).forEach((url) => {
            const trimmed = url.trim();
            if (trimmed && !list.includes(trimmed)) list.push(trimmed);
          });
        }
      });
    } else if (typeof images === "string" && images.trim()) {
      images.split(/\s+/).forEach((url) => {
        const trimmed = url.trim();
        if (trimmed && !list.includes(trimmed)) list.push(trimmed);
      });
    }

    if (thumbnail && thumbnail.trim() && !list.includes(thumbnail.trim())) {
      list.push(thumbnail.trim());
    }

    return list;
  }, [images, thumbnail]);

  const [activeIndex, setActiveIndex] = useState(0);

  // Reset to first image when variant images change
  React.useEffect(() => {
    setActiveIndex(0);
  }, [images, thumbnail]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: "center center",
    transform: "scale(1)",
  });

  const activeImage = normalizedImages[activeIndex] || normalizedImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)",
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  const handleToggleWishlist = () => {
    setIsWishlisted((prev) => !prev);
    toast.info(!isWishlisted ? "Added to your Wishlist" : "Removed from your Wishlist", {
      position: "bottom-right",
      autoClose: 1800,
    });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4 select-none">
      {/* Vertical Thumbnail Column */}
      {normalizedImages.length > 1 && (
        <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[580px] scrollbar-none py-0.5 shrink-0">
          {normalizedImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
                aria-label={`View product image ${idx + 1}`}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg p-1 transition-all duration-150 shrink-0 bg-white border cursor-pointer flex items-center justify-center ${
                  isActive
                    ? "border-[#e77600] ring-2 ring-[#e77600] shadow-xs"
                    : "border-slate-200 hover:border-slate-400 opacity-85 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="56px"
                  className="object-contain p-1 rounded-md"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image Container */}
      <div className="relative flex-1 bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col items-center justify-between min-h-[420px] sm:min-h-[480px] max-h-[580px] group">
        {/* Top Right Action Icons: Heart & Share */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Add to Wishlist"
            className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-rose-500 shadow-xs transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share product"
            className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Center Main Image Viewport with Hover Zoom */}
        <div
          className="relative w-full h-[360px] sm:h-[420px] flex items-center justify-center cursor-crosshair overflow-hidden rounded-xl"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {activeImage ? (
            <div
              className="relative w-full h-full transition-transform duration-100 ease-out flex items-center justify-center"
              style={zoomStyle}
            >
              <Image
                src={activeImage}
                alt={title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                className="object-contain p-2 select-none"
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
              <Search className="w-16 h-16 stroke-1 text-slate-300 mb-2" />
              <span className="text-xs text-slate-400">No image available</span>
            </div>
          )}
        </div>

        {/* Bottom Center Zoom Hint */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400 select-none pointer-events-none">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Roll over image to zoom in</span>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
