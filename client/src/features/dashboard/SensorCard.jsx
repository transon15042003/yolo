import React from "react";

// Import các hình ảnh
import tempIcon from "../../assets/images/temp.png";
import humidIcon from "../../assets/images/humidity.png";
import lightIcon from "../../assets/images/light.png";

const iconMap = {
    "Nhiệt độ": tempIcon,
    "Độ ẩm": humidIcon,
    "Ánh sáng": lightIcon,
};

export default function SensorCard({ title, value, unit, color }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center h-full hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mr-4 p-2 bg-gray-50 rounded-full">
                <img
                    src={iconMap[title]}
                    alt={title}
                    className="w-10 h-10 object-contain"
                />
            </div>

            <div className="flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                <div className="flex items-end mt-2">
                    <span className="text-3xl font-bold" style={{ color }}>
                        {value || "--"}
                    </span>
                    <span className="ml-1 text-gray-500 text-lg">{unit}</span>
                </div>
            </div>
        </div>
    );
}
