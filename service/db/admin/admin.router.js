const { DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop } = await import('./admin.controller.js');
const {createLogAppRI} = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const {checkAdmin} = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename(import.meta.url), __appfunction(), __appline(), req.body).then(function(){
		next();
	})
})
router.get("/DBInfo",  checkAdmin, DBInfo);
router.get("/DBInfoSpace",  checkAdmin, DBInfoSpace);
router.get("/DBInfoSpaceSum",  checkAdmin, DBInfoSpaceSum);
router.get("/DBStart",  checkAdmin, DBStart);
router.get("/DBStop",  checkAdmin, DBStop);
export{router};