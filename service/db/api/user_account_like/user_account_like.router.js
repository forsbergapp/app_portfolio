const router = require("express").Router();
const { likeUser, 
	    unlikeUser} = require ("./user_account_like.controller");
const { checkAccessToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.service");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.post("/:id", checkAccessToken, likeUser);
router.delete("/:id", checkAccessToken, unlikeUser);
module.exports = router;