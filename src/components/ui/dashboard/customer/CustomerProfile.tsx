import React, { Suspense } from "react";
import ProfilePage from "@/components/ui/profile/ProfilePage";
import CustomerProfileSkeleton from "@/components/shared/skeleton/CustomerProfileSkeleton";

const CustomerProfile = () => {
    return (
        <div>
            <Suspense fallback={<CustomerProfileSkeleton />}>
                <ProfilePage />
            </Suspense>
        </div>
    );
};

export default CustomerProfile;
