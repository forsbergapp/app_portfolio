const router = require("express").Router();
const { getSettings } = require ("./setting.controller");
const { checkDataToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/",  checkDataToken, getSettings);
router.get("/admin",  checkDataToken, getSettings);
module.exports = router;