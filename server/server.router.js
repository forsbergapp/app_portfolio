const { ConfigMaintenanceGet, ConfigMaintenanceSet, ConfigGet, ConfigGetSaved, ConfigSave, ConfigInfo, Info} = await import("./server.controller.js");

const { checkAdmin} = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
const { checkAccessTokenAdmin} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);

const {Router} = await import('express');
const router = Router();
router.put("/config/systemadmin", checkAdmin, ConfigSave);
router.get("/config/systemadmin", checkAdmin, ConfigGet);
router.get("/config/systemadmin/saved", checkAdmin, ConfigGetSaved);
router.get("/config/systemadmin/maintenance", checkAdmin, ConfigMaintenanceGet);
router.patch("/config/systemadmin/maintenance", checkAdmin, ConfigMaintenanceSet);
router.get("/config/info", checkAdmin, ConfigInfo);
router.get("/info", checkAdmin, Info);

router.get("/config/admin", checkAccessTokenAdmin, ConfigGet);

export {router};