import CustomersBread from "@/components/ui/dashboard/admin/customers/CustomersBread";
import CustomersData from "@/components/ui/dashboard/admin/customers/CustomersData";
import CustomersHeader from "@/components/ui/dashboard/admin/customers/CustomersHeader";

const Customers = () => {
    return (
        <div className="space-y-6">
            <CustomersBread />
            <CustomersHeader />
            <CustomersData />
        </div>
    );
};

export default Customers;