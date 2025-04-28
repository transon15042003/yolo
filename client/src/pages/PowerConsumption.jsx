import React, { useEffect, useState } from "react";
import SensorChart from "../components/charts/LineChart";
import TimeRangeSelector from "../components/ui/TimeRangeSelector";
import PowerCard from "../features/powerConsumption/PowerCard";
import {
    fetchPowerConsumption,
    fetchPowerConsumptionChange,
} from "../services/powerService";

export default function PowerConsumption() {
    const [powerData, setPowerData] = useState({
        led: [],
        fan: [],
        total: [],
    });
    const [changes, setChanges] = useState({
        led: { hourChange: 0, dayChange: 0, monthChange: 0 },
        fan: { hourChange: 0, dayChange: 0, monthChange: 0 },
        total: { hourChange: 0, dayChange: 0, monthChange: 0 },
    });
    const [timeRange, setTimeRange] = useState("month");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Power Consumption - Smart Home IoT Platform";

        const fetchData = async () => {
            try {
                const [led, fan, total, ledChanges, fanChanges, totalChanges] =
                    await Promise.all([
                        fetchPowerConsumption("led", timeRange),
                        fetchPowerConsumption("fan", timeRange),
                        fetchPowerConsumption("total", timeRange),
                        fetchPowerConsumptionChange("led"),
                        fetchPowerConsumptionChange("fan"),
                        fetchPowerConsumptionChange("total"),
                    ]);

                setPowerData({
                    led,
                    fan,
                    total,
                });
                setChanges({
                    led: ledChanges,
                    fan: fanChanges,
                    total: totalChanges,
                });
            } catch (error) {
                console.error("Error fetching power consumption data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    if (loading)
        return <div className="p-6 text-gray-300">Đang tải dữ liệu...</div>;

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                    Quản Lý Tiêu Thụ Điện Năng
                </h1>

                <TimeRangeSelector
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                    className="mb-8"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <PowerCard
                        title="Đèn LED"
                        value={powerData.led[powerData.led.length - 1]?.value}
                        changes={changes.led}
                        unit="kWh"
                        color="#3b82f6"
                        bgColor="bg-gray-800/50"
                        borderColor="border-blue-500/30"
                        timeRange={timeRange}
                    />
                    <PowerCard
                        title="Quạt"
                        value={powerData.fan[powerData.fan.length - 1]?.value}
                        changes={changes.fan}
                        unit="kWh"
                        color="#10b981"
                        bgColor="bg-gray-800/50"
                        borderColor="border-teal-500/30"
                        timeRange={timeRange}
                    />
                    <PowerCard
                        title="Tổng tiêu thụ"
                        value={
                            powerData.total[powerData.total.length - 1]?.value
                        }
                        changes={changes.total}
                        unit="kWh"
                        color="#ef4444"
                        bgColor="bg-gray-800/50"
                        borderColor="border-red-500/30"
                        timeRange={timeRange}
                    />
                </div>

                <div className="space-y-8 bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                    <SensorChart
                        data={powerData.led}
                        dataKey="value"
                        title="Tiêu thụ điện của Đèn LED"
                        color="#3b82f6"
                        timeRange={timeRange}
                        label="Đèn LED"
                        bgColor="bg-gray-800/20"
                    />
                    <SensorChart
                        data={powerData.fan}
                        dataKey="value"
                        title="Tiêu thụ điện của Quạt"
                        color="#10b981"
                        timeRange={timeRange}
                        label="Quạt"
                        bgColor="bg-gray-800/20"
                    />
                    <SensorChart
                        data={powerData.total}
                        dataKey="value"
                        title="Tổng tiêu thụ điện"
                        color="#ef4444"
                        timeRange={timeRange}
                        label="Tổng"
                        bgColor="bg-gray-800/20"
                    />
                </div>
            </div>
        </div>
    );
}
