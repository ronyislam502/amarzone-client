import { Store } from "lucide-react";
import Link from "next/link";

const VendorsBread = () => {
  return (
    <div className="breadcrumbs text-xs text-base-content/70">
      <ul>
        <li>
          <Link href="/admin" className="hover:text-warning transition-colors">
            Admin Dashboard
          </Link>
        </li>
        <li className="font-extrabold text-base-content flex items-center gap-1">
          <Store className="w-3.5 h-3.5 text-warning" />
          <span>Vendors Directory</span>
        </li>
      </ul>
    </div>
  );
};

export default VendorsBread;
