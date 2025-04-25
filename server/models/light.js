const db = require("../config/mongodb").getClient();

let mode = "automatic";
let LightEnergy = 50;
let minLightEnergy = 40;
let maxLightEnergy = 60;
let ledState = 0; // 0: off, 1: on
let ledCapacity = 30; // LED capacity in watts

async function getLightEnergy() {
    return { LightEnergy };
}

async function setLightEnergy(value) {
    LightEnergy = value;
    await checkLightEnergy(value); // Trigger automation check whenever light energy is updated
}

async function getMode() {
    return { mode };
}

async function setMode(value) {
    mode = value;
    try {
        await updateLedModeInDB();
        await checkLightEnergy(LightEnergy); // Trigger automation check whenever mode is updated
    } catch (error) {
        console.error("Error in setMode:", error.message, error.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to set mode",
        });
    }
}

async function getMinMaxLightEnergy() {
    return { minLightEnergy, maxLightEnergy };
}

async function setMinMaxLightEnergy(min, max) {
    if (min >= max) {
        throw new Error(
            "Minimum light energy must be less than maximum light energy"
        );
    }
    minLightEnergy = min;
    maxLightEnergy = max;
}

async function getLedCapacity() {
    return { ledCapacity };
}

async function setLedCapacity(value) {
    ledCapacity = value;
    try {
        await updateLedCapacityInDB(); // Update LED capacity in the database
    } catch (error) {
        console.error("Error in setLedCapacity:", error.message, error.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to set LED capacity",
        });
    }
}

async function checkLightEnergy(value) {
    try {
        if (mode === "automatic") {
            if (value < minLightEnergy && ledState === 0) {
                await setLedState(1); // Turn LED on
                console.log(
                    "Automatic: Turning LED on due to low light energy"
                );
                // Publish to MQTT to turn on the LED
                global.ada.publish(
                    process.env.LED_SENSOR,
                    "1",
                    { qos: 1, retain: false },
                    (error) => {
                        if (error) {
                            console.error("Error publishing LED state:", error);
                        }
                    }
                );
            } else if (value > maxLightEnergy && ledState === 1) {
                await setLedState(0); // Turn LED off
                console.log(
                    "Automatic: Turning LED off due to high light energy"
                );
                // Publish to MQTT to turn off the LED
                global.ada.publish(
                    process.env.LED_SENSOR,
                    "0",
                    { qos: 1, retain: false },
                    (error) => {
                        if (error) {
                            console.error("Error publishing LED state:", error);
                        }
                    }
                );
            }
        }
        console.log(
            `Current state - Light Energy: ${value}, LED State: ${ledState}, Mode: ${mode}`
        );
        return "Successful";
    } catch (err) {
        console.error("Error in checkLightEnergy:", err);
        throw err;
    }
}

async function fetchLatestData() {
    try {
        const lights = db.collection("lights");
        const leds = db.collection("leds");

        const latestLightData = await lights.findOne(
            {},
            { sort: { timestamp: -1 } }
        );
        const latestLedData = await leds.findOne(
            {},
            { sort: { timestamp: -1 } }
        );

        if (latestLightData && latestLedData) {
            LightEnergy = latestLightData.value;
            ledState = latestLedData.value;
            mode = latestLedData.mode;
        }
        return "Successful";
    } catch (err) {
        console.error("Error fetching latest light data:", err);
        throw err;
    }
}

async function getLedState() {
    return { ledState };
}

async function setLedState(state) {
    try {
        ledState = state;
        await updateLedStateInDB();
        return { success: true };
    } catch (err) {
        console.error("Error setting LED state:", err);
        throw err;
    }
}

async function updateLedStateInDB() {
    try {
        const collection = db.collection("leds");
        // Find the most recent record and update its ledState
        const result = await collection.findOneAndUpdate(
            {}, // Match any document (we'll sort to get the latest)
            {
                $set: {
                    value: ledState, // Update the ledState field
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
                value: ledState,
            });
            console.log("No existing LED record found, inserted a new one.");
        } else {
            console.log("Updated ledState in the latest LED record:", result);
        }
    } catch (err) {
        console.error("Error updating LED state in DB:", err);
        throw err;
    }
}

async function updateLedModeInDB() {
    try {
        const collection = db.collection("leds");
        // Find the most recent record and update its mode
        const result = await collection.findOneAndUpdate(
            {}, // Match any document (we'll sort to get the latest)
            {
                $set: {
                    mode: mode, // Update the mode field
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
                value: ledState,
                ledCapacity: ledCapacity,
                mode: mode,
            });
            console.log("No existing LED record found, inserted a new one.");
        } else {
            console.log("Updated mode in the latest LED record:", result);
        }
    } catch (err) {
        console.error("Error updating LED mode in DB:", err);
        throw err;
    }
}

async function updateLedCapacityInDB() {
    try {
        const collection = db.collection("leds");
        // Find the most recent record and update its ledCapacity
        const result = await collection.findOneAndUpdate(
            {}, // Match any document (we'll sort to get the latest)
            {
                $set: {
                    ledCapacity: ledCapacity, // Update the ledCapacity field
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
                value: ledState,
                ledCapacity: ledCapacity,
                mode: mode,
            });
            console.log("No existing LED record found, inserted a new one.");
        } else {
            console.log(
                "Updated ledCapacity in the latest LED record:",
                result
            );
        }
    } catch (err) {
        console.error("Error updating LED capacity in DB:", err);
        throw err;
    }
}

module.exports = {
    getMode,
    setMode,
    getLightEnergy,
    setLightEnergy,
    getMinMaxLightEnergy,
    setMinMaxLightEnergy,
    checkLightEnergy,
    fetchLatestData,
    getLedState,
    setLedState,
    getLedCapacity,
    // setLedCapacity,
    updateLedStateInDB,
};
