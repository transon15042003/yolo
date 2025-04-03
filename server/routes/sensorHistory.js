const express = require("express");
const router = express.Router();

const getSensorHistoryController = require("../controllers/sensorHistoryController");

router.get("/:sensorType", getSensorHistoryController.getSensorHistory);

module.exports = router;
