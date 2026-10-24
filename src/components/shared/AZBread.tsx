import { ReactNode } from "react";
import Link from "next/link";

export type TBreadcrumbItem = {
  label: string;
  href?: string;
  icon?: ReactNode;
  hoverColor?: string;
};

export type TBreadProps = {
  title?: string;
  icon?: ReactNode;
  parentHref?: string;
  parentLabel?: string;
  hoverColor?: string;
  items?: TBreadcrumbItem[];
  className?: string;
};

const AZBread = ({ title, icon, parentHref, parentLabel, hoverColor = "hover:text-primary", items, className = "", }: TBreadProps) => {
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
                    className={`${item.hoverColor || hoverColor
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
            {parentHref && parentLabel && (
              <li>
                <Link href={parentHref} className={`${hoverColor} transition-colors`}>
                  {parentLabel}
                </Link>
              </li>
            )} {title && (
              <li className="font-extrabold text-base-content flex items-center gap-1">
                {icon}
                <span>{title}</span>
              </li>
            )}
          </>
        )}
      </ul>
    </div>
  );
};


export default AZBread;