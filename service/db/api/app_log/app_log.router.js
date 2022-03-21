const router = require("express").Router();
const { getLogs,createLog, getStatUniqueVisitor} = require ("./app_log.controller");
const { checkDataToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.service");
const { checkAdmin} = require ("../../../auth/admin/admin.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/",  checkAdmin, getLogs);
router.post("/", checkDataToken, createLog);
router.get("/admin/stat/uniquevisitor", checkAdmin, getStatUniqueVisitor);
module.exports = router;