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
    // initial testing
    res.send("OK");
});

module.exports = router;
