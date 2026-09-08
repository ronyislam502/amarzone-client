import { redirect } from "next/navigation";

export default function DepartmentRedirect() {
    redirect("/admin/departments");
}
