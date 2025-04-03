const express = require("express");
const router = express.Router();

// Middleware to inject ada client (optional, if you want to make it more modular)
const injectAdaClient = (req, res, next) => {
    req.ada = global.ada; // Assuming ada is globally available
    next();
};

// Validate LED state
const validateLedState = (req, res, next) => {
    const state = req.body.state || 0;
    if (state !== 0 && state !== 1) {
        return res
            .status(400)
            .json({ error: "Invalid LED state. Must be 0 or 1." });
    }
    req.validatedState = state;
    next();
};

// Validate fan power
const validateFanPower = (req, res, next) => {
    const power = req.body.power || 0;
    const validPowers = [0, 60, 70, 80, 90];
    if (!validPowers.includes(power)) {
        return res
            .status(400)
            .json({
                error: "Invalid power value. Must be 0, 60, 70, 80, or 90.",
            });
    }
    req.validatedPower = power;
    next();
};

// Điều khiển LED
router.put("/led", injectAdaClient, validateLedState, async (req, res) => {
    const state = req.validatedState;

    req.ada.publish(
        process.env.LED_SENSOR,
        state.toString(),
        { qos: 1, retain: false },
        async (error) => {
            if (error) {
                console.error(
                    `Error publishing LED state (${state}):`,
                    error.message,
                    error.stack
                );
                return res
                    .status(500)
                    .json({
                        error: "Failed to control LED",
                        details: error.message,
                    });
            }
            console.log(`LED ${state === 1 ? "on" : "off"}`);
            res.status(200).json({ success: true, state });
        }
    );
});

// Điều khiển FAN với công suất
router.put("/fan", injectAdaClient, validateFanPower, async (req, res) => {
    const power = req.validatedPower;

    req.ada.publish(
        process.env.FAN_SENSOR,
        power.toString(),
        { qos: 1, retain: false },
        async (error) => {
            if (error) {
                console.error(
                    `Error publishing fan power (${power}W):`,
                    error.message,
                    error.stack
                );
                return res
                    .status(500)
                    .json({
                        error: "Failed to control fan",
                        details: error.message,
                    });
            }
            console.log(`Fan power set to ${power}W`);
            res.status(200).json({ success: true, power });
        }
    );
});

module.exports = router;
