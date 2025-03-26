const mongoose = require("mongoose");

// Tạo schema chung
const sensorSchema = new mongoose.Schema({
    timestamp: String,
    value: Number,
});

// Tạo các models cụ thể
module.exports = {
    Temperature: mongoose.model("Temperature", sensorSchema),
    Humidity: mongoose.model("Air Humidity", sensorSchema),
    Light: mongoose.model("Light", sensorSchema),
};
