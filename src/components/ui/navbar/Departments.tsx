import Link from "next/link";
import { ChevronDown } from "lucide-react";

const departments = [
    {
        name: "Electronics",
        href: "/electronics",
    },
    {
        name: "Fashion",
        href: "/fashion",
    },
    {
        name: "Home & Living",
        href: "/home-living",
    },
    {
        name: "Groceries",
        href: "/groceries",
    },
    {
        name: "Beauty",
        href: "/beauty",
    },
];

const Departments = () => {
    return (
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost">
                <h2 className="text-white text-md"> Departments</h2><ChevronDown className="w-4 h-4" />
            </div>
            <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow text-black">
                {departments?.map((department) => (
                    <li key={department.name}>
                        <Link href={department.href}>
                            {department.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>

    );
}


export default Departments;