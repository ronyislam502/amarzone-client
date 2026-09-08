import { Users } from "lucide-react";
import Link from "next/link";

const CustomersBread = () => {
  return (
    <div className="breadcrumbs text-xs text-base-content/70">
      <ul>
        <li>
          <Link href="/admin" className="hover:text-info transition-colors">
            Admin Dashboard
          </Link>
        </li>
        <li className="font-extrabold text-base-content flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-info" />
          <span>Customers Directory</span>
        </li>
      </ul>
    </div>
  );
};

export default CustomersBread;
