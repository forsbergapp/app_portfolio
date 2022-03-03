const { likeUserSetting, 
	    unlikeUserSetting} = require ("./app_timetables_user_setting_like.controller");
const router = require("express").Router();
const { checkAccessToken } = require("../../../auth/auth.controller");

router.post("/:id", checkAccessToken, likeUserSetting);
router.delete("/:id", checkAccessToken, unlikeUserSetting);
module.exports = router;