import {
    LayoutDashboard,
    Store,
    Users,
    ShoppingBag,
    Layers,
    DollarSign,
    ShieldAlert,
    BarChart3,
    Settings,
    Activity,
    User,
    UserCheck,
} from "lucide-react";

export const adminSidebarItems = [
    {
        title: "Main Overview",
        items: [
            {
                label: "Admin Dashboard",
                href: "/admin",
                icon: LayoutDashboard,
                iconClass: "text-primary",
                exact: true,
            },
            {
                label: "Vendor Dashboard",
                href: "/vendor",
                icon: Store,
                iconClass: "text-warning",
                exact: true,
            },
            {
                label: "User Dashboard",
                href: "/customer",
                icon: User,
                iconClass: "text-info",
                exact: true,
                badge: {
                    text: "New",
                    className: "badge-info",
                },
            },
            {
                label: "Analytics",
                href: "/admin/analytics",
                icon: BarChart3,
                iconClass: "text-secondary",
                exact: true,
            },
            {
                label: "System Health",
                href: "/admin/health",
                icon: Activity,
                iconClass: "text-success",
                exact: true,
                badge: {
                    text: "99.8%",
                    className: "badge-success",
                },
            },
        ],
    },

    {
        title: "Management",
        items: [
            {
                label: "Admins & Staff",
                href: "/admin/admins",
                icon: UserCheck,
                iconClass: "text-secondary",
                badge: {
                    text: "Staff",
                    className: "badge-secondary",
                },
            },
            {
                label: "Vendors",
                href: "/admin/vendors",
                icon: Store,
                iconClass: "text-warning",
                badge: {
                    text: "12 New",
                    className: "badge-warning",
                },
            },
            {
                label: "Customers",
                href: "/admin/customers",
                icon: Users,
                iconClass: "text-info",
            },
            {
                label: "Categories",
                href: "/admin/categories",
                icon: Layers,
                iconClass: "text-accent",
            },
            {
                label: "Products",
                href: "/admin/products",
                icon: ShoppingBag,
                iconClass: "text-primary",
            },
        ],
    },

    {
        title: "Finance & SLA",
        items: [
            {
                label: "Payout Requests",
                href: "/admin/payouts",
                icon: DollarSign,
                iconClass: "text-success",
                badge: {
                    text: "5 Pending",
                    className: "badge-info",
                },
            },
            {
                label: "Disputes",
                href: "/admin/disputes",
                icon: ShieldAlert,
                iconClass: "text-error",
                badge: {
                    text: "3 Open",
                    className: "badge-error",
                },
            },
        ],
    },

    {
        title: "System Config",
        items: [
            {
                label: "Settings",
                href: "/admin/settings",
                icon: Settings,
                iconClass: "text-base-content/70",
            },
        ],
    },
];