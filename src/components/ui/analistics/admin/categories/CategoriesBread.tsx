import { FolderTree } from "lucide-react";
import CustomersBread from "../customers/CustomersBread";

const CategoriesBread = () => {
  return (
    <CustomersBread
      title="Category Catalog"
      icon={<FolderTree className="w-3.5 h-3.5 text-primary" />}
      hoverColor="hover:text-primary"
    />
  );
};

export default CategoriesBread;