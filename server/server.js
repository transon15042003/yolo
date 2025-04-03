const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const { convertName } = require("./config/utils");
const {
    scheduleFanOnAt,
    scheduleFanOffAt,
    scheduleLedOnAt,
    scheduleLedOffAt,
} = require("./utils/scheduler");

const MQTTClient = require("./config/adafruit");
global.ada = MQTTClient.getClient();
const DatabaseClient = require("./config/mongodb");
const db = DatabaseClient.getClient();

// Import models
const airHumidModel = require("./models/airHumid");
const lightModel = require("./models/light");
const tempModel = require("./models/temperature");

// Initialized model values from MongoDB
async function initializeModels() {
    try {
        await airHumidModel.fetchLatestData();
        await lightModel.fetchLatestData();
        await tempModel.fetchLatestData();
        console.log("Initialized model values from MongoDB");
    } catch (err) {
        console.error("Error initializing models:", err);
    }
}

// Import routes
const requestApiRouter = require("./routes/index");
const gatewayApiRouter = require("./routes/gateway");

// App setup for request port
const requestApp = express();
const requestPort = process.env.REQUEST_PORT || 8080;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
};

requestApp.use(express.static("public"));
requestApp.use(express.urlencoded({ extended: true }));
requestApp.use(express.json());
requestApp.use(cors(corsOptions));
requestApp.use(bodyParser.json());

// Every route should start with /api
requestApp.use("/api", requestApiRouter);

// Error handler for request port
requestApp.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Server is having some problems!");
});

// Listen for requests on requestPort
requestApp.listen(requestPort, async () => {
    console.log(`Request server running on port ${requestPort}...`);
    await initializeModels();
});

/* --------------------------------------------------------------------- */

// App setup for gateway port
const gatewayApp = express();
const gatewayPort = process.env.GATEWAY_PORT || 8081;

gatewayApp.use(express.static("public"));
gatewayApp.use(express.urlencoded({ extended: true }));
gatewayApp.use(express.json());
gatewayApp.use(cors(corsOptions));
gatewayApp.use(bodyParser.json());

gatewayApp.use("/gatewayAppApi", gatewayApiRouter);

gatewayApp.listen(gatewayPort, async () => {
    console.log(`Gateway server running on port ${gatewayPort}...`);
    await initializeModels();

    const feed_names_apis = [
        process.env.LED_SENSOR,
        process.env.FAN_SENSOR,
        process.env.LIGHT_SENSOR,
        process.env.HUMID_SENSOR,
        process.env.TEMP_SENSOR,
    ];

    feed_names_apis.forEach((feed_name_api) => {
        ada.subscribe(feed_name_api, (err) => {
            if (err) {
                console.error("Error subscribing to", feed_name_api, ":", err);
                throw err;
            }
            console.log(`Subscribed to ${feed_name_api} successfully`);
        });
    });

    ada.on("message", async (feed_name_api, valueLoad) => {
        const feed_name = feed_name_api.split("/").slice(-1)[0];
        const collection_name = convertName(feed_name);
        const timestamp = String(Date.now());

        db.collection(collection_name).insertOne({
            timestamp: timestamp,
            value: Number(valueLoad.toString()),
        });

        console.log(`Insert ${valueLoad} from ${feed_name_api} to database.`);

        if (feed_name == "temp") {
            axios.put(
                `http://localhost:${process.env.REQUEST_PORT}/api/temperature/temp`,
                {
                    temp: Number(valueLoad.toString()),
                }
            );
        }

        if (feed_name == "air-humid") {
            axios.put(
                `http://localhost:${process.env.REQUEST_PORT}/api/air-humidity/air-humid`,
                {
                    humid: Number(valueLoad.toString()),
                }
            );
        }

        if (feed_name == "light") {
            axios.put(
                `http://localhost:${process.env.REQUEST_PORT}/api/light/lightEnergy`,
                {
                    LightEnergy: Number(valueLoad.toString()),
                }
            );
        }

        if (feed_name == "led") {
            axios.put(
                `http://localhost:${process.env.REQUEST_PORT}/api/light/ledState`,
                {
                    ledState: Number(valueLoad.toString()),
                }
            );
        }

        if (feed_name == "fan") {
            axios.put(
                `http://localhost:${process.env.REQUEST_PORT}/api/temperature/fan-power`,
                {
                    fanPower: Number(valueLoad.toString()),
                }
            );
        }
    });
});

// Schedule fan to turn on at 8 AM and off at 8 PM
scheduleFanOnAt("0 8 * * *"); // 8:00 AM every day
scheduleFanOffAt("0 20 * * *"); // 8:00 PM every day

// Schedule LED to turn on at 6 PM and off at 6 AM
scheduleLedOnAt("0 18 * * *"); // 6:00 PM every day
scheduleLedOffAt("0 6 * * *"); // 6:00 AM every day
