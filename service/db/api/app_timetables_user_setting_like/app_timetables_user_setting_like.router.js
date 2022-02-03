const { likeUserSetting, 
	    unlikeUserSetting} = require ("./app_timetables_user_setting_like.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.post("/:id", checkToken, likeUserSetting);
router.delete("/:id", checkToken, unlikeUserSetting);
module.exports = router;