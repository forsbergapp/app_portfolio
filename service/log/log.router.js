const { getParameters, getLogs, getFiles, getPM2Logs} = require ("./log.controller");
const router = require("express").Router();
const { checkAdmin} = require(global.SERVER_ROOT + "/service/auth/admin/admin.controller");
router.get("/parameters", checkAdmin, getParameters);
router.get("/logs", checkAdmin, getLogs);
router.get("/files", checkAdmin, getFiles);
router.get("/pm2logs", checkAdmin, getPM2Logs);
module.exports = router;