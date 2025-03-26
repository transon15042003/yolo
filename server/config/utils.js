function convertName(name) {
    switch (name) {
        case "led":
            return "Led";
        case "air-humid":
            return "Air Humidity";
        case "light":
            return "Light Condition";
        case "fan":
            return "Fan";
        case "temp":
            return "Temperature Condition";
        default:
            return name;
    }
}

module.exports = { convertName };
