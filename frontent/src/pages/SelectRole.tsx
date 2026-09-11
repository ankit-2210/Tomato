import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { useAppData } from "../context/useAppData";
import { authService } from "../main";

type Role = "customer" | "seller" | "rider" | null;

const SelectRole = () => {
    const [role, setRole] = useState<Role>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser } = useAppData();

    const roles: Exclude<Role, null>[] = [
        "customer",
        "seller",
        "rider",
    ];

    const addRole = async () => {
        if (!role) {
            toast.error("Please select a role");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const { data } = await axios.patch(
                `${authService}/api/auth/add/role`, { role },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            localStorage.setItem("token", data.token);
            setUser(data.user);
            toast.success("Role updated successfully");
            navigate("/", { replace: true });
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "Failed to update role"
                );
            }
            else {
                toast.error("Something went wrong");
            }

            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-red-50 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Select Your Role
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Choose how you'd like to use Tomato.
                    </p>
                </div>

                <div className="space-y-4">
                    {roles.map((item) => (
                        <button
                            key={item}
                            onClick={() => setRole(item)}
                            className={`w-full rounded-2xl border p-5 text-left transition-all duration-200 ${role === item
                                ? "border-red-500 bg-red-500 text-white shadow-lg scale-[1.02]"
                                : "border-gray-200 bg-white hover:border-red-400 hover:shadow-md"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold capitalize">
                                        {item}
                                    </h2>
                                    <p
                                        className={`text-sm ${role === item
                                            ? "text-red-100"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {item === "customer" &&
                                            "Order delicious food online."}

                                        {item === "seller" &&
                                            "Manage your restaurant and menu."}

                                        {item === "rider" &&
                                            "Deliver orders and earn money."}
                                    </p>
                                </div>

                                {role === item && (
                                    <div className="text-2xl font-bold">
                                        ✓
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    disabled={!role || loading}
                    onClick={addRole}
                    className={`mt-8 w-full rounded-2xl py-4 font-semibold transition ${role
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "cursor-not-allowed bg-gray-300 text-gray-500"
                        }`}
                >
                    {loading ? "Saving..." : "Continue"}
                </button>
            </div>
        </div>
    );
};

export default SelectRole;