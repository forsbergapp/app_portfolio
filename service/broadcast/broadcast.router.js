const { getBroadcast, getConnected, sendBroadcast} = require ("./broadcast.controller");
const { checkAdmin} = require ("../auth/admin/admin.controller");
const router = require("express").Router();

router.get("/",getBroadcast);
router.get("/connected", checkAdmin, getConnected);
router.post("/",checkAdmin, sendBroadcast);
module.exports = router;