import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";

export interface ProductCardThumbnailProps {
  thumb?: string;
  title: string;
  productHref: string;
  viewMode?: "grid" | "list";
}

export default function ProductCardThumbnail({
  thumb,
  title,
  productHref,
  viewMode = "grid",
}: ProductCardThumbnailProps) {
  if (viewMode === "list") {
    return (
      <Link href={productHref} className="shrink-0">
        <div className="w-36 h-36 bg-base-200 border border-base-300 flex items-center justify-center p-2 overflow-hidden rounded-sm">
          {thumb ? (
            <Image
              src={thumb}
              alt={title}
              width={120}
              height={120}
              className="object-contain max-h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Package className="w-10 h-10 text-slate-200" />
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={productHref} className="block">
      <div className="h-36 bg-base-200 flex items-center justify-center p-3 overflow-hidden">
        {thumb ? (
          <Image
            src={thumb}
            alt={title}
            width={120}
            height={120}
            className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Package className="w-10 h-10 text-slate-200" />
        )}
      </div>
    </Link>
  );
}
