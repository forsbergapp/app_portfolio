const { getCities} = require ("./worldcities.controller");
const router = require("express").Router();
const { checkToken } = require("../auth/auth.controller");

router.get("/:country", checkToken, getCities);
module.exports = router;