const { getApp, getAppsAdmin, updateAppAdmin } = require ("./app.controller");
const router = require("express").Router();
const { checkDataToken } = require(global.SERVER_ROOT + "/service/auth/auth.controller");
const { createLogAppRI } = require(global.SERVER_ROOT + "/service/log/log.controller");
const { checkAccessTokenAdmin} = require (global.SERVER_ROOT + "/service/auth/auth.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body).then(function(){
		next();
	})
})
router.get("/",  checkDataToken, getApp);
router.get("/admin",  checkAccessTokenAdmin, getAppsAdmin);
router.put("/admin/:id",  checkAccessTokenAdmin, updateAppAdmin);
module.exports = router;