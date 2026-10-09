import { ProductsPage } from "@/src/components/ui/products/ReusableProductsPage";

interface DepartmentPageProps {
  params: Promise<{ department: string }>;
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const resolvedParams = await params;
  const departmentSlug = resolvedParams?.department || "";

  return (
    <ProductsPage
      mode="department"
      departmentSlug={departmentSlug}
    />
  );
}
