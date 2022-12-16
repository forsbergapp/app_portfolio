const router = require("express").Router();
const { getParameters, getParametersAdmin, getParametersAllAdmin, setParameter_admin, setParameterValue_admin } = require ("./app_parameter.controller");
const { createLogAppRI } = require("../../../log/log.controller");
const { checkDataToken, checkAccessTokenAdmin} = require ("../../../auth/auth.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body);
    next();
})

router.get("/admin/all/:app_id", checkAccessTokenAdmin, getParametersAllAdmin);
router.put("/admin", checkAccessTokenAdmin, setParameter_admin);
router.patch("/admin/value", checkAccessTokenAdmin, setParameterValue_admin);
router.get("/admin/:app_id", checkDataToken, getParametersAdmin);
router.get("/:app_id", checkDataToken, getParameters);

module.exports = router;