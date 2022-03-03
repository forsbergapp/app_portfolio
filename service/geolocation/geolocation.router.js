const { getPlace, getIp} = require ("./geolocation.controller");
const router = require("express").Router();
const { checkDataToken } = require("../auth/auth.controller");
router.get("/getplace", checkDataToken, getPlace);
router.get("/getip", checkDataToken, getIp);
module.exports = router;