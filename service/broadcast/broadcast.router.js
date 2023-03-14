const { BroadcastConnect, BroadcastSendSystemAdmin, BroadcastSendAdmin, ConnectedList, ConnectedListSystemAdmin, ConnectedCount, ConnectedUpdate, ConnectedCheck} = await import("./broadcast.controller.js");
const {checkAccessTokenAdmin} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const {checkAdmin} = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
const {checkDataToken} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);

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

router.get("/SystemAdmin/connected", checkAdmin, ConnectedListSystemAdmin);
router.patch("/SystemAdmin/update_connected", checkAdmin, ConnectedUpdate);
router.post("/SystemAdmin/Send",checkAdmin, BroadcastSendSystemAdmin);

router.post("/Admin/Send",checkAccessTokenAdmin, BroadcastSendAdmin);
router.get("/Admin/connected", checkAccessTokenAdmin, ConnectedList);
router.get("/Admin/connected/count", checkAccessTokenAdmin, ConnectedCount);

router.get("/connect/:clientId",BroadcastConnect);
router.patch("/update_connected", checkDataToken, ConnectedUpdate);
router.get("/checkconnected/:user_account_id", checkDataToken, ConnectedCheck);

export {router};