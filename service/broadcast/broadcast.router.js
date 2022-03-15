const { getBroadcast} = require ("./broadcast.controller");
const router = require("express").Router();

router.get("/",getBroadcast);
module.exports = router;