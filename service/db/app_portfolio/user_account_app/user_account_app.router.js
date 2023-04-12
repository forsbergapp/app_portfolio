const { createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps} = await import("./user_account_app.controller.js");
const { checkAccessToken } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
	let stack = new Error().stack;
	import(`file://${process.cwd()}/service/common/common.service.js`).then(({COMMON}) => {
		import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogAppRI}) => {
			createLogAppRI(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), req.body,
				           req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
				           req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
				next();
			})
		})
	})
})
router.post("/", checkAccessToken, createUserAccountApp);
router.get("/:user_account_id", checkAccessToken, getUserAccountApp);
router.get("/apps/:user_account_id", checkAccessToken, getUserAccountApps);
router.patch("/:user_account_id", checkAccessToken, updateUserAccountApp);
router.delete("/:user_account_id/:app_id", checkAccessToken, deleteUserAccountApps);
export{router};