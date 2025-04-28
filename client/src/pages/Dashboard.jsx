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
    const [dailySensorData, setDailySensorData] = useState({
        temp: [],
        humid: [],
        light: [],
    });
    const [prefetchedData, setPrefetchedData] = useState({
        day: { temp: [], humid: [], light: [] },
        month: { temp: [], humid: [], light: [] },
        year: { temp: [], humid: [], light: [] },
    });
    const [timeRange, setTimeRange] = useState("day");
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        document.title = "Dashboard - Smart Home IoT Platform";

        // Hàm fetch dữ liệu cho một timeRange cụ thể
        const fetchDataForRange = async (range) => {
            try {
                let [temp, humid, light] = await Promise.all([
                    fetchSensorData("temp", range),
                    fetchSensorData("air-humid", range),
                    fetchSensorData("light", range),
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

                return { temp, humid, light };
            } catch (error) {
                console.error(`Error fetching data for ${range}:`, error);
                return { temp: [], humid: [], light: [] };
            }
        };

        // Hàm prefetch dữ liệu cho tất cả các bộ lọc
        const prefetchAllData = async () => {
            const [dayData, monthData, yearData] = await Promise.all([
                fetchDataForRange("day"),
                fetchDataForRange("month"),
                fetchDataForRange("year"),
            ]);

            setPrefetchedData({
                day: dayData,
                month: monthData,
                year: yearData,
            });

            // Cập nhật dữ liệu ban đầu
            setDailySensorData(dayData);
            setSensorData(dayData);
            setIsInitialLoad(false);
        };

        // Thực thi prefetch khi trang bắt đầu
        prefetchAllData();

        // Cập nhật định kỳ
        const interval = setInterval(
            () => {
                prefetchAllData();
            },
            timeRange === "day" ? 30000 : 60000
        );

        return () => clearInterval(interval);
    }, []);

    // Cập nhật sensorData khi timeRange thay đổi
    useEffect(() => {
        if (!isInitialLoad) {
            setSensorData(prefetchedData[timeRange]);
        }
    }, [timeRange, prefetchedData]);

    if (isInitialLoad) {
        return <div className="p-6 text-gray-300">Đang tải dữ liệu...</div>;
    }

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
                            dailySensorData.temp[
                                dailySensorData.temp.length - 1
                            ]?.value
                        }
                        unit="°C"
                        color="#ef4444" // Màu đỏ
                        bgColor="bg-gray-800/50"
                        borderColor="border-red-500/30" // Viền đỏ nhạt
                        alert={getTemperatureAlert(
                            dailySensorData.temp[
                                dailySensorData.temp.length - 1
                            ]?.value
                        )}
                    />
                    <SensorCard
                        title="Độ ẩm"
                        value={
                            dailySensorData.humid[
                                dailySensorData.humid.length - 1
                            ]?.value
                        }
                        unit="%"
                        color="#3b82f6"
                        bgColor="bg-gray-800/50"
                        borderColor="border-blue-500/30"
                        alert={getHumidityAlert(
                            dailySensorData.humid[
                                dailySensorData.humid.length - 1
                            ]?.value
                        )}
                    />
                    <SensorCard
                        title="Ánh sáng"
                        value={
                            dailySensorData.light[
                                dailySensorData.light.length - 1
                            ]?.value
                        }
                        unit="lux"
                        color="#fbbf24" // Màu vàng
                        bgColor="bg-gray-800/50"
                        borderColor="border-yellow-500/30" // Viền vàng nhạt
                        alert={getLightAlert(
                            dailySensorData.light[
                                dailySensorData.light.length - 1
                            ]?.value
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
