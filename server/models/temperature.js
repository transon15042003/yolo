const axios = require("axios");
const db = require("../config/mongodb").getClient();

let mode = "automatic"; //Automatic or Manual
let temp = 0; // cần lấy giá trị mới nhất trong database
let min_temp = 21;
let max_temp = 27;
let fan = 0; // cần lấy giá trị mới nhất trong database

async function getTemp() {
    return { temp: temp };
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
    return { mode: mode };
}

async function setMode(value) {
    mode = value;
}

async function checkTemp(value) {
    try {
        if (value < min_temp) {
            if (fan == 1 && mode == "automatic") {
                await inact_fan();
                console.log(
                    "Automatic: Turning fan off due to low temperature"
                );
            } else if (mode == "manual") {
                console.log(
                    "Manual mode: Temperature is low - check fan settings"
                );
            }
        } else if (value > max_temp) {
            if (fan == 0 && mode == "automatic") {
                await act_fan();
                console.log(
                    "Automatic: Turning fan on due to high temperature"
                );
            } else if (mode == "manual") {
                console.log(
                    "Manual mode: Temperature is high - check fan settings"
                );
            }
        }

        // Log current state
        console.log(
            `Current state - Temp: ${value}, Fan: ${fan}, Mode: ${mode}`
        );
        return "Successful";
    } catch (err) {
        console.error("Error in checkTemp:", err);
        throw err;
    }
}

async function fetchLatestData() {
    try {
        const collection = db.collection("temperatures");
        const latestData = await collection.findOne(
            {},
            { sort: { timestamp: -1 } }
        );
        if (latestData) {
            temp = latestData.value;
            fan = latestData.fan || 0;
        }
    } catch (err) {
        console.error("Error fetching latest temperature data:", err);
    }
}

async function act_fan() {
    axios.put("http://localhost:8081/gatewayAppApi/fan", {
        fan: 1,
    });
    fan = 1;
}

async function inact_fan() {
    axios.put("http://localhost:8081/gatewayAppApi/fan", {
        fan: 0,
    });
    fan = 0;
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
};
