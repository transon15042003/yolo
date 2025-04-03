const temp_model = require("../models/temperature");

async function getTemp(req, res) {
    try {
        const value = await temp_model.getTemp();
        res.status(200).json({ success: true, data: value });
    } catch (err) {
        console.error("Error in getTemp:", err.message, err.stack);
        res.status(500).json({
            success: false,
            error: "Failed to get temperature",
            details: err.message,
        });
    }
}

async function setTemp(req, res) {
    try {
        const { temp } = req.body;
        if (typeof temp !== "number" || isNaN(temp)) {
            return res.status(400).json({
                success: false,
                error: "Temperature must be a valid number",
            });
        }
        await temp_model.setTemp(temp);
        res.status(200).json({ success: true, data: { temp } });
    } catch (err) {
        console.error("Error in setTemp:", err.message, err.stack);
        res.status(500).json({
            success: false,
            error: "Failed to set temperature",
            details: err.message,
        });
    }
}

async function getMinMaxTemp(req, res) {
    try {
        const value = await temp_model.get_minmax_temp();
        res.status(200).json({ success: true, data: value });
    } catch (err) {
        console.error("Error in getMinMaxTemp:", err.message, err.stack);
        res.status(500).json({
            success: false,
            error: "Failed to get min/max temperature",
            details: err.message,
        });
    }
}

async function setMinMaxTemp(req, res) {
    try {
        const { minTemp, maxTemp } = req.body;
        if (
            typeof minTemp !== "number" ||
            typeof maxTemp !== "number" ||
            isNaN(minTemp) ||
            isNaN(maxTemp)
        ) {
            return res.status(400).json({
                success: false,
                error: "Min and max temperatures must be valid numbers",
            });
        }
        if (minTemp >= maxTemp) {
            return res.status(400).json({
                success: false,
                error: "Min temperature must be less than max temperature",
            });
        }
        await temp_model.set_minmax_temp(minTemp, maxTemp);
        res.status(200).json({ success: true, data: { minTemp, maxTemp } });
    } catch (err) {
        console.error("Error in setMinMaxTemp:", err.message, err.stack);
        res.status(500).json({
            success: false,
            error: "Failed to set min/max temperature",
            details: err.message,
        });
    }
}

async function getMode(req, res) {
    try {
        const value = await temp_model.getMode();
        res.status(200).json({ success: true, data: value });
    } catch (err) {
        console.error("Error in getMode:", err.message, err.stack);
        res.status(500).json({
            success: false,
            error: "Failed to get mode",
            details: err.message,
        });
    }
}

async function setMode(req, res) {
    try {
        const { mode } = req.body;
        if (!["automatic", "manual"].includes(mode)) {
            return res.status(400).json({
                success: false,
                error: "Mode must be 'automatic' or 'manual'",
            });
        }
        await temp_model.setMode(mode);
        res.status(200).json({ success: true, data: { mode } });
    } catch (err) {
        console.error("Error in setMode:", err.message, err.stack);
        res.status(500).json({
            success: false,
            error: "Failed to set mode",
            details: err.message,
        });
    }
}

async function getFanPower(req, res) {
    try {
        const fanData = await temp_model.getFanPower();

        res.status(200).json({
            fanPower: fanData.fanPower,
        });
    } catch (err) {
        console.error("Error in getFanPower:", err.message, err.stack);
        res.status(500).json({
            success: false,
            error: "Failed to get fan power",
            details: err.message,
        });
    }
}

async function setFanPower(req, res) {
    try {
        const { fanPower } = req.body;
        const validPowers = [0, 60, 70, 80, 90];
        if (!validPowers.includes(fanPower)) {
            return res.status(400).json({
                success: false,
                error: "Fan power must be one of 0, 60, 70, 80, or 90",
            });
        }
        await temp_model.setFanPower(fanPower);
        res.status(200).json({ success: true, data: { fanPower } });
    } catch (err) {
        console.error("Error in setFanPower:", err.message, err.stack);
        res.status(500).json({
            success: false,
            error: "Failed to set fan power",
            details: err.message,
        });
    }
}

module.exports = {
    getTemp,
    setTemp,
    getMinMaxTemp,
    setMinMaxTemp,
    getMode,
    setMode,
    getFanPower,
    setFanPower,
};
