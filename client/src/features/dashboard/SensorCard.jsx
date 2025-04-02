import React from "react";
import tempIcon from "../../assets/images/temp.png";
import humidIcon from "../../assets/images/humidity.png";
import lightIcon from "../../assets/images/light.png";

const iconMap = {
    "Nhiệt độ": tempIcon,
    "Độ ẩm": humidIcon,
    "Ánh sáng": lightIcon,
};

export default function SensorCard({
    title,
    value,
    unit,
    color,
    bgColor = "bg-gray-800/50",
    borderColor = "border-gray-700",
}) {
    return (
        <div
            className={`p-4 rounded-xl border ${borderColor} ${bgColor} hover:shadow-lg transition-all h-full`}
        >
            <div className="flex items-center">
                <div className="mr-4 p-2 bg-gray-800 rounded-full">
                    <img
                        src={iconMap[title]}
                        alt={title}
                        className="w-8 h-8 object-contain filter"
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                        {title}
                    </h3>
                    <div className="flex items-end mt-1">
                        <span className="text-2xl font-bold text-white">
                            {value || "--"}
                        </span>
                        <span className="ml-1 text-gray-400 text-sm">
                            {unit}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
