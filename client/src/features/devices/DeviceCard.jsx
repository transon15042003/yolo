import React from "react";
import { FaLightbulb, FaFan, FaPowerOff } from "react-icons/fa";

const iconMap = (icon, isActive) =>
    ({
        led: (
            <FaLightbulb
                className={isActive ? "text-yellow-400" : "text-gray-500"}
                size={20}
            />
        ),
        fan: (
            <FaFan
                className={isActive ? "text-teal-400" : "text-gray-500"}
                size={20}
            />
        ),
    }[icon]);

export default function DeviceCard({
    title,
    status,
    isActive,
    onToggle,
    onToggleMode,
    mode,
    icon,
    customContent,
    bgColor = "bg-gray-800/50",
    borderColor = "border-gray-700",
    activeColor = "bg-blue-500",
    inactiveColor = "bg-gray-700",
}) {
    return (
        <div
            className={`p-4 rounded-xl border ${borderColor} ${bgColor} hover:shadow-lg transition-all flex flex-col gap-3`}
        >
            {/* Main Layout: Split into Left and Right */}
            <div className="flex justify-between">
                {/* Left Side: Icon, Title, and Status */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        {/* Device Icon */}
                        <div className="p-2 bg-gray-800 rounded-full">
                            {iconMap(icon, isActive)}
                        </div>
                        {/* Title */}
                        <h2 className="text-lg font-semibold text-white">
                            {title}
                        </h2>
                    </div>
                    {/* Status */}
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

                {/* Right Side: Controls */}
                <div className="flex flex-col items-end gap-2">
                    {/* Power Toggle or Custom Content */}
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
                            } text-white transition-colors shadow-md ${
                                mode === "automatic"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            disabled={mode === "automatic"}
                        >
                            <FaPowerOff size={16} />
                        </button>
                    )}

                    {/* Auto Toggle Switch with Label */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-300">
                            AUTO
                        </span>
                        <div
                            className={`relative inline-flex items-center h-8 w-16 rounded-full cursor-pointer transition-colors duration-300 ${
                                mode === "automatic"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            }`}
                            onClick={onToggleMode}
                            title={
                                mode === "automatic"
                                    ? "Tắt chế độ tự động"
                                    : "Bật chế độ tự động"
                            }
                        >
                            <span
                                className={`absolute text-xs font-medium text-white ${
                                    mode === "automatic" ? "left-2" : "right-2"
                                }`}
                            >
                                {mode === "automatic" ? "ON" : "OFF"}
                            </span>
                            <span
                                className={`inline-block h-6 w-6 bg-white rounded-full transform transition-transform duration-300 ${
                                    mode === "automatic"
                                        ? "translate-x-9"
                                        : "translate-x-1"
                                }`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
