import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiHome,
    FiGrid,
    FiPlusCircle,
    FiBarChart2,
    FiSettings,
    FiMenu,
    FiX,
    FiLogOut,
    FiChevronRight,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";
import { BiRestaurant } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
    fetchRestaurant,
} from "../../redux/slices/Restaurant/restaurantSlice";

import {
    fetchMenuItems,
} from "../../redux/slices/Menu/menuItemSlice";

import AddRestaurant from "./AddRestaurant";
import RestaurantProfile from "./RestaurantProfile";
import Overview from "./sections/Overview";
import AddItemsSection from "./sections/AddItemsSection";
import MenuSections from "./sections/MenuSections";
import SalesSection from "./sections/SalesSection";

type DashboardTab =
    | "overview"
    | "menu"
    | "add-items"
    | "sales"
    | "profile";

const navigation: {
    id: DashboardTab;
    label: string;
    description: string;
    icon: typeof FiHome;
}[] = [
        {
            id: "overview",
            label: "Overview",
            description: "Dashboard summary",
            icon: FiHome,
        },
        {
            id: "menu",
            label: "Menu Management",
            description: "Manage your dishes",
            icon: FiGrid,
        },
        {
            id: "add-items",
            label: "Add Menu Item",
            description: "Expand your menu",
            icon: FiPlusCircle,
        },
        {
            id: "sales",
            label: "Sales & Analytics",
            description: "Track performance",
            icon: FiBarChart2,
        },
        {
            id: "profile",
            label: "Restaurant Profile",
            description: "Business information",
            icon: FiSettings,
        },
    ];

export default function Restaurant() {
    const dispatch = useAppDispatch();

    const restaurant = useAppSelector(
        (state) => state.restaurant.restaurant
    );

    const restaurantLoading = useAppSelector(
        (state) => state.restaurant.loading
    );

    const restaurantError = useAppSelector(
        (state) => state.restaurant.error
    );

    const menuItems = useAppSelector(
        (state) => state.menuItem.items
    );

    const [activeTab, setActiveTab] =
        useState<DashboardTab>("overview");

    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchRestaurant());
    }, [dispatch]);

    useEffect(() => {
        if (restaurant?._id) {
            dispatch(fetchMenuItems(restaurant._id));
        }
    }, [dispatch, restaurant?._id]);

    const handleNavigate = (tab: DashboardTab) => {
        setActiveTab(tab);
        setSidebarOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const pageTitles: Record<DashboardTab, string> = {
        overview: "Dashboard Overview",
        menu: "Menu Management",
        "add-items": "Add Menu Item",
        sales: "Sales & Analytics",
        profile: "Restaurant Profile",
    };

    const availableItems = menuItems.filter(
        (item) => item.isAvailable
    ).length;

    const unavailableItems = menuItems.length - availableItems;

    // Show the restaurant registration form if the owner
    // has not registered a restaurant yet.
    if (!restaurantLoading && !restaurant && !restaurantError) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-2xl">🍅</span>
                            <span className="text-xl font-extrabold text-gray-900">
                                Tomato<span className="text-orange-500">.</span>
                            </span>
                        </Link>

                        <Link
                            to="/account"
                            className="text-sm font-semibold text-gray-600 hover:text-orange-600"
                        >
                            My Account
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                    <div className="mb-8 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                            <BiRestaurant className="text-3xl text-orange-600" />
                        </div>

                        <h1 className="mt-5 text-3xl font-black text-gray-900">
                            Set up your restaurant
                        </h1>

                        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
                            Create your restaurant profile to start adding menu items
                            and managing your business on Tomato.
                        </p>
                    </div>

                    <AddRestaurant />
                </main>
            </div>
        );
    }

    if (restaurantLoading && !restaurant) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
                    <p className="mt-4 text-sm font-medium text-gray-600">
                        Loading your restaurant dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (restaurantError && !restaurant) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <FiAlertCircle className="mx-auto text-4xl text-red-500" />
                    <h2 className="mt-4 text-xl font-bold text-gray-900">
                        Unable to load your restaurant
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        {restaurantError}
                    </p>
                    <button
                        type="button"
                        onClick={() => dispatch(fetchRestaurant())}
                        className="mt-6 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-gray-950/40 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl">🍅</span>
                        <span className="text-xl font-extrabold text-gray-900">
                            Tomato<span className="text-orange-500">.</span>
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <FiX className="text-xl" />
                    </button>
                </div>

                {/* Restaurant card */}
                <div className="mx-4 mt-5 rounded-2xl bg-orange-50 p-4">
                    <div className="flex items-center gap-3">
                        {restaurant?.image ? (
                            <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="h-12 w-12 rounded-xl border border-white object-cover"
                            />
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl">
                                🍽️
                            </div>
                        )}

                        <div className="min-w-0 flex-1">
                            <p className="truncate font-bold text-gray-900">
                                {restaurant?.name || "My Restaurant"}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5">
                                <span
                                    className={`h-2 w-2 rounded-full ${restaurant?.isOpen
                                        ? "bg-green-500"
                                        : "bg-gray-400"
                                        }`}
                                />
                                <span className="text-xs text-gray-600">
                                    {restaurant?.isOpen ? "Currently open" : "Currently closed"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-2 pt-7">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Workspace
                    </p>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const active = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleNavigate(item.id)}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active
                                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                                    }`}
                            >
                                <Icon className="shrink-0 text-xl" />

                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-semibold">
                                        {item.label}
                                    </span>
                                    <span
                                        className={`mt-0.5 block text-xs ${active ? "text-orange-100" : "text-gray-400"
                                            }`}
                                    >
                                        {item.description}
                                    </span>
                                </span>

                                {active && <FiChevronRight />}
                            </button>
                        );
                    })}
                </nav>

                <div className="border-t border-gray-100 p-4">
                    <Link
                        to="/account"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <FiLogOut className="text-lg" />
                        Account & Settings
                    </Link>

                    <Link
                        to="/"
                        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <FiHome className="text-lg" />
                        Customer Homepage
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="min-h-screen lg:pl-72">
                {/* Top bar */}
                <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-xl">
                    <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-xl border border-gray-200 p-2.5 text-gray-700 hover:bg-gray-50 lg:hidden"
                                aria-label="Open sidebar"
                            >
                                <FiMenu className="text-xl" />
                            </button>

                            <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-400">
                                    Restaurant workspace
                                </p>
                                <h1 className="truncate text-lg font-extrabold text-gray-900 sm:text-xl">
                                    {pageTitles[activeTab]}
                                </h1>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-bold text-gray-800">
                                    {restaurant?.name}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Restaurant owner
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                <BiRestaurant className="text-xl" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    {/* Welcome banner */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "overview" && (
                            <div className="mb-7 overflow-hidden rounded-2xl bg-gradient-to-r from-gray-950 to-gray-800 p-6 text-white sm:p-8">
                                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                                    <div>
                                        <p className="text-sm font-semibold text-orange-300">
                                            YOUR RESTAURANT AT A GLANCE
                                        </p>
                                        <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                                            Welcome back, {restaurant?.name || "Restaurant Owner"}!
                                        </h2>
                                        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300">
                                            Manage your menu, keep availability up to date, and
                                            review your restaurant's performance.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleNavigate("add-items")}
                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                                    >
                                        <FiPlusCircle />
                                        Add Menu Item
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Quick statistics */}
                        {activeTab === "overview" && (
                            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <StatCard
                                    label="Total Menu Items"
                                    value={menuItems.length}
                                    detail="Items in your menu"
                                    icon={<FiGrid />}
                                />
                                <StatCard
                                    label="Available Items"
                                    value={availableItems}
                                    detail="Currently available"
                                    icon={<FiCheckCircle />}
                                />
                                <StatCard
                                    label="Unavailable Items"
                                    value={unavailableItems}
                                    detail="Currently unavailable"
                                    icon={<FiAlertCircle />}
                                />
                            </div>
                        )}

                        {/* Existing dashboard sections */}
                        <section className="min-w-0">
                            {activeTab === "overview" && (
                                <Overview onNavigate={handleNavigate} />
                            )}

                            {activeTab === "menu" && <MenuSections />}

                            {activeTab === "add-items" && <AddItemsSection />}

                            {activeTab === "sales" && <SalesSection />}

                            {activeTab === "profile" && <RestaurantProfile />}
                        </section>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    detail,
    icon,
}: {
    label: string;
    value: number;
    detail: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="mt-3 text-3xl font-black text-gray-900">{value}</p>
                    <p className="mt-2 text-xs text-gray-500">{detail}</p>
                </div>

                <div className="rounded-xl bg-orange-50 p-3 text-xl text-orange-600">
                    {icon}
                </div>
            </div>
        </div>
    );
}
