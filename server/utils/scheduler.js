const schedule = require("node-schedule");
const tempModel = require("../models/temperature");
const lightModel = require("../models/light");

function scheduleFanOnAt(time) {
    schedule.scheduleJob(time, async () => {
        await tempModel.setFanPower(70);
        global.ada.publish(
            process.env.FAN_SENSOR,
            "70",
            { qos: 1, retain: false },
            (error) => {
                if (error) {
                    console.error("Error publishing fan power:", error);
                }
            }
        );
        console.log(`Scheduled: Fan turned on at ${time}`);
    });
}

function scheduleFanOffAt(time) {
    schedule.scheduleJob(time, async () => {
        await tempModel.setFanPower(0);
        global.ada.publish(
            process.env.FAN_SENSOR,
            "0",
            { qos: 1, retain: false },
            (error) => {
                if (error) {
                    console.error("Error publishing fan power:", error);
                }
            }
        );
        console.log(`Scheduled: Fan turned off at ${time}`);
    });
}

function scheduleLedOnAt(time) {
    schedule.scheduleJob(time, async () => {
        await lightModel.setLedState(1);
        global.ada.publish(
            process.env.LED_SENSOR,
            "1",
            { qos: 1, retain: false },
            (error) => {
                if (error) {
                    console.error("Error publishing LED state:", error);
                }
            }
        );
        console.log(`Scheduled: LED turned on at ${time}`);
    });
}

function scheduleLedOffAt(time) {
    schedule.scheduleJob(time, async () => {
        await lightModel.setLedState(0);
        global.ada.publish(
            process.env.LED_SENSOR,
            "0",
            { qos: 1, retain: false },
            (error) => {
                if (error) {
                    console.error("Error publishing LED state:", error);
                }
            }
        );
        console.log(`Scheduled: LED turned off at ${time}`);
    });
}

module.exports = {
    scheduleFanOnAt,
    scheduleFanOffAt,
    scheduleLedOnAt,
    scheduleLedOffAt,
};
