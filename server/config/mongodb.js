require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "";

class DatabaseClient {
    connection = null;

    constructor() {
        if (!this.connection) {
            this.connection = mongoose.connection;

            this.connection
                .on(
                    "open",
                    console.info.bind(console, "MongoDB connection: open")
                )
                .on(
                    "close",
                    console.info.bind(console, "MongoDB connection: close")
                )
                .on(
                    "disconnecting",
                    console.info.bind(
                        console,
                        "MongoDB connection: disconnecting"
                    )
                )
                .on(
                    "disconnected",
                    console.info.bind(
                        console,
                        "MongoDB connection: disconnected"
                    )
                )
                .on(
                    "reconnected",
                    console.info.bind(
                        console,
                        "MongoDB connection: reconnected"
                    )
                )
                .on(
                    "fullsetup",
                    console.info.bind(console, "MongoDB connection: fullsetup")
                )
                .on(
                    "all",
                    console.info.bind(console, "MongoDB connection: all")
                )
                .on(
                    "error",
                    console.error.bind(console, "MongoDB connection: error:")
                );
        }
        this.connect();
    }

    async connect() {
        try {
            await mongoose.connect(MONGODB_URI, {
                maxPoolSize: 10,
            });
        } catch (error) {
            console.error(error);
        }
    }

    async close() {
        try {
            await this.connection.close();
        } catch (error) {
            console.error(error);
        }
    }

    getClient() {
        return this.connection;
    }
}

module.exports = new DatabaseClient();
