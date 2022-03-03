const { getPlace } = require ("./app_timetables_place.controller");
const router = require("express").Router();
const { checkDataToken } = require("../../../auth/auth.controller");

router.get("/",  checkDataToken, getPlace);
module.exports = router;