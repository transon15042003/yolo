// require("dotenv").config();
// const mqtt = require("mqtt");
// const axios = require("axios");

// // Cấu hình Adafruit IO
// const ADAFRUIT_IO_USERNAME = process.env.ADA_USERNAME;
// const ADAFRUIT_IO_KEY = process.env.ADA_PASSWORD;
// const FEEDS = {
//     TEMPERATURE: `${ADAFRUIT_IO_USERNAME}/feeds/temp`,
//     HUMIDITY: `${ADAFRUIT_IO_USERNAME}/feeds/air-humid`,
//     LIGHT: `${ADAFRUIT_IO_USERNAME}/feeds/light`,
// };

// // Kết nối MQTT
// const client = mqtt.connect("mqtt://io.adafruit.com", {
//     username: ADAFRUIT_IO_USERNAME,
//     password: ADAFRUIT_IO_KEY,
// });

// client.on("connect", () => {
//     console.log("Connected to Adafruit IO MQTT server");
//     startPublishing();
// });

// client.on("error", (err) => {
//     console.error("MQTT error:", err);
// });

// // Hàm tạo dữ liệu ngẫu nhiên
// function generateRandomData() {
//     const now = new Date();
//     return {
//         temperature: Math.floor(Math.random() * 30 + 10), // 10-40°C
//         humidity: Math.floor(Math.random() * 30 + 40), // 40-70%
//         light: Math.floor(Math.random() * 40 + 30), // 30-70 lux
//         timestamp: now.toISOString(),
//     };
// }

// // Gửi dữ liệu lên Adafruit IO
// async function publishData() {
//     const data = generateRandomData();

//     try {
//         // Gửi qua MQTT
//         client.publish(FEEDS.TEMPERATURE, data.temperature.toString());
//         client.publish(FEEDS.HUMIDITY, data.humidity.toString());
//         client.publish(FEEDS.LIGHT, data.light.toString());

//         console.log("Published data:", {
//             temperature: `${data.temperature}°C`,
//             humidity: `${data.humidity}%`,
//             light: `${data.light} lux`,
//         });

//         // Đồng bộ với server của bạn (tuỳ chọn)
//         // await syncWithLocalServer(data);
//     } catch (err) {
//         console.error("Publish error:", err);
//     }
// }

// // Đồng bộ với server local (tuỳ chọn)
// async function syncWithLocalServer(data) {
//     try {
//         await axios.post("http://localhost:8080/api/sensor-data", {
//             temp: data.temperature,
//             humid: data.humidity,
//             light: data.light,
//             timestamp: data.timestamp,
//         });
//     } catch (err) {
//         console.error("Sync with local server failed:", err.message);
//     }
// }

// // Bắt đầu gửi dữ liệu định kỳ
// function startPublishing() {
//     // Gửi ngay lập tức
//     publishData();

//     // Thiết lập interval mỗi 10 giây
//     setInterval(publishData, 10000);
// }

// // Xử lý tắt chương trình
// process.on("SIGINT", () => {
//     console.log("\nDisconnecting from MQTT...");
//     client.end();
//     process.exit();
// });

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const mongoose = require("mongoose");

const DatabaseClient = require("./config/mongodb");
const db = DatabaseClient.getClient();

// Hàm tạo giá trị ngẫu nhiên trong khoảng min-max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Hàm tạo timestamp cho một ngày cụ thể tại giờ, phút, giây cụ thể
function getTimestampForDate(date, hours = 0, minutes = 0, seconds = 0) {
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, seconds, 0);
    return String(newDate.getTime());
}

async function generateSensorsDumpData() {
    try {
        const temperatures = db.collection("temperatures");
        const lights = db.collection("lights");
        const airHumidities = db.collection("air humidities");

        // Xóa dữ liệu cũ trong các collection để tránh trùng lặp
        await temperatures.deleteMany({});
        await lights.deleteMany({});
        await airHumidities.deleteMany({});
        console.log("Cleared existing data in collections");

        // Ngày hiện tại (28/04/2025)
        const currentDate = new Date("2025-04-28T23:59:59");

        // 1. Tạo dữ liệu cho 12 tháng gần đây (28/04/2024 - 28/03/2025)
        const start12Months = new Date("2024-04-28T00:00:00");
        const end12Months = new Date("2025-03-28T23:59:59");
        let currentDay = new Date(start12Months);

        const tempData12Months = [];
        const lightData12Months = [];
        const humidData12Months = [];

        while (currentDay <= end12Months) {
            const timestamp = getTimestampForDate(currentDay, 12, 0, 0); // 12:00 mỗi ngày

            tempData12Months.push({
                timestamp: timestamp,
                value: getRandomInt(15, 62), // Nhiệt độ từ 15 đến 62
            });

            lightData12Months.push({
                timestamp: timestamp,
                value: getRandomInt(0, 100), // Ánh sáng từ 0 đến 100
            });

            humidData12Months.push({
                timestamp: timestamp,
                value: getRandomInt(15, 92), // Độ ẩm từ 15 đến 92
            });

            currentDay.setDate(currentDay.getDate() + 1); // Tăng 1 ngày
        }

        // 2. Tạo dữ liệu cho 30 ngày gần đây (29/03/2025 - 28/04/2025), mỗi ngày 24 giá trị
        const start30Days = new Date("2025-03-29T00:00:00");
        const end30Days = new Date("2025-04-28T23:59:59");
        currentDay = new Date(start30Days);

        const tempData30Days = [];
        const lightData30Days = [];
        const humidData30Days = [];

        while (currentDay <= end30Days) {
            for (let hour = 0; hour < 24; hour++) {
                const timestamp = getTimestampForDate(currentDay, hour, 0, 0);

                tempData30Days.push({
                    timestamp: timestamp,
                    value: getRandomInt(15, 62),
                });

                lightData30Days.push({
                    timestamp: timestamp,
                    value: getRandomInt(0, 100),
                });

                humidData30Days.push({
                    timestamp: timestamp,
                    value: getRandomInt(15, 92),
                });
            }
            currentDay.setDate(currentDay.getDate() + 1);
        }

        // 3. Tạo dữ liệu cho 24 giờ gần đây (27/04/2025 00:00:00 - 28/04/2025 23:59:59), mỗi giờ 24 giá trị
        const start24Hours = new Date("2025-04-27T00:00:00");
        const end24Hours = new Date("2025-04-28T23:59:59");

        const tempData24Hours = [];
        const lightData24Hours = [];
        const humidData24Hours = [];

        for (let hour = 0; hour < 24; hour++) {
            const baseTime = new Date(start24Hours);
            baseTime.setHours(hour);

            // Mỗi giờ có 24 giá trị, tức mỗi 2.5 phút (60 phút / 24 = 2.5 phút)
            for (let i = 0; i < 24; i++) {
                const minutes = Math.floor((i * 60) / 24); // Khoảng cách 2.5 phút
                const seconds = Math.floor(((i * 60) % 24) * 2.5); // Giây
                const timestamp = getTimestampForDate(
                    baseTime,
                    hour,
                    minutes,
                    seconds
                );

                tempData24Hours.push({
                    timestamp: timestamp,
                    value: getRandomInt(15, 62),
                });

                lightData24Hours.push({
                    timestamp: timestamp,
                    value: getRandomInt(0, 100),
                });

                humidData24Hours.push({
                    timestamp: timestamp,
                    value: getRandomInt(15, 92),
                });
            }
        }

        // Insert dữ liệu vào MongoDB
        await temperatures.insertMany([
            ...tempData12Months,
            ...tempData30Days,
            ...tempData24Hours,
        ]);
        await lights.insertMany([
            ...lightData12Months,
            ...lightData30Days,
            ...lightData24Hours,
        ]);
        await airHumidities.insertMany([
            ...humidData12Months,
            ...humidData30Days,
            ...humidData24Hours,
        ]);

        console.log("Successfully inserted sensor data into MongoDB");
    } catch (err) {
        console.error("Error generating sensor data:", err);
    } finally {
        await mongoose.connection.close();
        console.log("Disconnected from MongoDB");
    }
}

// Chạy hàm
await generateSensorsDumpData();
