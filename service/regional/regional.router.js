const { getTimezoneOffset, getGregorian}  = require ("./regional.controller");
const router = require("express").Router();
const { checkDataToken } = require("../auth/auth.controller");
router.get("/timezoneoffset", checkDataToken, getTimezoneOffset);
router.get("/gregorian", checkDataToken, getGregorian);
module.exports = router;