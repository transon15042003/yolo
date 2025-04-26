const API_URL = import.meta.env.VITE_API_URL;

export const fetchAutoSettings = async () => {
    try {
        const response = await fetch(`${API_URL}/api/settings`);
        const data = await response.json();
        return {
            minTemp: data.data.fanSettings.minTemp,
            maxTemp: data.data.fanSettings.maxTemp,
            minLightEnergy: data.data.lightSettings.minLightEnergy,
            maxLightEnergy: data.data.lightSettings.maxLightEnergy,
        };
    } catch (error) {
        console.error("Error fetching auto settings:", error);
        throw error;
    }
};

export const updateAutoSettings = async (settings) => {
    try {
        const fanSettings = {
            minTemp: settings.minTemp,
            maxTemp: settings.maxTemp,
        };
        const ledSettings = {
            minLightEnergy: settings.minLightEnergy,
            maxLightEnergy: settings.maxLightEnergy,
        };

        const [fanResponse, ledResponse] = await Promise.all([
            fetch(`${API_URL}/api/settings/fan`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fanSettings),
            }),
            fetch(`${API_URL}/api/settings/led`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ledSettings),
            }),
        ]);

        const fanData = await fanResponse.json();
        const ledData = await ledResponse.json();

        if (!fanData.success || !ledData.success) {
            throw new Error("Failed to update settings");
        }

        return { fanData, ledData };
    } catch (error) {
        console.error("Error updating auto settings:", error);
        throw error;
    }
};
