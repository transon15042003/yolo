const db = require("../config/mongodb").getClient();

let mode = "automatic";
let airHumid = 0;
let min_humid = 45;
let max_humid = 60;

async function getHumid() {
    return { humid: airHumid };
}

async function setHumid(value) {
    airHumid = value;
}

async function get_minmax_humid() {
    return { minHumid: min_humid, maxHumid: max_humid };
}

async function set_minmax_humid(min, max) {
    min_humid = min;
    max_humid = max;
}

async function getMode() {
    return { mode: mode };
}

async function setMode(value) {
    mode = value;
}

async function checkHumid(value) {
    try {
        if (value < min_humid) {
            console.log("Warning: Air Humidity is low");
        } else if (value > max_humid) {
            console.log("Warning: Air Humidity is high");
        }
        return "Successful";
    } catch (err) {
        console.error("Error in checkHumid:", err);
        throw err;
    }
}

async function fetchLatestData() {
    try {
        const collection = db.collection("air_humidities");
        const latestData = await collection.findOne(
            {},
            { sort: { timestamp: -1 } }
        );
        if (latestData) {
            airHumid = latestData.value;
        }
    } catch (err) {
        console.error("Error fetching latest air humidity data:", err);
        throw err;
    }
}

module.exports = {
    getHumid,
    setHumid,
    getMode,
    setMode,
    get_minmax_humid,
    set_minmax_humid,
    checkHumid,
    fetchLatestData,
};
