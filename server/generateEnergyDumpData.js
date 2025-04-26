import { createRequire } from "module";
const require = createRequire(import.meta.url);

const mongoose = require("mongoose");
const { LedEnergy, FanEnergy } = require("./models/sensorModels");

const DatabaseClient = require("./config/mongodb");
const db = DatabaseClient.getClient();

// Hàm tạo số ngẫu nhiên trong khoảng [min, max]
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Hàm tạo dump data
async function generateDumpData() {
    try {
        // Xóa dữ liệu cũ
        await LedEnergy.deleteMany({});
        await FanEnergy.deleteMany({});
        console.log("Cleared old data");

        // Dữ liệu cho LED và Fan
        const ledData = [];
        const fanData = [];

        // 1. Tạo dữ liệu cho các tháng trước (5/2024 - 3/2025)
        // Chỉ tạo dữ liệu cho ngày 1 và ngày 15 của mỗi tháng
        for (let month = 4; month <= 14; month++) {
            // 5/2024 (month=4) đến 3/2025 (month=14)
            const year = month < 12 ? 2024 : 2025;
            const adjustedMonth = month % 12; // Điều chỉnh tháng cho năm 2025

            // Ngày 1 và ngày 15 của mỗi tháng
            const daysToGenerate = [1, 15];
            for (const day of daysToGenerate) {
                for (let hour = 0; hour < 24; hour++) {
                    const timestamp = new Date(year, adjustedMonth, day, hour);

                    // LED: Công suất 30W, mỗi giờ bật/tắt ngẫu nhiên
                    const ledIsOn = getRandomInt(0, 1); // 0: tắt, 1: bật
                    const hourlyLedEnergy = ledIsOn * 108000; // 30W * 3600s = 108,000J

                    // Fan: Công suất 60-90W, mỗi giờ bật/tắt ngẫu nhiên
                    const fanPower = getRandomInt(60, 90);
                    const fanIsOn = getRandomInt(0, 1); // 0: tắt, 1: bật
                    const hourlyFanEnergy = fanIsOn * fanPower * 3600; // Joules/giờ

                    // Chèn dữ liệu giờ
                    ledData.push({
                        timestamp: timestamp,
                        energy: hourlyLedEnergy,
                    });
                    fanData.push({
                        timestamp: timestamp,
                        energy: hourlyFanEnergy,
                    });
                }
            }
        }

        // 2. Tạo dữ liệu cho từng giờ từ 1/4/2025 đến 25/4/2025
        for (let day = 1; day <= 25; day++) {
            for (let hour = 0; hour < 24; hour++) {
                const timestamp = new Date(2025, 3, day, hour); // Tháng 4/2025 (month=3)

                // LED: Công suất 30W, mỗi giờ bật/tắt ngẫu nhiên
                const ledIsOn = getRandomInt(0, 1);
                const hourlyLedEnergy = ledIsOn * 108000;

                // Fan: Công suất 60-90W, mỗi giờ bật/tắt ngẫu nhiên
                const fanPower = getRandomInt(60, 90);
                const fanIsOn = getRandomInt(0, 1);
                const hourlyFanEnergy = fanIsOn * fanPower * 3600;

                // Chèn dữ liệu giờ
                ledData.push({
                    timestamp: timestamp,
                    energy: hourlyLedEnergy,
                });
                fanData.push({
                    timestamp: timestamp,
                    energy: hourlyFanEnergy,
                });
            }
        }

        // 3. Tạo dữ liệu cho từng giờ trong ngày 26/4/2025
        for (let hour = 0; hour < 24; hour++) {
            const timestamp = new Date(2025, 3, 26, hour); // 26/4/2025

            // LED: Công suất 30W, mỗi giờ bật/tắt ngẫu nhiên
            const ledIsOn = getRandomInt(0, 1);
            const hourlyLedEnergy = ledIsOn * 108000;

            // Fan: Công suất 60-90W, mỗi giờ bật/tắt ngẫu nhiên
            const fanPower = getRandomInt(60, 90);
            const fanIsOn = getRandomInt(0, 1);
            const hourlyFanEnergy = fanIsOn * fanPower * 3600;

            // Chèn dữ liệu giờ
            ledData.push({
                timestamp: timestamp,
                energy: hourlyLedEnergy,
            });
            fanData.push({
                timestamp: timestamp,
                energy: hourlyFanEnergy,
            });
        }

        // Chèn dữ liệu vào MongoDB
        await LedEnergy.insertMany(ledData);
        await FanEnergy.insertMany(fanData);

        console.log(`Inserted ${ledData.length} records into LedEnergy`);
        console.log(`Inserted ${fanData.length} records into FanEnergy`);

        // Đóng kết nối MongoDB
        mongoose.connection.close();
    } catch (err) {
        console.error("Error generating dump data:", err);
        mongoose.connection.close();
    }
}

await generateDumpData();
