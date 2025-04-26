import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiMenu,
    FiX,
    FiHome,
    FiInfo,
    FiGrid,
    FiMonitor,
    FiSettings,
    FiZap,
    FiSliders,
} from "react-icons/fi";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { path: "/", name: "Trang chủ", icon: <FiHome /> },
        { path: "/about", name: "Giới thiệu", icon: <FiInfo /> },
        { path: "/features", name: "Tính năng", icon: <FiGrid /> },
        { path: "/dashboard", name: "Dashboard", icon: <FiMonitor /> },
        { path: "/devices", name: "Thiết bị", icon: <FiSettings /> },
        { path: "/power-consumption", name: "Tiêu thụ", icon: <FiZap /> },
        {
            path: "/settings",
            name: "Cài đặt",
            icon: <FiSliders />,
        },
    ];

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-gray-900/90 backdrop-blur-md border-b border-gray-800"
                    : "bg-gray-900/50 backdrop-blur-md"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 mr-2"></div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                                SmartHome IoT
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    location.pathname === item.path
                                        ? "text-blue-400"
                                        : "text-gray-300 hover:text-white"
                                }`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <motion.div
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={{
                    open: { opacity: 1, height: "auto" },
                    closed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                                location.pathname === item.path
                                    ? "bg-gray-800 text-blue-400"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`}
                        >
                            <span className="mr-2">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </div>
            </motion.div>
        </header>
    );
};

export default Header;
