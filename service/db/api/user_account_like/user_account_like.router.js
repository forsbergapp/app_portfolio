const { likeUser, 
	    unlikeUser} = require ("./user_account_like.controller");
const router = require("express").Router();
const { checkAccessToken } = require("../../../auth/auth.controller");

router.post("/:id", checkAccessToken, likeUser);
router.delete("/:id", checkAccessToken, unlikeUser);
module.exports = router;