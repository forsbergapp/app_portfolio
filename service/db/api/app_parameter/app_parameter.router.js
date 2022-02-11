const { getParameters } = require ("./app_parameter.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.get("/:app_id", getParameters);
module.exports = router;