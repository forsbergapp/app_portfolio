const { getUserAccountLogonAdmin} = require ("./user_account_logon.controller");
const router = require("express").Router();
const { createLogAppRI } = require("../../../log/log.controller");
const { checkAccessTokenAdmin} = require ("../../../auth/auth.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/admin/:user_account_id/:app_id",  checkAccessTokenAdmin, getUserAccountLogonAdmin);
module.exports = router;