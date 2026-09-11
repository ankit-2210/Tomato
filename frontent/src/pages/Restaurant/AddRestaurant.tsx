import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
    FiUploadCloud,
    FiMapPin,
    FiPhone,
    FiHome,
    FiFileText,
} from "react-icons/fi";

import { restaurantService } from "../../main";
import { useAppData } from "../../context/useAppData";

const AddRestaurant = () => {
    const { location } = useAppData();

    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        phone: "",
    });

    const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length)
            return;

        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!image) {
            return toast.error("Please upload a restaurant image.");
        }

        if (!location) {
            return toast.error("Location not found.");
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("phone", form.phone);

            formData.append("latitude", location.latitude.toString());
            formData.append("longitude", location.longitude.toString());
            formData.append("formattedAddress", location.formattedAddress);
            formData.append("file", image);

            const { data } = await axios.post(`${restaurantService}/api/restaurant/add`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "token"
                    )}`,
                },
            });

            toast.success(data.message);

            window.location.reload();
        }
        catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ??
                    "Something went wrong."
                );
            }
            else {
                toast.error("Something went wrong.");
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-6"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80')",
            }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

            {/* Form Card */}
            <motion.form
                onSubmit={submitHandler}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl bg-white/90 shadow-2xl backdrop-blur-xl"
            >
                {/* Header */}
                <div className="bg-linear-to-r from-red-600 via-orange-500 to-yellow-500 px-10 py-8 text-white">
                    <h1 className="text-4xl font-extrabold">
                        🍽️ Register Your Restaurant
                    </h1>

                    <p className="mt-2 text-lg text-white/90">
                        Join thousands of restaurants and start serving hungry
                        customers today.
                    </p>
                </div>

                <div className="grid gap-8 p-8 lg:grid-cols-2">

                    {/* LEFT SIDE */}
                    <div className="space-y-6">

                        {/* Image Upload */}
                        <div>
                            <label className="mb-2 block font-semibold text-gray-700">
                                Restaurant Image
                            </label>

                            <label className="group flex h-72 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-red-500">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <FiUploadCloud
                                            size={65}
                                            className="mx-auto text-red-500"
                                        />

                                        <h3 className="mt-4 text-lg font-semibold text-gray-700">
                                            Upload Restaurant Photo
                                        </h3>

                                        <p className="mt-2 text-sm text-gray-500">
                                            JPG • PNG • WEBP
                                        </p>
                                    </div>
                                )}

                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={imageHandler}
                                />
                            </label>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="mb-2 block font-semibold text-gray-700">
                                Restaurant Location
                            </label>

                            <div className="flex items-start gap-3 rounded-2xl border bg-gray-50 p-4">
                                <FiMapPin
                                    className="mt-1 text-red-500"
                                    size={22}
                                />

                                <span className="text-sm text-gray-700">
                                    {location?.formattedAddress ||
                                        "Fetching your location..."}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="space-y-5">

                        {/* Name */}
                        <div>
                            <label className="mb-2 block font-semibold text-gray-700">
                                Restaurant Name
                            </label>

                            <div className="relative">
                                <FiHome
                                    className="absolute left-4 top-4 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    placeholder="Pizza Hub"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-2xl border pl-12 pr-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-300"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-2 block font-semibold text-gray-700">
                                Contact Number
                            </label>

                            <div className="relative">
                                <FiPhone
                                    className="absolute left-4 top-4 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="tel"
                                    placeholder="9876543210"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-2xl border pl-12 pr-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-300"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-2 block font-semibold text-gray-700">
                                Description
                            </label>

                            <div className="relative">
                                <FiFileText
                                    className="absolute left-4 top-4 text-gray-400"
                                    size={20}
                                />

                                <textarea
                                    rows={5}
                                    placeholder="Tell customers what makes your restaurant special..."
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-2xl border pl-12 pr-4 py-3 outline-none resize-none focus:border-red-500 focus:ring-2 focus:ring-red-300"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{
                                scale: 1.02,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            disabled={loading}
                            className="w-full rounded-2xl bg-linear-to-r from-red-600 via-orange-500 to-yellow-500 py-4 text-lg font-bold text-white shadow-xl transition-all disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading
                                ? "Creating Restaurant..."
                                : "🚀 Create Restaurant"}
                        </motion.button>

                        <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4">
                            <h3 className="font-semibold text-orange-600">
                                Why register?
                            </h3>

                            <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                <li>✅ Reach thousands of nearby customers</li>
                                <li>✅ Manage your own menu</li>
                                <li>✅ Accept orders instantly</li>
                                <li>✅ Real-time order tracking</li>
                                <li>✅ Analytics & earnings dashboard</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-8 py-5 text-center">
                    <p className="text-sm text-gray-500">
                        Powered by{" "}
                        <span className="font-semibold text-red-500">
                            Tomato
                        </span>{" "}
                        • Grow your restaurant business with us 🍕
                    </p>
                </div>
            </motion.form>
        </div>
    );
};

export default AddRestaurant;