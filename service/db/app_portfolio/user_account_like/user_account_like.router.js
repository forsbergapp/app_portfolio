const { likeUser, 
	    unlikeUser} = await import("./user_account_like.controller.js");
const { checkAccessToken } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const { createLogAppRI } = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename(import.meta.url), __appfunction(), __appline(), req.body).then(function(){
		next();
	})
})
router.post("/:id", checkAccessToken, likeUser);
router.delete("/:id", checkAccessToken, unlikeUser);
export{router};