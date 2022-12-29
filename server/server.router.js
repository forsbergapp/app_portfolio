const { ConfigMaintenanceGet, ConfigMaintenanceSet, ConfigGet, ConfigGetSaved, ConfigSave, ConfigInfo, Info} = require ("./server.controller");
const router = require("express").Router();
const { checkAdmin} = require (global.SERVER_ROOT + "/service/auth/admin/admin.controller");
const { checkAccessTokenAdmin} = require (global.SERVER_ROOT + "/service/auth/auth.controller");
const { checkDataToken} = require (global.SERVER_ROOT + "/service/auth/auth.controller");
router.put("/config/systemadmin", checkAdmin, ConfigSave);
router.get("/config/systemadmin", checkAdmin, ConfigGet);
router.get("/config/systemadmin/saved", checkAdmin, ConfigGetSaved);
router.get("/config/systemadmin/maintenance", checkAdmin, ConfigMaintenanceGet);
router.patch("/config/systemadmin/maintenance", checkAdmin, ConfigMaintenanceSet);
router.get("/config/info", checkAdmin, ConfigInfo);
router.get("/info", checkAdmin, Info);

router.get("/config/admin", checkAccessTokenAdmin, ConfigGet);

module.exports = router;