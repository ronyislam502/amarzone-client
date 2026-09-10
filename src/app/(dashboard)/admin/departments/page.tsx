import DepartmentsBread from "@/src/components/ui/Dashboard/admin/departments/DepartmentsBread";
import DepartmentsData from "@/src/components/ui/Dashboard/admin/departments/DepartmentsData";
import DepartmentsHeader from "@/src/components/ui/Dashboard/admin/departments/DepartmentsHeader";
import DepartmentsStats from "@/src/components/ui/Dashboard/admin/departments/DepartmentsStats";

const Departments = () => {
    return (
        <div className="space-y-6 w-full pb-10">
            <DepartmentsBread />
            <DepartmentsHeader />
            <DepartmentsStats />
            <DepartmentsData />
        </div>
    );
};

export default Departments;
