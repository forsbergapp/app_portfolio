const { connectBroadcast, getListConnected, sendBroadcast, updateConnected, checkConnected} = require ("./broadcast.controller");
const { checkAdmin} = require ("../auth/admin/admin.controller");
const { checkDataToken } = require("../auth/auth.controller");
const router = require("express").Router();

router.get("/connect/:clientId",connectBroadcast);
router.get("/connected", checkAdmin, getListConnected);
router.put("/update_connected", checkDataToken, updateConnected);
router.get("/checkconnected/:user_account_id", checkDataToken, checkConnected);

router.post("/",checkAdmin, sendBroadcast);
module.exports = router;