import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
    BiPackage,
    BiMap,
    BiLogOut,
    BiChevronRight,
    BiUser,
    BiCog,
} from "react-icons/bi";

import {
    useAppDispatch,
    useAppSelector
} from '../redux/hooks';

import { logout } from "../redux/slices/authSlice";

type MenuItemProps = {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
};

const MenuItem = ({ icon, title, onClick }: MenuItemProps) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full flex items-center justify-between rounded-2xl p-4 hover:bg-gray-50 transition"
    >
        <div className="flex items-center gap-4">
            {icon}
            <span className="font-medium text-gray-700">
                {title}
            </span>
        </div>

        <BiChevronRight className="text-xl text-gray-400" />
    </motion.button>
);

const Account = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.auth.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const logoutHandler = () => {
        dispatch(logout());

        toast.success("Logout Successful");
        navigate("/login", {
            replace: true
        });
    };

    const roleColors = {
        customer: "bg-green-100 text-green-700",
        seller: "bg-blue-100 text-blue-700",
        rider: "bg-orange-100 text-orange-700",
    };

    const roleColor =
        user.role && user.role in roleColors
            ? roleColors[user.role as keyof typeof roleColors]
            : "bg-white text-black";

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-100 px-4 py-8">

            <div className="mx-auto max-w-lg">

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100"
                >

                    {/* Profile Header */}
                    <div className="bg-linear-to-r from-red-500 via-orange-500 to-red-600 p-7 text-white">
                        <div className="flex items-center gap-4">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
                                    {user.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                            )}

                            <div>
                                <h2 className="text-2xl font-bold">
                                    {user.name}
                                </h2>

                                <p className="text-sm text-white/90">
                                    {user.email}
                                </p>

                                <span
                                    className={`inline-block mt-2 rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleColor}`}
                                >
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 p-5 border-b">

                        <div className="rounded-2xl bg-gray-50 p-4 text-center">
                            <h3 className="text-xl font-bold">
                                12
                            </h3>
                            <p className="text-xs text-gray-500">
                                Orders
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4 text-center">
                            <h3 className="text-xl font-bold">
                                3
                            </h3>
                            <p className="text-xs text-gray-500">
                                Addresses
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4 text-center">
                            <h3 className="text-xl font-bold">
                                ₹540
                            </h3>
                            <p className="text-xs text-gray-500">
                                Saved
                            </p>
                        </div>
                    </div>

                    {/* Menu */}
                    <div className="p-3">

                        <MenuItem
                            icon={
                                <div className="rounded-xl bg-red-100 p-2">
                                    <BiPackage className="text-xl text-red-500" />
                                </div>
                            }
                            title="My Orders"
                            onClick={() =>
                                navigate("/orders")
                            }
                        />

                        <MenuItem
                            icon={
                                <div className="rounded-xl bg-blue-100 p-2">
                                    <BiMap className="text-xl text-blue-500" />
                                </div>
                            }
                            title="Saved Addresses"
                            onClick={() =>
                                navigate("/address")
                            }
                        />

                        <MenuItem
                            icon={
                                <div className="rounded-xl bg-purple-100 p-2">
                                    <BiUser className="text-xl text-purple-500" />
                                </div>
                            }
                            title="Edit Profile"
                            onClick={() =>
                                navigate("/profile")
                            }
                        />

                        <MenuItem
                            icon={
                                <div className="rounded-xl bg-gray-100 p-2">
                                    <BiCog className="text-xl text-gray-600" />
                                </div>
                            }
                            title="Settings"
                            onClick={() =>
                                navigate("/settings")
                            }
                        />

                        <motion.button
                            whileHover={{
                                scale: 1.02
                            }}
                            whileTap={{
                                scale: 0.98
                            }}
                            onClick={logoutHandler}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 font-semibold text-white hover:bg-red-600 transition"
                        >
                            <BiLogOut className="text-xl" />
                            Logout
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Account;

