import { UserCheck } from "lucide-react";
import Link from "next/link";

const AdminsBread = () => {
  return (
    <div className="breadcrumbs text-xs text-base-content/70">
      <ul>
        <li>
          <Link href="/admin" className="hover:text-secondary transition-colors">
            Admin Dashboard
          </Link>
        </li>
        <li className="font-extrabold text-base-content flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-secondary" />
          <span>Admins & Staff Directory</span>
        </li>
      </ul>
    </div>
  );
};

export default AdminsBread;
