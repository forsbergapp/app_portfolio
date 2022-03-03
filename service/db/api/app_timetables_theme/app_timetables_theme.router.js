const { getThemes } = require ("./app_timetables_theme.controller");
const router = require("express").Router();
const { checkDataToken } = require("../../../auth/auth.controller");

router.get("/",  checkDataToken, getThemes);
module.exports = router;