import React, { memo } from "react";
import LineChart from "../../components/charts/LineChart";

const SensorChartContainer = memo(
    ({ data, title, color, timeRange, label, bgColor = "bg-gray-800/30" }) => {
        return (
            <div className={`p-4 rounded-xl border border-gray-700 ${bgColor}`}>
                <LineChart
                    data={data}
                    dataKey="value"
                    color={color}
                    title={title}
                    timeRange={timeRange}
                    label={label}
                />
            </div>
        );
    }
);

export default SensorChartContainer;
