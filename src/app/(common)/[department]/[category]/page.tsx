import { ProductsPage } from "@/src/components/ui/products/ReusableProductsPage";

interface CategoryProductsPageProps {
  params: Promise<{ department: string; category: string }>;
}

export default async function CategoryProductsPage({ params }: CategoryProductsPageProps) {
  const resolvedParams = await params;
  const departmentSlug = resolvedParams?.department || "";
  const categorySlug = resolvedParams?.category || "";

  return (
    <ProductsPage
      mode="category"
      departmentSlug={departmentSlug}
      categorySlug={categorySlug}
    />
  );
}
