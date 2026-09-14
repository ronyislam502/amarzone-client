
import { Metadata } from "next";
import CustomerProfileContainer from "@/src/components/ui/Dashboard/customer/profile/CustomerProfileContainer";

export const metadata: Metadata = {
  title: "Customer Profile | Amarzone",
  description: "Manage customer profile details, delivery addresses, and account preferences.",
};

const CustomerProfilePage = () => {
  return <CustomerProfileContainer />;
};

export default CustomerProfilePage;
