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

module.exports = {
    Temperature: mongoose.model("Temperature", temperatureSchema),
    Light: mongoose.model("Light", lightSchema),
    Humidity: mongoose.model("Air Humidity", humiditySchema),
};
