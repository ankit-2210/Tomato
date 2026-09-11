import { FiMenu } from "react-icons/fi";

import EmptyDashboard from "./EmptyDashboard";


const MenuSection = () => {
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