import { ReactNode } from "react";
import { Building2 } from "lucide-react";
import CustomersBread, { TBreadcrumbItem } from "../customers/CustomersBread";

export interface DepartmentsBreadProps {
  title?: string;
  icon?: ReactNode;
  parentHref?: string;
  parentLabel?: string;
  hoverColor?: string;
  items?: TBreadcrumbItem[];
  className?: string;
}

const DepartmentsBread = ({
  title = "Department Management",
  icon = <Building2 className="w-3.5 h-3.5 text-primary" />,
  parentHref = "/admin",
  parentLabel = "Admin Dashboard",
  hoverColor = "hover:text-primary",
  items,
  className = "",
}: DepartmentsBreadProps = {}) => {
  return (
    <CustomersBread
      title={title}
      icon={icon}
      parentHref={parentHref}
      parentLabel={parentLabel}
      hoverColor={hoverColor}
      items={items}
      className={className}
    />
  );
};

export default DepartmentsBread;
