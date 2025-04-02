import React, { useState, useEffect } from "react";
import { fetchDeviceStatus, controlDevice } from "../services/deviceService.js";
import DeviceCard from "../features/devices/DeviceCard.jsx";
import FanSpeedControl from "../features/devices/FanSpeedControl.jsx";

export default function Devices() {
    const [devices, setDevices] = useState({
        led: 0,
        fan: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDeviceStatus = async () => {
            try {
                const status = await fetchDeviceStatus();
                setDevices(status);
                setError(null);

                console.log(status);
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

    if (loading) return <div className="p-6">Đang tải...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Quản Lý Thiết Bị</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DeviceCard
                    title="Đèn"
                    status={devices.led ? "Đang Bật" : "Đang Tắt"}
                    isActive={devices.led}
                    onToggle={toggleLight}
                    icon="led"
                />

                <DeviceCard
                    title="Quạt"
                    status={
                        devices.fan === 0
                            ? "Đang Tắt"
                            : `Đang Bật Ở Mức ${devices.fan}`
                    }
                    isActive={devices.fan > 0}
                    icon="fan"
                    customContent={
                        <FanSpeedControl
                            currentSpeed={devices.fan}
                            onChangeSpeed={changeFanSpeed}
                            compactMode
                        />
                    }
                />
            </div>
        </div>
    );
}
