const express = require("express");
const router = express.Router();
const airHumidController = require("../controllers/airHumidController");

router.get("/air-humid", airHumidController.getHumid);

router.put("/air-humid", airHumidController.setHumid);

router.get("/mode", airHumidController.getMode);

router.put("/mode", airHumidController.setMode);

router.get("/min-max-air-humid", airHumidController.getMinMaxHumid);

router.put("/min-max-air-humid", airHumidController.setMinMaxHumid);

module.exports = router;
