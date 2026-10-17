import { FiArrowLeft, FiMenu } from "react-icons/fi";
import { motion } from "framer-motion";

import MenuSections from "../sections/MenuSections";

interface MenuItemsProps {
    onBack?: () => void;
}

const MenuItems = ({ onBack }: MenuItemsProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-3">
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        aria-label="Go back"
                        className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:bg-gray-50"
                    >
                        <FiArrowLeft size={19} />
                    </button>
                )}

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <FiMenu size={22} />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Menu Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        View, edit, and manage your restaurant menu items.
                    </p>
                </div>
            </div>

            <MenuSections />
        </motion.div>
    );
};

export default MenuItems;