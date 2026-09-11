import { motion } from "framer-motion";


const EmptyDashboard = ({ icon, title, description, button }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    button: string;
}) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="flex min-h-100 items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm"
        >

            <div className="max-w-md">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-3xl text-red-500">
                    {icon}
                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                    {title}
                </h2>

                <p className="mt-3 leading-7 text-gray-500">
                    {description}
                </p>

                <button className="mt-7 rounded-xl bg-gray-950 px-6 py-3 font-semibold text-white transition hover:bg-red-500">
                    {button}
                </button>

            </div>

        </motion.div>
    );
};


export default EmptyDashboard;