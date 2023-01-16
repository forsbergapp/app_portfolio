const { createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps} = await import("./user_account_app.controller.js");
const { checkAccessToken } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const { createLogAppRI } = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename(import.meta.url), __appfunction(), __appline(), req.body).then(function(){
		next();
	})
})
router.post("/", checkAccessToken, createUserAccountApp);
router.get("/:user_account_id", checkAccessToken, getUserAccountApp);
router.get("/apps/:user_account_id", checkAccessToken, getUserAccountApps);
router.patch("/:user_account_id", checkAccessToken, updateUserAccountApp);
router.delete("/:user_account_id/:app_id", checkAccessToken, deleteUserAccountApps);
export{router};