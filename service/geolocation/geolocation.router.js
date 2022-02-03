const { getPlace, getIp} = require ("./geolocation.controller");
const router = require("express").Router();
const { checkToken } = require("../auth/auth.controller");
router.get("/getplace", checkToken, getPlace);
router.get("/getip", checkToken, getIp);
module.exports = router;