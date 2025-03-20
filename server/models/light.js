var LightEnergy = 50;
var minLightEnergy = 40;
var maxLightEnergy = 60;

async function getLightEnergy() {
    return { LightEnergy: LightEnergy };
}

async function setLightEnergy(value) {
    LightEnergy = value;
}

async function getMinMaxLightEnergy() {
    return { minLightEnergy, maxLightEnergy };
}

async function setMinMaxLightEnergy(min, max) {
    minLightEnergy = min;
    maxLightEnergy = max;
}

async function checkLightEnergy(value) {
    if (value < minLightEnergy || value > maxLightEnergy) return false;
    return true;
}

module.exports = {
    getLightEnergy,
    setLightEnergy,
    getMinMaxLightEnergy,
    setMinMaxLightEnergy,
    checkLightEnergy,
};
