const { authAdmin} = require ("./admin.controller");
const router = require("express").Router();
router.post("/", authAdmin);
module.exports = router;