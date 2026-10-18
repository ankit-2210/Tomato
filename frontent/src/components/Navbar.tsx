
import { useEffect, useState } from "react";
import {
    Link,
    NavLink,
    useLocation,
    useSearchParams,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    BiMapPin,
    BiSearch,
    BiUser,
    BiMenu,
    BiX,
} from "react-icons/bi";
import { CgShoppingCart } from "react-icons/cg";
import { useAppData } from "../context/useAppData";

const suggestions = ["Pizza", "Burger", "Biryani", "Sushi", "Indian"];

const Navbar = () => {
    const { isAuth, city } = useAppData();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const isHomePage = location.pathname === "/";
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [focused, setFocused] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setSearch(searchParams.get("search") || "");
    }, [searchParams]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            if (!isHomePage) return;

            const nextParams = new URLSearchParams(searchParams);

            if (search.trim()) {
                nextParams.set("search", search.trim());
            } else {
                nextParams.delete("search");
            }

            if (nextParams.toString() !== searchParams.toString()) {
                setSearchParams(nextParams, { replace: true });
            }
        }, 350);

        return () => window.clearTimeout(timer);
    }, [search, isHomePage, searchParams, setSearchParams]);

    const navLinks = [
        { label: "Home", to: "/" },
        { label: "Restaurants", to: "/restaurants" },
        { label: "Categories", to: "/categories" },
        { label: "Offers", to: "/offers" },
    ];

    const chooseSuggestion = (value: string) => {
        setSearch(value);
        setFocused(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex shrink-0 items-center gap-2"
                    aria-label="Tomato home"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-2xl shadow-sm">
                        🍅
                    </span>
                    <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                        Tomato<span className="text-orange-500">.</span>
                    </span>
                </Link>

                {/* Location */}
                <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 md:flex">
                    <BiMapPin className="h-5 w-5 shrink-0 text-orange-500" />
                    <span className="max-w-32 truncate text-sm font-medium text-gray-700">
                        {city && city !== "Fetching Location..." ? city : "Your location"}
                    </span>
                </div>

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-7 lg:flex">
                    {navLinks.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                `border-b-2 py-2 text-sm font-semibold transition ${isActive
                                    ? "border-orange-500 text-orange-600"
                                    : "border-transparent text-gray-600 hover:text-orange-500"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/cart"
                        aria-label="Shopping cart"
                        className="relative rounded-full p-2 transition hover:bg-orange-50"
                    >
                        <CgShoppingCart className="h-7 w-7 text-gray-800" />
                    </Link>

                    {isAuth ? (
                        <Link
                            to="/account"
                            className="hidden items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 sm:flex"
                        >
                            <BiUser className="h-5 w-5" />
                            Account
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="hidden rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 sm:block"
                        >
                            Login
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((value) => !value)}
                        className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {mobileMenuOpen ? (
                            <BiX className="h-6 w-6" />
                        ) : (
                            <BiMenu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Homepage search */}
            {isHomePage && (
                <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 lg:hidden">
                    <SearchBar
                        search={search}
                        setSearch={setSearch}
                        focused={focused}
                        setFocused={setFocused}
                        chooseSuggestion={chooseSuggestion}
                    />
                </div>
            )}

            {isHomePage && (
                <div className="mx-auto hidden max-w-7xl px-6 pb-3 lg:block lg:px-8">
                    <div className="max-w-xl">
                        <SearchBar
                            search={search}
                            setSearch={setSearch}
                            focused={focused}
                            setFocused={setFocused}
                            chooseSuggestion={chooseSuggestion}
                        />
                    </div>
                </div>
            )}

            {/* Mobile navigation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-gray-100 bg-white lg:hidden"
                    >
                        <div className="flex flex-col gap-1 px-4 py-3">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {!isAuth && (
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-xl px-4 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                                >
                                    Login / Sign up
                                </Link>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};

interface SearchBarProps {
    search: string;
    setSearch: (value: string) => void;
    focused: boolean;
    setFocused: (value: boolean) => void;
    chooseSuggestion: (value: string) => void;
}

function SearchBar({
    search,
    setSearch,
    focused,
    setFocused,
    chooseSuggestion,
}: SearchBarProps) {
    return (
        <div className="relative">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    setFocused(false);
                }}
                className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100"
            >
                <BiSearch className="ml-2 h-5 w-5 shrink-0 text-gray-400" />

                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => window.setTimeout(() => setFocused(false), 150)}
                    type="search"
                    placeholder="Search restaurants, cuisines or dishes..."
                    className="min-w-0 flex-1 bg-transparent py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    aria-label="Search restaurants, cuisines or dishes"
                />

                <button
                    type="submit"
                    className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                    Search
                </button>
            </form>

            <AnimatePresence>
                {focused && search.trim() && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl"
                    >
                        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Popular searches
                        </p>

                        {suggestions
                            .filter((item) =>
                                item.toLowerCase().includes(search.toLowerCase())
                            )
                            .concat(
                                suggestions.some(
                                    (item) => item.toLowerCase() === search.toLowerCase()
                                )
                                    ? []
                                    : [search]
                            )
                            .slice(0, 5)
                            .map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => chooseSuggestion(item)}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                >
                                    <BiSearch className="h-4 w-4 text-gray-400" />
                                    {item}
                                </button>
                            ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Navbar;
