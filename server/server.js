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
const airHumidModel = require("./models/airHumid");
const lightModel = require("./models/light");
const tempModel = require("./models/temperature");
const { Temperature, Humidity, Light } = require("./models/sensorModels");

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

// requestApp.get("/api/history/:sensorType", async (req, res) => {
//     try {
//         const { range } = req.query;
//         let aggregation = [];
//         let Model;

//         // Xác định Model dựa trên sensorType
//         switch (req.params.sensorType) {
//             case "temp":
//                 Model = Temperature;
//                 break;
//             case "air-humid":
//                 Model = Humidity;
//                 break;
//             case "light":
//                 Model = Light;
//                 break;
//             default:
//                 return res.status(400).json({ error: "Invalid sensor type" });
//         }

//         // Lấy thời gian hiện tại (giả sử là 23h45 ngày 2/4/2025)
//         const now = Date.now();

//         if (range === "day") {
//             // Fetch dữ liệu với các giá trị timestamp cách nhau 1 giờ, từ cũ nhất đến mới nhất
//             // Lấy 20 giá trị gần nhất, mỗi giá trị cách nhau 1 giờ
//             const oneHour = 60 * 60 * 1000; // 1 giờ tính bằng milliseconds
//             const timestamps = Array.from(
//                 { length: 20 },
//                 (_, i) => now - i * oneHour
//             );

//             // Tìm giá trị gần nhất cho mỗi timestamp
//             const dataPromises = timestamps.map(async (targetTimestamp) => {
//                 // Tìm bản ghi có timestamp gần targetTimestamp nhất
//                 const nearestRecord = await Model.aggregate([
//                     {
//                         $addFields: {
//                             timestampNum: { $toLong: "$timestamp" }, // Chuyển timestamp từ string sang số
//                         },
//                     },
//                     {
//                         $match: {
//                             timestampNum: {
//                                 $gte: targetTimestamp - oneHour / 2, // Trong khoảng ±30 phút
//                                 $lte: targetTimestamp + oneHour / 2,
//                             },
//                         },
//                     },
//                     {
//                         $sort: {
//                             timestampNum: 1, // Sắp xếp theo timestamp tăng dần
//                         },
//                     },
//                     {
//                         $limit: 1, // Lấy bản ghi gần nhất
//                     },
//                 ]);

//                 return nearestRecord.length > 0
//                     ? {
//                           timestamp: nearestRecord[0].timestamp,
//                           value: nearestRecord[0].value,
//                       }
//                     : null;
//             });

//             let data = (await Promise.all(dataPromises)).filter(
//                 (d) => d !== null
//             );
//             // Sắp xếp từ cũ nhất đến mới nhất
//             data = data.sort(
//                 (a, b) => parseInt(a.timestamp) - parseInt(b.timestamp)
//             );
//             res.json(data);
//         } else if (range === "month") {
//             // Fetch dữ liệu với giá trị timestamp cách nhau 1 ngày, từ cũ nhất đến mới nhất
//             // Lấy trung bình giá trị trong ngày, giới hạn 20 ngày
//             const oneDay = 24 * 60 * 60 * 1000; // 1 ngày tính bằng milliseconds
//             const startOfToday = new Date(now);
//             startOfToday.setHours(0, 0, 0, 0); // Đặt về 0h ngày hiện tại

//             aggregation = [
//                 {
//                     $addFields: {
//                         timestampNum: { $toLong: "$timestamp" }, // Chuyển timestamp từ string sang số
//                     },
//                 },
//                 {
//                     $match: {
//                         timestampNum: {
//                             $gte: startOfToday.getTime() - 19 * oneDay, // Lấy 20 ngày (bao gồm hôm nay)
//                             $lte: now,
//                         },
//                     },
//                 },
//                 {
//                     $group: {
//                         _id: {
//                             $dateToString: {
//                                 format: "%Y-%m-%d",
//                                 date: { $toDate: "$timestampNum" },
//                             },
//                         },
//                         value: { $avg: "$value" }, // Tính trung bình giá trị trong ngày
//                         timestamp: { $first: "$timestamp" },
//                     },
//                 },
//                 {
//                     $sort: { _id: 1 }, // Sắp xếp từ cũ nhất đến mới nhất
//                 },
//                 {
//                     $limit: 20,
//                 },
//             ];

//             const data = await Model.aggregate(aggregation);
//             res.json(data);
//         } else if (range === "year") {
//             // Fetch dữ liệu với giá trị timestamp cách nhau 1 tháng, từ cũ nhất đến mới nhất
//             // Lấy trung bình giá trị trong tháng, giới hạn 20 tháng
//             const startOfMonth = new Date(now);
//             startOfMonth.setDate(1);
//             startOfMonth.setHours(0, 0, 0, 0); // Đặt về ngày 1 của tháng hiện tại

//             aggregation = [
//                 {
//                     $addFields: {
//                         timestampNum: { $toLong: "$timestamp" }, // Chuyển timestamp từ string sang số
//                     },
//                 },
//                 {
//                     $match: {
//                         timestampNum: {
//                             $gte:
//                                 startOfMonth.getTime() -
//                                 19 * 30 * 24 * 60 * 60 * 1000, // Lấy 20 tháng (ước lượng 30 ngày/tháng)
//                             $lte: now,
//                         },
//                     },
//                 },
//                 {
//                     $group: {
//                         _id: {
//                             $dateToString: {
//                                 format: "%Y-%m",
//                                 date: { $toDate: "$timestampNum" },
//                             },
//                         },
//                         value: { $avg: "$value" }, // Tính trung bình giá trị trong tháng
//                         timestamp: { $first: "$timestamp" },
//                     },
//                 },
//                 {
//                     $sort: { _id: 1 }, // Sắp xếp từ cũ nhất đến mới nhất
//                 },
//                 {
//                     $limit: 20,
//                 },
//             ];

//             const data = await Model.aggregate(aggregation);
//             res.json(data);
//         } else {
//             // Mặc định: lấy 20 bản ghi gần nhất
//             const data = await Model.find().sort({ timestamp: -1 }).limit(20);
//             res.json(data);
//         }
//     } catch (err) {
//         console.error("Error:", err);
//         res.status(500).json({ error: err.message });
//     }
// });

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
