const {getAppCategoryAdmin} = await import('./app_category.controller.js');
const {createLogAppRI } = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const {checkAccessTokenAdmin} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
	let stack = new Error().stack;
	import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
		createLogAppRI(req, res, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), req.body).then(function(){
			next();
		})
	})
})
router.get("/admin",  checkAccessTokenAdmin, getAppCategoryAdmin);
export{router};