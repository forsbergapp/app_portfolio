const { insertUserSettingView} = require ("./app_timetables_user_setting_view.controller");
const router = require("express").Router();
const { checkDataToken } = require("../../../auth/auth.controller");

router.post("/", checkDataToken, insertUserSettingView);
module.exports = router;