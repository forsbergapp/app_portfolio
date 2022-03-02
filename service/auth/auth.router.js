const { accessToken} = require ("./auth.controller");
const router = require("express").Router();
router.post("/", accessToken);
module.exports = router;