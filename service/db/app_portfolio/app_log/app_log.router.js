const router = require("express").Router();
const { getLogsAdmin,createLog, getStatUniqueVisitorAdmin} = require ("./app_log.controller");
const { checkDataToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.controller");
const { checkAccessTokenAdmin} = require ("../../../auth/auth.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/",  checkAccessTokenAdmin, getLogsAdmin);
router.post("/", checkDataToken, createLog);
router.get("/admin/stat/uniquevisitor", checkAccessTokenAdmin, getStatUniqueVisitorAdmin);
module.exports = router;