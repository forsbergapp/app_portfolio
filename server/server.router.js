const { ConfigGet, ConfigUpdateParameter, ConfigUpdateAll} = require ("./server.controller");
const router = require("express").Router();
const { checkAccessTokenAdmin} = require ("../service/auth/auth.controller");
router.get("/", checkAccessTokenAdmin, ConfigGet);
router.patch("/", checkAccessTokenAdmin, ConfigUpdateParameter);
router.put("/", checkAccessTokenAdmin, ConfigUpdateAll);
module.exports = router;