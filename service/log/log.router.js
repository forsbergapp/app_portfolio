const {getParameters, getLogs, getFiles, getPM2Logs} = await import('./log.controller.js');
const {createLogAppRI} = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const { checkAdmin} = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
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

router.get("/parameters", checkAdmin, getParameters);
router.get("/logs", checkAdmin, getLogs);
router.get("/files", checkAdmin, getFiles);
router.get("/pm2logs", checkAdmin, getPM2Logs);
export {router};