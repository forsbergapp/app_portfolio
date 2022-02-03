const { likeUser, 
	    unlikeUser} = require ("./user_account_like.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.post("/:id", checkToken, likeUser);
router.delete("/:id", checkToken, unlikeUser);
module.exports = router;