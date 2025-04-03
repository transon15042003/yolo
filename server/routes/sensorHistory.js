const express = require("express");
const router = express.Router();

const getSensorHistoryController = require("../controllers/sensorHistoryController");

// Validate sensorType and range before calling the controller
router.get(
    "/:sensorType",
    (req, res, next) => {
        const { sensorType } = req.params;
        const { range } = req.query;

        // Validate sensorType
        const validSensorTypes = ["temp", "air-humid", "light"];
        if (!validSensorTypes.includes(sensorType)) {
            return res
                .status(400)
                .json({
                    error: "Invalid sensor type. Must be 'temp', 'air-humid', or 'light'.",
                });
        }

        // Validate range
        const validRanges = ["day", "month", "year"];
        if (range && !validRanges.includes(range)) {
            return res
                .status(400)
                .json({
                    error: "Invalid range. Must be 'day', 'month', or 'year'.",
                });
        }

        next();
    },
    getSensorHistoryController.getSensorHistory
);

module.exports = router;
