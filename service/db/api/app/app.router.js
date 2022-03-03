const { getApp } = require ("./app.controller");
const router = require("express").Router();
const { checkDataToken } = require("../../../auth/auth.controller");

router.get("/",  checkDataToken, getApp);
module.exports = router;