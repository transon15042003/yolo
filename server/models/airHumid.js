const axios = require("axios");
const db = require("../config/mongodb").getClient();

var mode = "automatic"; //Automatic or Manual
var airHumid = 0; // cần lấy giá trị mới nhất trong database
var min_humid = 45;
var max_humid = 60;
var fan = 0; // cần lấy giá trị mới nhất trong database

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
    if (value < min_humid) {
        if (fan == 1 && mode == "automatic") {
            //   await inact_fan();
        } else if (mode != "automatic") {
            console.log("Warning: Air Humidity is low");
        }
    } else if (value > max_humid) {
        if (fan == 0 && mode == "automatic") {
            //   await act_fan();
        } else if (mode != "automatic") {
            console.log("Warning: Air Humidity is high");
        }
    }
    return "Successful";
}

async function fetchLatestData() {
    try {
        const collection = db.collection("air humidities");
        const latestData = await collection.findOne(
            {},
            { sort: { timestamp: -1 } }
        );
        if (latestData) {
            airHumid = latestData.value;
            fan = latestData.fan || 0; // Giả sử có trường 'fan' trong document
        }
    } catch (err) {
        console.error("Error fetching latest air humidity data:", err);
    }
}

// async function act_fan() {
//   axios.put("http://localhost:8081/gatewayAppApi/fan", {
//     fan: 1,
//   });
//   fan = 1;
// }

// async function inact_fan() {
//   axios.put("http://localhost:8081/gatewayAppApi/fan", {
//     fan: 0,
//   });
//   fan = 0;
// }

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
