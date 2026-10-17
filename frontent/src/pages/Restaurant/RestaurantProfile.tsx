import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
    FiEdit2,
    FiSave,
    FiX,
    FiPhone,
    FiMapPin,
    FiCheckCircle,
    FiClock,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    editRestaurant,
    toggleRestaurantStatus,
} from "../../redux/slices/Restaurant/restaurantSlice";

const RestaurantProfile = () => {
    const dispatch = useAppDispatch();

    const { restaurant, actionLoading } = useAppSelector(
        (state) => state.restaurant
    );

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setName(restaurant?.name ?? "");
        setDescription(restaurant?.description ?? "");
    }, [restaurant]);

    if (!restaurant) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                    Restaurant not found
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Register your restaurant before managing its profile.
                </p>
            </div>
        );
    }

    const handleSave = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim()) {
            toast.error("Restaurant name is required.");
            return;
        }

        try {
            await dispatch(
                editRestaurant({
                    name: name.trim(),
                    description: description.trim(),
                })
            ).unwrap();

            toast.success("Restaurant profile updated.");
            setIsEditing(false);
        } catch (error) {
            toast.error(
                typeof error === "string"
                    ? error
                    : "Failed to update restaurant profile."
            );
        }
    };

    const handleToggleStatus = async () => {
        try {
            await dispatch(toggleRestaurantStatus()).unwrap();
            toast.success("Restaurant status updated.");
        }
        catch (error) {
            toast.error(
                typeof error === "string"
                    ? error
                    : "Failed to update restaurant status."
            );
        }
    };

    const cancelEditing = () => {
        setName(restaurant.name);
        setDescription(restaurant.description ?? "");
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Restaurant Profile
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your restaurant information and availability.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
                <div className="relative h-56 bg-orange-50 sm:h-72">
                    {restaurant.image ? (
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-orange-300">
                            <FiMapPin size={48} />
                        </div>
                    )}

                    <span
                        className={`absolute right-4 top-4 rounded-full px-4 py-2 text-sm font-semibold ${restaurant.isOpen
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {restaurant.isOpen ? "Open" : "Closed"}
                    </span>
                </div>

                <div className="p-5 sm:p-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {restaurant.name}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                {restaurant.description || "No restaurant description added."}
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="flex w-fit items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-orange-400 hover:text-orange-600"
                            >
                                <FiEdit2 />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="my-7 border-t border-gray-100" />

                    {isEditing ? (
                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="restaurantName"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Restaurant Name
                                </label>

                                <input
                                    id="restaurantName"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    maxLength={100}
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="restaurantDescription"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="restaurantDescription"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    rows={4}
                                    maxLength={1000}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
                                >
                                    <FiSave />
                                    {actionLoading ? "Saving..." : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    disabled={actionLoading}
                                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <FiX />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                                <FiPhone className="mt-1 text-orange-500" size={19} />
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Contact Number
                                    </p>
                                    <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                                        {restaurant.phone || "Not provided"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                                <FiMapPin className="mt-1 text-orange-500" size={19} />
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Restaurant Address
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-gray-800">
                                        {restaurant.autoLocation?.formattedAddress ||
                                            "Address not available"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                                <FiCheckCircle className="mt-1 text-orange-500" size={19} />
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Verification Status
                                    </p>
                                    <p
                                        className={`mt-1 text-sm font-semibold ${restaurant.isVerified
                                            ? "text-green-700"
                                            : "text-amber-700"
                                            }`}
                                    >
                                        {restaurant.isVerified
                                            ? "Verified"
                                            : "Verification Pending"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                                <FiClock className="mt-1 text-orange-500" size={19} />
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Restaurant Status
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-gray-800">
                                        {restaurant.isOpen
                                            ? "Accepting orders"
                                            : "Not accepting orders"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            Restaurant Availability
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Control whether customers can place orders at your restaurant.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleToggleStatus}
                        disabled={actionLoading}
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${restaurant.isOpen
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {actionLoading
                            ? "Updating..."
                            : restaurant.isOpen
                                ? "Close Restaurant"
                                : "Open Restaurant"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestaurantProfile;