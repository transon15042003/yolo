import React, { useEffect, useState } from "react";
import { fetchSensorData } from "../services/sensorService";
import SensorCard from "../features/dashboard/SensorCard";
import TimeRangeSelector from "../components/ui/TimeRangeSelector";
import SensorChartContainer from "../features/dashboard/SensorChartContainer";
import {
    getHumidityAlert,
    getTemperatureAlert,
    getLightAlert,
} from "../utils/getAlert";

export default function Dashboard() {
    const [sensorData, setSensorData] = useState({
        temp: [],
        humid: [],
        light: [],
    });
    const [timeRange, setTimeRange] = useState("day");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Dashboard - Smart Home IoT Platform";
        const loadData = async () => {
            try {
                let [temp, humid, light] = await Promise.all([
                    fetchSensorData("temp", timeRange),
                    fetchSensorData("air-humid", timeRange),
                    fetchSensorData("light", timeRange),
                ]);

                temp = temp.map((item) => ({
                    ...item,
                    value: item.value.toFixed(2),
                }));
                humid = humid.map((item) => ({
                    ...item,
                    value: item.value.toFixed(2),
                }));
                light = light.map((item) => ({
                    ...item,
                    value: item.value.toFixed(2),
                }));

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

    if (loading)
        return <div className="p-6 text-gray-300">Đang tải dữ liệu...</div>;

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                    Bảng Điều Khiển
                </h1>

                <TimeRangeSelector
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                    className="mb-8"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <SensorCard
                        title="Nhiệt độ"
                        value={
                            sensorData.temp[sensorData.temp.length - 1]?.value
                        }
                        unit="°C"
                        color="#ef4444" // Màu đỏ
                        bgColor="bg-gray-800/50"
                        borderColor="border-red-500/30" // Viền đỏ nhạt
                        alert={getTemperatureAlert(
                            sensorData.temp[sensorData.temp.length - 1]?.value
                        )}
                    />
                    <SensorCard
                        title="Độ ẩm"
                        value={
                            sensorData.humid[sensorData.humid.length - 1]?.value
                        }
                        unit="%"
                        color="#3b82f6"
                        bgColor="bg-gray-800/50"
                        borderColor="border-blue-500/30"
                        alert={getHumidityAlert(
                            sensorData.humid[sensorData.humid.length - 1]?.value
                        )}
                    />
                    <SensorCard
                        title="Ánh sáng"
                        value={
                            sensorData.light[sensorData.light.length - 1]?.value
                        }
                        unit="lux"
                        color="#fbbf24" // Màu vàng
                        bgColor="bg-gray-800/50"
                        borderColor="border-yellow-500/30" // Viền vàng nhạt
                        alert={getLightAlert(
                            sensorData.light[sensorData.light.length - 1]?.value
                        )}
                    />
                </div>

                <div className="space-y-8 bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                    <SensorChartContainer
                        data={sensorData.temp}
                        title="Biểu đồ nhiệt độ"
                        color="#ef4444"
                        timeRange={timeRange}
                        label="Nhiệt độ"
                        bgColor="bg-gray-800/20"
                    />
                    <SensorChartContainer
                        data={sensorData.humid}
                        title="Biểu đồ độ ẩm"
                        color="#3b82f6"
                        timeRange={timeRange}
                        label="Độ ẩm"
                        bgColor="bg-gray-800/20"
                    />
                    <SensorChartContainer
                        data={sensorData.light}
                        title="Biểu đồ ánh sáng"
                        color="#fbbf24"
                        timeRange={timeRange}
                        label="Độ sáng"
                        bgColor="bg-gray-800/20"
                    />
                </div>
            </div>
        </div>
    );
}
