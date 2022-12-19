const router = require("express").Router();
const { followUser, 
	    unfollowUser} = require ("./user_account_follow.controller");
const { checkAccessToken } = require(global.SERVER_ROOT + "/service/auth/auth.controller");
const { createLogAppRI } = require(global.SERVER_ROOT + "/service/log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body).then(function(){
		next();
	})
})
router.post("/:id", checkAccessToken, followUser);
router.delete("/:id", checkAccessToken, unfollowUser);
module.exports = router;