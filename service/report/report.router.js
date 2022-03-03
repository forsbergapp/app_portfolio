const { getReport } = require ("./report.controller");
const router = require("express").Router();

router.get("/", getReport);
module.exports = router;