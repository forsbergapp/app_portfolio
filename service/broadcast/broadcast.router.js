const { BroadcastConnect, BroadcastSendSystemAdmin, BroadcastSendAdmin, ConnectedList, ConnectedListSystemAdmin, ConnectedCount, ConnectedUpdate, ConnectedCheck} = await import("./broadcast.controller.js");

const {checkAccessTokenAdmin} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const {checkAdmin} = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
const {checkDataToken} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);

const {Router} = await import('express');
const router = Router();

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