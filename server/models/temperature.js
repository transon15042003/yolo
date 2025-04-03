const db = require("../config/mongodb").getClient();
const { sendNotification } = require("../utils/notifications");

let mode = "automatic";
let temp = 0;
let min_temp = 21;
let max_temp = 27;
let fanPower = 0; // 0: off, 60-90: power levels

async function getTemp() {
    return { temp };
}

async function setTemp(value) {
    temp = value;
    await checkTemp(value); // Trigger automation check whenever temperature is updated
}

async function get_minmax_temp() {
    return { minTemp: min_temp, maxTemp: max_temp };
}

async function set_minmax_temp(min, max) {
    if (min >= max) {
        throw new Error(
            "Minimum temperature must be less than maximum temperature"
        );
    }
    min_temp = min;
    max_temp = max;
}

async function getMode() {
    return { mode };
}

async function setMode(value) {
    mode = value;
}

async function checkTemp(value) {
    try {
        if (mode === "automatic") {
            if (value < min_temp && fanPower > 0) {
                await setFanPower(0);
                console.log(
                    "Automatic: Turning fan off due to low temperature"
                );
                global.ada.publish(
                    process.env.FAN_SENSOR,
                    "0",
                    { qos: 1, retain: false },
                    (error) => {
                        if (error) {
                            console.error("Error publishing fan power:", error);
                        }
                    }
                );
                await sendNotification(
                    "Temperature Alert",
                    `Temperature dropped below minimum threshold: ${value}°C`
                );
            } else if (value > max_temp && fanPower === 0) {
                await setFanPower(70);
                console.log(
                    "Automatic: Turning fan on at level 2 due to high temperature"
                );
                global.ada.publish(
                    process.env.FAN_SENSOR,
                    "70",
                    { qos: 1, retain: false },
                    (error) => {
                        if (error) {
                            console.error("Error publishing fan power:", error);
                        }
                    }
                );
                await sendNotification(
                    "Temperature Alert",
                    `Temperature exceeded maximum threshold: ${value}°C`
                );
            }
        }
        console.log(
            `Current state - Temp: ${value}, Fan Power: ${fanPower}W, Mode: ${mode}`
        );
        return "Successful";
    } catch (err) {
        console.error("Error in checkTemp:", err);
        throw err;
    }
}

async function fetchLatestData() {
    try {
        const temperatures = db.collection("temperatures");
        const fans = db.collection("fans");

        const latestTempData = await temperatures.findOne(
            {},
            { sort: { timestamp: -1 } }
        );
        const latestFanData = await fans.findOne(
            {},
            { sort: { timestamp: -1 } }
        );

        if (latestTempData && latestFanData) {
            temp = latestTempData.value;
            fanPower = latestFanData.value || 0;
        }
    } catch (err) {
        console.error("Error fetching latest temperature data:", err);
        throw err;
    }
}

async function getFanPower() {
    return { fanPower };
}

async function setFanPower(power) {
    try {
        fanPower = power;
        await updateFanStateInDB();
        return { success: true };
    } catch (err) {
        console.error("Error setting fan power:", err);
        throw err;
    }
}

async function updateFanStateInDB() {
    try {
        const collection = db.collection("temperatures");
        // Find the most recent record and update its fanPower
        const result = await collection.findOneAndUpdate(
            {}, // Match any document (we'll sort to get the latest)
            {
                $set: {
                    fanPower: fanPower, // Update the fanPower field
                    timestamp: String(Date.now()), // Optionally update the timestamp to reflect the modification time
                },
            },
            {
                sort: { timestamp: -1 }, // Sort by timestamp in descending order to get the most recent record
                returnDocument: "after", // Return the updated document
            }
        );

        if (!result) {
            // If no record exists, insert a new one as a fallback
            await collection.insertOne({
                timestamp: String(Date.now()),
                value: temp,
                fanPower,
            });
            console.log(
                "No existing temperature record found, inserted a new one."
            );
        } else {
            console.log(
                "Updated fanPower in the latest temperature record:",
                result
            );
        }
    } catch (err) {
        console.error("Error updating fan state in DB:", err);
        throw err;
    }
}

module.exports = {
    getTemp,
    setTemp,
    getMode,
    setMode,
    get_minmax_temp,
    set_minmax_temp,
    checkTemp,
    fetchLatestData,
    getFanPower,
    setFanPower,
    updateFanStateInDB,
};
