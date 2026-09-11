import { FiDollarSign } from "react-icons/fi";

import EmptyDashboard from "./EmptyDashboard";

const SalesSection = () => {
    return (
        <EmptyDashboard
            icon={<FiDollarSign />}
            title="Sales & Revenue"
            description="Track your restaurant sales, revenue and business performance."
            button="View Analytics"
        />
    );
};

export default SalesSection;