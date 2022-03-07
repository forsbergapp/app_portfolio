const { getApp } = require ("./app.controller");
const router = require("express").Router();
const { checkDataToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.service");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/",  checkDataToken, getApp);
module.exports = router;