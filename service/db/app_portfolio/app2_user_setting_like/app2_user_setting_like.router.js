const router = require("express").Router();
const { likeUserSetting, 
	unlikeUserSetting} = require ("./app2_user_setting_like.controller");
const { checkAccessToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.post("/:id", checkAccessToken, likeUserSetting);
router.delete("/:id", checkAccessToken, unlikeUserSetting);
module.exports = router;