const { getMessage } = require ("./message_translation.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.get("/:code",  checkToken, getMessage);
module.exports = router;