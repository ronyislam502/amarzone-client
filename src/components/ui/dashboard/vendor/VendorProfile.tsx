import React, { Suspense } from "react";
import ProfilePage from "@/components/ui/profile/ProfilePage";
import VendorProfileSkeleton from "@/components/shared/skeleton/VendorProfileSkeleton";

const VendorProfile = () => {
    return (
        <div>
            <Suspense fallback={<VendorProfileSkeleton />}>
                <ProfilePage />
            </Suspense>
        </div>
    );
};

export default VendorProfile;
