const { ConfigGet, ConfigUpdateParameter, ConfigSave, DefaultConfig} = require ("./server.controller");
const router = require("express").Router();
const { checkAdmin} = require (global.SERVER_ROOT + "/service/auth/admin/admin.controller");
const { checkDataToken} = require (global.SERVER_ROOT + "/service/auth/auth.controller");
router.get("/config", checkAdmin, ConfigGet);
router.patch("/config", checkAdmin, ConfigUpdateParameter);
router.put("/config", checkAdmin, ConfigSave);
router.post("/config", checkDataToken, DefaultConfig);
module.exports = router;