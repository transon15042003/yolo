const express = require("express");
const router = express.Router();
const tempController = require("../controllers/tempController");

router.get("/temp", tempController.getTemp);
router.put("/temp", tempController.setTemp);

router.get("/mode", tempController.getMode);
router.put("/mode", tempController.setMode);

router.get("/min-max-temp", tempController.getMinMaxTemp);
router.put("/min-max-temp", tempController.setMinMaxTemp);

router.get("/fan-power", tempController.getFanPower);
router.put("/fan-power", tempController.setFanPower);

router.get("/fanEnergy", tempController.getFanEnergy);

module.exports = router;
