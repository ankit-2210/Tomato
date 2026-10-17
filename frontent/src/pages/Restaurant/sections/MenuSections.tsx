import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    FiEdit2,
    FiSearch,
    FiTrash2,
    FiEye,
    FiEyeOff,
    FiRefreshCw,
    FiPlus,
    FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    fetchMenuItems,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
} from "../../../redux/slices/Menu/menuItemSlice";

import type { IMenuItem } from "../../../types";
import MenuItemForm from "../menuItems/MenuItemForm";

const MenuSections = () => {
    const dispatch = useAppDispatch();

    const restaurant = useAppSelector(
        (state) => state.restaurant.restaurant
    );

    const {
        items,
        loading,
        actionLoading,
        error,
    } = useAppSelector((state) => state.menuItem);

    const [search, setSearch] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState<
        "all" | "available" | "unavailable"
    >("all");

    const [editingItem, setEditingItem] = useState<IMenuItem | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [savingEdit, setSavingEdit] = useState(false);

    useEffect(() => {
        if (restaurant?._id) {
            dispatch(fetchMenuItems(restaurant._id));
        }
    }, [dispatch, restaurant?._id]);

    const filteredItems = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return items.filter((item: IMenuItem) => {
            const matchesSearch =
                !normalizedSearch ||
                item.name.toLowerCase().includes(normalizedSearch) ||
                (item.description ?? "").toLowerCase().includes(normalizedSearch);

            const matchesAvailability =
                availabilityFilter === "all" ||
                (availabilityFilter === "available" && item.isAvailable) ||
                (availabilityFilter === "unavailable" && !item.isAvailable);

            return matchesSearch && matchesAvailability;
        });
    }, [items, search, availabilityFilter]);

    const handleEdit = async (formData: FormData) => {
        if (!editingItem) return;

        setSavingEdit(true);

        try {
            await dispatch(
                updateMenuItem({
                    id: editingItem._id,
                    formData,
                })
            ).unwrap();

            toast.success("Menu item updated successfully.");
            setEditingItem(null);

            if (restaurant?._id) {
                await dispatch(fetchMenuItems(restaurant._id));
            }
        } catch (err) {
            toast.error(
                typeof err === "string" ? err : "Failed to update menu item."
            );
        } finally {
            setSavingEdit(false);
        }
    };

    const handleDelete = async (item: IMenuItem) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${item.name}"?`
        );

        if (!confirmed) return;

        setDeletingId(item._id);

        try {
            await dispatch(deleteMenuItem(item._id)).unwrap();
            toast.success("Menu item deleted successfully.");

            if (restaurant?._id) {
                await dispatch(fetchMenuItems(restaurant._id));
            }
        } catch (err) {
            toast.error(
                typeof err === "string" ? err : "Failed to delete menu item."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleAvailability = async (item: IMenuItem) => {
        try {
            await dispatch(toggleMenuItemAvailability(item._id)).unwrap();

            toast.success(
                item.isAvailable
                    ? "Menu item marked unavailable."
                    : "Menu item is now available."
            );

            if (restaurant?._id) {
                await dispatch(fetchMenuItems(restaurant._id));
            }
        } catch (err) {
            toast.error(
                typeof err === "string"
                    ? err
                    : "Failed to update item availability."
            );
        }
    };

    if (!restaurant) {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                Register your restaurant before managing menu items.
            </div>
        );
    }

    if (editingItem) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-3xl"
            >
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Edit Menu Item
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Update the details for {editingItem.name}.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setEditingItem(null)}
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                        aria-label="Cancel editing"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                    <MenuItemForm
                        initialValues={{
                            name: editingItem.name,
                            description: editingItem.description ?? "",
                            price: String(editingItem.price),
                        }}
                        initialImage={editingItem.image}
                        submitLabel="Save Changes"
                        loading={savingEdit}
                        onSubmit={handleEdit}
                        onCancel={() => setEditingItem(null)}
                    />
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Menu Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage dishes, prices, images, and availability.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => dispatch(fetchMenuItems(restaurant._id))}
                    disabled={loading}
                    className="flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                    <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Total Items" value={items.length} />
                <StatCard
                    label="Available"
                    value={items.filter((item: IMenuItem) => item.isAvailable).length}
                />
                <StatCard
                    label="Unavailable"
                    value={items.filter((item: IMenuItem) => !item.isAvailable).length}
                />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                        <FiSearch
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />

                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by item name or description..."
                            className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>

                    <select
                        value={availabilityFilter}
                        onChange={(event) =>
                            setAvailabilityFilter(
                                event.target.value as
                                | "all"
                                | "available"
                                | "unavailable"
                            )
                        }
                        className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
                    >
                        <option value="all">All Items</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading && items.length === 0 ? (
                <div className="flex justify-center py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <FiPlus size={25} />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                        {search || availabilityFilter !== "all"
                            ? "No matching menu items"
                            : "Your menu is empty"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                        {search || availabilityFilter !== "all"
                            ? "Try changing your search or availability filter."
                            : "Add your first menu item to start building your restaurant menu."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredItems.map((item: IMenuItem) => (
                        <motion.article
                            key={item._id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                            <div className="relative h-48 bg-gray-100">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        loading="lazy"
                                        className={`h-full w-full object-cover ${item.isAvailable ? "" : "opacity-50 grayscale"
                                            }`}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                        No image available
                                    </div>
                                )}

                                <span
                                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${item.isAvailable
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {item.isAvailable ? "Available" : "Unavailable"}
                                </span>

                                <span className="absolute right-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm">
                                    ₹{item.price}
                                </span>
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {item.name}
                                </h3>

                                <p className="mt-2 min-h-10 text-sm leading-5 text-gray-500">
                                    {item.description || "No description available."}
                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingItem(item)}
                                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:border-orange-400 hover:text-orange-600"
                                    >
                                        <FiEdit2 />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleToggleAvailability(item)}
                                        disabled={actionLoading}
                                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                                    >
                                        {item.isAvailable ? <FiEyeOff /> : <FiEye />}
                                        {item.isAvailable ? "Disable" : "Enable"}
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(item)}
                                    disabled={deletingId === item._id}
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                                >
                                    <FiTrash2 />
                                    {deletingId === item._id ? "Deleting..." : "Delete Item"}
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </div>
            )}
        </div>
    );
};

interface StatCardProps {
    label: string;
    value: number;
}

const StatCard = ({ label, value }: StatCardProps) => (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
);

export default MenuSections;