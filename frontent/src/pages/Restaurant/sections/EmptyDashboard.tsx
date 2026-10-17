
import type { ReactNode } from "react";
import { FiPlusCircle, FiInbox } from "react-icons/fi";
import { motion } from "framer-motion";

interface EmptyDashboardProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: ReactNode;
}

export default function EmptyDashboard({
    title = "Nothing to display yet",
    description = "Your information will appear here when it becomes available.",
    actionLabel,
    onAction,
    icon,
}: EmptyDashboardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center"
        >
            <div className="rounded-2xl bg-orange-50 p-4">
                {icon ?? <FiInbox className="text-3xl text-orange-500" />}
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {title}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                {description}
            </p>

            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                    <FiPlusCircle className="text-lg" />
                    {actionLabel}
                </button>
            )}
        </motion.div>
    );
}
