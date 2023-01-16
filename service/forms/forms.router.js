const { getFormAdminSecure } = await import("./forms.controller.js");
const { checkAdmin} = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
const {Router} = await import('express');
const router = Router();
router.post("/admin/secure", checkAdmin, getFormAdminSecure);
export {router};