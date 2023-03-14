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
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
	let stack = new Error().stack;
	import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
		import(`file://${process.cwd()}/service/log/log.service.js`).then(function({createLogAppRI}){
			createLogAppRI(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), req.body,
				           req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
				           req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(function(){
				next();
			})
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