const { DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop } = require ("./admin.controller");
const router = require("express").Router();
const { createLogAppRI } = require("../../log/log.controller");
const { checkAdmin} = require ("../../auth/admin/admin.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/DBInfo",  checkAdmin, DBInfo);
router.get("/DBInfoSpace",  checkAdmin, DBInfoSpace);
router.get("/DBInfoSpaceSum",  checkAdmin, DBInfoSpaceSum);
router.get("/DBStart",  checkAdmin, DBStart);
router.get("/DBStop",  checkAdmin, DBStop);
module.exports = router;