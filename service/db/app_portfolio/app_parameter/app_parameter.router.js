const { getParameters, getParametersAdmin, getParametersAllAdmin, setParameter_admin, setParameterValue_admin } = await import("./app_parameter.controller.js");
const { createLogAppRI } = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const { checkDataToken, checkAccessTokenAdmin} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
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

router.get("/admin/all/:app_id", checkAccessTokenAdmin, getParametersAllAdmin);
router.put("/admin", checkAccessTokenAdmin, setParameter_admin);
router.patch("/admin/value", checkAccessTokenAdmin, setParameterValue_admin);
router.get("/admin/:app_id", checkDataToken, getParametersAdmin);
router.get("/:app_id", checkDataToken, getParameters);

export{router};