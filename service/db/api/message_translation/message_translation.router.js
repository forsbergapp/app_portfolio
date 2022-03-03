const { getMessage } = require ("./message_translation.controller");
const router = require("express").Router();
const { checkDataToken } = require("../../../auth/auth.controller");

router.get("/:code",  checkDataToken, getMessage);
module.exports = router;