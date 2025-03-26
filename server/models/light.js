const axios = require("axios");
const db = require("../config/mongodb").getClient();

let mode = "automatic";
let LightEnergy = 50;
let minLightEnergy = 40;
let maxLightEnergy = 60;
let light = 0; // get the newest value from the database

async function getLightEnergy() {
    return { LightEnergy: LightEnergy };
}

async function setLightEnergy(value) {
    LightEnergy = value;
}

async function getMode() {
    return { mode: mode };
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
    if (value < minLightEnergy) {
        if (light == 1) {
            await inact_light();
        }
    } else if (value > maxLightEnergy) {
        if (light == 0) {
            await act_light();
        }
    }
    return "Successful";
}

async function fetchLatestData() {
    try {
        const collection = db.collection("Light Condition");
        const latestData = await collection.findOne(
            {},
            { sort: { timestamp: -1 } }
        );
        if (latestData) {
            LightEnergy = latestData.value;
            light = latestData.light || 0;
        }
    } catch (err) {
        console.error("Error fetching latest light data:", err);
    }
}

async function act_light() {
    axios.put("http://localhost:8081/gatewayAppApi/light", {
        light: 1,
    });
    light = 1;
}

async function inact_light() {
    axios.put("http://localhost:8081/gatewayAppApi/light", {
        light: 0,
    });
    light = 0;
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
};
