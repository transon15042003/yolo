import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export default function SensorChart({
    data,
    dataKey,
    color,
    title,
    timeRange,
    label,
}) {
    // Hàm định dạng timestamp theo timeRange
    const formatTimestamp = (timestamp) => {
        try {
            const date = new Date(parseInt(timestamp));

            switch (timeRange) {
                case "day":
                    return format(date, "HH:mm");
                case "month":
                    return format(date, "dd/MM");
                case "year":
                    return format(date, "MM/yyyy");
                default:
                    return format(date, "HH:mm");
            }
        } catch (error) {
            console.error("Error formatting timestamp:", timestamp, error);
            return "";
        }
    };

    // Hàm format tooltip
    const formatTooltip = (value, name, props) => {
        let unit = "";
        if (title.includes("nhiệt độ")) unit = "°C";
        if (title.includes("độ ẩm")) unit = "%";
        if (title.includes("ánh sáng")) unit = "lux";

        return [`${value} ${unit}`, title];
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatTimestamp}
                    />
                    <YAxis />
                    <Tooltip
                        labelFormatter={(value) =>
                            `Thời gian: ${formatTimestamp(value)}`
                        }
                        formatter={formatTooltip}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        activeDot={{ r: 8 }}
                        name={label}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
