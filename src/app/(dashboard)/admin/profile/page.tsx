import React from "react";
import { Metadata } from "next";
import AdminProfileContainer from "@/src/components/ui/analistics/admin/profile/AdminProfileContainer";

export const metadata: Metadata = {
  title: "Admin Profile | Amarzone",
  description: "Manage administrator profile details, security preferences, and administrative access.",
};

const AdminProfilePage = () => {
  return <AdminProfileContainer />;
};

export default AdminProfilePage;
