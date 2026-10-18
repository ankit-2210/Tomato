import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import { FiCamera, FiMapPin, FiPlus, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addRestaurant } from "../../redux/slices/Restaurant/restaurantSlice";

const AddRestaurant = () => {
  const dispatch = useAppDispatch();

  const { actionLoading, error } = useAppSelector(
    (state) => state.restaurant
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    formattedAddress: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        toast.success("Restaurant coordinates captured.");
      },
      () => {
        toast.error(
          "Unable to get your location. Please allow location access."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Restaurant name is required.");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    if (!formData.formattedAddress.trim()) {
      toast.error("Restaurant address is required.");
      return;
    }

    if (!image) {
      toast.error("Please upload a restaurant image.");
      return;
    }

    if (latitude === null || longitude === null) {
      toast.error("Please capture the restaurant's coordinates.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("description", formData.description.trim());
    payload.append("phone", formData.phone.trim());
    payload.append("formattedAddress", formData.formattedAddress.trim());
    payload.append("latitude", String(latitude));
    payload.append("longitude", String(longitude));
    payload.append("file", image);

    try {
      await dispatch(addRestaurant(payload)).unwrap();
      toast.success("Restaurant registered successfully!");
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : error || "Unable to register restaurant."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
            Seller Registration
          </span>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Register Your Restaurant
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Set up your restaurant profile to start managing your menu and
            serving customers through Tomato.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-7">
            <h2 className="text-lg font-semibold text-gray-900">
              Restaurant Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter the details customers will see.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Restaurant Name *
              </label>

              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Tomato Kitchen"
                maxLength={100}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell customers what makes your restaurant special..."
                rows={4}
                maxLength={1000}
                className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Contact Number *
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
                maxLength={20}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="formattedAddress"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <FiMapPin className="text-orange-500" />
                Restaurant Address *
              </label>

              <textarea
                id="formattedAddress"
                name="formattedAddress"
                value={formData.formattedAddress}
                onChange={handleChange}
                placeholder="Enter the complete restaurant address"
                rows={3}
                required
                className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              <button
                type="button"
                onClick={handleGetLocation}
                className="mt-3 rounded-xl border border-orange-300 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
              >
                <FiMapPin className="mr-2 inline" />
                Capture Restaurant Coordinates
              </button>

              {latitude !== null && longitude !== null && (
                <p className="mt-2 text-sm text-green-600">
                  Coordinates captured: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Restaurant Image *
              </label>

              {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={preview}
                    alt="Restaurant preview"
                    className="h-64 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    aria-label="Remove image"
                    className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow hover:bg-red-50"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-10 transition hover:border-orange-400 hover:bg-orange-50">
                  <FiCamera className="mb-3 text-3xl text-orange-500" />

                  <span className="text-sm font-semibold text-gray-700">
                    Upload restaurant image
                  </span>

                  <span className="mt-1 text-xs text-gray-500">
                    PNG, JPG or WebP — maximum 5 MB
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={actionLoading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiPlus />
            {actionLoading ? "Registering..." : "Register Restaurant"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddRestaurant;