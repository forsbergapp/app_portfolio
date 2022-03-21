const { getBroadcast, getConnected} = require ("./broadcast.controller");
const { checkAdmin} = require ("../auth/admin/admin.controller");
const router = require("express").Router();

router.get("/",getBroadcast);
router.get("/connected",checkAdmin, getConnected);
module.exports = router;