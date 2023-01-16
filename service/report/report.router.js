const { getReport } = await import("./report.controller.js");
const {Router} = await import('express');
const router = Router();

router.get("/", getReport);
export {router};