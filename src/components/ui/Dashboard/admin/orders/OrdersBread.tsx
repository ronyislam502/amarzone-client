import React from "react";
import { ShoppingBag } from "lucide-react";
import CustomersBread from "../customers/CustomersBread";

export const OrdersBread: React.FC = () => {
  return (
    <CustomersBread
      title="Orders Management"
      icon={<ShoppingBag className="w-3.5 h-3.5 text-amber-400" />}
      hoverColor="hover:text-amber-400"
    />
  );
};

export default OrdersBread;
