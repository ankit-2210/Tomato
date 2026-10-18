
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiArrowRight,
    FiClock,
    FiHeart,
    FiStar,
    FiTruck,
    FiShield,
    FiSearch,
    FiPlus,
} from "react-icons/fi";
import { BiRestaurant } from "react-icons/bi";

const categories = [
    {
        name: "Burgers",
        emoji: "🍔",
        color: "bg-orange-50",
        query: "Burger",
    },
    {
        name: "Pizza",
        emoji: "🍕",
        color: "bg-red-50",
        query: "Pizza",
    },
    {
        name: "Sushi",
        emoji: "🍣",
        color: "bg-pink-50",
        query: "Sushi",
    },
    {
        name: "Indian",
        emoji: "🍛",
        color: "bg-amber-50",
        query: "Indian",
    },
    {
        name: "Chinese",
        emoji: "🥡",
        color: "bg-yellow-50",
        query: "Chinese",
    },
    {
        name: "Italian",
        emoji: "🍝",
        color: "bg-lime-50",
        query: "Italian",
    },
    {
        name: "Salads",
        emoji: "🥗",
        color: "bg-green-50",
        query: "Salad",
    },
    {
        name: "Desserts",
        emoji: "🍰",
        color: "bg-rose-50",
        query: "Dessert",
    },
];

const restaurants = [
    {
        id: "burger-barn",
        name: "Burger Barn",
        cuisine: "Burgers · Fast Food",
        rating: "4.5",
        reviews: "1.2k",
        time: "25–35 min",
        delivery: "Free delivery",
        image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
        tag: "Popular",
    },
    {
        id: "pizza-palace",
        name: "Pizza Palace",
        cuisine: "Pizza · Italian",
        rating: "4.7",
        reviews: "856",
        time: "30–45 min",
        delivery: "Free delivery",
        image:
            "https://images.unsplash.com/photo-157 pizza",
        tag: "Best rated",
    },
    {
        id: "sushi-world",
        name: "Sushi World",
        cuisine: "Sushi · Japanese",
        rating: "4.6",
        reviews: "723",
        time: "20–35 min",
        delivery: "Free delivery",
        image:
            "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85",
        tag: "Fresh picks",
    },
    {
        id: "spice-hub",
        name: "Spice Hub",
        cuisine: "Indian · North Indian",
        rating: "4.4",
        reviews: "642",
        time: "30–50 min",
        delivery: "Free delivery",
        image:
            "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=85",
        tag: "Local favorite",
    },
];

const benefits = [
    {
        title: "Wide Variety",
        description: "Discover restaurants and cuisines for every craving.",
        icon: BiRestaurant,
    },
    {
        title: "Fast & Reliable",
        description: "Convenient delivery, right to your doorstep.",
        icon: FiTruck,
    },
    {
        title: "Secure & Safe",
        description: "A smooth, secure checkout experience.",
        icon: FiShield,
    },
    {
        title: "Better Together",
        description: "Great food brings people together.",
        icon: FiHeart,
    },
];

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    const filteredRestaurants = useMemo(() => {
        if (!search) return restaurants;

        return restaurants.filter((restaurant) =>
            `${restaurant.name} ${restaurant.cuisine}`
                .toLowerCase()
                .includes(search)
        );
    }, [search]);

    const searchCategory = (query: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("search", query);
        setSearchParams(params);
        document.getElementById("restaurants")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <main id="top" className="min-h-screen bg-white text-gray-900">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-r from-orange-50 via-orange-50 to-amber-100">
                <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="z-10"
                    >
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-orange-600">
                            <span>🍅</span> Good food, good mood
                        </span>

                        <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                            Delicious Food
                            <br />
                            Delivered to{" "}
                            <span className="text-orange-500">Your Door</span>
                        </h1>

                        <p className="mt-5 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
                            Order from your favorite restaurants and enjoy fresh, delicious
                            meals whenever the craving hits.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <a
                                href="#restaurants"
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600"
                            >
                                Explore Restaurants
                                <FiArrowRight />
                            </a>

                            <a
                                href="#categories"
                                className="rounded-xl border border-orange-200 bg-white px-6 py-3.5 font-bold text-gray-800 transition hover:border-orange-400 hover:text-orange-600"
                            >
                                Browse Categories
                            </a>
                        </div>

                        <div className="mt-9 grid max-w-xl grid-cols-3 gap-4 border-t border-orange-200/80 pt-6">
                            <div>
                                <FiTruck className="mb-2 text-2xl text-orange-500" />
                                <p className="text-sm font-bold">Fast Delivery</p>
                                <p className="mt-1 text-xs text-gray-500">Convenient ordering</p>
                            </div>
                            <div>
                                <FiShield className="mb-2 text-2xl text-orange-500" />
                                <p className="text-sm font-bold">Secure Payments</p>
                                <p className="mt-1 text-xs text-gray-500">Protected checkout</p>
                            </div>
                            <div>
                                <FiStar className="mb-2 text-2xl text-orange-500" />
                                <p className="text-sm font-bold">Great Restaurants</p>
                                <p className="mt-1 text-xs text-gray-500">Food worth sharing</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="relative mx-auto w-full max-w-xl"
                    >
                        <div className="absolute -inset-4 rounded-full bg-orange-300/30 blur-3xl" />

                        <img
                            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=90"
                            alt="Fresh, colorful meal bowl"
                            className="relative h-72 w-full rounded-[2rem] object-cover shadow-2xl sm:h-96 lg:h-[440px]"
                        />

                        <div className="absolute -bottom-4 left-4 rounded-2xl border border-white bg-white p-4 shadow-xl sm:bottom-5 sm:-left-5">
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                                    🛵
                                </span>
                                <div>
                                    <p className="font-extrabold text-gray-900">Food on its way!</p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Your next favorite meal
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-orange-600 shadow-lg sm:right-5 sm:top-5">
                            Fresh & tasty ✨
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section
                id="categories"
                className="mx-auto max-w-7xl scroll-mt-32 px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
            >
                <SectionHeading
                    eyebrow="Find your craving"
                    title="Popular Categories"
                    description="Explore a variety of cuisines and find something you'll love."
                />

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                    {categories.map((category, index) => (
                        <motion.button
                            key={category.name}
                            type="button"
                            onClick={() => searchCategory(category.query)}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.04 }}
                            className="group rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                        >
                            <span
                                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${category.color} text-4xl transition group-hover:scale-110`}
                            >
                                {category.emoji}
                            </span>
                            <span className="mt-3 block text-sm font-bold text-gray-800 group-hover:text-orange-600">
                                {category.name}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Offer banner */}
            <section id="offers" className="mx-auto max-w-7xl scroll-mt-32 px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gray-950">
                    <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=85"
                        alt="Freshly baked pizza"
                        className="absolute inset-0 h-full w-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-950/20" />

                    <div className="relative max-w-2xl px-6 py-10 sm:px-10 sm:py-14">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-orange-300">
                            Special offer
                        </span>

                        <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
                            Get <span className="text-orange-400">20% OFF</span>
                            <br />
                            on Your First Order
                        </h2>

                        <p className="mt-4 text-sm text-gray-200 sm:text-base">
                            Discover something delicious and enjoy your first order.
                        </p>

                        <p className="mt-2 text-sm text-gray-200">
                            Promo code:{" "}
                            <span className="font-extrabold tracking-wider text-orange-300">
                                TOMATO20
                            </span>
                        </p>

                        <a
                            href="#restaurants"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                        >
                            Order Now <FiArrowRight />
                        </a>
                    </div>
                </div>
            </section>

            {/* Restaurants */}
            <section
                id="restaurants"
                className="mx-auto max-w-7xl scroll-mt-32 px-4 py-14 sm:px-6 lg:px-8 lg:py-16"
            >
                <SectionHeading
                    eyebrow="Handpicked for you"
                    title="Featured Restaurants"
                    description={
                        search
                            ? `Showing restaurants matching "${search}".`
                            : "Explore delicious options from our featured restaurants."
                    }
                />

                {search && (
                    <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-orange-50 px-4 py-3">
                        <p className="text-sm text-gray-700">
                            Search: <span className="font-bold">{search}</span>
                        </p>
                        <button
                            type="button"
                            onClick={() => setSearchParams({})}
                            className="text-sm font-bold text-orange-600 hover:text-orange-700"
                        >
                            Clear search
                        </button>
                    </div>
                )}

                {filteredRestaurants.length > 0 ? (
                    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {filteredRestaurants.map((restaurant, index) => (
                            <motion.article
                                key={restaurant.id}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.06 }}
                                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        loading="lazy"
                                        className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-orange-600 shadow-sm">
                                        {restaurant.tag}
                                    </span>

                                    <button
                                        type="button"
                                        aria-label={`Save ${restaurant.name} to favorites`}
                                        className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-gray-500 transition hover:text-red-500"
                                        onClick={() => {
                                            // Connect this action to a favorites feature when available.
                                        }}
                                    >
                                        <FiHeart />
                                    </button>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-extrabold text-gray-900">
                                            {restaurant.name}
                                        </h3>

                                        <span className="flex shrink-0 items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
                                            <FiStar className="fill-current" />
                                            {restaurant.rating}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {restaurant.cuisine}
                                    </p>

                                    <div className="my-4 border-t border-gray-100" />

                                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                                        <span className="flex items-center gap-1.5">
                                            <FiClock className="text-orange-500" />
                                            {restaurant.time}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <FiTruck className="text-orange-500" />
                                            {restaurant.delivery}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-xs text-gray-400">
                                        {restaurant.reviews} reviews
                                    </p>

                                    <Link
                                        to="/restaurants"
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 py-2.5 text-sm font-bold text-orange-600 transition hover:bg-orange-500 hover:text-white"
                                    >
                                        View Restaurant <FiArrowRight />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                ) : (
                    <div className="mt-8 rounded-2xl border border-dashed border-gray-200 px-5 py-12 text-center">
                        <FiSearch className="mx-auto text-3xl text-gray-400" />
                        <h3 className="mt-3 text-lg font-bold text-gray-800">
                            No matching restaurants
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Try a different restaurant name or cuisine.
                        </p>
                        <button
                            type="button"
                            onClick={() => setSearchParams({})}
                            className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
                        >
                            Show all restaurants
                        </button>
                    </div>
                )}
            </section>

            {/* Why Tomato */}
            <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
                <div className="rounded-3xl bg-orange-50 px-5 py-10 sm:px-8 lg:px-10">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 lg:items-center">
                        <div className="lg:col-span-1">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                                Why choose Tomato
                            </p>
                            <h2 className="mt-3 text-2xl font-black leading-tight text-gray-900">
                                Your Favorite Food, Made Easy
                            </h2>
                        </div>

                        {benefits.map((benefit) => {
                            const Icon = benefit.icon;

                            return (
                                <div key={benefit.title} className="flex gap-3 lg:block">
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-xl text-orange-500 shadow-sm lg:mb-4">
                                        <Icon />
                                    </span>
                                    <div>
                                        <h3 className="font-extrabold text-gray-900">
                                            {benefit.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-gray-600">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-950 text-gray-300">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
                    <div>
                        <Link to="/" className="flex items-center gap-2 text-2xl font-black text-white">
                            <span>🍅</span>
                            Tomato<span className="text-orange-500">.</span>
                        </Link>
                        <p className="mt-3 text-sm text-gray-400">
                            Good food. Great moments.
                        </p>
                        <p className="mt-5 text-sm text-gray-400">
                            Made for food lovers, everywhere.
                        </p>
                    </div>

                    <FooterColumn
                        title="Quick Links"
                        links={[
                            { label: "Home", href: "#top" },
                            { label: "Restaurants", href: "#restaurants" },
                            { label: "Categories", href: "#categories" },
                            { label: "Offers", href: "#offers" },
                        ]}
                    />

                    <FooterColumn
                        title="Help & Support"
                        links={[
                            { label: "FAQs", href: "/faq" },
                            { label: "Contact Us", href: "/contact" },
                            { label: "Terms & Conditions", href: "/terms" },
                            { label: "Privacy Policy", href: "/privacy" },
                        ]}
                    />

                    <div>
                        <h3 className="font-bold text-white">Stay in the loop</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-400">
                            Subscribe for food inspiration and updates.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>

                <div className="border-t border-white/10">
                    <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-gray-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                        <p>© {new Date().getFullYear()} Tomato. All rights reserved.</p>
                        <p>
                            Made with <span className="text-red-400">♥</span> for food lovers
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}

function SectionHeading({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
                {eyebrow}
            </p>
            <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 sm:text-base">
                        {description}
                    </p>
                </div>
                <a
                    href="#restaurants"
                    className="inline-flex items-center gap-2 self-start text-sm font-bold text-orange-600 hover:text-orange-700 sm:self-auto"
                >
                    View all <FiArrowRight />
                </a>
            </div>
        </div>
    );
}

function FooterColumn({
    title,
    links,
}: {
    title: string;
    links: { label: string; href: string }[];
}) {
    return (
        <div>
            <h3 className="font-bold text-white">{title}</h3>
            <ul className="mt-4 space-y-3">
                {links.map((link) => (
                    <li key={link.label}>
                        <a
                            href={link.href}
                            className="text-sm text-gray-400 transition hover:text-orange-400"
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function NewsletterForm() {
    return (
        <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
                event.preventDefault();
            }}
        >
            <input
                type="email"
                required
                placeholder="Your email address"
                aria-label="Email address for newsletter"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white px-3 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-orange-400"
            />
            <button
                type="submit"
                className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
                <FiPlus />
            </button>
        </form>
    );
}
