const { getPlace, getPlaceAdmin, getPlaceSystemAdmin, getIp, getIpAdmin, getIpSystemAdmin, getTimezone, getTimezoneAdmin, getTimezoneSystemAdmin} = await import("./geolocation.controller.js");
const {createLogAppRI} = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const { checkAccessTokenAdmin} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const { checkDataToken } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const { checkAdmin } = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
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