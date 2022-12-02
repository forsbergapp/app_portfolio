const { getParameters, getLogs, getFiles, getPM2Logs} = require ("./log.controller");
const router = require("express").Router();
const { checkAccessTokenAdmin} = require ("../auth/auth.controller");
router.get("/parameters", checkAccessTokenAdmin, getParameters);
router.get("/logs", checkAccessTokenAdmin, getLogs);
router.get("/files", checkAccessTokenAdmin, getFiles);
router.get("/pm2logs", checkAccessTokenAdmin, getPM2Logs);
module.exports = router;