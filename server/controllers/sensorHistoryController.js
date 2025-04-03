const { Temperature, Humidity, Light } = require("../models/sensorModels");

async function getSensorHistory(req, res, next) {
    try {
        const { range } = req.query;
        let aggregation = [];
        let Model;

        // Xác định Model dựa trên sensorType
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
            default:
                return res.status(400).json({ error: "Invalid sensor type" });
        }

        // Lấy thời gian hiện tại
        const now = Date.now();

        if (range === "day") {
            // Fetch dữ liệu với các giá trị timestamp cách nhau 1 giờ, từ cũ nhất đến mới nhất
            // Lấy 20 giá trị gần nhất, mỗi giá trị cách nhau 1 giờ
            const oneHour = 60 * 60 * 1000; // 1 giờ tính bằng milliseconds
            const timestamps = Array.from(
                { length: 20 },
                (_, i) => now - i * oneHour
            );

            // Tìm giá trị gần nhất cho mỗi timestamp
            const dataPromises = timestamps.map(async (targetTimestamp) => {
                // Tìm bản ghi có timestamp gần targetTimestamp nhất
                const nearestRecord = await Model.aggregate([
                    {
                        $addFields: {
                            timestampNum: { $toLong: "$timestamp" }, // Chuyển timestamp từ string sang số
                        },
                    },
                    {
                        $match: {
                            timestampNum: {
                                $gte: targetTimestamp - oneHour / 2, // Trong khoảng ±30 phút
                                $lte: targetTimestamp + oneHour / 2,
                            },
                        },
                    },
                    {
                        $sort: {
                            timestampNum: -1, // Sắp xếp theo timestamp giảm dần để lấy bản ghi mới nhất
                        },
                    },
                    {
                        $limit: 1, // Lấy bản ghi gần nhất
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
            // Sắp xếp từ cũ nhất đến mới nhất
            data = data.sort(
                (a, b) => parseInt(a.timestamp) - parseInt(b.timestamp)
            );
            res.json(data);
        } else if (range === "month") {
            // Fetch dữ liệu với giá trị timestamp cách nhau 1 ngày, từ cũ nhất đến mới nhất
            // Lấy trung bình giá trị trong ngày, giới hạn 20 ngày
            const oneDay = 24 * 60 * 60 * 1000; // 1 ngày tính bằng milliseconds
            const startOfToday = new Date(now);
            startOfToday.setHours(0, 0, 0, 0); // Đặt về 0h ngày hiện tại

            aggregation = [
                {
                    $addFields: {
                        timestampNum: { $toLong: "$timestamp" }, // Chuyển timestamp từ string sang số
                    },
                },
                {
                    $match: {
                        timestampNum: {
                            $gte: startOfToday.getTime() - 19 * oneDay, // Lấy 20 ngày (bao gồm hôm nay)
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
                        value: { $avg: "$value" }, // Tính trung bình giá trị trong ngày
                        timestamp: { $first: "$timestamp" },
                    },
                },
                {
                    $sort: { _id: 1 }, // Sắp xếp từ cũ nhất đến mới nhất
                },
                {
                    $limit: 20,
                },
            ];

            const data = await Model.aggregate(aggregation);
            res.json(data);
        } else if (range === "year") {
            // Fetch dữ liệu với giá trị timestamp cách nhau 1 tháng, từ cũ nhất đến mới nhất
            // Lấy trung bình giá trị trong tháng, giới hạn 20 tháng
            const startOfMonth = new Date(now);
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0); // Đặt về ngày 1 của tháng hiện tại

            aggregation = [
                {
                    $addFields: {
                        timestampNum: { $toLong: "$timestamp" }, // Chuyển timestamp từ string sang số
                    },
                },
                {
                    $match: {
                        timestampNum: {
                            $gte:
                                startOfMonth.getTime() -
                                19 * 30 * 24 * 60 * 60 * 1000, // Lấy 20 tháng (ước lượng 30 ngày/tháng)
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
                        value: { $avg: "$value" }, // Tính trung bình giá trị trong tháng
                        timestamp: { $first: "$timestamp" },
                    },
                },
                {
                    $sort: { _id: 1 }, // Sắp xếp từ cũ nhất đến mới nhất
                },
                {
                    $limit: 20,
                },
            ];

            const data = await Model.aggregate(aggregation);
            res.json(data);
        } else {
            // Mặc định: lấy 20 bản ghi gần nhất
            const data = await Model.find().sort({ timestamp: -1 }).limit(20);
            res.json(data);
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getSensorHistory };
