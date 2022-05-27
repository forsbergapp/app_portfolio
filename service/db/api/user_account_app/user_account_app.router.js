const router = require("express").Router();
const { createUserAccountApp} = require ("./user_account_app.controller");
const { checkAccessToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.service");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.post("/", checkAccessToken, createUserAccountApp);
module.exports = router;