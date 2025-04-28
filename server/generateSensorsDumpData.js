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
                value: getRandomInt(15, 42), // Nhiệt độ từ 15 đến 42
            });

            lightData12Months.push({
                timestamp: timestamp,
                value: getRandomInt(0, 2500), // Ánh sáng từ 0 đến 2500
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
