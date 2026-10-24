"use client";

import { useState } from "react";
import AZHeader from "@/components/shared/AZHeader";
import { PlusCircle, Sparkles, Wand2 } from "lucide-react";
import AiCreateProduct from "./AiCreateProduct";

const ProductsHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AZHeader
                badgeLabel="Master Product Catalog"
                badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
                statusLabel="Live SKU & Variant Governance"
                title="Products"
                highlightTitle="Management"
                description="Govern master product listings, structure multi-attribute SKU variants, manage department classification, and curate discovery tags across the platform."
                onCreate={() => setIsOpen(true)}
                createLabel="Create Product"
                createIcon={<Wand2 className="w-4 h-4" />}
            />

            <AiCreateProduct
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};

export default ProductsHeader;