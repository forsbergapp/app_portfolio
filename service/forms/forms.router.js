const { getAdminSecure } = require ("./forms.controller");
const router = require("express").Router();
const { checkAdmin} = require ("../auth/admin/admin.controller");

router.get("/admin/secure", checkAdmin, getAdminSecure);
module.exports = router;