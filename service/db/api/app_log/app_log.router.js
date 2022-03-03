const { getLogs,createLog } = require ("./app_log.controller");
const router = require("express").Router();
const { checkDataToken } = require("../../../auth/auth.controller");

router.get("/",  checkDataToken, getLogs);
router.post("/", checkDataToken, createLog);
module.exports = router;