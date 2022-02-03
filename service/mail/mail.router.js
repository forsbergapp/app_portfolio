const router = require("express").Router();
const { getLogo } = require ("./mail.controller");

router.get("/logo", getLogo);
module.exports = router;