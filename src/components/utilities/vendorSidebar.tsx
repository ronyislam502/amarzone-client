import {
    Store,
    ShoppingBag,
    PlusCircle,
    Layers,
    TrendingUp,
    Package,
    DollarSign,
    Settings,
    Activity,
    MessageSquare,
} from "lucide-react";

export const vendorSidebarItems = [
    {
        title: "Overview",
        items: [
            {
                label: "Vendor Dashboard",
                href: "/vendor",
                icon: Store,
                iconClass: "text-warning",
                exact: true,
            },
            {
                label: "Account Health",
                href: "/vendor/health",
                icon: Activity,
                iconClass: "text-emerald-400",
                badge: {
                    text: "SLA",
                    className: "badge-success badge-outline",
                },
            },
            {
                label: "Sales Analytics",
                href: "/vendor/analytics",
                icon: TrendingUp,
                iconClass: "text-success",
                exact: true,
                badge: {
                    text: "+18.4%",
                    className: "badge-success",
                },
            },
        ],
    },
    {
        title: "Product & Inventory",
        items: [
            {
                label: "My Products",
                href: "/vendor/products",
                icon: ShoppingBag,
                iconClass: "text-warning",
                badge: {
                    text: "128",
                    className: "badge-warning",
                },
            },
            {
                label: "Add Product",
                href: "/vendor/products/add",
                icon: PlusCircle,
                iconClass: "text-success",
            },
            {
                label: "Inventory & Stock",
                href: "/vendor/inventory",
                icon: Layers,
                iconClass: "text-accent",
                badge: {
                    text: "3 Low",
                    className: "badge-error",
                },
            },
        ],
    },
    {
        title: "Orders & Earnings",
        items: [
            {
                label: "Store Orders",
                href: "/vendor/orders",
                icon: Package,
                iconClass: "text-info",
                badge: {
                    text: "4 Unshipped",
                    className: "badge-info",
                },
            },
            {
                label: "Earnings & Payouts",
                href: "/vendor/payouts",
                icon: DollarSign,
                iconClass: "text-success",
                badge: {
                    text: "$12.4k",
                    className: "badge-success",
                },
            },
            {
                label: "Customer Messages",
                href: "/vendor/chat",
                icon: MessageSquare,
                iconClass: "text-primary",
            },
        ],
    },
    {
        title: "Store Config",
        items: [
            {
                label: "Store Profile",
                href: "/vendor/profile",
                icon: Store,
                iconClass: "text-warning",
            },
            {
                label: "Settings",
                href: "/vendor/settings",
                icon: Settings,
                iconClass: "text-base-content/70",
            },
        ],
    },
];
