const express = require("express");
const router = express.Router();

const energyHistoryController = require("../controllers/energyHistoryController");

// Validate deviceType and range before passing to the controller
router.get(
    "/",
    (req, res, next) => {
        const { deviceType, range } = req.query;

        // Validate deviceType
        const validDeviceTypes = ["led", "fan"];
        if (!deviceType || !validDeviceTypes.includes(deviceType)) {
            return res.status(400).json({
                error: "Invalid device type. Must be 'led' or 'fan'.",
            });
        }

        // Validate range
        const validRanges = ["day", "month", "year"];
        if (range && !validRanges.includes(range)) {
            return res.status(400).json({
                error: "Invalid range. Must be 'day', 'month', or 'year'.",
            });
        }

        next();
    },
    energyHistoryController.getEnergyHistory
);

module.exports = router;
