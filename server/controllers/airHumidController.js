const humid_model = require("../models/airHumid");

async function getHumid(req, res) {
    try {
        const value = await humid_model.getHumid();
        res.status(200).json(value);
    } catch (err) {
        console.error("Error in getHumid:", err.message, err.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to get humidity",
        });
    }
}

async function setHumid(req, res) {
    try {
        const { humid } = req.body;
        if (typeof humid !== "number" || isNaN(humid)) {
            return res
                .status(400)
                .json({
                    status: "error",
                    message: "Humidity must be a valid number",
                });
        }
        await humid_model.setHumid(humid);
        await humid_model.checkHumid(humid);
        res.status(200).json({ status: "OK" });
    } catch (err) {
        console.error("Error in setHumid:", err.message, err.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to set humidity",
        });
    }
}

async function getMinMaxHumid(req, res) {
    try {
        const value = await humid_model.get_minmax_humid();
        res.status(200).json(value);
    } catch (err) {
        console.error("Error in getMinMaxHumid:", err.message, err.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to get min/max humidity",
        });
    }
}

async function setMinMaxHumid(req, res) {
    try {
        const { minHumid, maxHumid } = req.body;
        if (
            typeof minHumid !== "number" ||
            typeof maxHumid !== "number" ||
            isNaN(minHumid) ||
            isNaN(maxHumid)
        ) {
            return res
                .status(400)
                .json({
                    status: "error",
                    message: "Min and max humidity must be valid numbers",
                });
        }
        if (minHumid >= maxHumid) {
            return res
                .status(400)
                .json({
                    status: "error",
                    message: "Min humidity must be less than max humidity",
                });
        }
        await humid_model.set_minmax_humid(minHumid, maxHumid);
        res.status(200).json({ status: "OK" });
    } catch (err) {
        console.error("Error in setMinMaxHumid:", err.message, err.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to set min/max humidity",
        });
    }
}

async function getMode(req, res) {
    try {
        const value = await humid_model.getMode();
        res.status(200).json(value);
    } catch (err) {
        console.error("Error in getMode:", err.message, err.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to get mode",
        });
    }
}

async function setMode(req, res) {
    try {
        const { mode } = req.body;
        if (!["automatic", "manual"].includes(mode)) {
            return res
                .status(400)
                .json({
                    status: "error",
                    message: "Mode must be 'automatic' or 'manual'",
                });
        }
        await humid_model.setMode(mode);
        res.status(200).json({ status: "OK" });
    } catch (err) {
        console.error("Error in setMode:", err.message, err.stack);
        res.status(500).json({
            status: "error",
            message: "Failed to set mode",
        });
    }
}

module.exports = {
    getHumid,
    setHumid,
    getMinMaxHumid,
    setMinMaxHumid,
    getMode,
    setMode,
};
