const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");

// Lấy tất cả settings
router.get("/", settingsController.getSettings);

// Cập nhật fan settings
router.put("/fan", settingsController.updateFanSettings);

// Cập nhật led settings
router.put("/led", settingsController.updateLedSettings);

module.exports = router;
