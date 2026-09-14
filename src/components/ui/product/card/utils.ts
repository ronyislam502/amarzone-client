import { ExtractedProductCardData } from "./types";

export function getRankStyle(rank: number) {
  if (rank === 1) return { bg: "bg-[#c45500]", text: "text-white" };
  if (rank <= 3) return { bg: "bg-[#e77600]", text: "text-white" };
  if (rank <= 10) return { bg: "bg-[#232f3e]", text: "text-[#febd69]" };
  return { bg: "bg-slate-600", text: "text-white" };
}

export function extractProductCardData(
  product: any,
  href?: string
): ExtractedProductCardData {
  const thumb =
    product?.variants?.[0]?.thumbnail ||
    product?.variants?.[0]?.images?.[0] ||
    "";
  const title = product?.title || product?.name || "Product";
  const price: number = product?.variants?.[0]?.price ?? 29.99;
  const rating: number = product?.averageRating ?? 4.5;
  const reviewCount: number =
    product?.reviewCount ?? 1250;
  const brand: string =
    product?.brand ||
    product?.variants?.[0]?.attributes?.find(
      (a: any) => a.name === "brand"
    )?.value ||
    "";
  const originalPrice = (price * 1.25).toFixed(2);
  const discountPct = Math.round(
    ((price * 1.25 - price) / (price * 1.25)) * 100
  );
  const productHref = href ?? `/product/${product?._id}`;

  return {
    thumb,
    title,
    price,
    rating,
    reviewCount,
    brand,
    originalPrice,
    discountPct,
    productHref,
  };
}
