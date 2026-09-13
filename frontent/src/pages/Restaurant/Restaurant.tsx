import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { restaurantService } from "../../main";
import AddRestaurant from "./AddRestaurant";
import RestaurantProfile from "./RestaurantProfile";

import AddItemsSection from "./sections/AddItemsSection";
import MenuSection from "./sections/MenuSections";
import SalesSection from "./sections/SalesSection";
import Overview from "./sections/Overview";

import type { IRestaurant } from "../../types";

type SellerTab = "overview" | "menu" | "add-items" | "sales";

const Restaurant = () => {
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<SellerTab>("overview");

    const fetchRestaurant = async () => {
        try {
            const { data } = await axios.get(`${restaurantService}/api/restaurant/`, {
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setRestaurant(data.restaurant);

            if (data.token) {
                localStorage.setItem("token", data.token);
            }
        }
        catch (error) {
            console.error("Failed to fetch restaurant:", error);
            setRestaurant(null);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurant();
    }, []);

    if (loading) {
        return <RestaurantLoading />;
    }

    if (!restaurant) {
        return <AddRestaurant />;
    }

    return (
        <div className="min-h-screen bg-[#f7f7f8]">

            {/* Top Background */}
            <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-105 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-red-600 via-orange-500 to-amber-400" />
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -left-32 top-48 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
            </div>

            <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Top Navigation */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: -15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="mb-6 flex items-center justify-between"
                >
                    <div className="text-white">
                        <p className="text-sm font-medium text-white/80">
                            Seller Center
                        </p>

                        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                            Restaurant Dashboard
                        </h1>
                    </div>

                    <div className="hidden items-center gap-3 sm:flex">
                        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl">
                            <span className="h-2 w-2 rounded-full bg-green-400" />
                            Live Dashboard
                        </div>
                    </div>
                </motion.div>

                {/* Restaurant Hero */}
                <RestaurantProfile
                    restaurant={restaurant}
                    isSeller={true}
                    onUpdate={setRestaurant}
                />

                {/* Navigation Tabs */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.15,
                    }}
                    className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm"
                >
                    <div className="flex min-w-max gap-2">
                        <TabButton
                            active={tab === "overview"}
                            onClick={() =>
                                setTab("overview")
                            }
                            label="Overview"
                        />

                        <TabButton
                            active={tab === "menu"}
                            onClick={() =>
                                setTab("menu")
                            }
                            label="Menu"
                        />

                        <TabButton
                            active={tab === "add-items"}
                            onClick={() =>
                                setTab("add-items")
                            }
                            label="Add Items"
                        />

                        <TabButton
                            active={tab === "sales"}
                            onClick={() =>
                                setTab("sales")
                            }
                            label="Sales"
                        />

                    </div>
                </motion.div>

                {/* Content */}
                <div className="mt-6">
                    {tab === "overview" && (
                        <Overview restaurant={restaurant} />
                    )}

                    {tab === "menu" && (
                        <MenuSection restaurant={restaurant} />
                    )}

                    {tab === "add-items" && (
                        <AddItemsSection restaurant={restaurant} />
                    )}

                    {tab === "sales" && (
                        <SalesSection />
                    )}

                </div>

            </main>
        </div>
    );
};

export default Restaurant;



const RestaurantLoading = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f7f7f8]">
            <div className="text-center">
                <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-red-500" />
                <p className="mt-5 font-medium text-gray-500">
                    Loading your restaurant...
                </p>
            </div>
        </div>
    );
};


interface TabButtonProps {
    active: boolean;
    label: string;
    onClick: () => void;
}

const TabButton = ({ active, label, onClick }: TabButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${active
                ? "bg-gray-950 text-white shadow-lg"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
        >
            {label}
        </button>
    );
};








