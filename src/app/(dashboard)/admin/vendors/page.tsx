import VendorsBread from "@/components/ui/dashboard/admin/vendors/VendorsBread";
import VendorsData from "@/components/ui/dashboard/admin/vendors/VendorsData";
import VendorsHeader from "@/components/ui/dashboard/admin/vendors/VendorsHeader";


const Vendors = () => {
    return (
        <div className="space-y-6">
            <VendorsBread />
            <VendorsHeader />
            <VendorsData />
        </div>
    );
};

export default Vendors;