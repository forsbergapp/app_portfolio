const { getCities} = require ("./worldcities.controller");
const router = require("express").Router();
const { checkDataToken } = require(global.SERVER_ROOT + "/service/auth/auth.controller");

router.get("/:country", checkDataToken, getCities);
module.exports = router;