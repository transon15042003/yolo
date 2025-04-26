const { LedEnergy, FanEnergy } = require("../models/sensorModels");

async function getEnergyHistory(req, res) {
    try {
        const { deviceType, range } = req.query;
        let Model;

        // Map deviceType to Model
        switch (deviceType) {
            case "led":
                Model = LedEnergy;
                break;
            case "fan":
                Model = FanEnergy;
                break;
            default:
                return res.status(400).json({
                    error: "Invalid device type. Must be 'led' or 'fan'.",
                });
        }

        // Lấy thời gian hiện tại
        const now = new Date();
        const oneHour = 60 * 60 * 1000; // 1 giờ tính bằng milliseconds
        const oneDay = 24 * 60 * 60 * 1000; // 1 ngày tính bằng milliseconds

        if (range === "day") {
            // Lấy 24 giờ gần nhất (tính cả giờ hiện tại)
            const startOfRange = new Date(now.getTime() - 23 * oneHour); // 24 giờ trước giờ hiện tại
            startOfRange.setMinutes(0, 0, 0); // Đặt về đầu giờ (ví dụ: 9:00:00)

            const data = await Model.aggregate([
                {
                    $match: {
                        timestamp: {
                            $gte: startOfRange,
                            $lte: now,
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%dT%H:00:00Z",
                                date: "$timestamp",
                            },
                        },
                        energy: { $sum: "$energy" }, // Tổng năng lượng trong giờ
                        timestamp: { $first: "$timestamp" },
                    },
                },
                {
                    $sort: { timestamp: 1 },
                },
                {
                    $limit: 24,
                },
            ]);

            const result = data.map((item) => ({
                timestamp: item.timestamp,
                energy: item.energy,
            }));

            res.status(200).json(result);
        } else if (range === "month") {
            // Tổng hợp năng lượng theo ngày trong 30 ngày gần nhất
            const startOfToday = new Date(now);
            startOfToday.setHours(0, 0, 0, 0); // Đặt về đầu ngày hiện tại
            const startOfRange = new Date(startOfToday.getTime() - 29 * oneDay); // 30 ngày trước

            const data = await Model.aggregate([
                {
                    $match: {
                        timestamp: {
                            $gte: startOfRange,
                            $lte: now,
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$timestamp",
                            },
                        },
                        energy: { $sum: "$energy" }, // Tổng năng lượng trong ngày
                        timestamp: { $first: "$timestamp" },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
                {
                    $limit: 30,
                },
            ]);

            const result = data.map((item) => ({
                timestamp: item.timestamp,
                energy: item.energy,
            }));

            res.status(200).json(result);
        } else if (range === "year") {
            // Tổng hợp năng lượng theo tháng trong 12 tháng gần nhất
            const startOfMonth = new Date(now);
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0); // Đặt về đầu tháng hiện tại
            const startOfRange = new Date(startOfMonth);
            startOfRange.setMonth(startOfMonth.getMonth() - 11); // 12 tháng trước

            const data = await Model.aggregate([
                {
                    $match: {
                        timestamp: {
                            $gte: startOfRange,
                            $lte: now,
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m",
                                date: "$timestamp",
                            },
                        },
                        energy: { $sum: "$energy" }, // Tổng năng lượng trong tháng
                        timestamp: { $first: "$timestamp" },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
                {
                    $limit: 12,
                },
            ]);

            const result = data.map((item) => ({
                timestamp: item.timestamp,
                energy: item.energy,
            }));

            res.status(200).json(result);
        } else {
            // Mặc định: Lấy 24 bản ghi gần nhất (theo giờ)
            const data = await Model.find().sort({ timestamp: -1 }).limit(24);

            res.status(200).json(data);
        }
    } catch (err) {
        console.error(
            `Error in getEnergyHistory (deviceType: ${req.query.deviceType}, range: ${req.query.range}):`,
            err.message,
            err.stack
        );
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getEnergyHistory };
