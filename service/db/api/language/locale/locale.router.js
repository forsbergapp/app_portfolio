const { getLocales } = require ("./locale.controller");
const router = require("express").Router();
const { checkDataToken } = require("../../../../auth/auth.controller");

router.get("/:lang_code",  checkDataToken, getLocales);
module.exports = router;