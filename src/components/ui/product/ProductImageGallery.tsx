"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Share2, ZoomIn } from "lucide-react";
import { toast } from "react-toastify";

interface ProductImageGalleryProps {
  images: string[] | string;
  thumbnail?: string;
  title: string;
  isBestSeller?: boolean;
  isPrivateLevel?: boolean;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  thumbnail,
  title,
  isBestSeller = false,
  isPrivateLevel = false,
}) => {
  // Normalize images: handles array of strings, space-separated string, or thumbnail fallback
  const normalizedImages: string[] = React.useMemo(() => {
    const list: string[] = [];

    if (Array.isArray(images)) {
      images.forEach((img) => {
        if (typeof img === "string") {
          // Some DB entries have space-separated URLs in an array element
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

    if (thumbnail && !list.includes(thumbnail)) {
      list.unshift(thumbnail);
    }

    return list.length > 0
      ? list
      : ["https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80"];
  }, [images, thumbnail]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: "center center",
    transform: "scale(1)",
  });
  const [isHovering, setIsHovering] = useState(false);

  const activeImage = normalizedImages[activeIndex] || normalizedImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.8)",
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
    toast.info(
      !isWishlisted ? "Added to your Wishlist" : "Removed from your Wishlist",
      { position: "bottom-right", autoClose: 1800 }
    );
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
    <div className="flex flex-col-reverse md:flex-row gap-3 sm:gap-4 select-none">
      {/* Thumbnail Strip (Left on md+, Bottom on mobile) */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[520px] scrollbar-thin py-1 shrink-0">
        {normalizedImages.map((img, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={`${img}-${idx}`}
              type="button"
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => setActiveIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg p-1 transition-all duration-150 shrink-0 bg-white border cursor-pointer ${
                isActive
                  ? "border-[#e77600] ring-2 ring-[#e77600]/30 shadow-xs"
                  : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-contain p-0.5 rounded"
              />
            </button>
          );
        })}
      </div>

      {/* Main Image Viewport with Hover Zoom */}
      <div className="relative flex-1 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 flex items-center justify-center min-h-[380px] sm:min-h-[460px] max-h-[560px] overflow-hidden group">
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {isBestSeller && (
            <div className="inline-flex items-center gap-1 bg-[#e77600] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-sm shadow-xs">
              <span>#1 Best Seller</span>
            </div>
          )}
          {isPrivateLevel && (
            <div className="inline-flex items-center gap-1 bg-slate-900 text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-sm">
              <span>Amarzone Brand</span>
            </div>
          )}
        </div>

        {/* Action icons: Wishlist & Share */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Add to Wishlist"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-rose-500 shadow-xs transition-colors cursor-pointer"
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
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Magnifier Viewport */}
        <div
          className="relative w-full h-[340px] sm:h-[420px] flex items-center justify-center cursor-crosshair overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="relative w-full h-full transition-transform duration-75 ease-out"
            style={zoomStyle}
          >
            <Image
              src={activeImage}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 35vw"
              className="object-contain select-none"
            />
          </div>

          {/* Hover zoom hint */}
          {!isHovering && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[11px] text-slate-400 bg-white/80 backdrop-blur-xs px-2 py-1 rounded-md border border-slate-200/60 pointer-events-none">
              <ZoomIn className="w-3 h-3" />
              <span>Roll over image to zoom in</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
