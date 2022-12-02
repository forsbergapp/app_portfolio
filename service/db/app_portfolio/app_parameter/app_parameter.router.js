const router = require("express").Router();
const { getParameters, getParameters_admin, getParameter_admin, setParameter_admin, setParameterValue_admin } = require ("./app_parameter.controller");
const { createLogAppRI } = require("../../../log/log.controller");
const { checkDataToken, checkAccessTokenAdmin} = require ("../../../auth/auth.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/:app_id", checkDataToken, getParameters);
router.get("/admin/all/:app_id", checkAccessTokenAdmin, getParameters_admin);
router.get("/admin/:app_id", checkAccessTokenAdmin, getParameter_admin);
router.put("/admin", checkAccessTokenAdmin, setParameter_admin);
router.patch("/admin/value", checkAccessTokenAdmin, setParameterValue_admin);

module.exports = router;