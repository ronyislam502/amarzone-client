import { ReactNode } from "react";
import { Users } from "lucide-react";
import Link from "next/link";

export type TBreadcrumbItem = {
  label: string;
  href?: string;
  icon?: ReactNode;
  hoverColor?: string;
};

export type TCustomersBreadProps = {
  title?: string;
  icon?: ReactNode;
  parentHref?: string;
  parentLabel?: string;
  hoverColor?: string;
  items?: TBreadcrumbItem[];
  className?: string;
};

const CustomersBread = ({
  title = "Customers Directory",
  icon = <Users className="w-3.5 h-3.5 text-info" />,
  parentHref = "/admin",
  parentLabel = "Admin Dashboard",
  hoverColor = "hover:text-info",
  items,
  className = "",
}: TCustomersBreadProps) => {
  return (
    <div className={`breadcrumbs text-xs text-base-content/70 ${className}`}>
      <ul>
        {items && items.length > 0 ? (
          items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li
                key={index}
                className={
                  isLast
                    ? "font-extrabold text-base-content flex items-center gap-1"
                    : ""
                }
              >
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={`${
                      item.hoverColor || hoverColor
                    } transition-colors flex items-center gap-1`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-1">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                )}
              </li>
            );
          })
        ) : (
          <>
            <li>
              <Link href={parentHref} className={`${hoverColor} transition-colors`}>
                {parentLabel}
              </Link>
            </li>
            <li className="font-extrabold text-base-content flex items-center gap-1">
              {icon}
              <span>{title}</span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export { CustomersBread as AZBreadcrumb, CustomersBread as Breadcrumb };
export default CustomersBread;
