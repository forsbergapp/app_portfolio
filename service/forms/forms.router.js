const { getFormAdminSecure } = await import("./forms.controller.js");
const { checkAdmin} = await import(`file://${process.cwd()}/service/auth/admin/admin.controller.js`);
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
	let stack = new Error().stack;
	import(`file://${process.cwd()}/service/common/common.service.js`).then(({COMMON}) => {
		import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogAppRI}) => {
			createLogAppRI(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), req.body,
				           req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
				           req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
				next();
			})
		})
	})
})

router.post("/admin/secure", checkAdmin, getFormAdminSecure);
export {router};