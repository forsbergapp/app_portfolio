const { getParameters } = require ("./app_parameter.controller");
const router = require("express").Router();

router.get("/:app_id", getParameters);
module.exports = router;