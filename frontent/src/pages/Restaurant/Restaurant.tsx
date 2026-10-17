import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FiGrid,
    FiMenu,
    FiPlusCircle,
    FiBarChart2,
    FiSettings,
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchRestaurant } from "../../redux/slices/Restaurant/restaurantSlice";

import AddRestaurant from "./AddRestaurant";
import RestaurantProfile from "./RestaurantProfile";
import AddItemsSection from "./sections/AddItemsSection";
import MenuSections from "./sections/MenuSections";
import SalesSection from "./sections/SalesSection";
import Overview from "./sections/Overview";

type TabType = "overview" | "menu" | "add-items" | "sales" | "profile";

const tabs = [
    { id: "overview", label: "Overview", icon: FiGrid },
    { id: "menu", label: "Menu Items", icon: FiMenu },
    { id: "add-items", label: "Add Items", icon: FiPlusCircle },
    { id: "sales", label: "Sales", icon: FiBarChart2 },
    { id: "profile", label: "Restaurant Profile", icon: FiSettings },
] as const;

const Restaurant = () => {
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    const { restaurant, loading, error } = useAppSelector(
        (state) => state.restaurant
    );

    useEffect(() => {
        dispatch(fetchRestaurant());
    }, [dispatch]);

    if (loading && !restaurant) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
        );
    }

    if (error && !restaurant) {
        return (
            <div className="mx-auto mt-10 max-w-xl rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <h2 className="text-lg font-semibold text-red-700">
                    Unable to load your restaurant
                </h2>
                <p className="mt-2 text-sm text-red-600">{error}</p>
                <button
                    onClick={() => dispatch(fetchRestaurant())}
                    className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!restaurant) {
        return <AddRestaurant />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return <Overview onNavigate={setActiveTab} />;
            case "menu":
                return <MenuSections />;
            case "add-items":
                return <AddItemsSection />;
            case "sales":
                return <SalesSection />;
            case "profile":
                return <RestaurantProfile />;
            default:
                return <Overview onNavigate={setActiveTab} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-wider text-orange-600">
                                Seller Dashboard
                            </p>
                            <h1 className="mt-1 text-3xl font-bold text-gray-900">
                                {restaurant.name}
                            </h1>
                            <p className="mt-2 text-sm text-gray-500">
                                Manage your restaurant, menu, and sales.
                            </p>
                        </div>

                        <span
                            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${restaurant.isOpen
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${restaurant.isOpen ? "bg-green-500" : "bg-gray-500"
                                    }`}
                            />
                            {restaurant.isOpen ? "Restaurant Open" : "Restaurant Closed"}
                        </span>
                    </div>
                </motion.div>

                <div className="mb-6 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2">
                    <div className="flex min-w-max gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
                                            ? "bg-orange-500 text-white shadow-sm"
                                            : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                                        }`}
                                >
                                    <Icon size={17} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderContent()}
                </motion.div>
            </div>
        </div>
    );
};

export default Restaurant;