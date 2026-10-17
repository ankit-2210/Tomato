import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiPlusCircle } from "react-icons/fi";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addMenuItem } from "../../../redux/slices/Menu/menuItemSlice";
import { fetchMenuItems } from "../../../redux/slices/Menu/menuItemSlice";

import MenuItemForm from "./MenuItemForm";

interface AddMenuItemProps {
    onCancel?: () => void;
    onSuccess?: () => void;
}

const AddMenuItem = ({ onCancel, onSuccess }: AddMenuItemProps) => {
    const dispatch = useAppDispatch();
    const [submitting, setSubmitting] = useState(false);

    const restaurant = useAppSelector(
        (state) => state.restaurant.restaurant
    );

    if (!restaurant) {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                Register your restaurant before adding menu items.
            </div>
        );
    }

    const handleSubmit = async (formData: FormData) => {
        setSubmitting(true);

        try {
            formData.append("restaurantId", restaurant._id);

            await dispatch(addMenuItem(formData)).unwrap();

            await dispatch(fetchMenuItems(restaurant._id));

            toast.success("Menu item added successfully!");
            onSuccess?.();
        } catch (error) {
            toast.error(
                typeof error === "string"
                    ? error
                    : "Failed to add menu item. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl"
        >
            <div className="mb-6 flex items-center gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Go back"
                        className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:bg-gray-50"
                    >
                        <FiArrowLeft size={19} />
                    </button>
                )}

                <div>
                    <div className="flex items-center gap-2">
                        <FiPlusCircle className="text-orange-500" size={23} />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Add Menu Item
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                        Add a dish or product to your restaurant menu.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                <MenuItemForm
                    submitLabel="Add Menu Item"
                    loading={submitting}
                    onSubmit={handleSubmit}
                    onCancel={onCancel}
                />
            </div>
        </motion.div>
    );
};

export default AddMenuItem;