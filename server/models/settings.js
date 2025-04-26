const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        fanSettings: {
            minTemp: { type: Number, default: 21 },
            maxTemp: { type: Number, default: 27 },
            lastStateChange: { type: Date, default: Date.now },
            currentHourEnergy: { type: Number, default: 0 },
        },
        lightSettings: {
            minLightEnergy: { type: Number, default: 40 },
            maxLightEnergy: { type: Number, default: 60 },
            lastStateChange: { type: Date, default: Date.now },
            currentHourEnergy: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

// Phương thức để lấy tất cả settings
async function getSettings() {
    try {
        const settings = await this.findOne({});
        if (!settings) {
            // Nếu chưa có settings, tạo mới với giá trị mặc định
            return await this.create({});
        }
        return settings;
    } catch (err) {
        console.error("Error in getSettings:", err);
        throw err;
    }
}

// Phương thức để cập nhật fan settings
async function updateFanSettings({
    minTemp,
    maxTemp,
    lastStateChange,
    currentHourEnergy,
}) {
    try {
        const updateData = {};
        if (minTemp !== undefined) updateData["fanSettings.minTemp"] = minTemp;
        if (maxTemp !== undefined) updateData["fanSettings.maxTemp"] = maxTemp;
        if (lastStateChange !== undefined)
            updateData["fanSettings.lastStateChange"] = lastStateChange;
        if (currentHourEnergy !== undefined)
            updateData["fanSettings.currentHourEnergy"] = currentHourEnergy;

        const settings = await this.findOneAndUpdate(
            {},
            { $set: updateData },
            { new: true, upsert: true }
        );
        return settings;
    } catch (err) {
        console.error("Error in updateFanSettings:", err);
        throw err;
    }
}

// Phương thức để cập nhật light settings
async function updateLedSettings({
    minLightEnergy,
    maxLightEnergy,
    lastStateChange,
    currentHourEnergy,
}) {
    try {
        const updateData = {};
        if (minLightEnergy !== undefined)
            updateData["lightSettings.minLightEnergy"] = minLightEnergy;
        if (maxLightEnergy !== undefined)
            updateData["lightSettings.maxLightEnergy"] = maxLightEnergy;
        if (lastStateChange !== undefined)
            updateData["lightSettings.lastStateChange"] = lastStateChange;
        if (currentHourEnergy !== undefined)
            updateData["lightSettings.currentHourEnergy"] = currentHourEnergy;

        const settings = await this.findOneAndUpdate(
            {},
            { $set: updateData },
            { new: true, upsert: true }
        );
        return settings;
    } catch (err) {
        console.error("Error in updateLedSettings:", err);
        throw err;
    }
}

settingsSchema.statics.getSettings = getSettings;
settingsSchema.statics.updateFanSettings = updateFanSettings;
settingsSchema.statics.updateLedSettings = updateLedSettings;

module.exports = mongoose.model("Settings", settingsSchema);
