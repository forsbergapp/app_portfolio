const { BroadcastConnect, BroadcastSendSystemAdmin, BroadcastSendAdmin, ConnectedList, ConnectedListSystemAdmin, ConnectedCount, ConnectedUpdate, ConnectedCheck} = require ("./broadcast.controller");
const { checkAccessTokenAdmin} = require ("../auth/auth.controller");
const { checkAdmin} = require ("../auth/admin/admin.controller");
const { checkDataToken } = require("../auth/auth.controller");
const router = require("express").Router();

router.get("/SystemAdmin/connected", checkAdmin, ConnectedListSystemAdmin);
router.patch("/SystemAdmin/update_connected", checkAdmin, ConnectedUpdate);
router.post("/SystemAdmin/Send",checkAdmin, BroadcastSendSystemAdmin);

router.post("/Admin/Send",checkAccessTokenAdmin, BroadcastSendAdmin);
router.get("/Admin/connected", checkAccessTokenAdmin, ConnectedList);
router.get("/Admin/connected/count", checkAccessTokenAdmin, ConnectedCount);

router.get("/connect/:clientId",BroadcastConnect);
router.patch("/update_connected", checkDataToken, ConnectedUpdate);
router.get("/checkconnected/:user_account_id", checkDataToken, ConnectedCheck);

module.exports = router;