import DepartmentsBread from "@/components/ui/dashboard/admin/departments/DepartmentsBread";
import DepartmentsData from "@/components/ui/dashboard/admin/departments/DepartmentsData";
import DepartmentsHeader from "@/components/ui/dashboard/admin/departments/DepartmentsHeader";


const Departments = () => {
    return (
        <div>
            <DepartmentsBread />
            <DepartmentsHeader />
            <DepartmentsData />
        </div>
    );
};

export default Departments;
