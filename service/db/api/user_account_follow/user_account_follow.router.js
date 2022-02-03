const { followUser, 
		unfollowUser} = require ("./user_account_follow.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.post("/:id", checkToken, followUser);
router.delete("/:id", checkToken, unfollowUser);
module.exports = router;