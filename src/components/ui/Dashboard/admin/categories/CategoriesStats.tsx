
import { FolderTree, Layers, ShoppingBag, Tag } from "lucide-react";

const CategoriesStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Stat 1: Total Categories */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-primary">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <FolderTree className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Total Categories</div>
          <div className="stat-value text-2xl text-primary">64</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            ↗︎ 8 new categories added
          </div>
        </div>
      </div>

      {/* Stat 2: Active Departments */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-success">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
              <Layers className="w-6 h-6 text-success" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Departments Mapped</div>
          <div className="stat-value text-2xl text-success">12</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            100% active coverage
          </div>
        </div>
      </div>

      {/* Stat 3: Total Products Linked */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-warning">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center border border-warning/20">
              <ShoppingBag className="w-6 h-6 text-warning" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Linked Products</div>
          <div className="stat-value text-2xl text-warning">18,420</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            Active merchandise listings
          </div>
        </div>
      </div>

      {/* Stat 4: Catalog Compliance */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <Tag className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Taxonomy Status</div>
          <div className="stat-value text-2xl text-secondary">99.4%</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            Optimal SEO indexing
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesStats;
