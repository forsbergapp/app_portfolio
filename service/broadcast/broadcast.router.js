const { BroadcastConnect, BroadcastSend, ConnectedList, ConnectedCount, ConnectedUpdate, ConnectedCheck} = require ("./broadcast.controller");
const { checkAccessTokenAdmin} = require ("../auth/auth.controller");
const { checkDataToken } = require("../auth/auth.controller");
const router = require("express").Router();

router.get("/connect/:clientId",BroadcastConnect);
router.post("/",checkAccessTokenAdmin, BroadcastSend);

router.get("/connected", checkAccessTokenAdmin, ConnectedList);
router.get("/connected/count", checkAccessTokenAdmin, ConnectedCount);
router.patch("/update_connected", checkDataToken, ConnectedUpdate);
router.get("/checkconnected/:user_account_id", checkDataToken, ConnectedCheck);

module.exports = router;