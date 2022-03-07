const router = require("express").Router();
const { getLogs,createLog } = require ("./app_log.controller");
const { checkDataToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.service");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/",  checkDataToken, getLogs);
router.post("/", checkDataToken, createLog);
module.exports = router;