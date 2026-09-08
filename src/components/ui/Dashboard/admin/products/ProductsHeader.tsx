import { Download, Sparkles } from "lucide-react";

export interface ProductsHeaderProps {
    onExportCsv?: () => void;
    onAddProduct?: () => void;
}

const ProductsHeader = ({ onExportCsv, onAddProduct }: ProductsHeaderProps) => {
    return (
        <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="badge badge-primary gap-1 px-3 py-2 text-xs font-black shadow">
                            <Sparkles className="w-3.5 h-3.5" />
                            Master Product Catalog
                        </span>
                        <span className="badge badge-secondary badge-outline gap-1 font-bold text-xs">
                            <span className="w-2 h-2 rounded-full bg-secondary" />
                            SKU & Variant Governance
                        </span>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight">
                        Products <span className="text-primary">Catalog</span>
                    </h1>
                    <p className="text-base-content/70 text-xs sm:text-sm max-w-2xl">
                        Govern master product listings, create multi-attribute SKU variants, manage department classification, and evaluate product ratings.
                    </p>
                </div>

                {/* Header Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={onExportCsv}
                        className="btn btn-outline btn-sm gap-2 cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductsHeader;
