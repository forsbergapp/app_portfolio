const { getPlace, getPlaceAdmin, getPlaceSystemAdmin, getIp, getIpAdmin, getIpSystemAdmin, getTimezone, getTimezoneAdmin, getTimezoneSystemAdmin} = await import("./geolocation.controller.js");
const { checkAccessTokenAdmin} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const { checkDataToken } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const { checkAdmin } = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
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

router.get("/place", checkDataToken, getPlace);
router.get("/place/admin", checkAccessTokenAdmin, getPlaceAdmin);
router.get("/place/systemadmin", checkAdmin, getPlaceSystemAdmin);
router.get("/ip", checkDataToken, getIp);
router.get("/ip/admin", checkAccessTokenAdmin, getIpAdmin);
router.get("/ip/systemadmin", checkAdmin, getIpSystemAdmin);
router.get("/timezone", checkDataToken, getTimezone);
router.get("/timezone/admin", checkAccessTokenAdmin, getTimezoneAdmin);
router.get("/timezone/systemadmin", checkAdmin, getTimezoneSystemAdmin);
export {router};