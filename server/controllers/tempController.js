const temp_model = require("../models/temperature");

async function getTemp(req, res) {
    value = await temp_model.getTemp();
    res.json(value);
}

async function setTemp(req, res) {
    try {
        await temp_model.setTemp(req.body.temp);
        checktemp = await temp_model.checkTemp(req.body.temp);
        res.json({ status: "OK" });
    } catch (err) {
        throw err;
    }
}

async function getMinMaxTemp(req, res) {
    value = await temp_model.get_minmax_temp();
    res.json(value);
}

async function setMinMaxTemp(req, res) {
    await temp_model.set_minmax_temp(req.body.minTemp, req.body.maxTemp);
    res.json({ status: "OK" });
}

async function getMode(req, res) {
    value = await temp_model.getMode();
    res.json(value);
}

async function setMode(req, res) {
    await temp_model.setMode(req.body.mode);
    res.json({ status: "OK" });
}

async function getFanPower(req, res) {
    try {
        const tempData = await temp_model.getTemp();
        const minMaxTempData = await temp_model.get_minmax_temp();
        const fanData = await temp_model.getFanPower();
        res.json({
            temp: tempData.temp,
            fanPower: fanData.fanPower,
            minTemp: minMaxTempData.minTemp,
            maxTemp: minMaxTempData.maxTemp,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function setFanPower(req, res) {
    await temp_model.setFanPower(req.body.fanPower);
    res.json({ status: "OK" });
}

module.exports = {
    getTemp,
    setTemp,
    getMinMaxTemp,
    setMinMaxTemp,
    getMode,
    setMode,
    getFanPower,
    setFanPower,
};
