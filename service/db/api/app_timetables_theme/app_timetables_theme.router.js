const { getThemes } = require ("./app_timetables_theme.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.get("/",  checkToken, getThemes);
module.exports = router;