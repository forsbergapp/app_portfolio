const router = require("express").Router();
const { getParameters, getParameters_admin, getParameter_admin, setParameter_admin, setParameterValue_admin, getAppStartParameters } = require ("./app_parameter.controller");
const { createLogAppRI } = require("../../../log/log.controller");
const { checkAdmin} = require ("../../../auth/admin/admin.controller");
const { checkDataToken } = require("../../../auth/auth.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/:app_id", checkDataToken, getParameters);
router.get("/admin/all/:app_id", checkAdmin, getParameters_admin);
router.get("/admin/:app_id", checkAdmin, getParameter_admin);
router.put("/admin", checkAdmin, setParameter_admin);
router.patch("/admin/value", checkAdmin, setParameterValue_admin);

router.get("/start/:app_id", checkDataToken, getAppStartParameters);

module.exports = router;