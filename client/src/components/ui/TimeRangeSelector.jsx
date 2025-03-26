import React from "react";

export default function TimeRangeSelector({ timeRange, setTimeRange }) {
    return (
        <div className="flex space-x-2 mb-4">
            <button
                className={`px-4 py-2 rounded-md ${
                    timeRange === "day"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                }`}
                onClick={() => setTimeRange("day")}
            >
                Trong ngày
            </button>
            <button
                className={`px-4 py-2 rounded-md ${
                    timeRange === "month"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                }`}
                onClick={() => setTimeRange("month")}
            >
                Trong tháng
            </button>
            <button
                className={`px-4 py-2 rounded-md ${
                    timeRange === "year"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                }`}
                onClick={() => setTimeRange("year")}
            >
                Theo năm
            </button>
        </div>
    );
}
