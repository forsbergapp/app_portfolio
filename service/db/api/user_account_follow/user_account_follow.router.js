const router = require("express").Router();
const { followUser, 
	    unfollowUser} = require ("./user_account_follow.controller");
const { checkAccessToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.post("/:id", checkAccessToken, followUser);
router.delete("/:id", checkAccessToken, unfollowUser);
module.exports = router;