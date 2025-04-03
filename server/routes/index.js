const express = require("express");

const temperature = require("./temperature");
const airHumidity = require("./airHumidity");
const light = require("./light");
const sensorHistory = require("./sensorHistory");

const router = express.Router();

router.use("/temperature", temperature);
router.use("/air-humidity", airHumidity);
router.use("/light", light);
router.use("/history", sensorHistory);

router.get("/test", (req, res) => {
    const uptime = process.uptime();
    const serverInfo = {
        status: "OK",
        message: "Server is running",
        uptime: `${Math.floor(uptime / 60)} minutes, ${Math.floor(
            uptime % 60
        )} seconds`,
        timestamp: new Date().toISOString(),
    };
    res.status(200).json(serverInfo);
});

module.exports = router;
