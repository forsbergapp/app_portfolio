const { DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop } = require ("./admin.controller");
const router = require("express").Router();
const { createLogAppRI } = require("../../log/log.controller");
const { checkAccessTokenAdmin} = require ("../../auth/auth.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/DBInfo",  checkAccessTokenAdmin, DBInfo);
router.get("/DBInfoSpace",  checkAccessTokenAdmin, DBInfoSpace);
router.get("/DBInfoSpaceSum",  checkAccessTokenAdmin, DBInfoSpaceSum);
router.get("/DBStart",  checkAccessTokenAdmin, DBStart);
router.get("/DBStop",  checkAccessTokenAdmin, DBStop);
module.exports = router;