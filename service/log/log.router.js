const { getParameters, getLogs, getFiles} = require ("./log.controller");
const router = require("express").Router();
const { checkAdmin} = require ("../auth/admin/admin.controller");
router.get("/parameters", checkAdmin, getParameters);
router.get("/logs", checkAdmin, getLogs);
router.get("/files", checkAdmin, getFiles);
module.exports = router;