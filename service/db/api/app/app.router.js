const { getApp, getAppsAdmin, updateApp } = require ("./app.controller");
const router = require("express").Router();
const { checkDataToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.controller");
const { checkAdmin} = require ("../../../auth/admin/admin.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/",  checkDataToken, getApp);
router.get("/admin",  checkAdmin, getAppsAdmin);
router.put("/admin/:id",  checkAdmin, updateApp);
module.exports = router;