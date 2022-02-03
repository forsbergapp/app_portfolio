const { getApp, getApp1Globals, getMainGlobals } = require ("./app.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.get("/",  checkToken, getApp);
router.get("/mainglobals", getMainGlobals);
router.get("/app1globals", getApp1Globals);
module.exports = router;