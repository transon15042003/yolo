// fakeData.js
require("dotenv").config();
const mqtt = require("mqtt");
const axios = require("axios");

// Cấu hình Adafruit IO
const ADAFRUIT_IO_USERNAME = process.env.ADA_USERNAME;
const ADAFRUIT_IO_KEY = process.env.ADA_PASSWORD;
const FEEDS = {
    TEMPERATURE: `${ADAFRUIT_IO_USERNAME}/feeds/temp`,
    HUMIDITY: `${ADAFRUIT_IO_USERNAME}/feeds/air-humid`,
    LIGHT: `${ADAFRUIT_IO_USERNAME}/feeds/light`,
};

// Kết nối MQTT
const client = mqtt.connect("mqtt://io.adafruit.com", {
    username: ADAFRUIT_IO_USERNAME,
    password: ADAFRUIT_IO_KEY,
});

client.on("connect", () => {
    console.log("Connected to Adafruit IO MQTT server");
    startPublishing();
});

client.on("error", (err) => {
    console.error("MQTT error:", err);
});

// Hàm tạo dữ liệu ngẫu nhiên
function generateRandomData() {
    const now = new Date();
    return {
        temperature: Math.floor(Math.random() * 15 + 20), // 20-35°C
        humidity: Math.floor(Math.random() * 30 + 40), // 40-70%
        light: Math.floor(Math.random() * 50 + 50), // 0-100 lux
        timestamp: now.toISOString(),
    };
}

// Gửi dữ liệu lên Adafruit IO
async function publishData() {
    const data = generateRandomData();

    try {
        // Gửi qua MQTT
        client.publish(FEEDS.TEMPERATURE, data.temperature.toString());
        client.publish(FEEDS.HUMIDITY, data.humidity.toString());
        client.publish(FEEDS.LIGHT, data.light.toString());

        console.log("Published data:", {
            temperature: `${data.temperature}°C`,
            humidity: `${data.humidity}%`,
            light: `${data.light} lux`,
        });

        // Đồng bộ với server của bạn (tuỳ chọn)
        // await syncWithLocalServer(data);
    } catch (err) {
        console.error("Publish error:", err);
    }
}

// Đồng bộ với server local (tuỳ chọn)
async function syncWithLocalServer(data) {
    try {
        await axios.post("http://localhost:8080/api/sensor-data", {
            temp: data.temperature,
            humid: data.humidity,
            light: data.light,
            timestamp: data.timestamp,
        });
    } catch (err) {
        console.error("Sync with local server failed:", err.message);
    }
}

// Bắt đầu gửi dữ liệu định kỳ
function startPublishing() {
    // Gửi ngay lập tức
    publishData();

    // Thiết lập interval mỗi 10 giây
    setInterval(publishData, 10000);
}

// Xử lý tắt chương trình
process.on("SIGINT", () => {
    console.log("\nDisconnecting from MQTT...");
    client.end();
    process.exit();
});
