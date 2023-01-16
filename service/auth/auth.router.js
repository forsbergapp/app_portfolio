const { dataToken} = await import("./auth.controller.js");
const {Router} = await import('express');
const router = Router();
router.post("/", dataToken);
export {router};