const { execute_db_sql } = require ("./common.controller");
const router = require("express").Router();
const { createLogAppRI } = require("../../log/log.controller");
const { checkDBUrl} = require ("../../auth/auth.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.post("/execute_db_sql",  checkDBUrl, execute_db_sql);
module.exports = router;