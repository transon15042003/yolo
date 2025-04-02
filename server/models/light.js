const db = require("../config/mongodb").getClient();

let mode = "automatic";
let LightEnergy = 50;
let minLightEnergy = 40;
let maxLightEnergy = 60;
let ledState = 0; // 0: tắt, 1: bật

async function getLightEnergy() {
    return { LightEnergy };
}

async function setLightEnergy(value) {
    LightEnergy = value;
}

async function getMode() {
    return { mode };
}

async function setMode(value) {
    mode = value;
}

async function getMinMaxLightEnergy() {
    return { minLightEnergy, maxLightEnergy };
}

async function setMinMaxLightEnergy(min, max) {
    minLightEnergy = min;
    maxLightEnergy = max;
}

async function checkLightEnergy(value) {
    try {
        if (mode === "automatic") {
            if (value < minLightEnergy && ledState === 1) {
                await setLedState(0);
            } else if (value > maxLightEnergy && ledState === 0) {
                await setLedState(1);
            }
        }
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
        return { success: true };
    } catch (err) {
        console.error("Error setting LED state:", err);
        throw err;
    }
}

async function updateLedStateInDB() {
    try {
        const collection = db.collection("lights");
        await collection.insertOne({
            timestamp: new Date().toISOString(),
            value: LightEnergy,
            ledState,
        });
    } catch (err) {
        console.error("Error updating LED state in DB:", err);
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
};
