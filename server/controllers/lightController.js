const lightModel = require("../models/light");
const { LedEnergy } = require("../models/sensorModels");

async function getLightEnergy(req, res) {
    try {
        const value = await lightModel.getLightEnergy();
        res.status(200).json(value);
    } catch (error) {
        console.error("Error in getLightEnergy:", error.message, error.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to get light energy",
        });
    }
}

async function setLightEnergy(req, res) {
    try {
        const { LightEnergy } = req.body;
        if (typeof LightEnergy !== "number" || isNaN(LightEnergy)) {
            return res.status(400).json({
                status: "error",
                message: "Light energy must be a valid number",
            });
        }
        await lightModel.setLightEnergy(LightEnergy);
        const checkLightEnergy = await lightModel.checkLightEnergy(LightEnergy);
        if (checkLightEnergy !== "Successful") {
            return res.status(500).json({ status: "error" });
        }
        res.status(200).json({ status: "OK" }); // Assuming this is the expected response based on other controllers
    } catch (error) {
        console.error("Error in setLightEnergy:", error.message, error.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to set light energy",
        });
    }
}

async function getMinMaxLightEnergy(req, res) {
    try {
        const value = await lightModel.getMinMaxLightEnergy();
        res.status(200).json(value);
    } catch (error) {
        console.error(
            "Error in getMinMaxLightEnergy:",
            error.message,
            error.stack
        );
        res.status(500).json({
            status: "error",
            message: "Failed to get min/max light energy",
        });
    }
}

async function setMinMaxLightEnergy(req, res) {
    try {
        const { minLightEnergy, maxLightEnergy } = req.body;
        if (
            typeof minLightEnergy !== "number" ||
            typeof maxLightEnergy !== "number" ||
            isNaN(minLightEnergy) ||
            isNaN(maxLightEnergy)
        ) {
            return res.status(400).json({
                status: "error",
                message: "Min and max light energy must be valid numbers",
            });
        }
        if (minLightEnergy >= maxLightEnergy) {
            return res.status(400).json({
                status: "error",
                message: "Min light energy must be less than max light energy",
            });
        }
        await lightModel.setMinMaxLightEnergy(minLightEnergy, maxLightEnergy);
        res.status(200).json({
            status: "OK",
            data: { minLightEnergy, maxLightEnergy },
        });
    } catch (error) {
        console.error(
            "Error in setMinMaxLightEnergy:",
            error.message,
            error.stack
        );
        res.status(500).json({
            status: "error",
            message: "Failed to set min/max light energy",
        });
    }
}

async function getMode(req, res) {
    try {
        const value = await lightModel.getMode();
        res.status(200).json({ success: true, data: value });
    } catch (error) {
        console.error("Error in getMode:", error.message, error.stack);
        res.status(500).json({
            successful: false,
            status: "error",
            message: "Failed to get mode",
        });
    }
}

async function setMode(req, res) {
    try {
        const { mode } = req.body;
        if (mode !== "manual" && mode !== "automatic") {
            return res.status(400).json({
                status: "error",
                message: "Mode must be 'manual' or 'automatic'",
            });
        }
        await lightModel.setMode(mode);
        res.status(200).json({
            status: "OK",
            data: { mode },
        });
    } catch (error) {
        console.error("Error in setMode:", error.message, error.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to set mode",
        });
    }
}

async function getLedState(req, res) {
    try {
        const value = await lightModel.getLedState();
        res.status(200).json(value);
    } catch (error) {
        console.error("Error in getLedState:", error.message, error.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to get LED state",
        });
    }
}

async function setLedState(req, res) {
    try {
        const { ledState } = req.body;
        if (ledState !== 0 && ledState !== 1) {
            return res
                .status(400)
                .json({ status: "error", message: "LED state must be 0 or 1" });
        }
        await lightModel.setLedState(ledState);
        res.status(200).json({
            status: "OK",
            data: { ledState },
        });
    } catch (error) {
        console.error("Error in setLedState:", error.message, error.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to set LED state",
        });
    }
}

async function getLedCapacity(req, res) {
    try {
        const value = await lightModel.getLedCapacity();
        res.status(200).json(value);
    } catch (error) {
        console.error("Error in getLedCapacity:", error.message, error.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to get LED capacity",
        });
    }
}

// async function setLedCapacity(req, res) {
//     try {
//         const { ledCapacity } = req.body;
//         if (typeof ledCapacity !== "number" || isNaN(ledCapacity)) {
//             return res.status(400).json({
//                 status: "error",
//                 message: "LED capacity must be a valid number",
//             });
//         }
//         await lightModel.setLedCapacity(ledCapacity);
//         res.status(200).json({
//             status: "OK",
//             data: { ledCapacity },
//         });
//     } catch (error) {
//         console.error("Error in setLedCapacity:", error.message, error.stack);
//         res.status(500).json({
//             status: "error",
//             message: "Failed to set LED capacity",
//         });
//     }
// }

const getLedEnergy = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let query = {};
        if (startDate && endDate) {
            query = {
                timestamp: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            };
        }

        const energyData = await LedEnergy.find(query).sort({ timestamp: 1 });
        res.status(200).json(energyData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getLightEnergy,
    setLightEnergy,
    getMinMaxLightEnergy,
    setMinMaxLightEnergy,
    getMode,
    setMode,
    getLedState,
    setLedState,
    getLedCapacity,
    getLedEnergy,
};
