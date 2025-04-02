import React from "react";
import { FiPower } from "react-icons/fi";
import { FaLightbulb, FaFan } from "react-icons/fa";

const iconMap = {
    led: <FaLightbulb className="text-yellow-400" size={20} />,
    fan: <FaFan className="text-teal-400" size={20} />,
};

export default function DeviceCard({
    title,
    status,
    isActive,
    onToggle,
    icon,
    customContent,
    bgColor = "bg-gray-800/50",
    borderColor = "border-gray-700",
    activeColor = "bg-blue-500",
    inactiveColor = "bg-gray-700",
}) {
    return (
        <div
            className={`p-4 rounded-xl border ${borderColor} ${bgColor} hover:shadow-lg transition-all`}
        >
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        isActive
                            ? "bg-green-900/50 text-green-400 border border-green-400/30"
                            : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
                    }`}
                >
                    {status}
                </span>
            </div>

            <div className="flex items-center justify-between">
                <div className="p-2 bg-gray-800 rounded-full">
                    {iconMap[icon]}
                </div>

                {customContent || (
                    <button
                        onClick={onToggle}
                        className={`p-2 rounded-full ${
                            isActive
                                ? `${activeColor} hover:${activeColor.replace(
                                      "500",
                                      "600"
                                  )}`
                                : `${inactiveColor} hover:bg-gray-600`
                        } text-white transition-colors shadow-md`}
                    >
                        <FiPower size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
