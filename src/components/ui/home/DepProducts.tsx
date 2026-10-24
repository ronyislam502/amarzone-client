
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAllProductsByDepartmentQuery } from "@/redux/features/product/productApi";
import { PRODUCT_PLACEHOLDER } from "@/lib/constants";

const ProductThumbnail = ({ src, alt }: { src?: string; alt?: string }) => {
    const [imgSrc, setImgSrc] = useState(src || PRODUCT_PLACEHOLDER);

    useEffect(() => {
        setImgSrc(src || PRODUCT_PLACEHOLDER);
    }, [src]);

    return (
        <Image
            src={imgSrc}
            alt={alt || "Product"}
            fill
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 10vw"
            className="object-contain transition-transform duration-200 group-hover:scale-105"
            loading="eager"
            unoptimized
            onError={() => setImgSrc(PRODUCT_PLACEHOLDER)}
        />
    );
};

const DepartmentProducts = ({ department, departmentSlug }: any) => {
    const { data: productsData } = useAllProductsByDepartmentQuery(department?._id);

    const products = productsData?.data?.slice(0, 4) || [];

    return (
        <div className="my-3.5 grid grid-cols-2 gap-2.5">
            {products.map((product: any) => (
                <Link
                    key={product?._id || product?.id}
                    href={`/products/${product._id || product.id}`}
                    className="group flex flex-col items-start rounded-xl bg-slate-50/60 p-2 transition-colors hover:bg-slate-100/70"
                >
                    {/* Product Image */}
                    <div className="relative mb-1.5 aspect-square w-full overflow-hidden rounded-lg bg-white p-1">
                        <ProductThumbnail
                            src={product?.thumbnail}
                            alt={product?.title}
                        />
                    </div>
                    {/* Product Title */}
                    <span className="w-full truncate text-[10px] text-slate-600 group-hover:text-[#0071dc]">
                        {product.title}
                    </span>
                </Link>
            ))}
        </div>
    );
};

export default DepartmentProducts;