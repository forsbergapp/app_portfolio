const { getAppRoleAdmin} = require ("./app_role.controller");
const router = require("express").Router();
const { createLogAppRI } = require(global.SERVER_ROOT + "/service/log/log.controller");
const { checkAccessTokenAdmin} = require (global.SERVER_ROOT + "/service/auth/auth.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body).then(function(){
		next();
	})
})
router.get("/admin",  checkAccessTokenAdmin, getAppRoleAdmin);
module.exports = router;