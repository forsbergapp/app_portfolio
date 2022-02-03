const { accessToken} = require ("./auth.controller");
const router = require("express").Router();
router.post("/token/:token_type", accessToken);
module.exports = router;