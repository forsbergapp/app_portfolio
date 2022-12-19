const { getUserAccountLogonAdmin} = require ("./user_account_logon.controller");
const router = require("express").Router();
const { createLogAppRI } = require(global.SERVER_ROOT + "/service/log/log.controller");
const { checkAccessTokenAdmin} = require (global.SERVER_ROOT + "/service/auth/auth.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body).then(function(){
		next();
	})
})
router.get("/admin/:user_account_id/:app_id",  checkAccessTokenAdmin, getUserAccountLogonAdmin);
module.exports = router;