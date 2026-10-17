import { motion } from "framer-motion";
import {
    FiMenu,
    FiPlusCircle,
    FiBarChart2,
    FiSettings,
    FiArrowUpRight,
} from "react-icons/fi";

import { useAppSelector } from "../../../redux/hooks";

type DashboardTab = "overview" | "menu" | "add-items" | "sales" | "profile";

interface OverviewProps {
    onNavigate: (tab: DashboardTab) => void;
}

const Overview = ({ onNavigate }: OverviewProps) => {
    const restaurant = useAppSelector(
        (state) => state.restaurant.restaurant
    );

    const items = useAppSelector((state) => state.menuItem.items);

    const totalItems = items.length;
    const availableItems = items.filter((item) => item.isAvailable).length;
    const unavailableItems = totalItems - availableItems;

    const stats = [
        {
            label: "Total Menu Items",
            value: totalItems,
            description: "Items in your menu",
            icon: FiMenu,
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Available Items",
            value: availableItems,
            description: "Ready for customers",
            icon: FiPlusCircle,
            color: "bg-green-50 text-green-600",
        },
        {
            label: "Unavailable Items",
            value: unavailableItems,
            description: "Currently disabled",
            icon: FiBarChart2,
            color: "bg-amber-50 text-amber-600",
        },
    ];

    const shortcuts: {
        title: string;
        description: string;
        icon: typeof FiMenu;
        tab: DashboardTab;
    }[] = [
            {
                title: "Manage Menu",
                description: "View, edit, or remove existing items.",
                icon: FiMenu,
                tab: "menu",
            },
            {
                title: "Add Menu Item",
                description: "Add a new dish with its price and image.",
                icon: FiPlusCircle,
                tab: "add-items",
            },
            {
                title: "Sales Dashboard",
                description: "Review your restaurant sales information.",
                icon: FiBarChart2,
                tab: "sales",
            },
            {
                title: "Restaurant Profile",
                description: "Manage your restaurant details and status.",
                icon: FiSettings,
                tab: "profile",
            },
        ];

    return (
        <div className="space-y-8">
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-sm sm:p-8"
            >
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-orange-100">
                            Restaurant Dashboard
                        </p>

                        <h2 className="mt-2 text-3xl font-bold">
                            Welcome back{restaurant?.name ? `, ${restaurant.name}` : ""}!
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-orange-50">
                            Manage your restaurant menu and keep your business information
                            up to date from one place.
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <span
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${restaurant?.isOpen
                                    ? "bg-white text-green-700"
                                    : "bg-orange-100 text-orange-800"
                                    }`}
                            >
                                {restaurant?.isOpen ? "Restaurant Open" : "Restaurant Closed"}
                            </span>

                            {restaurant?.isVerified && (
                                <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white">
                                    Verified Restaurant
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onNavigate("add-items")}
                        className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                    >
                        <FiPlusCircle size={18} />
                        Add Menu Item
                    </button>
                </div>
            </motion.section>

            <section>
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                        Menu Overview
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        A quick summary of your current menu.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;

                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            {stat.label}
                                        </p>
                                        <p className="mt-3 text-3xl font-bold text-gray-900">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {stat.description}
                                        </p>
                                    </div>

                                    <div className={`rounded-xl p-3 ${stat.color}`}>
                                        <Icon size={22} />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            <section>
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                        Quick Actions
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Jump directly to the section you need.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {shortcuts.map((shortcut, index) => {
                        const Icon = shortcut.icon;

                        return (
                            <motion.button
                                key={shortcut.tab}
                                type="button"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.06 }}
                                onClick={() => onNavigate(shortcut.tab)}
                                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-orange-300 hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                                    <Icon size={22} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-gray-900">
                                        {shortcut.title}
                                    </h4>
                                    <p className="mt-1 text-sm leading-5 text-gray-500">
                                        {shortcut.description}
                                    </p>
                                </div>

                                <FiArrowUpRight
                                    className="shrink-0 text-gray-400 transition group-hover:text-orange-500"
                                    size={20}
                                />
                            </motion.button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Overview;