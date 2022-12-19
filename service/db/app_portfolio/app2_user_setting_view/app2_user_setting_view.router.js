const router = require("express").Router();
const { insertUserSettingView} = require ("./app2_user_setting_view.controller");
const { checkDataToken } = require(global.SERVER_ROOT + "/service/auth/auth.controller");
const { createLogAppRI } = require(global.SERVER_ROOT + "/service/log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body).then(function(){
		next();
	})
})
router.post("/", checkDataToken, insertUserSettingView);
module.exports = router;