const { dataToken} = require ("./auth.controller");
const router = require("express").Router();
router.post("/", dataToken);
module.exports = router;