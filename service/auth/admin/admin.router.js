const { authAdmin} = await import("./admin.controller.js");
const {Router} = await import('express');
const router = Router();
router.post("/", authAdmin);
export {router};