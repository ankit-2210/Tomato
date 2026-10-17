import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { FiCamera, FiSave, FiX } from "react-icons/fi";

export interface MenuItemFormValues {
    name: string;
    description: string;
    price: string;
}

interface MenuItemFormProps {
    initialValues?: MenuItemFormValues;
    initialImage?: string;
    submitLabel?: string;
    loading?: boolean;
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel?: () => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const MenuItemForm = ({
    initialValues = {
        name: "",
        description: "",
        price: "",
    },
    initialImage = "",
    submitLabel = "Save Menu Item",
    loading = false,
    onSubmit,
    onCancel,
}: MenuItemFormProps) => {
    const [name, setName] = useState(initialValues.name);
    const [description, setDescription] = useState(
        initialValues.description
    );
    const [price, setPrice] = useState(initialValues.price);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState(initialImage);
    const [imageRemoved, setImageRemoved] = useState(false);
    const [validationError, setValidationError] = useState("");

    useEffect(() => {
        setName(initialValues.name);
        setDescription(initialValues.description);
        setPrice(initialValues.price);
        setPreview(initialImage);
        setImage(null);
        setImageRemoved(false);
        setValidationError("");
    }, [
        initialValues.name,
        initialValues.description,
        initialValues.price,
        initialImage,
    ]);

    useEffect(() => {
        if (!image) return;

        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file)
            return;

        if (!file.type.startsWith("image/")) {
            setValidationError("Please select a valid image file.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setValidationError("Image size must not exceed 5 MB.");
            event.target.value = "";
            return;
        }

        setValidationError("");
        setImage(file);
        setImageRemoved(false);
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreview("");
        setImageRemoved(true);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setValidationError("");

        if (!name.trim()) {
            setValidationError("Menu item name is required.");
            return;
        }

        const parsedPrice = Number(price);

        if (price.trim() === "" || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            setValidationError("Enter a valid price greater than zero.");
            return;
        }

        if (!preview && !image) {
            setValidationError("Please upload an image for this menu item.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("description", description.trim());
        formData.append("price", String(parsedPrice));

        if (image) {
            formData.append("file", image);
        }

        // Optional signal if your backend supports explicitly removing an image.
        if (imageRemoved) {
            formData.append("removeImage", "true");
        }

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label
                    htmlFor="menuItemName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Item Name *
                </label>

                <input
                    id="menuItemName"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Margherita Pizza"
                    maxLength={100}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
            </div>

            <div>
                <label
                    htmlFor="menuItemDescription"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Description
                </label>

                <textarea
                    id="menuItemDescription"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe the ingredients, taste, and portion..."
                    rows={3}
                    maxLength={1000}
                    className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
            </div>

            <div>
                <label
                    htmlFor="menuItemPrice"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Price (₹) *
                </label>

                <input
                    id="menuItemPrice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="e.g. 249"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Item Image *
                </label>

                {preview ? (
                    <div className="relative overflow-hidden rounded-xl border border-gray-200">
                        <img
                            src={preview}
                            alt="Menu item preview"
                            className="h-56 w-full object-cover"
                        />

                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            aria-label="Remove selected image"
                            className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow hover:bg-red-50"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-8 transition hover:border-orange-400 hover:bg-orange-50">
                        <FiCamera className="mb-3 text-3xl text-orange-500" />

                        <span className="text-sm font-semibold text-gray-700">
                            Upload item image
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

            {validationError && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {validationError}
                </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <FiSave />
                    {loading ? "Saving..." : submitLabel}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        <FiX />
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default MenuItemForm;