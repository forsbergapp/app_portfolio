const router = require("express").Router();
const { getParameterType} = require ("./parameter_type.controller");
const { createLogAppRI } = require("../../../log/log.service");
const { checkAdmin} = require ("../../../auth/admin/admin.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/admin", checkAdmin, getParameterType);

module.exports = router;