const { getDBInfo, getDBInfoSpace, getDBInfoSpaceSum } = require ("./admin.controller");
const router = require("express").Router();
const { createLogAppRI } = require("../../log/log.controller");
const { checkAdmin} = require ("../../auth/admin/admin.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/getDBInfo",  checkAdmin, getDBInfo);
router.get("/getDBInfoSpace",  checkAdmin, getDBInfoSpace);
router.get("/getDBInfoSpaceSum",  checkAdmin, getDBInfoSpaceSum);
module.exports = router;