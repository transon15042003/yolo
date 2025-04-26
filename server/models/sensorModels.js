const mongoose = require("mongoose");

// Schema cho nhiệt độ (có fan)
const temperatureSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    value: Number,
    fanPower: { type: Number, enum: [0, 60, 70, 80, 90], default: 0 },
});

// Schema cho ánh sáng (có LED)
const lightSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    value: Number,
    ledState: { type: Number, enum: [0, 1], default: 0 },
});

// Schema cho độ ẩm (không có thiết bị điều khiển)
const humiditySchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    value: Number,
});

// Schema cho tiêu thụ năng lượng của LED
const ledEnergySchema = new mongoose.Schema({
    timestamp: { type: Date, required: true }, // Thời điểm bắt đầu của giờ (e.g., 0h, 1h, ...)
    energy: { type: Number, default: 0 }, // Năng lượng tiêu thụ trong giờ đó (Joules)
});

// Schema cho tiêu thụ năng lượng của quạt
const fanEnergySchema = new mongoose.Schema({
    timestamp: { type: Date, required: true }, // Thời điểm bắt đầu của giờ
    energy: { type: Number, default: 0 }, // Năng lượng tiêu thụ trong giờ đó (Joules)
});

module.exports = {
    Temperature: mongoose.model("Temperature", temperatureSchema),
    Light: mongoose.model("Light", lightSchema),
    Humidity: mongoose.model("Air Humidity", humiditySchema),
    LedEnergy: mongoose.model("Led Energy", ledEnergySchema),
    FanEnergy: mongoose.model("Fan Energy", fanEnergySchema),
};
