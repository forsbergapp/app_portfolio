const { BroadcastConnect, BroadcastSend, ConnectedList, ConnectedCount, ConnectedUpdate, ConnectedCheck} = require ("./broadcast.controller");
const { checkAdmin} = require ("../auth/admin/admin.controller");
const { checkDataToken } = require("../auth/auth.controller");
const router = require("express").Router();

router.get("/connect/:clientId",BroadcastConnect);
router.post("/",checkAdmin, BroadcastSend);

router.get("/connected", checkAdmin, ConnectedList);
router.get("/connected/count", checkAdmin, ConnectedCount);
router.patch("/update_connected", checkDataToken, ConnectedUpdate);
router.get("/checkconnected/:user_account_id", checkDataToken, ConnectedCheck);

module.exports = router;