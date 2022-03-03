const { getObjects } = require ("./app_object.controller");
const router = require("express").Router();
const { checkDataToken } = require("../../../auth/auth.controller");

router.get("/:lang_code",  checkDataToken, getObjects);
module.exports = router;