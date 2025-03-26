import React, { memo } from "react";
import LineChart from "../../components/charts/LineChart";

const SensorChartContainer = memo(
    ({ data, title, color, timeRange, label }) => {
        return (
            <LineChart
                data={data}
                dataKey="value"
                color={color}
                title={title}
                timeRange={timeRange}
                label={label}
            />
        );
    }
);

export default SensorChartContainer;
