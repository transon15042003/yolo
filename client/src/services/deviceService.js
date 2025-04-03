const API_URL = import.meta.env.VITE_API_URL;
const GATEWAY_API_URL = import.meta.env.VITE_GATEWAY_API_URL;

const speedSettings = [
    { level: 0, label: "Tắt", power: 0 },
    { level: 1, label: "Mức 1", power: 60 },
    { level: 2, label: "Mức 2", power: 70 },
    { level: 3, label: "Mức 3", power: 80 },
    { level: 4, label: "Mức 4", power: 90 },
];

export const fetchDeviceStatus = async () => {
    try {
        const [ledRes, fanRes, ledModeRes, fanModeRes] = await Promise.all([
            fetch(`${API_URL}/api/light/ledState`),
            fetch(`${API_URL}/api/temperature/fan-power`),
            fetch(`${API_URL}/api/light/mode`), // Fetch LED mode
            fetch(`${API_URL}/api/temperature/mode`), // Fetch fan mode
        ]);

        const ledData = await ledRes.json();
        const fanData = await fanRes.json();
        const ledModeData = await ledModeRes.json();
        const fanModeData = await fanModeRes.json();

        return {
            led: ledData.ledState,
            fan:
                speedSettings.find((s) => s.power === fanData.fanPower)
                    ?.level || 0,
            ledMode: ledModeData.data.mode, // Add LED mode
            fanMode: fanModeData.data.mode, // Add fan mode
        };
    } catch (error) {
        console.error("Error fetching device status:", error);
        return { led: 0, fan: 0, ledMode: "manual", fanMode: "manual" };
    }
};

export const controlDevice = async (device, command) => {
    try {
        let url, body;

        if (device === "led") {
            url = `${GATEWAY_API_URL}/gatewayAppApi/led`;
            body = { state: command === "on" ? 1 : 0 };
        } else if (device === "fan") {
            url = `${GATEWAY_API_URL}/gatewayAppApi/fan`;
            const power =
                speedSettings.find((s) => s.level === command)?.power || 0;
            body = { power };
        }

        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        return await response.json();
    } catch (error) {
        console.error("Error controlling device:", error);
        throw error;
    }
};

export const setDeviceMode = async (device, mode) => {
    try {
        let url;
        if (device === "led") {
            url = `${API_URL}/api/light/mode`;
        } else if (device === "fan") {
            url = `${API_URL}/api/temperature/mode`;
        }

        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error setting ${device} mode to ${mode}:`, error);
        throw error;
    }
};
