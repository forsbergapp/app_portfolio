const router = require("express").Router();
const { getPlace } = require ("./app_timetables_place.controller");
const { checkDataToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.service");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/",  checkDataToken, getPlace);
module.exports = router;