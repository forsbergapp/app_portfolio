const { DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop } = await import('./admin.controller.js');
const {checkAdmin} = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
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
router.get("/DBInfo",  checkAdmin, DBInfo);
router.get("/DBInfoSpace",  checkAdmin, DBInfoSpace);
router.get("/DBInfoSpaceSum",  checkAdmin, DBInfoSpaceSum);
router.get("/DBStart",  checkAdmin, DBStart);
router.get("/DBStop",  checkAdmin, DBStop);
export{router};