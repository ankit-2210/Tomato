import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiMenu,
    FiTrash2,
    FiEdit3,
    FiCheck,
    FiX,
    FiRefreshCw,
} from "react-icons/fi";

import EmptyDashboard from "./EmptyDashboard";

import { restaurantService } from "../../../main";
import type { IRestaurant, IMenuItem } from "../../../types";

interface MenuSectionProps {
    restaurant: IRestaurant;
}



const MenuSection = ({ restaurant }: MenuSectionProps) => {

    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${restaurantService}/api/menu/all/${restaurant._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setMenuItems(data.menuItems || []);
        }
        catch (error) {
            console.log(error);

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to load menu items."
                );
            }
            else {
                toast.error("Failed to load menu items.");
            }
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMenuItems();
    }, [restaurant._id]);

    // Delete item
    const deleteItem = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this menu item?");

        if (!confirmDelete)
            return;

        try {
            setActionLoading(id);
            const { data } = await axios.delete(`${restaurantService}/api/menu/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            toast.success(data.message || "Menu item deleted successfully.");
        }
        catch (error) {
            console.log(error);

        }
        finally {
            setActionLoading(null);
        }


    }

    return (
        <EmptyDashboard
            icon={<FiMenu />}
            title="Menu Management"
            description="Manage your restaurant menu, categories and food items from here."
            button="Add Food Item"
        />
    );
};

export default MenuSection;