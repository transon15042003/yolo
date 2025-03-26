function convertName(name) {
    switch (name) {
        case "led":
            return "leds";
        case "air-humid":
            return "air humidities";
        case "light":
            return "lights";
        case "fan":
            return "fans";
        case "temp":
            return "temperatures";
        default:
            return name;
    }
}

module.exports = { convertName };
