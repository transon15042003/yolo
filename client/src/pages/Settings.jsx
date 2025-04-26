import React, { useEffect, useState } from "react";
import {
    fetchAutoSettings,
    updateAutoSettings,
} from "../services/settingsService";

export default function Settings() {
    const [settings, setSettings] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = "Settings - Smart Home IoT Platform";

        const loadSettings = async () => {
            try {
                const data = await fetchAutoSettings();
                setSettings(data);
            } catch (error) {
                console.error("Error loading settings:", error);
                setError("Không thể tải thông số");
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    const handleUpdate = async () => {
        try {
            await updateAutoSettings(settings);
            alert("Thông số đã được cập nhật!");
        } catch (error) {
            console.error("Error updating settings:", error);
            setError("Lỗi khi cập nhật thông số");
        }
    };

    const SettingInput = ({ label, name, value, unit, onChange }) => (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
            <label className="text-gray-300 font-medium w-40">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-400">{unit}</span>
            </div>
        </div>
    );

    if (loading)
        return <div className="p-6 text-gray-300">Đang tải cài đặt...</div>;
    if (error) return <div className="p-6 text-red-400">{error}</div>;

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                    Cài Đặt
                </h1>

                <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 max-w-lg">
                    <h2 className="text-xl font-semibold text-white mb-6">
                        Cài Đặt Ngưỡng Tự Động Bật/Tắt
                    </h2>

                    <SettingInput
                        label="Nhiệt độ tối thiểu"
                        name="minTemp"
                        value={settings.minTemp}
                        unit="°C"
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                minTemp: Number(e.target.value),
                            })
                        }
                    />
                    <SettingInput
                        label="Nhiệt độ tối đa"
                        name="maxTemp"
                        value={settings.maxTemp}
                        unit="°C"
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                maxTemp: Number(e.target.value),
                            })
                        }
                    />
                    <SettingInput
                        label="Ánh sáng tối thiểu"
                        name="minLightEnergy"
                        value={settings.minLightEnergy}
                        unit="lux"
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                minLightEnergy: Number(e.target.value),
                            })
                        }
                    />
                    <SettingInput
                        label="Ánh sáng tối đa"
                        name="maxLightEnergy"
                        value={settings.maxLightEnergy}
                        unit="lux"
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                maxLightEnergy: Number(e.target.value),
                            })
                        }
                    />

                    <button
                        onClick={handleUpdate}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Lưu Cài Đặt
                    </button>
                </div>
            </div>
        </div>
    );
}
