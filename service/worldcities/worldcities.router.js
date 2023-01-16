const { getCities} = await import('./worldcities.controller.js');
const { checkDataToken } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const {Router} = await import('express');
const router = Router();
router.get("/:country", checkDataToken, getCities);
export {router};