import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiPlusCircle } from "react-icons/fi";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    addMenuItem,
    fetchMenuItems,
} from "../../../redux/slices/Menu/menuItemSlice";

import MenuItemForm from "../menuItems/MenuItemForm";

const AddItemsSection = () => {
    const dispatch = useAppDispatch();
    const [submitting, setSubmitting] = useState(false);
    const [addedItemName, setAddedItemName] = useState("");

    const restaurant = useAppSelector(
        (state) => state.restaurant.restaurant
    );

    if (!restaurant) {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                Please register your restaurant before adding menu items.
            </div>
        );
    }

    const handleSubmit = async (formData: FormData) => {
        setSubmitting(true);
        setAddedItemName("");

        try {
            formData.append("restaurantId", restaurant._id);

            await dispatch(addMenuItem(formData)).unwrap();
            await dispatch(fetchMenuItems(restaurant._id));

            setAddedItemName(String(formData.get("name") ?? "Menu item"));
            toast.success("Menu item added successfully!");
        } catch (error) {
            toast.error(
                typeof error === "string"
                    ? error
                    : "Unable to add menu item. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl space-y-6"
        >
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <FiPlusCircle size={24} />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Add Menu Items
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Add dishes and products customers can order.
                    </p>
                </div>
            </div>

            {addedItemName && (
                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                    <FiCheckCircle className="mt-0.5 text-green-600" size={20} />

                    <div>
                        <p className="font-semibold text-green-800">
                            Menu item created
                        </p>
                        <p className="mt-1 text-sm text-green-700">
                            {addedItemName} was added to your menu.
                        </p>
                    </div>
                </div>
            )}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                <div className="mb-6 border-b border-gray-100 pb-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                        {restaurant.name}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">
                        Item Details
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Complete the form below to publish a menu item.
                    </p>
                </div>

                <MenuItemForm
                    submitLabel="Add Menu Item"
                    loading={submitting}
                    onSubmit={handleSubmit}
                />
            </div>
        </motion.div>
    );
};

export default AddItemsSection;