import { FiPlus } from "react-icons/fi";

import EmptyDashboard from "./EmptyDashboard";

const AddItemsSection = ({ restaurant }) => {
    return (
        <EmptyDashboard
            icon={<FiPlus />}
            title="Add New Food"
            description="Create delicious menu items and make them available to your customers."
            button="Create Food Item"
        />
    );
};

export default AddItemsSection