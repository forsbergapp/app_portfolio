const { getApp, getAppsAdmin, updateAppAdmin } = require ("./app.controller");
const router = require("express").Router();
const { checkDataToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.controller");
const { checkAccessTokenAdmin} = require ("../../../auth/auth.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body).then(function(){
		next();
	})
})
router.get("/",  checkDataToken, getApp);
router.get("/admin",  checkAccessTokenAdmin, getAppsAdmin);
router.put("/admin/:id",  checkAccessTokenAdmin, updateAppAdmin);
module.exports = router;