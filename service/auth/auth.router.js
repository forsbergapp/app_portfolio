const { accessToken} = require ("./auth.controller");
const router = require("express").Router();
router.post("/token", accessToken);
module.exports = router;