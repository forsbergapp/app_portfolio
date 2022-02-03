const { getObjects } = require ("./app_object.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.get("/:lang_code",  checkToken, getObjects);
module.exports = router;