import {
    User,
    Package,
    Heart,
    Star,
    Wallet,
    Tag,
    CreditCard,
    MapPin,
    Bell,
    MessageSquare,
} from "lucide-react";

export const customerSidebarItems = [
    {
        title: "Main Dashboard",
        items: [
            {
                label: "Customer Hub",
                href: "/customer",
                icon: User,
                iconClass: "text-success",
                exact: true,
            },
            {
                label: "My Orders",
                href: "/customer/orders",
                icon: Package,
                iconClass: "text-info",
                badge: {
                    text: "2 Active",
                    className: "badge-info",
                },
            },
            {
                label: "Wishlist & Saved",
                href: "/customer/wishlist",
                icon: Heart,
                iconClass: "text-error",
                badge: {
                    text: "12",
                    className: "badge-error",
                },
            },
            {
                label: "My Reviews",
                href: "/customer/reviews",
                icon: Star,
                iconClass: "text-warning",
            },
        ],
    },
    {
        title: "Wallet & Payments",
        items: [
            {
                label: "Amarzone Wallet",
                href: "/customer/wallet",
                icon: Wallet,
                iconClass: "text-success",
                badge: {
                    text: "$450.00",
                    className: "badge-success",
                },
            },
            {
                label: "Coupons & Offers",
                href: "/customer/coupons",
                icon: Tag,
                iconClass: "text-secondary",
                badge: {
                    text: "3 Available",
                    className: "badge-secondary",
                },
            },
            {
                label: "Payment Methods",
                href: "/customer/payment-methods",
                icon: CreditCard,
                iconClass: "text-accent",
            },
        ],
    },
    {
        title: "Account & Preferences",
        items: [
            {
                label: "Profile Settings",
                href: "/customer/profile",
                icon: User,
                iconClass: "text-info",
            },
            // {
            //     label: "Saved Addresses",
            //     href: "/customer/addresses",
            //     icon: MapPin,
            //     iconClass: "text-warning",
            // },
            // {
            //     label: "Notifications",
            //     href: "/customer/notifications",
            //     icon: Bell,
            //     iconClass: "text-sky-400",
            //     badge: {
            //         text: "5 New",
            //         className: "badge-info",
            //     },
            // },
            {
                label: "Help & Support",
                href: "/customer/support",
                icon: MessageSquare,
                iconClass: "text-accent",
            },
        ],
    },
];
