import React from "react";

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4 px-6 mt-auto">
            <div className="max-w-7xl mx-auto text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Smart Home App. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
