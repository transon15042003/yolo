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
        <div>
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatTimestamp}
                        tick={{ fill: "#9CA3AF" }}
                        stroke="#4B5563"
                    />
                    <YAxis tick={{ fill: "#9CA3AF" }} stroke="#4B5563" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1F2937",
                            borderColor: "#374151",
                            borderRadius: "0.5rem",
                        }}
                        labelFormatter={(value) =>
                            `Thời gian: ${formatTimestamp(value)}`
                        }
                        formatter={formatTooltip}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={2}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        dot={false}
                        name={label}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
