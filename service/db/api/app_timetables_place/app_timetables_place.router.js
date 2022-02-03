const { getPlace } = require ("./app_timetables_place.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.get("/",  checkToken, getPlace);
module.exports = router;