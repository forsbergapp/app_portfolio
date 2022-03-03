const { getCountries } = require ("./country.controller");
const router = require("express").Router();
const { checkDataToken } = require("../../../auth/auth.controller");

router.get("/:lang_code",  checkDataToken, getCountries);
module.exports = router;