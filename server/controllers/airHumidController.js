const humid_model = require("../models/airHumid");

async function getHumid(req, res) {
    value = await humid_model.getHumid();
    res.json(value);
}

async function setHumid(req, res) {
    try {
        await humid_model.setHumid(req.body.humid);
        checkHumid = await humid_model.checkHumid(req.body.humid);
        res.json({ status: "OK" });
    } catch (err) {
        throw err;
    }
}

async function getMinMaxHumid(req, res) {
    value = await humid_model.get_minmax_humid();
    res.json(value);
}

async function setMinMaxHumid(req, res) {
    await humid_model.set_minmax_humid(req.body.minHumid, req.body.maxHumid);
    res.json({ status: "OK" });
}

async function getMode(req, res) {
    value = await humid_model.getMode();
    res.json(value);
}

async function setMode(req, res) {
    await humid_model.setMode(req.body.mode);
    res.json({ status: "OK" });
}

module.exports = {
    getHumid,
    setHumid,
    getMinMaxHumid,
    setMinMaxHumid,
    getMode,
    setMode,
};
