const router = require("express").Router();
const { createUserSetting, 
	getUserSettingsByUserId, 
	getProfileUserSettings,
	getUserSetting,
	updateUserSetting, 
	deleteUserSetting,
	deleteUserSettingsByUserId} = require ("./app_timetables_user_setting.controller");
const { checkAccessToken, checkDataToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.service");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.get("/:id", checkDataToken, getUserSetting);
router.get("/user_account_id/:id", checkDataToken, getUserSettingsByUserId);
router.get("/profile/:id", checkDataToken, getProfileUserSettings);

router.post("/", checkAccessToken, createUserSetting);
router.put("/:id", checkAccessToken, updateUserSetting);
router.delete("/:id", checkAccessToken, deleteUserSetting);
router.delete("/user_account_id/:id", checkAccessToken, deleteUserSettingsByUserId);

module.exports = router;