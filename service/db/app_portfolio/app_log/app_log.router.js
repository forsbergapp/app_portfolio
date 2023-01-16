const { getLogsAdmin,createLog, getStatUniqueVisitorAdmin} = await import("./app_log.controller.js");
const { checkDataToken } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const { createLogAppRI } = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const { checkAccessTokenAdmin} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename(import.meta.url), __appfunction(), __appline(), req.body).then(function(){
		next();
	})
})
router.get("/admin",  checkAccessTokenAdmin, getLogsAdmin);
router.post("/", checkDataToken, createLog);
router.get("/admin/stat/uniquevisitor", checkAccessTokenAdmin, getStatUniqueVisitorAdmin);
export{router};