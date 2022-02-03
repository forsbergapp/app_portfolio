const { getReport } = require ("./report.controller");
const router = require("express").Router();
const { checkToken } = require("../auth/auth.controller");

router.get("/", getReport);
module.exports = router;