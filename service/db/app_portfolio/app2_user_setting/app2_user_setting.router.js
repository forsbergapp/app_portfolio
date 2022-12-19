const router = require("express").Router();
const { createUserSetting, 
	getUserSettingsByUserId, 
	getProfileUserSetting,
	getProfileUserSettings,
	getProfileUserSettingDetail,
	getProfileTop,
	getUserSetting,
	updateUserSetting, 
	deleteUserSetting} = require ("./app2_user_setting.controller");
const { checkAccessToken, checkDataToken } = require(global.SERVER_ROOT + "/service/auth/auth.controller");
const { createLogAppRI } = require(global.SERVER_ROOT + "/service/log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body).then(function(){
		next();
	})
})
router.get("/:id", checkDataToken, getUserSetting);
router.get("/user_account_id/:id", checkDataToken, getUserSettingsByUserId);
router.get("/profile/:id", checkDataToken, getProfileUserSetting);
router.get("/profile/all/:id", checkDataToken, getProfileUserSettings);
router.get("/profile/detail/:id", checkAccessToken, getProfileUserSettingDetail);
router.get("/profile/top/:statchoice", checkDataToken, getProfileTop);
router.post("/", checkAccessToken, createUserSetting);
router.put("/:id", checkAccessToken, updateUserSetting);
router.delete("/:id", checkAccessToken, deleteUserSetting);

module.exports = router;