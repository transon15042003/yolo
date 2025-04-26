const db = require("../config/mongodb").getClient();
const { LedEnergy } = require("../models/sensorModels");
const Settings = require("../models/settings");

let mode = "automatic";
let LightEnergy = 50;
let minLightEnergy = 40;
let maxLightEnergy = 60;
let ledState = 0; // 0: off, 1: on
let ledCapacity = 30; // LED capacity in watts
let lastStateChange = new Date(); // Khởi tạo dưới dạng Date
let currentHourEnergy = 0; // Năng lượng tích lũy trong giờ hiện tại

async function getLightEnergy() {
    return { LightEnergy };
}

async function setLightEnergy(value) {
    LightEnergy = value;
    await checkLightEnergy(value);
}

async function getMode() {
    return { mode };
}

async function setMode(value) {
    mode = value;
    try {
        await updateLedModeInDB();
        await checkLightEnergy(LightEnergy);
    } catch (error) {
        console.error("Error in setMode:", error.message, error.stack);
        throw error;
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

    // Lưu minLightEnergy và maxLightEnergy vào Settings model
    await Settings.updateLedSettings({
        minLightEnergy,
        maxLightEnergy,
    });
}

async function getLedCapacity() {
    return { ledCapacity };
}

async function setLedCapacity(value) {
    ledCapacity = value;
    try {
        await updateLedCapacityInDB();
    } catch (error) {
        console.error("Error in setLedCapacity:", error.message, error.stack);
        throw error;
    }
}

async function checkLightEnergy(value) {
    try {
        if (mode === "automatic") {
            if (value < minLightEnergy && ledState === 0) {
                await setLedState(1);
                console.log(
                    "Automatic: Turning LED on due to low light energy"
                );
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
                await setLedState(0);
                console.log(
                    "Automatic: Turning LED off due to high light energy"
                );
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
        const settings = await Settings.getSettings();

        // Lấy dữ liệu từ settings
        if (settings && settings.ledSettings) {
            minLightEnergy = settings.ledSettings.minLightEnergy || 40;
            maxLightEnergy = settings.ledSettings.maxLightEnergy || 60;
            lastStateChange = settings.ledSettings.lastStateChange
                ? new Date(settings.ledSettings.lastStateChange)
                : new Date();
            currentHourEnergy = settings.ledSettings.currentHourEnergy || 0;
        } else {
            lastStateChange = new Date();
        }

        // Lấy dữ liệu ánh sáng và trạng thái LED mới nhất
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

        // Tính currentHourEnergy từ lastStateChange đến thời điểm hiện tại
        const now = new Date();
        const currentHourStart = new Date(now);
        currentHourStart.setMinutes(0, 0, 0);

        const timeSinceLastChange = (now - lastStateChange) / 1000; // Thời gian (giây) kể từ lần thay đổi trạng thái trước
        if (ledState === 1 && timeSinceLastChange > 0) {
            currentHourEnergy = ledCapacity * timeSinceLastChange; // Joules = Watts * Seconds
        } else {
            currentHourEnergy = 0;
        }

        // Cập nhật currentHourEnergy vào Settings
        await Settings.updateLedSettings({ currentHourEnergy });

        // Cập nhật hoặc tạo bản ghi LedEnergy cho giờ hiện tại
        await LedEnergy.findOneAndUpdate(
            { timestamp: currentHourStart },
            { $set: { energy: currentHourEnergy } },
            { upsert: true }
        );

        console.log(
            `Fetched latest LED data - Light Energy: ${LightEnergy}, LED State: ${ledState}, Mode: ${mode}, Current Hour Energy: ${currentHourEnergy}J`
        );
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
        // Tính năng lượng tiêu thụ trước khi thay đổi trạng thái
        if (ledState === 1 && state === 0) {
            await updateLedEnergy();
        }

        ledState = state;
        lastStateChange = new Date(); // Đảm bảo lastStateChange là Date

        // Lưu lastStateChange và currentHourEnergy vào Settings
        await Settings.updateLedSettings({
            lastStateChange,
            currentHourEnergy,
        });

        await updateLedStateInDB();
        return { success: true };
    } catch (err) {
        console.error("Error setting LED state:", err);
        throw err;
    }
}

async function updateLedEnergy() {
    try {
        const now = new Date();
        const currentHourStart = new Date(now);
        currentHourStart.setMinutes(0, 0, 0);

        const timeSinceLastChange = (now - lastStateChange) / 1000; // Thời gian (giây) kể từ lần thay đổi trạng thái trước
        let energy = 0;
        energy = ledCapacity * timeSinceLastChange; // Joules = Watts * Seconds
        currentHourEnergy += energy;

        // Lưu năng lượng vào Settings và LedEnergy
        await Settings.updateLedSettings({ currentHourEnergy });
        await LedEnergy.findOneAndUpdate(
            { timestamp: currentHourStart },
            { $set: { energy: currentHourEnergy } },
            { upsert: true }
        );

        console.log(
            `Updated LED energy for ${currentHourStart}: ${currentHourEnergy}J`
        );
    } catch (err) {
        console.error("Error updating LED energy:", err);
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
        if (ledState === 1) {
            const timeInPreviousHour = Math.min(
                (previousHourEnd - lastStateChange) / 1000,
                3600 // Giới hạn tối đa 1 giờ (3600 giây)
            );
            if (timeInPreviousHour > 0) {
                energyToAdd = ledCapacity * timeInPreviousHour;
                currentHourEnergy += energyToAdd;
            }
        }

        // Cập nhật bản ghi cho giờ trước
        await LedEnergy.findOneAndUpdate(
            { timestamp: previousHourStart },
            { $set: { energy: currentHourEnergy } },
            { upsert: true }
        );

        // Reset năng lượng tích lũy cho giờ mới
        currentHourEnergy = 0;

        // Cập nhật currentHourEnergy vào Settings
        await Settings.updateLedSettings({ currentHourEnergy });

        // Tạo bản ghi cho giờ hiện tại
        const currentHourStart = new Date(now);
        currentHourStart.setMinutes(0, 0, 0);
        await LedEnergy.findOneAndUpdate(
            { timestamp: currentHourStart },
            { $set: { energy: 0 } },
            { upsert: true }
        );

        console.log(
            `Hourly LED update: Saved ${energyToAdd}J for ${previousHourStart}`
        );
    } catch (err) {
        console.error("Error in hourly LED update:", err);
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

        // Kiểm tra trạng thái LED tại 0h
        if (ledState === 1) {
            const timeFrom23hToMidnight = (midnight - lastStateChange) / 1000;
            if (timeFrom23hToMidnight > 0) {
                const energyToAdd = ledCapacity * timeFrom23hToMidnight;
                currentHourEnergy += energyToAdd;

                // Cập nhật bản ghi cho giờ 23 của ngày trước
                await LedEnergy.findOneAndUpdate(
                    { timestamp: previousDay23Hour },
                    { $set: { energy: currentHourEnergy } },
                    { upsert: true }
                );

                console.log(
                    `Midnight LED update: Added ${energyToAdd}J to hour 23 of previous day`
                );
            }
        } else {
            console.log(
                `Midnight LED update: LED is off, kept hour 23 energy as is`
            );
        }

        // Reset năng lượng tích lũy cho ngày mới
        currentHourEnergy = 0;

        // Tạo bản ghi cho giờ 0 của ngày mới
        await LedEnergy.findOneAndUpdate(
            { timestamp: midnight },
            { $set: { energy: 0 } },
            { upsert: true }
        );

        // Cập nhật lastStateChange và currentHourEnergy vào Settings
        lastStateChange = midnight;
        await Settings.updateLedSettings({
            lastStateChange,
            currentHourEnergy,
        });

        console.log("Handled LED midnight reset");
    } catch (err) {
        console.error("Error in LED midnight reset:", err);
        throw err;
    }
}

async function updateLedStateInDB() {
    try {
        const collection = db.collection("leds");
        const result = await collection.findOneAndUpdate(
            {},
            {
                $set: {
                    value: ledState,
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
        const result = await collection.findOneAndUpdate(
            {},
            {
                $set: {
                    ledCapacity: ledCapacity,
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
    updateLedEnergy,
    handleHourlyUpdate,
    handleMidnightReset,
};
