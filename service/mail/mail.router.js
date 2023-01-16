
const { getLogo } = await import("./mail.controller.js");
const {Router} = await import('express');
const router = Router();
router.get("/logo", getLogo);
export {router};