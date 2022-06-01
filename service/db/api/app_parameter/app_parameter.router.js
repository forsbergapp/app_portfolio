const router = require("express").Router();
const { getParameters, getParameters_admin, getParameter, setParameter, setParameterValue } = require ("./app_parameter.controller");
const { createLogAppRI } = require("../../../log/log.service");
const { checkAdmin} = require ("../../../auth/admin/admin.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/:app_id", getParameters);
router.get("/admin/all/:app_id", checkAdmin, getParameters_admin);
router.get("/admin/:app_id", checkAdmin, getParameter);
router.put("/admin", checkAdmin, setParameter);
router.put("/admin/value", checkAdmin, setParameterValue);

module.exports = router;