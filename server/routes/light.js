const express = require("express");
const router = express.Router();

const lightController = require("../controllers/lightController");

router.get("/lightEnergy", lightController.getLightEnergy);

router.put("/lightEnergy", lightController.setLightEnergy);

router.get("/min-max-light", lightController.getMinMaxLightEnergy);

router.put("/min-max-light", lightController.setMinMaxLightEnergy);

router.get("/mode", lightController.getMode);
router.put("/mode", lightController.setMode);

router.get("/ledState", lightController.getLedState);

router.put("/ledState", lightController.setLedState);

module.exports = router;
