const { getLogs,createLog } = require ("./app_log.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.get("/",  checkToken, getLogs);
router.post("/", checkToken, createLog);
module.exports = router;