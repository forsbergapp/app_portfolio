const { followUser, 
		unfollowUser} = require ("./user_account_follow.controller");
const router = require("express").Router();
const { checkAccessToken } = require("../../../auth/auth.controller");

router.post("/:id", checkAccessToken, followUser);
router.delete("/:id", checkAccessToken, unfollowUser);
module.exports = router;