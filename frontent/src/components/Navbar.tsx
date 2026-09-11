import { useEffect, useState } from 'react'

import { useAppData } from '../context/useAppData'
import { useLocation, useSearchParams, Link } from 'react-router-dom'

import { CgShoppingCart } from 'react-icons/cg'
import { BiMapPin, BiSearch } from 'react-icons/bi'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
    const { isAuth, city } = useAppData()
    const location = useLocation()

    const isHomePage = location.pathname === '/'
    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [focused, setFocused] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search) {
                setSearchParams({ search })
            } else {
                setSearchParams({})
            }
        }, 400)
        return () => clearTimeout(timer)
    }, [search, setSearchParams])

    return (
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
                    Tomato<span className="text-red-500">.</span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link to="/cart" className="relative group">
                        <CgShoppingCart className="h-7 w-7 text-gray-700 group-hover:text-red-500 transition" />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full animate-pulse">
                            0
                        </span>
                    </Link>
                    {isAuth ? (
                        <Link to="/account" className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition">
                            Account
                        </Link>
                    ) : (
                        <Link to="/login" className="px-4 py-1.5 rounded-full border border-gray-300 text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition">
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {isHomePage && (
                <div className="max-w-5xl mx-auto px-6 pb-4">
                    <div className="flex items-center gap-4 bg-white shadow-md rounded-2xl px-4 py-3 border border-gray-100 relative">
                        <div className="flex items-center gap-2 min-w-fit text-gray-600">
                            <BiMapPin className="h-5 w-5 text-red-500" />
                            <span className="text-sm font-medium truncate max-w-30">
                                {city}
                            </span>
                        </div>
                        <div className="h-6 w-px bg-gray-200" />
                        {/* Search */}
                        <div className="flex items-center flex-1 gap-2">
                            <BiSearch className="text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setTimeout(() => setFocused(false), 150)}
                                type="text"
                                placeholder="Search restaurants, dishes..."
                                className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Suggestions Dropdown */}
                        <AnimatePresence>
                            {focused && search && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50"
                                >
                                    <p className="text-xs text-gray-400 mb-2">Suggestions</p>
                                    <div className="flex flex-col gap-2 text-sm text-gray-700">
                                        <span onClick={() => {
                                            setSearch("Pizza");
                                            setFocused(false);
                                        }}
                                            className="hover:text-red-500 cursor-pointer"
                                        >
                                            Pizza
                                        </span>
                                        <span
                                            onClick={() => {
                                                setSearch("Burger");
                                                setFocused(false);
                                            }}
                                            className="hover:text-red-500 cursor-pointer"
                                        >
                                            Burger
                                        </span>
                                        <span
                                            onClick={() => {
                                                setSearch("Biryani");
                                                setFocused(false);
                                            }}
                                            className="hover:text-red-500 cursor-pointer"
                                        >
                                            Biryani
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
