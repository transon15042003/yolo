const axios = require("axios");
const db = require("../config/mongodb").getClient();

let mode = "automatic";
let temp = 0;
let min_temp = 21;
let max_temp = 27;
let fanPower = 0; // 0: tắt, 60-90: các mức công suất

async function getTemp() {
    return { temp };
}

async function setTemp(value) {
    temp = value;
}

async function get_minmax_temp() {
    return { minTemp: min_temp, maxTemp: max_temp };
}

async function set_minmax_temp(min, max) {
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
                await setFanPower(0); // Tắt quạt
                console.log(
                    "Automatic: Turning fan off due to low temperature"
                );
            } else if (value > max_temp && fanPower === 0) {
                await setFanPower(60); // Bật quạt mức cơ bản
                console.log(
                    "Automatic: Turning fan on due to high temperature"
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
        return { success: true };
    } catch (err) {
        console.error("Error setting fan power:", err);
        throw err;
    }
}

async function updateFanStateInDB() {
    try {
        const collection = db.collection("temperatures");
        await collection.insertOne({
            timestamp: new Date().toISOString(),
            value: temp,
            fanPower,
        });
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
