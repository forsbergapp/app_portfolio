const { createUserSetting, 
		getUserSettingsByUserId, 
		getProfileUserSettings,
		getUserSetting,
		updateUserSetting, 
		deleteUserSetting,
		deleteUserSettingsByUserId} = require ("./app_timetables_user_setting.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.post("/", checkToken, createUserSetting);
router.get("/:id", checkToken, getUserSetting);
router.get("/user_account_id/:id", checkToken, getUserSettingsByUserId);
router.get("/profile/:id", checkToken, getProfileUserSettings);
router.put("/:id", checkToken, updateUserSetting);
router.delete("/:id", checkToken, deleteUserSetting);
router.delete("/user_account_id/:id", checkToken, deleteUserSettingsByUserId);
module.exports = router;