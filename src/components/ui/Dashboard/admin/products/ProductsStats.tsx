import { ShoppingBag, Boxes, Flame, Star } from "lucide-react";

interface ProductsStatsProps {
  totalProducts?: number;
  totalVariants?: number;
  bestSellerCount?: number;
  avgRating?: number;
}

const ProductsStats = ({
  totalProducts = 0,
  totalVariants = 0,
  bestSellerCount = 0,
  avgRating = 4.8,
}: ProductsStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Stat 1: Total Catalog Items */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-primary">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Total Products</div>
          <div className="stat-value text-2xl text-primary">{totalProducts}</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            ↗︎ Active catalog items
          </div>
        </div>
      </div>

      {/* Stat 2: Product Variants */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <Boxes className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Product Variants</div>
          <div className="stat-value text-2xl text-secondary">
            {totalVariants}
          </div>
          <div className="stat-desc font-bold text-secondary flex items-center gap-1 mt-1">
            Active SKU attributes & options
          </div>
        </div>
      </div>

      {/* Stat 3: Best Sellers */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-warning">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center border border-warning/20">
              <Flame className="w-6 h-6 text-warning" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Best Sellers</div>
          <div className="stat-value text-2xl text-warning">
            {bestSellerCount}
          </div>
          <div className="stat-desc font-bold text-warning flex items-center gap-1 mt-1">
            High velocity merchandise
          </div>
        </div>
      </div>

      {/* Stat 4: Catalog Quality */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-accent">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Star className="w-6 h-6 text-accent fill-accent" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Customer Rating</div>
          <div className="stat-value text-2xl text-accent">{avgRating.toFixed(1)} ★</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            Based on verified reviews
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsStats;
