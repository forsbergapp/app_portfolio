const { getMessage } = await import("./message_translation.controller.js");
const { checkDataToken } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const { createLogAppRI } = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename(import.meta.url), __appfunction(), __appline(), req.body).then(function(){
		next();
	})
})
router.get("/:code",  checkDataToken, getMessage);
export{router};