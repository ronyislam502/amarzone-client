import {
    ShieldCheck,
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
    Lock,
    Key,
    Server,
} from "lucide-react";

export const superAdminSidebarItems = [
    {
        title: "Root Governance",
        items: [
            {
                label: "Super Admin Hub",
                href: "/super-admin",
                icon: ShieldCheck,
                iconClass: "text-secondary",
                exact: true,
                badge: {
                    text: "ROOT",
                    className: "badge-secondary",
                },
            },
            {
                label: "Admin Dashboard",
                href: "/admin",
                icon: LayoutDashboard,
                iconClass: "text-primary",
                exact: true,
            },
            {
                label: "System Analytics",
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
                    text: "99.9%",
                    className: "badge-success",
                },
            },
        ],
    },
    {
        title: "Platform Administration",
        items: [
            {
                label: "Admin Users & Staff",
                href: "/super-admin/admins",
                icon: User,
                iconClass: "text-secondary",
                badge: {
                    text: "Super",
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
                label: "All Products",
                href: "/admin/products",
                icon: ShoppingBag,
                iconClass: "text-primary",
            },
        ],
    },
    {
        title: "Finance & Disputes",
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
                label: "Disputes & SLA",
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
        title: "Security & System Config",
        items: [
            {
                label: "RBAC Permissions",
                href: "/super-admin/rbac",
                icon: Lock,
                iconClass: "text-secondary",
            },
            {
                label: "API Keys & Access",
                href: "/super-admin/api-keys",
                icon: Key,
                iconClass: "text-warning",
            },
            {
                label: "Server Logs",
                href: "/super-admin/logs",
                icon: Server,
                iconClass: "text-info",
            },
            {
                label: "System Settings",
                href: "/admin/settings",
                icon: Settings,
                iconClass: "text-base-content/70",
            },
        ],
    },
];
