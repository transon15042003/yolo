const API_URL = import.meta.env.VITE_API_URL;

export const fetchPowerConsumption = async (
    deviceType,
    timeRange = "month"
) => {
    try {
        if (deviceType === "total") {
            // Fetch both fan and led data
            const [fanData, ledData] = await Promise.all([
                fetch(
                    `${API_URL}/api/energy?deviceType=fan&range=${timeRange}`
                ).then((res) => res.json()),
                fetch(
                    `${API_URL}/api/energy?deviceType=led&range=${timeRange}`
                ).then((res) => res.json()),
            ]);

            // Combine the data by summing energy values at each timestamp
            const combinedData = {};
            [...fanData, ...ledData].forEach((item) => {
                const timestamp = new Date(item.timestamp).getTime();
                if (!combinedData[timestamp]) {
                    combinedData[timestamp] = { timestamp, value: 0 };
                }
                combinedData[timestamp].value += item.energy / 1000000; // Convert Wh to kWh
            });

            return Object.values(combinedData).sort(
                (a, b) => a.timestamp - b.timestamp
            );
        } else {
            const response = await fetch(
                `${API_URL}/api/energy?deviceType=${deviceType}&range=${timeRange}`
            );
            const data = await response.json();
            return data
                .map((item) => ({
                    timestamp: new Date(item.timestamp).getTime(),
                    value: item.energy / 1000000, // Convert Wh to kWh
                }))
                .sort((a, b) => a.timestamp - b.timestamp);
        }
    } catch (error) {
        console.error(
            `Error fetching power consumption for ${deviceType}:`,
            error
        );
        return [];
    }
};

export const fetchPowerConsumptionChange = async (deviceType) => {
    try {
        // Fetch data for the current hour, previous hour, previous day, and previous month
        const now = new Date();
        const oneHour = 60 * 60 * 1000;
        const oneDay = 24 * oneHour;
        const oneMonth = 30 * oneDay; // Approximate

        const [currentHourData, prevDayData, prevMonthData] = await Promise.all(
            [
                fetchPowerConsumption(deviceType, "day"), // Last 24 hours
                fetchPowerConsumption(deviceType, "month"), // Last 30 days
                fetchPowerConsumption(deviceType, "year"), // Last 12 months
            ]
        );

        // Calculate current hour's consumption (last entry in the last 24 hours)
        const currentHourValue =
            currentHourData[currentHourData.length - 1]?.value || 0;

        // Calculate previous hour's consumption (second-to-last entry in the last 24 hours)
        const prevHourValue =
            currentHourData[currentHourData.length - 2]?.value || 0;

        // Calculate previous day's consumption (last entry from the previous day)
        const prevDayTimestamp = now.getTime() - oneDay;
        const prevDayEntry = prevDayData.findLast(
            (item) => item.timestamp <= prevDayTimestamp
        );
        const prevDayValue = prevDayEntry?.value || 0;

        // Calculate previous month's consumption (last entry from the previous month)
        const prevMonthTimestamp = now.getTime() - oneMonth;
        const prevMonthEntry = prevMonthData.findLast(
            (item) => item.timestamp <= prevMonthTimestamp
        );
        const prevMonthValue = prevMonthEntry?.value || 0;

        // Calculate percentage changes
        const calcPercentageChange = (current, previous) => {
            if (previous === 0) return current === 0 ? 0 : 100; // Handle division by zero
            return ((current - previous) / previous) * 100;
        };

        return {
            hourChange: calcPercentageChange(currentHourValue, prevHourValue),
            dayChange: calcPercentageChange(currentHourValue, prevDayValue),
            monthChange: calcPercentageChange(currentHourValue, prevMonthValue),
        };
    } catch (error) {
        console.error(
            `Error calculating power consumption change for ${deviceType}:`,
            error
        );
        return { hourChange: 0, dayChange: 0, monthChange: 0 };
    }
};
