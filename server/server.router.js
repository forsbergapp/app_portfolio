const { ConfigGet, ConfigUpdateParameter, ConfigUpdateAll} = require ("./server.controller");
const router = require("express").Router();
const { checkAdmin} = require ("../service/auth/admin/admin.controller");
router.get("/", checkAdmin, ConfigGet);
router.patch("/", checkAdmin, ConfigUpdateParameter);
router.put("/", checkAdmin, ConfigUpdateAll);
module.exports = router;