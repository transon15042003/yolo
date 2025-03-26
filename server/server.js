const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const { convertName } = require("./config/utils");

const MQTTClient = require("./config/adafruit");
global.ada = MQTTClient.getClient();
const DatabaseClient = require("./config/mongodb");
const db = DatabaseClient.getClient();

// Import models
const airHumiModel = require("./models/airHumi");
const lightModel = require("./models/light");
const tempModel = require("./models/temperature");

// Khởi tạo giá trị ban đầu từ MongoDB
async function initializeModels() {
    try {
        await airHumiModel.fetchLatestData();
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
        const collection_name = convertName(
            feed_name_api.split("/").slice(-1)[0]
        );
        const timestamp = String(Date.now());

        db.collection(collection_name).insertOne({
            timestamp: timestamp,
            value: Number(valueLoad.toString()),
        });

        console.log(`Insert ${valueLoad} from ${feed_name_api} to database.`);

        if (feed_name == "temp") {
            axios.put("http://localhost:8080/api/temperature/temp", {
                temp: Number(valueLoad.toString()),
            });
        }

        if (feed_name == "air-humid") {
            axios.put("http://localhost:8080/api/air-humidity/air-humi", {
                humi: Number(valueLoad.toString()),
            });
        }

        if (feed_name == "light") {
            axios.put("http://localhost:8080/api/light/lightEnergy", {
                LightEnergy: Number(valueLoad.toString()),
            });
        }
    });
});
