import Link from "next/link";
import { ChevronDown } from "lucide-react";

const services = [
    {
        name: "Delivery",
        href: "/delivery",
    },
    {
        name: "Track Order",
        href: "/tracking",
    },
    {
        name: "Customer Support",
        href: "/support",
    },
];

const Services = () => {
    return (
        <div className="dropdown dropdown-end lg:dropdown-bottom">
            <div tabIndex={0} role="button" className="btn btn-sm sm:btn-md btn-ghost text-white hover:bg-white/10 font-medium rounded-full cursor-pointer flex items-center gap-1">
                <span>Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/80" />
            </div>
            <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
            >
                {services.map((service) => (
                    <li key={service.name}>
                        <Link href={service.href}>
                            {service.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Services;
