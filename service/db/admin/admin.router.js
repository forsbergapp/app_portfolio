const { DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop } = require ("./admin.controller");
const router = require("express").Router();
const { createLogAppRI } = require(global.SERVER_ROOT + "/service/log/log.controller");
const { checkAdmin} = require (global.SERVER_ROOT + "/service/auth/admin/admin.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body).then(function(){
		next();
	})
})
router.get("/DBInfo",  checkAdmin, DBInfo);
router.get("/DBInfoSpace",  checkAdmin, DBInfoSpace);
router.get("/DBInfoSpaceSum",  checkAdmin, DBInfoSpaceSum);
router.get("/DBStart",  checkAdmin, DBStart);
router.get("/DBStop",  checkAdmin, DBStop);
module.exports = router;