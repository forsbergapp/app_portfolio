const router = require("express").Router();
const { getMessage } = require ("./message_translation.controller");
const { checkDataToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/:code",  checkDataToken, getMessage);
module.exports = router;