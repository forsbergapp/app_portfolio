const { likeUserSetting, 
		unlikeUserSetting} = await import("./app2_user_setting_like.controller.js");
const { checkAccessToken } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const { createLogAppRI } = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename(import.meta.url), __appfunction(), __appline(), req.body).then(function(){
		next();
	})
})
router.post("/:id", checkAccessToken, likeUserSetting);
router.delete("/:id", checkAccessToken, unlikeUserSetting);
export{router};