import AdminsBread from "@/components/ui/dashboard/admin/admins/AdminsBread";
import AdminsData from "@/components/ui/dashboard/admin/admins/AdminsData";
import AdminsHeader from "@/components/ui/dashboard/admin/admins/AdminsHeader";

const Admins = () => {
    return (
        <div>
            <AdminsBread />
            <AdminsHeader />
            <AdminsData />
        </div>
    );
};

export default Admins;