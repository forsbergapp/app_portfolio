const router = require("express").Router();
const { likeUserSetting, 
	unlikeUserSetting} = require ("./app2_user_setting_like.controller");
const { checkAccessToken } = require(global.SERVER_ROOT + "/service/auth/auth.controller");
const { createLogAppRI } = require(global.SERVER_ROOT + "/service/log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body).then(function(){
		next();
	})
})
router.post("/:id", checkAccessToken, likeUserSetting);
router.delete("/:id", checkAccessToken, unlikeUserSetting);
module.exports = router;