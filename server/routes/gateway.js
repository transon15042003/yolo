const express = require("express");

const router = express.Router();

router.put("/fan", (req, res) => {
    if (req.body.fan == 1) {
        ada.publish(
            process.env.FAN_SENSOR,
            "1",
            { qos: 1, retain: false },
            (error) => {
                if (error) {
                    console.error("Error publishing message:", error);
                    throw error;
                }
                console.log("Fan On");
            }
        );
    } else {
        ada.publish(
            process.env.FAN_SENSOR,
            "0",
            { qos: 1, retain: false },
            (error) => {
                if (error) {
                    console.error("Error publishing message:", error);
                    throw error;
                }
                console.log("Fan Off");
            }
        );
    }
});

router.put("/led", (req, res) => {
    if (req.body.led == 1) {
        ada.publish(
            process.env.LED_SENSOR,
            "1",
            { qos: 1, retain: false },
            (error) => {
                if (error) {
                    console.error("Error publishing message:", error);
                    throw error;
                }
                console.log("LED on");
            }
        );
    } else {
        ada.publish(
            process.env.LED_SENSOR,
            "0",
            { qos: 1, retain: false },
            (error) => {
                if (error) {
                    console.error("Error publishing message:", error);
                    throw error;
                }
                console.log("LED off");
            }
        );
    }
});

module.exports = router;
