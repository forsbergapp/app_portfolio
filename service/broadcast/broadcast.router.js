const { BroadcastConnect, BroadcastSendSystemAdmin, BroadcastSendAdmin, ConnectedList, ConnectedListSystemAdmin, ConnectedCount, ConnectedUpdate, ConnectedCheck} = await import("./broadcast.controller.js");
const {createLogAppRI} = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const {checkAccessTokenAdmin} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const {checkAdmin} = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
const {checkDataToken} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);

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