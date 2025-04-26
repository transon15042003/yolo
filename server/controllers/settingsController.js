const Settings = require("../models/settings");

async function getSettings(req, res) {
    try {
        const settings = await Settings.getSettings();
        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        console.error("Error in getSettings:", err.message, err.stack);
        res.status(500).json({
            success: false,
            error: "Failed to get settings",
            details: err.message,
        });
    }
}

async function updateFanSettings(req, res) {
    try {
        const { minTemp, maxTemp, lastStateChange, currentHourEnergy } =
            req.body;

        // Validate inputs
        if (
            minTemp !== undefined &&
            (typeof minTemp !== "number" || isNaN(minTemp))
        ) {
            return res.status(400).json({
                success: false,
                error: "minTemp must be a valid number",
            });
        }
        if (
            maxTemp !== undefined &&
            (typeof maxTemp !== "number" || isNaN(maxTemp))
        ) {
            return res.status(400).json({
                success: false,
                error: "maxTemp must be a valid number",
            });
        }
        if (
            minTemp !== undefined &&
            maxTemp !== undefined &&
            minTemp >= maxTemp
        ) {
            return res.status(400).json({
                success: false,
                error: "minTemp must be less than maxTemp",
            });
        }
        if (
            lastStateChange !== undefined &&
            isNaN(new Date(lastStateChange).getTime())
        ) {
            return res.status(400).json({
                success: false,
                error: "lastStateChange must be a valid date",
            });
        }
        if (
            currentHourEnergy !== undefined &&
            (typeof currentHourEnergy !== "number" || isNaN(currentHourEnergy))
        ) {
            return res.status(400).json({
                success: false,
                error: "currentHourEnergy must be a valid number",
            });
        }

        const settings = await Settings.updateFanSettings({
            minTemp,
            maxTemp,
            lastStateChange: lastStateChange
                ? new Date(lastStateChange)
                : undefined,
            currentHourEnergy,
        });

        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        console.error("Error in updateFanSettings:", err.message, err.stack);
        res.status(500).json({
            success: false,
            error: "Failed to update fan settings",
            details: err.message,
        });
    }
}

async function updateLedSettings(req, res) {
    try {
        const {
            minLightEnergy,
            maxLightEnergy,
            lastStateChange,
            currentHourEnergy,
        } = req.body;

        // Validate inputs
        if (
            minLightEnergy !== undefined &&
            (typeof minLightEnergy !== "number" || isNaN(minLightEnergy))
        ) {
            return res.status(400).json({
                success: false,
                error: "minLightEnergy must be a valid number",
            });
        }
        if (
            maxLightEnergy !== undefined &&
            (typeof maxLightEnergy !== "number" || isNaN(maxLightEnergy))
        ) {
            return res.status(400).json({
                success: false,
                error: "maxLightEnergy must be a valid number",
            });
        }
        if (
            minLightEnergy !== undefined &&
            maxLightEnergy !== undefined &&
            minLightEnergy >= maxLightEnergy
        ) {
            return res.status(400).json({
                success: false,
                error: "minLightEnergy must be less than maxLightEnergy",
            });
        }
        if (
            lastStateChange !== undefined &&
            isNaN(new Date(lastStateChange).getTime())
        ) {
            return res.status(400).json({
                success: false,
                error: "lastStateChange must be a valid date",
            });
        }
        if (
            currentHourEnergy !== undefined &&
            (typeof currentHourEnergy !== "number" || isNaN(currentHourEnergy))
        ) {
            return res.status(400).json({
                success: false,
                error: "currentHourEnergy must be a valid number",
            });
        }

        const settings = await Settings.updateLedSettings({
            minLightEnergy,
            maxLightEnergy,
            lastStateChange: lastStateChange
                ? new Date(lastStateChange)
                : undefined,
            currentHourEnergy,
        });

        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        console.error("Error in updateLedSettings:", err.message, err.stack);
        res.status(500).json({
            success: false,
            error: "Failed to update led settings",
            details: err.message,
        });
    }
}

module.exports = {
    getSettings,
    updateFanSettings,
    updateLedSettings,
};
