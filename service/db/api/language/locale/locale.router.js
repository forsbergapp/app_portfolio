const router = require("express").Router();
const { getLocales } = require ("./locale.controller");
const { checkDataToken } = require("../../../../auth/auth.controller");
const { createLogAppRI } = require("../../../../log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/:lang_code",  checkDataToken, getLocales);
module.exports = router;