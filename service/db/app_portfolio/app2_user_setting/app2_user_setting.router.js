const { createUserSetting, 
		getUserSettingsByUserId, 
		getProfileUserSetting,
		getProfileUserSettings,
		getProfileUserSettingDetail,
		getProfileTop,
		getUserSetting,
		updateUserSetting, 
		deleteUserSetting} = await import("./app2_user_setting.controller.js");
const { checkAccessToken, checkDataToken } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const { createLogAppRI } = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
	let stack = new Error().stack;
	import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
		createLogAppRI(req, res, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), req.body).then(function(){
			next();
		})
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

export{router};