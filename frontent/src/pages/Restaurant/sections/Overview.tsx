import type { IRestaurant } from "../../../types";
import { motion } from "framer-motion";
import {
    FiShoppingBag,
    FiDollarSign,
    FiStar,
    FiMenu,
    FiPlus,
    FiEdit3,
    FiClock,
    FiTrendingUp,
    FiArrowUpRight,
    FiChevronRight,
} from "react-icons/fi";


const Overview = ({ restaurant }: { restaurant: IRestaurant }) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
        >

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <StatCard
                    title="Total Orders"
                    value="1,248"
                    change="+12.5%"
                    icon={<FiShoppingBag />}
                    iconClass="bg-blue-50 text-blue-600"
                />

                <StatCard
                    title="Total Revenue"
                    value="₹84,560"
                    change="+18.2%"
                    icon={<FiDollarSign />}
                    iconClass="bg-green-50 text-green-600"
                />

                <StatCard
                    title="Average Rating"
                    value="4.8"
                    change="+0.3"
                    icon={<FiStar />}
                    iconClass="bg-amber-50 text-amber-600"
                />

                <StatCard
                    title="Menu Items"
                    value="42"
                    change="+5"
                    icon={<FiMenu />}
                    iconClass="bg-red-50 text-red-600"
                />

            </div>

            {/* Main Grid */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">

                {/* Restaurant Information */}
                <div className="lg:col-span-2">
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-gray-400">
                                    Restaurant Overview
                                </p>

                                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                                    About your restaurant
                                </h2>
                            </div>

                            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 sm:flex">
                                <FiTrendingUp className="text-xl" />
                            </div>

                        </div>

                        <p className="mt-6 leading-7 text-gray-500">
                            {restaurant.description ||
                                "Add a description to tell customers what makes your restaurant special."}
                        </p>

                        <div className="mt-7 grid gap-4 sm:grid-cols-2">
                            <InfoBox
                                title="Phone"
                                value={restaurant.phone}
                            />

                            <InfoBox
                                title="Status"
                                value={
                                    restaurant.isOpen
                                        ? "Currently Open"
                                        : "Currently Closed"
                                }
                            />

                            <InfoBox
                                title="Verification"
                                value={
                                    restaurant.isVerified
                                        ? "Verified Restaurant"
                                        : "Verification Pending"
                                }
                            />

                            <InfoBox
                                title="Restaurant ID"
                                value={restaurant._id.slice(-8)}
                            />

                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    <p className="text-sm font-medium text-gray-400">
                        Shortcuts
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                        Quick Actions
                    </h2>

                    <div className="mt-6 space-y-3">

                        <QuickAction
                            title="Add New Food"
                            description="Add an item to your menu"
                            icon={<FiPlus />}
                        />

                        <QuickAction
                            title="Manage Orders"
                            description="View and manage orders"
                            icon={<FiShoppingBag />}
                        />

                        <QuickAction
                            title="Edit Restaurant"
                            description="Update restaurant details"
                            icon={<FiEdit3 />}
                        />

                        <QuickAction
                            title="Opening Hours"
                            description="Manage business hours"
                            icon={<FiClock />}
                        />

                    </div>
                </div>
            </div>

            {/* Performance */}
            <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-400">
                            Performance
                        </p>

                        <h2 className="mt-1 text-2xl font-bold">
                            Restaurant performance
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-600">
                        <FiTrendingUp />
                        +18.2%
                    </div>

                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    <PerformanceItem
                        title="Order Growth"
                        value="82%"
                    />

                    <PerformanceItem
                        title="Customer Satisfaction"
                        value="96%"
                    />

                    <PerformanceItem
                        title="Menu Performance"
                        value="91%"
                    />

                </div>
            </div>
        </motion.div>
    );
};


interface StatCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
    iconClass: string;
}

const StatCard = ({ title, value, change, icon, iconClass }: StatCardProps) => {
    return (
        <motion.div
            whileHover={{
                y: -4,
            }}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
        >

            <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${iconClass}`}>
                    {icon}
                </div>

                <div className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                    <FiArrowUpRight />
                    {change}
                </div>

            </div>

            <p className="mt-6 text-sm font-medium text-gray-400">
                {title}
            </p>

            <h3 className="mt-1 text-3xl font-bold text-gray-900">
                {value}
            </h3>

        </motion.div>
    );
};


const InfoBox = ({ title, value }: {
    title: string;
    value: string;
}) => {
    return (
        <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {title}
            </p>

            <p className="mt-2 truncate font-semibold text-gray-800">
                {value}
            </p>
        </div>
    );
};



const QuickAction = ({ title, description, icon }: {
    title: string;
    description: string;
    icon: React.ReactNode;
}) => {
    return (
        <button className="group flex w-full items-center gap-4 rounded-2xl border border-gray-100 p-4 text-left transition hover:border-red-100 hover:bg-red-50">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg text-gray-600 transition group-hover:bg-red-500 group-hover:text-white">
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800">
                    {title}
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-400">
                    {description}
                </p>
            </div>

            <FiChevronRight className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-red-500" />

        </button>
    );
};



const PerformanceItem = ({ title, value }: {
    title: string;
    value: string;
}) => {
    return (
        <div>
            <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                    {title}
                </span>

                <span className="font-bold text-gray-900">
                    {value}
                </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <motion.div
                    initial={{
                        width: 0,
                    }}
                    animate={{
                        width: value,
                    }}
                    transition={{
                        duration: 1,
                    }}
                    className="h-full rounded-full bg-linear-to-r from-red-500 to-orange-400"
                />
            </div>
        </div>
    );
};


export default Overview;