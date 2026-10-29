import React, { Suspense } from "react";
import ProfilePage from "@/components/ui/profile/ProfilePage";
import AdminProfileSkeleton from "@/components/shared/skeleton/AdminProfileSkeleton";

const AdminProfile = () => {
    return (
        <div>
            <Suspense fallback={<AdminProfileSkeleton />}>
                <ProfilePage />
            </Suspense>
        </div>
    );
};

export default AdminProfile;
