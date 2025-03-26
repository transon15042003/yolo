const DatabaseClient = require("./config/mongodb");
const db = DatabaseClient.getClient();

async function setupDatabase() {
    try {
        await db.collection("Devices").drop();
        await db.collection("Lighting Condition").drop();
        await db.collection("Temperature Condition").drop();
        await db.collection("Soil Moisture").drop();
        await db.collection("Air Humidity").drop();

        // Create collections
        await db.createCollection("Devices");
        await db.createCollection("Lighting Condition");
        await db.createCollection("Temperature Condition");
        await db.createCollection("Soil Moisture");
        await db.createCollection("Air Humidity");

        // Insert documents

        await db.collection("Devices").insertMany([
            {
                _id: 1,
                Type: "Measure temperature",
                idEnvironment: 1,
            },
            {
                _id: 3,
                Type: "Measure light",
                idEnvironment: 1,
            },
            {
                _id: 4,
                Type: "Measure air humidity",
                idEnvironment: 1,
            },
        ]);

        console.log("Completely created data");

        db.close();
    } catch (error) {
        console.error("Error setting up database:", error);
    }
}

setupDatabase();
