import DepartmentsBread from "@/src/components/ui/Dashboard/admin/departments/DepartmentsBread";
import DepartmentsData from "@/src/components/ui/Dashboard/admin/departments/DepartmentsData";
import DepartmentsHeader from "@/src/components/ui/Dashboard/admin/departments/DepartmentsHeader";
import DepartmentsStats from "@/src/components/ui/Dashboard/admin/departments/DepartmentsStats";

const Departments = () => {
    return (
        <div className="space-y-6 max-w-8xl mx-auto">
            <DepartmentsBread />
            <DepartmentsHeader />
            <DepartmentsStats />
            <DepartmentsData />
        </div>
    );
};

export default Departments;
