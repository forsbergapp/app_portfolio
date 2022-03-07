const router = require("express").Router();
const { getParameters } = require ("./app_parameter.controller");
const { createLogAppRI } = require("../../../log/log.service");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/:app_id", getParameters);
module.exports = router;