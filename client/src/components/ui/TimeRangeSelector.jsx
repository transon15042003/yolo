import React from "react";

export default function TimeRangeSelector({
    timeRange,
    setTimeRange,
    className = "",
}) {
    return (
        <div className={`flex space-x-2 ${className}`}>
            {["day", "month", "year"].map((range) => (
                <button
                    key={range}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        timeRange === range
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => setTimeRange(range)}
                >
                    {range === "day" && "Trong ngày"}
                    {range === "month" && "Trong tháng"}
                    {range === "year" && "Trong năm"}
                </button>
            ))}
        </div>
    );
}
