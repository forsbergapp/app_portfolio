const { getCountries } = require ("./country.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.get("/:lang_code",  checkToken, getCountries);
module.exports = router;