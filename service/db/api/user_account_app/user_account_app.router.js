const router = require("express").Router();
const { createUserAccountApp, getUserAccountApps, deleteUserAccountApps} = require ("./user_account_app.controller");
const { checkAccessToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.post("/", checkAccessToken, createUserAccountApp);
router.get("/:user_account_id", checkAccessToken, getUserAccountApps);
router.delete("/:user_account_id/:app_id", checkAccessToken, deleteUserAccountApps);
module.exports = router;