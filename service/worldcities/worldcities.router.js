const { getCities} = require ("./worldcities.controller");
const router = require("express").Router();
const { checkDataToken } = require("../auth/auth.controller");

router.get("/:country", checkDataToken, getCities);
module.exports = router;