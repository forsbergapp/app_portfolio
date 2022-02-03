const { getLocales } = require ("./locale.controller");
const router = require("express").Router();
const { checkToken } = require("../../../../auth/auth.controller");

router.get("/:lang_code",  checkToken, getLocales);
module.exports = router;