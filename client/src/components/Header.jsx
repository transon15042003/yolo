import React from "react";
import { Link } from "react-router-dom";
import HCMUT_logo from "../assets/images/HCMUT_official_logo.png";

function Header() {
    return (
        <header className="p-4 bg-white shadow-md">
            <div className="max-w-7xl mx-auto flex items-center">
                <img src={HCMUT_logo} alt="HCMUT Logo" className="h-12 mr-8" />
                <nav className="flex gap-8">
                    <Link
                        to="/"
                        className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        to="/smartHome"
                        className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                    >
                        Smart Home
                    </Link>
                    <Link
                        to="/weather"
                        className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                    >
                        Weather
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
