const router = require("express").Router();
const { getObjects } = require ("./app_object.controller");
const { checkDataToken } = require(global.SERVER_ROOT + "/service/auth/auth.controller");
const { createLogAppRI } = require(global.SERVER_ROOT + "/service/log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body).then(function(){
		next();
	})
})
router.get("/:lang_code",  checkDataToken, getObjects);
router.get("/admin/:lang_code",  checkDataToken, getObjects);
module.exports = router;