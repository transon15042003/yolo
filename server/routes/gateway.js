const express = require("express");
const router = express.Router();

// Điều khiển LED
router.put("/led", async (req, res) => {
    const state = req.body.state || 0; // 0: tắt, 1: bật

    ada.publish(
        process.env.LED_SENSOR,
        state.toString(),
        { qos: 1, retain: false },
        async (error) => {
            if (error) {
                console.error("Error publishing LED state:", error);
                return res.status(500).json({ error: "Failed to control LED" });
            }
            console.log(`LED ${state === 1 ? "on" : "off"}`);
            res.json({ success: true, state });
        }
    );
});

// Điều khiển FAN với công suất
router.put("/fan", async (req, res) => {
    const power = req.body.power || 0; // 0: tắt, 60-90: bật với các mức công suất

    // Validate power value
    const validPowers = [0, 60, 70, 80, 90];
    if (!validPowers.includes(power)) {
        return res
            .status(400)
            .json({ error: "Invalid power value (0,60,70,80,90)" });
    }

    ada.publish(
        process.env.FAN_SENSOR,
        power.toString(),
        { qos: 1, retain: false },
        async (error) => {
            if (error) {
                console.error("Error publishing fan power:", error);
                return res.status(500).json({ error: "Failed to control fan" });
            }
            console.log(`Fan power set to ${power}W`);
            res.json({ success: true, power });
        }
    );
});

module.exports = router;
