const { Temperature, Humidity, Light } = require("../models/sensorModels");

async function getSensorHistory(req, res, next) {
    try {
        const { range } = req.query;
        let aggregation = [];
        let Model;

        // Map sensorType to Model (validation is handled in middleware)
        switch (req.params.sensorType) {
            case "temp":
                Model = Temperature;
                break;
            case "air-humid":
                Model = Humidity;
                break;
            case "light":
                Model = Light;
                break;
        }

        // Lấy thời gian hiện tại
        const now = Date.now();

        if (range === "day") {
            const oneHour = 60 * 60 * 1000; // 1 giờ tính bằng milliseconds
            const timestamps = Array.from(
                { length: 20 },
                (_, i) => now - i * oneHour
            );

            const dataPromises = timestamps.map(async (targetTimestamp) => {
                const nearestRecord = await Model.aggregate([
                    {
                        $addFields: {
                            timestampNum: { $toLong: "$timestamp" },
                        },
                    },
                    {
                        $match: {
                            timestampNum: {
                                $gte: targetTimestamp - oneHour / 2,
                                $lte: targetTimestamp + oneHour / 2,
                            },
                        },
                    },
                    {
                        $sort: {
                            timestampNum: -1,
                        },
                    },
                    {
                        $limit: 1,
                    },
                ]);

                return nearestRecord.length > 0
                    ? {
                          timestamp: nearestRecord[0].timestamp,
                          value: nearestRecord[0].value,
                      }
                    : null;
            });

            let data = (await Promise.all(dataPromises)).filter(
                (d) => d !== null
            );
            data = data.sort(
                (a, b) => parseInt(a.timestamp) - parseInt(b.timestamp)
            );
            res.status(200).json(data);
        } else if (range === "month") {
            const oneDay = 24 * 60 * 60 * 1000;
            const startOfToday = new Date(now);
            startOfToday.setHours(0, 0, 0, 0);

            aggregation = [
                {
                    $addFields: {
                        timestampNum: { $toLong: "$timestamp" },
                    },
                },
                {
                    $match: {
                        timestampNum: {
                            $gte: startOfToday.getTime() - 19 * oneDay,
                            $lte: now,
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: { $toDate: "$timestampNum" },
                            },
                        },
                        value: { $avg: "$value" },
                        timestamp: { $first: "$timestamp" },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
                {
                    $limit: 20,
                },
            ];

            const data = await Model.aggregate(aggregation);
            res.status(200).json(data);
        } else if (range === "year") {
            const startOfMonth = new Date(now);
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            aggregation = [
                {
                    $addFields: {
                        timestampNum: { $toLong: "$timestamp" },
                    },
                },
                {
                    $match: {
                        timestampNum: {
                            $gte:
                                startOfMonth.getTime() -
                                19 * 30 * 24 * 60 * 60 * 1000,
                            $lte: now,
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m",
                                date: { $toDate: "$timestampNum" },
                            },
                        },
                        value: { $avg: "$value" },
                        timestamp: { $first: "$timestamp" },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
                {
                    $limit: 20,
                },
            ];

            const data = await Model.aggregate(aggregation);
            res.status(200).json(data);
        } else {
            console.log(
                `Fetching default sensor history for ${req.params.sensorType} (20 most recent records)`
            );
            const data = await Model.find().sort({ timestamp: -1 }).limit(20);
            res.status(200).json(data);
        }
    } catch (err) {
        console.error(
            `Error in getSensorHistory (${req.params.sensorType}, range: ${req.query.range}):`,
            err.message,
            err.stack
        );
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getSensorHistory };
