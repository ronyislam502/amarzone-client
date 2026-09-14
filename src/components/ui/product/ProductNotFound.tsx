import React from "react";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export interface ProductNotFoundProps {
  errorMessage?: string;
}

export const ProductNotFound: React.FC<ProductNotFoundProps> = ({ errorMessage }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center font-sans">
      <div className="alert alert-error max-w-lg mx-auto shadow-md rounded-2xl p-6 text-left">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 shrink-0 text-error-content mt-0.5" />
          <div className="flex-1">
            <h3 className="font-extrabold text-lg text-error-content">Product Not Found</h3>
            <p className="text-sm mt-1 text-error-content/90">
              {errorMessage || "Unable to retrieve product details from database."}
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/"
                className="btn btn-sm bg-base-100 text-base-content border-none hover:bg-base-200 font-bold gap-1.5 shadow-xs"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductNotFound;
