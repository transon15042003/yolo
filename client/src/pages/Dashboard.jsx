import React, { useEffect, useState } from "react";
import { fetchSensorData } from "../services/sensorService";
import SensorCard from "../features/dashboard/SensorCard";
import TimeRangeSelector from "../components/ui/TimeRangeSelector";
import SensorChartContainer from "../features/dashboard/SensorChartContainer";

export default function Dashboard() {
    const [sensorData, setSensorData] = useState({
        temp: [],
        humid: [],
        light: [],
    });
    const [timeRange, setTimeRange] = useState("day");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [temp, humid, light] = await Promise.all([
                    fetchSensorData("temp", timeRange),
                    fetchSensorData("air-humid", timeRange),
                    fetchSensorData("light", timeRange),
                ]);

                setSensorData({
                    temp,
                    humid,
                    light,
                });
            } catch (error) {
                console.error("Error loading sensor data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        const interval = setInterval(
            loadData,
            timeRange === "day" ? 30000 : 60000
        );

        return () => clearInterval(interval);
    }, [timeRange]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <TimeRangeSelector
                timeRange={timeRange}
                setTimeRange={setTimeRange}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <SensorCard
                    title="Nhiệt độ"
                    value={sensorData.temp[sensorData.temp.length - 1]?.value}
                    unit="°C"
                    color="#ef4444"
                />
                <SensorCard
                    title="Độ ẩm"
                    value={sensorData.humid[sensorData.humid.length - 1]?.value}
                    unit="%"
                    color="#3b82f6"
                />
                <SensorCard
                    title="Ánh sáng"
                    value={sensorData.light[sensorData.light.length - 1]?.value}
                    unit="lux"
                    color="#f97316"
                />
            </div>

            <div className="space-y-8">
                <SensorChartContainer
                    data={sensorData.temp}
                    title="Biểu đồ nhiệt độ"
                    color="#ef4444"
                    timeRange={timeRange}
                    label="Nhiệt độ"
                />
                <SensorChartContainer
                    data={sensorData.humid}
                    title="Biểu đồ độ ẩm"
                    color="#3b82f6"
                    timeRange={timeRange}
                    label="Độ ẩm"
                />
                <SensorChartContainer
                    data={sensorData.light}
                    title="Biểu đồ ánh sáng"
                    color="#f97316"
                    timeRange={timeRange}
                    label="Độ sáng"
                />
            </div>
        </div>
    );
}
