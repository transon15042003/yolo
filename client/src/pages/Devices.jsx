import React, { useState, useEffect } from "react";
import {
    fetchDeviceStatus,
    controlDevice,
    setDeviceMode,
} from "../services/deviceService.js";
import DeviceCard from "../features/devices/DeviceCard.jsx";
import FanSpeedControl from "../features/devices/FanSpeedControl.jsx";

export default function Devices() {
    const [devices, setDevices] = useState({
        led: 0,
        fan: 0,
        ledMode: "manual",
        fanMode: "manual",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = "Manage devices - Smart Home IoT Platform";

        const loadDeviceStatus = async () => {
            try {
                const status = await fetchDeviceStatus();
                setDevices(status);
                setError(null);
            } catch (error) {
                console.error("Error loading device status:", error);
                setError("Không thể tải trạng thái thiết bị");
            } finally {
                setLoading(false);
            }
        };

        loadDeviceStatus();
        const interval = setInterval(loadDeviceStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const toggleLight = async () => {
        try {
            const newState = devices.led === 0 ? 1 : 0;
            await controlDevice("led", newState === 1 ? "on" : "off");
            setDevices((prev) => ({ ...prev, led: newState }));
        } catch (error) {
            console.error("Error toggling led:", error);
            setError("Lỗi khi điều khiển đèn");
        }
    };

    const changeFanSpeed = async (level) => {
        try {
            await controlDevice("fan", level);
            setDevices((prev) => ({ ...prev, fan: level }));
        } catch (error) {
            console.error("Error changing fan speed:", error);
            setError("Lỗi khi điều khiển quạt");
        }
    };

    const toggleLedMode = async () => {
        try {
            const newMode =
                devices.ledMode === "automatic" ? "manual" : "automatic";
            await setDeviceMode("led", newMode);
            setDevices((prev) => ({ ...prev, ledMode: newMode }));
        } catch (error) {
            console.error("Error toggling LED mode:", error);
            setError("Lỗi khi thay đổi chế độ đèn");
        }
    };

    const toggleFanMode = async () => {
        try {
            const newMode =
                devices.fanMode === "automatic" ? "manual" : "automatic";
            await setDeviceMode("fan", newMode);
            setDevices((prev) => ({ ...prev, fanMode: newMode }));
        } catch (error) {
            console.error("Error toggling fan mode:", error);
            setError("Lỗi khi thay đổi chế độ quạt");
        }
    };

    if (loading)
        return <div className="p-6 text-gray-300">Đang tải thiết bị...</div>;
    if (error) return <div className="p-6 text-red-400">{error}</div>;

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                    Quản Lý Thiết Bị
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DeviceCard
                        title="Đèn LED"
                        status={devices.led ? "Đang Bật" : "Đang Tắt"}
                        isActive={devices.led}
                        onToggle={toggleLight}
                        onToggleMode={toggleLedMode} // Pass mode toggle function
                        mode={devices.ledMode} // Pass current mode
                        icon="led"
                        bgColor="bg-gray-800/50"
                        borderColor="border-blue-500/30"
                        activeColor="bg-blue-500"
                        inactiveColor="bg-gray-700"
                    />

                    <DeviceCard
                        title="Quạt"
                        status={
                            devices.fan === 0
                                ? "Đang Tắt"
                                : `Đang Bật (Mức ${devices.fan})`
                        }
                        isActive={devices.fan > 0}
                        onToggleMode={toggleFanMode} // Pass mode toggle function
                        mode={devices.fanMode} // Pass current mode
                        icon="fan"
                        bgColor="bg-gray-800/50"
                        borderColor="border-teal-500/30"
                        activeColor="bg-teal-500"
                        inactiveColor="bg-gray-700"
                        customContent={
                            <FanSpeedControl
                                currentSpeed={devices.fan}
                                onChangeSpeed={changeFanSpeed}
                                compactMode
                                activeColor="bg-teal-500"
                                inactiveColor="bg-gray-700"
                                disabled={devices.fanMode === "automatic"} // Disable speed control in auto mode
                            />
                        }
                    />
                </div>
            </div>
        </div>
    );
}
