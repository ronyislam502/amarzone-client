import React from "react";
import { Metadata } from "next";
import VendorProfileContainer from "@/src/components/ui/analistics/vendor/profile/VendorProfileContainer";

export const metadata: Metadata = {
  title: "Vendor Store Profile | Amarzone",
  description: "Manage merchant profile details, store branding, fulfillment information, and business credentials.",
};

const VendorProfilePage = () => {
  return <VendorProfileContainer />;
};

export default VendorProfilePage;
