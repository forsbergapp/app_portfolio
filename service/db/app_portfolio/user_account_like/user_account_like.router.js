const { likeUser, 
	    unlikeUser} = await import("./user_account_like.controller.js");
const { checkAccessToken } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
	let stack = new Error().stack;
	import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
		import(`file://${process.cwd()}/service/log/log.service.js`).then(function({createLogAppRI}){
			createLogAppRI(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), req.body,
				           req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
				           req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(function(){
				next();
			})
		})
	})
})
router.post("/:id", checkAccessToken, likeUser);
router.delete("/:id", checkAccessToken, unlikeUser);
export{router};