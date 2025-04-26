const db = require("../config/mongodb").getClient();
const { FanEnergy } = require("../models/sensorModels");
const Settings = require("../models/settings");
// const { sendNotification } = require("../utils/notifications");

let mode = "automatic";
let temp = 0;
let min_temp = 21;
let max_temp = 27;
let fanPower = 0; // 0: off, 60-90: power levels
let lastStateChange = new Date(); // Khởi tạo dưới dạng Date
let currentHourEnergy = 0; // Năng lượng tích lũy trong giờ hiện tại

async function getTemp() {
    return { temp };
}

async function setTemp(value) {
    temp = value;
    await checkTemp(value);
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

    // Lưu min_temp và max_temp vào Settings model
    await Settings.updateFanSettings({
        minTemp: min,
        maxTemp: max,
    });
}

async function getMode() {
    return { mode };
}

async function setMode(value) {
    mode = value;
    try {
        await updateFanModeInDB();
        await checkTemp(temp);
    } catch (error) {
        console.error("Error in setMode:", error.message, error.stack);
        throw error;
    }
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
                // await sendNotification(
                //     "Temperature Alert",
                //     `Temperature dropped below minimum threshold: ${value}°C`
                // );
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
                // await sendNotification(
                //     "Temperature Alert",
                //     `Temperature exceeded maximum threshold: ${value}°C`
                // );
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
        const settings = await Settings.getSettings();

        // Lấy dữ liệu từ settings
        if (settings && settings.fanSettings) {
            min_temp = settings.fanSettings.minTemp || 21;
            max_temp = settings.fanSettings.maxTemp || 27;
            lastStateChange = settings.fanSettings.lastStateChange
                ? new Date(settings.fanSettings.lastStateChange)
                : new Date();
            currentHourEnergy = settings.fanSettings.currentHourEnergy || 0;
        } else {
            lastStateChange = new Date();
        }

        // Lấy dữ liệu nhiệt độ và trạng thái quạt mới nhất
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
            mode = latestFanData.mode;
        }

        // Tính currentHourEnergy từ lastStateChange đến thời điểm hiện tại
        const now = new Date();
        const currentHourStart = new Date(now);
        currentHourStart.setMinutes(0, 0, 0);

        const timeSinceLastChange = (now - lastStateChange) / 1000; // Thời gian (giây) kể từ lần thay đổi trạng thái trước
        if (fanPower > 0 && timeSinceLastChange > 0) {
            currentHourEnergy = fanPower * timeSinceLastChange; // Joules = Watts * Seconds
        } else {
            currentHourEnergy = 0;
        }

        // Cập nhật currentHourEnergy vào Settings
        await Settings.updateFanSettings({ currentHourEnergy });

        // Cập nhật hoặc tạo bản ghi FanEnergy cho giờ hiện tại
        await FanEnergy.findOneAndUpdate(
            { timestamp: currentHourStart },
            { $set: { energy: currentHourEnergy } },
            { upsert: true }
        );

        console.log(
            `Fetched latest fan data - Temp: ${temp}, Fan Power: ${fanPower}, Mode: ${mode}, Current Hour Energy: ${currentHourEnergy}J`
        );
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
        // Tính năng lượng tiêu thụ trước khi thay đổi trạng thái
        await updateFanEnergy();

        fanPower = power;
        lastStateChange = new Date(); // Đảm bảo lastStateChange là Date

        // Lưu lastStateChange và currentHourEnergy vào Settings
        await Settings.updateFanSettings({
            lastStateChange,
            currentHourEnergy,
        });

        await updateFanStateInDB();
        return { success: true };
    } catch (err) {
        console.error("Error setting fan power:", err);
        throw err;
    }
}

async function updateFanEnergy() {
    try {
        const now = new Date();
        const currentHourStart = new Date(now);
        currentHourStart.setMinutes(0, 0, 0);

        const timeSinceLastChange = (now - lastStateChange) / 1000; // Thời gian (giây) kể từ lần thay đổi trạng thái trước
        let energy = 0;

        if (fanPower > 0) {
            energy = fanPower * timeSinceLastChange; // Joules = Watts * Seconds
            currentHourEnergy += energy;
        }

        // Lưu năng lượng vào Settings và FanEnergy
        await Settings.updateFanSettings({ currentHourEnergy });
        await FanEnergy.findOneAndUpdate(
            { timestamp: currentHourStart },
            { $set: { energy: currentHourEnergy } },
            { upsert: true }
        );

        console.log(
            `Updated FanEnergy for ${currentHourStart}: ${currentHourEnergy}J`
        );
    } catch (err) {
        console.error("Error updating fan energy:", err);
        throw err;
    }
}

async function handleHourlyUpdate() {
    try {
        const now = new Date();
        const previousHourStart = new Date(now);
        previousHourStart.setHours(now.getHours() - 1, 0, 0, 0);
        const previousHourEnd = new Date(previousHourStart);
        previousHourEnd.setHours(previousHourStart.getHours() + 1);

        // Tính năng lượng cho giờ trước (từ đầu giờ đến cuối giờ)
        let energyToAdd = 0;
        if (fanPower > 0) {
            const timeInPreviousHour = Math.min(
                (previousHourEnd - lastStateChange) / 1000,
                3600 // Giới hạn tối đa 1 giờ (3600 giây)
            );
            if (timeInPreviousHour > 0) {
                energyToAdd = fanPower * timeInPreviousHour;
                currentHourEnergy += energyToAdd;
            }
        }

        // Cập nhật bản ghi cho giờ trước
        await FanEnergy.findOneAndUpdate(
            { timestamp: previousHourStart },
            { $set: { energy: currentHourEnergy } },
            { upsert: true }
        );

        // Reset năng lượng tích lũy cho giờ mới
        currentHourEnergy = 0;

        // Cập nhật currentHourEnergy vào Settings
        await Settings.updateFanSettings({ currentHourEnergy });

        // Tạo bản ghi cho giờ hiện tại
        const currentHourStart = new Date(now);
        currentHourStart.setMinutes(0, 0, 0);
        await FanEnergy.findOneAndUpdate(
            { timestamp: currentHourStart },
            { $set: { energy: 0 } },
            { upsert: true }
        );

        console.log(
            `Hourly fan update: Saved ${energyToAdd}J for ${previousHourStart}`
        );
    } catch (err) {
        console.error("Error in hourly fan update:", err);
        throw err;
    }
}

async function handleMidnightReset() {
    try {
        const now = new Date();
        const previousDay23Hour = new Date(now);
        previousDay23Hour.setDate(now.getDate() - 1);
        previousDay23Hour.setHours(23, 0, 0, 0);
        const midnight = new Date(now);
        midnight.setHours(0, 0, 0, 0);

        // Kiểm tra trạng thái quạt tại 0h
        if (fanPower > 0) {
            const timeFrom23hToMidnight = (midnight - lastStateChange) / 1000;
            if (timeFrom23hToMidnight > 0) {
                const energyToAdd = fanPower * timeFrom23hToMidnight;
                currentHourEnergy += energyToAdd;

                // Cập nhật bản ghi cho giờ 23 của ngày trước
                await FanEnergy.findOneAndUpdate(
                    { timestamp: previousDay23Hour },
                    { $set: { energy: currentHourEnergy } },
                    { upsert: true }
                );

                console.log(
                    `Midnight fan update: Added ${energyToAdd}J to hour 23 of previous day`
                );
            }
        } else {
            console.log(
                `Midnight fan update: Fan is off, kept hour 23 energy as is`
            );
        }

        // Reset năng lượng tích lũy cho ngày mới
        currentHourEnergy = 0;

        // Tạo bản ghi cho giờ 0 của ngày mới
        await FanEnergy.findOneAndUpdate(
            { timestamp: midnight },
            { $set: { energy: 0 } },
            { upsert: true }
        );

        // Cập nhật lastStateChange và currentHourEnergy vào Settings
        lastStateChange = midnight;
        await Settings.updateFanSettings({
            lastStateChange,
            currentHourEnergy,
        });

        console.log("Handled fan midnight reset");
    } catch (err) {
        console.error("Error in fan midnight reset:", err);
        throw err;
    }
}

async function updateFanStateInDB() {
    try {
        const collection = db.collection("temperatures");
        const result = await collection.findOneAndUpdate(
            {},
            {
                $set: {
                    fanPower: fanPower,
                    timestamp: String(Date.now()),
                },
            },
            {
                sort: { timestamp: -1 },
                returnDocument: "after",
            }
        );

        if (!result) {
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

async function updateFanModeInDB() {
    try {
        const collection = db.collection("fans");
        const result = await collection.findOneAndUpdate(
            {},
            {
                $set: {
                    mode: mode,
                    timestamp: String(Date.now()),
                },
            },
            {
                sort: { timestamp: -1 },
                returnDocument: "after",
            }
        );

        if (!result) {
            await collection.insertOne({
                timestamp: String(Date.now()),
                value: fanPower,
                mode,
            });
            console.log("No existing FAN record found, inserted a new one.");
        } else {
            console.log("Updated mode in the latest FAN record:", result);
        }
    } catch (err) {
        console.error("Error updating FAN mode in DB:", err);
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
    updateFanEnergy,
    handleHourlyUpdate,
    handleMidnightReset,
};
