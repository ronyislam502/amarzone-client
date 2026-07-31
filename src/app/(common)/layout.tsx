import React from "react";
import AmazonNavbar from "@/components/navbar/AmazonNavbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AmazonNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default layout;
