import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HCMUT_logo from "../assets/images/HCMUT_official_logo.png";
import { FiSun, FiMoon, FiBell, FiUser, FiLogOut } from "react-icons/fi";

function Header() {
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3); // Số thông báo chưa đọc

    // Kiểm tra route hiện tại để highlight menu
    const isActive = (path) => location.pathname === path;

    return (
        <header
            className={`sticky top-0 z-50 ${
                darkMode ? "bg-gray-900" : "bg-white"
            } shadow-md transition-colors duration-300`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo và menu chính */}
                    <div className="flex items-center space-x-8">
                        <img
                            src={HCMUT_logo}
                            alt="HCMUT Logo"
                            className="h-10"
                        />

                        <nav className="hidden md:flex space-x-6">
                            <Link
                                to="/dashboard"
                                className={`flex items-center px-1 pt-1 text-sm font-medium ${
                                    isActive("/dashboard")
                                        ? "border-b-2 border-blue-500 text-blue-600"
                                        : "text-gray-700 hover:text-blue-500"
                                }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/devices"
                                className={`flex items-center px-1 pt-1 text-sm font-medium ${
                                    isActive("/devices")
                                        ? "border-b-2 border-blue-500 text-blue-600"
                                        : "text-gray-700 hover:text-blue-500"
                                }`}
                            >
                                Thiết Bị
                            </Link>
                        </nav>
                    </div>

                    {/* Các chức năng phụ */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            {darkMode ? (
                                <FiSun size={20} />
                            ) : (
                                <FiMoon size={20} />
                            )}
                        </button>

                        <div className="relative">
                            <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative">
                                <FiBell size={20} />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="relative group">
                            <button className="flex items-center space-x-1">
                                <FiUser size={20} />
                                <span className="hidden md:inline">Admin</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Hồ sơ
                                </Link>
                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                    <FiLogOut className="mr-2" /> Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
