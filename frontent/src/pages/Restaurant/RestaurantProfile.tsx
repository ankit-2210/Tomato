import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import type { IRestaurant } from "../../types";

import {
    FiMapPin,
    FiPhone,
    FiEdit3,
    FiCheck,
    FiX,
    FiClock,
    FiShield,
} from "react-icons/fi";

import { restaurantService } from "../../main";

interface RestaurantProfileProps {
    restaurant: IRestaurant;
    isSeller: boolean;
    onUpdate: (
        restaurant: IRestaurant
    ) => void;
}

const RestaurantProfile = ({ restaurant, isSeller, onUpdate }: RestaurantProfileProps) => {

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(restaurant.name);
    const [description, setDescription] = useState(restaurant.description || "");

    const [loading, setLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        setName(restaurant.name);
        setDescription(restaurant.description || "");
    }, [restaurant]);


    const toggleOpenStatus = async () => {
        try {
            setStatusLoading(true);

            const { data } = await axios.patch(`${restaurantService}/api/restaurant/toggle-open`, {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (data.restaurant) {
                onUpdate(data.restaurant);
            }

            toast.success(data.message || "Restaurant status updated.");
        }
        catch (error) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to update status.");
            }
            else {
                toast.error("Failed to update status.");
            }

        }
        finally {
            setStatusLoading(false);
        }
    };

    const saveChanges = async () => {
        if (!name.trim()) {
            toast.error("Restaurant name is required.");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.patch(`${restaurantService}/api/restaurant/edit`,
                {
                    name: name.trim(),
                    description: description.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (data.restaurant) {
                onUpdate(data.restaurant);
            }

            setEditMode(false);

            toast.success(data.message || "Restaurant updated successfully.");

        }
        catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to update restaurant.");
            }
            else {
                toast.error("Failed to update restaurant.");
            }
        }
        finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setName(restaurant.name);
        setDescription(restaurant.description || "");

        setEditMode(false);
    };

    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.5,
            }}
            className="overflow-hidden rounded-4xl border border-white/20 bg-white shadow-2xl"
        >

            <div className="relative h-75 overflow-hidden sm:h-95">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top badges */}
                <div className="absolute left-5 right-5 top-5 flex items-start justify-between">

                    {/* Verification */}
                    {restaurant.isVerified ? (
                        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl">
                            <FiCheck className="text-green-400" />
                            Verified
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl">
                            <FiShield className="text-yellow-400" />
                            Verification Pending
                        </div>
                    )}

                    {/* Status */}
                    <div
                        className={`flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl ${restaurant.isOpen
                            ? "bg-green-500/80"
                            : "bg-black/50"
                            }`}
                    >
                        <span
                            className={`h-2.5 w-2.5 rounded-full ${restaurant.isOpen
                                ? "animate-pulse bg-white"
                                : "bg-red-400"
                                }`}
                        />
                        {restaurant.isOpen ? "Open Now" : "Closed"}
                    </div>

                </div>

                {/* Bottom restaurant information */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div className="min-w-0">

                            {editMode ? (
                                <input
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-white/30 bg-black/40 px-4 py-2 text-2xl font-bold text-white outline-none backdrop-blur-xl placeholder:text-white/50 sm:text-4xl"
                                    placeholder="Restaurant name"
                                />
                            ) : (
                                <h1 className="truncate text-3xl font-black tracking-tight text-white sm:text-5xl">
                                    {restaurant.name}
                                </h1>
                            )}

                            <div className="mt-3 flex items-start gap-2 text-sm text-white/80">
                                <FiMapPin className="mt-0.5 shrink-0 text-red-400" />
                                <span className="line-clamp-2">
                                    {
                                        restaurant
                                            .autoLocation
                                            .formattedAddress
                                    }
                                </span>
                            </div>
                        </div>

                        {isSeller && (
                            <div className="flex shrink-0 gap-2">
                                {editMode ? (
                                    <>
                                        <button
                                            onClick={
                                                cancelEdit
                                            }
                                            className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 font-semibold text-white backdrop-blur-xl transition hover:bg-white/25"
                                        >
                                            <FiX />
                                            Cancel
                                        </button>

                                        <button
                                            onClick={
                                                saveChanges
                                            }
                                            disabled={
                                                loading
                                            }
                                            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-gray-900 shadow-lg transition hover:bg-gray-100 disabled:opacity-60"
                                        >
                                            <FiCheck />
                                            {loading ? "Saving..." : "Save"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() =>
                                            setEditMode(
                                                true
                                            )
                                        }
                                        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-gray-900 shadow-lg transition hover:bg-gray-100"
                                    >
                                        <FiEdit3 />
                                        Edit
                                    </button>
                                )}

                            </div>
                        )}

                    </div>
                </div>
            </div>


            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-3">
                {/* Description */}
                <div className="lg:col-span-2">

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                        About Restaurant
                    </p>

                    {editMode ? (
                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            rows={4}
                            className="mt-3 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-gray-700 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            placeholder="Describe your restaurant..."
                        />
                    ) : (
                        <p className="mt-3 max-w-3xl leading-7 text-gray-500">
                            {restaurant.description ||
                                "Tell customers what makes your restaurant special."}
                        </p>
                    )}

                </div>

                {/* Status control */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                            <FiClock className="text-lg text-gray-700" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Restaurant Status
                            </p>

                            <p className="mt-1 font-bold text-gray-900">
                                {restaurant.isOpen ? "Open for Orders" : "Currently Closed"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={
                            toggleOpenStatus
                        }
                        disabled={
                            statusLoading
                        }
                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${restaurant.isOpen
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-500 text-white hover:bg-green-600"
                            } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${restaurant.isOpen
                                ? "bg-red-500"
                                : "bg-white"
                                }`}
                        />

                        {statusLoading
                            ? "Updating..."
                            : restaurant.isOpen
                                ? "Close Restaurant"
                                : "Open Restaurant"}

                    </button>
                </div>
            </div>

            <div className="border-t border-gray-100 bg-gray-50/70 px-6 py-5 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                            <FiPhone className="text-gray-600" />
                        </div>

                        <div>

                            <p className="text-xs text-gray-400">
                                Contact Number
                            </p>

                            <p className="font-semibold text-gray-800">
                                {restaurant.phone}
                            </p>

                        </div>
                    </div>

                    <div className="text-left sm:text-right">

                        <p className="text-xs text-gray-400">
                            Restaurant ID
                        </p>

                        <p className="font-mono text-sm font-semibold text-gray-600">
                            #{restaurant._id.slice(-10)}
                        </p>

                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default RestaurantProfile;