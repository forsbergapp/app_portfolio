const { DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop } = await import('./admin.controller.js');
const {createLogAppRI} = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const {checkAdmin} = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
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
router.get("/DBInfo",  checkAdmin, DBInfo);
router.get("/DBInfoSpace",  checkAdmin, DBInfoSpace);
router.get("/DBInfoSpaceSum",  checkAdmin, DBInfoSpaceSum);
router.get("/DBStart",  checkAdmin, DBStart);
router.get("/DBStop",  checkAdmin, DBStop);
export{router};