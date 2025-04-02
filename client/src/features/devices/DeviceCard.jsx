import React from "react";
import { FiPower } from "react-icons/fi";
import { FaLightbulb, FaFan } from "react-icons/fa";

const iconMap = {
    led: <FaLightbulb size={24} />,
    fan: <FaFan size={24} />,
};

export default function DeviceCard({
    title,
    status,
    isActive,
    onToggle,
    icon,
    customContent,
}) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{title}</h2>
                <span
                    className={`px-2 py-1 rounded text-xs ${
                        isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {status}
                </span>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-gray-500 p-2 bg-gray-50 rounded-full">
                    {iconMap[icon]}
                </div>

                {customContent || (
                    <button
                        onClick={onToggle}
                        className={`p-2 rounded-full ${
                            isActive
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                        } text-white transition-colors`}
                    >
                        <FiPower size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
