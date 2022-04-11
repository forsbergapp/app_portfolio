const { getParameters, getLogs} = require ("./log.controller");
const router = require("express").Router();
const { checkAdmin} = require ("../auth/admin/admin.controller");
router.get("/parameters", checkAdmin, getParameters);
router.get("/logs", checkAdmin, getLogs);
module.exports = router;