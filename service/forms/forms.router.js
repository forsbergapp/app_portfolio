const { getAdminSecure } = require ("./forms.controller");
const router = require("express").Router();
const { authAdmin} = require ("../auth/admin/admin.controller");

router.post("/admin/secure", authAdmin, getAdminSecure);
module.exports = router;