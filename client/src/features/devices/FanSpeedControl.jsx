import React from "react";
import { FaFan } from "react-icons/fa";

const speedSettings = [
    { level: 0, label: "Tắt", power: 0 },
    { level: 1, label: "1", power: 60 },
    { level: 2, label: "2", power: 70 },
    { level: 3, label: "3", power: 80 },
    { level: 4, label: "4", power: 90 },
];

export default function FanSpeedControl({
    currentSpeed,
    onChangeSpeed,
    compactMode,
    activeColor = "bg-teal-500",
    inactiveColor = "bg-gray-700",
}) {
    const getFanSpeedStyle = (power) => {
        if (power === 0) return { animationDuration: "0s" };
        const duration = 2000 - power * 15;
        return { animationDuration: `${duration}ms` };
    };

    return (
        <div className={`${compactMode ? "mt-2" : "space-y-3"}`}>
            {compactMode ? (
                <div className="flex items-center gap-2">
                    <FaFan
                        className={`${
                            currentSpeed > 0
                                ? "text-teal-400 animate-spin"
                                : "text-gray-500"
                        }`}
                        style={getFanSpeedStyle(
                            speedSettings.find((s) => s.level === currentSpeed)
                                ?.power || 0
                        )}
                        size={20}
                    />
                    <div className="flex gap-1">
                        {speedSettings.map((setting) => (
                            <button
                                key={setting.level}
                                onClick={() => onChangeSpeed(setting.level)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                                    currentSpeed === setting.level
                                        ? `${activeColor} text-white shadow-md`
                                        : `${inactiveColor} text-gray-300 hover:bg-gray-600`
                                } transition-colors`}
                                title={`Mức ${setting.level} (${setting.power}W)`}
                            >
                                {setting.level}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-3">
                        <FaFan
                            className={`${
                                currentSpeed > 0
                                    ? "text-teal-400 animate-spin"
                                    : "text-gray-500"
                            }`}
                            style={getFanSpeedStyle(
                                speedSettings.find(
                                    (s) => s.level === currentSpeed
                                )?.power || 0
                            )}
                            size={24}
                        />
                        <div className="text-sm text-gray-300">
                            Công suất:{" "}
                            <span className="font-medium">
                                {speedSettings.find(
                                    (s) => s.level === currentSpeed
                                )?.power || 0}
                                W
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {speedSettings.map((setting) => (
                            <button
                                key={setting.level}
                                onClick={() => onChangeSpeed(setting.level)}
                                className={`py-2 rounded-md text-sm ${
                                    currentSpeed === setting.level
                                        ? `${activeColor} text-white shadow-md`
                                        : `${inactiveColor} text-gray-300 hover:bg-gray-600`
                                } transition-colors`}
                            >
                                {setting.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
