const {getParameters, getLogs, getFiles, getPM2Logs} = await import('./log.controller.js');
const { checkAdmin} = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
const {Router} = await import('express');
const router = Router();
router.get("/parameters", checkAdmin, getParameters);
router.get("/logs", checkAdmin, getLogs);
router.get("/files", checkAdmin, getFiles);
router.get("/pm2logs", checkAdmin, getPM2Logs);
export {router};