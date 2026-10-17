
import { useState } from "react";
import {
    FiCalendar,
    FiDollarSign,
    FiShoppingBag,
    FiTrendingUp,
    FiBarChart2,
    FiInfo,
} from "react-icons/fi";
import { motion } from "framer-motion";

type SalesPeriod = "today" | "week" | "month" | "year";

const PERIODS: { label: string; value: SalesPeriod }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
];

export default function SalesSection() {
    const [period, setPeriod] = useState<SalesPeriod>("month");

    const stats = [
        {
            title: "Total Revenue",
            value: "—",
            icon: FiDollarSign,
            description: "Sales revenue for the selected period",
        },
        {
            title: "Total Orders",
            value: "—",
            icon: FiShoppingBag,
            description: "Orders received during this period",
        },
        {
            title: "Average Order Value",
            value: "—",
            icon: FiTrendingUp,
            description: "Average value per completed order",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Sales & Analytics
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Monitor your restaurant's revenue and order performance.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white p-1">
                    <FiCalendar className="ml-2 text-gray-500" />

                    <select
                        value={period}
                        onChange={(event) =>
                            setPeriod(event.target.value as SalesPeriod)
                        }
                        className="rounded-lg bg-transparent px-2 py-2 text-sm font-medium text-gray-700 outline-none"
                        aria-label="Sales reporting period"
                    >
                        {PERIODS.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {stat.title}
                                    </p>
                                    <p className="mt-3 text-3xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-orange-50 p-3">
                                    <Icon className="text-xl text-orange-600" />
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-gray-500">
                                {stat.description}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-2xl bg-orange-50 p-4">
                        <FiBarChart2 className="text-3xl text-orange-500" />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-gray-900">
                        Sales analytics will appear here
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                        Connect your order and payment data to display revenue trends,
                        completed orders, best-selling menu items, and sales charts.
                    </p>

                    <div className="mt-5 flex items-start gap-2 rounded-xl bg-blue-50 p-4 text-left">
                        <FiInfo className="mt-0.5 shrink-0 text-blue-600" />
                        <p className="text-sm text-blue-800">
                            Selected period:{" "}
                            <span className="font-semibold">
                                {PERIODS.find((item) => item.value === period)?.label}
                            </span>
                            . Actual sales metrics will be displayed once the sales API
                            is integrated.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
