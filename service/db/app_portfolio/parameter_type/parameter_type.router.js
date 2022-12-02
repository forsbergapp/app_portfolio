const router = require("express").Router();
const { getParameterTypeAdmin} = require ("./parameter_type.controller");
const { createLogAppRI } = require("../../../log/log.controller");
const { checkAccessTokenAdmin} = require ("../../../auth/auth.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/admin", checkAccessTokenAdmin, getParameterTypeAdmin);

module.exports = router;