const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const { convertName } = require("./config/utils");

const MQTTClient = require("./config/adafruit");
global.ada = MQTTClient.getClient();
const DatabaseClient = require("./config/mongodb");
const db = DatabaseClient.getClient();

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
    res.status(500).send("Server đang bị lỗi. Vui lòng thử lại sau!");
});

// Listen for requests on requestPort
requestApp.listen(requestPort, () => {
    console.log(`Request server running on port ${requestPort}...`);
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

gatewayApp.listen(gatewayPort, () => {
    console.log(`Gateway server running on port ${gatewayPort}...`);

    const feed_names_apis = [
        process.env.MOI_SENSOR,
        process.env.PUMP_SENSOR,
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

        if (feed_name == "soil-moisture") {
            axios.put("http://localhost:8080/api/watering/moisture", {
                moisture: Number(valueLoad.toString()),
            });
        }

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
