"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, PlusCircle } from "lucide-react";
import CreateProductForm from "@/components/dashboard/admin/CreateProductForm";

const AdminCreateProductPage = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* DaisyUI Breadcrumbs */}
      <div className="breadcrumbs text-xs text-base-content/70">
        <ul>
          <li>
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className="hover:text-primary transition-colors flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-primary" />
              <span>Products</span>
            </Link>
          </li>
          <li className="font-extrabold text-base-content flex items-center gap-1">
            <PlusCircle className="w-3.5 h-3.5 text-primary" />
            <span>Create Product</span>
          </li>
        </ul>
      </div>

      {/* Main Create Product Form Component */}
      <CreateProductForm />
    </div>
  );
};

export default AdminCreateProductPage;
