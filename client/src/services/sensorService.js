import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchSensorData = async (sensorType, timeRange = "day") => {
    try {
        const response = await axios.get(
            `${API_URL}/api/${sensorType}/history`,
            { params: { range: timeRange } }
        );
        return response.data
            .map((item) => ({
                timestamp: item.timestamp,
                value: item.value,
            }))
            .sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));
    } catch (error) {
        console.error(`Error fetching ${sensorType} data:`, error);
        return [];
    }
};
