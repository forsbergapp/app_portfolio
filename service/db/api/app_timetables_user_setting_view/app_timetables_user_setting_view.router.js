const { insertUserSettingView} = require ("./app_timetables_user_setting_view.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.post("/", checkToken, insertUserSettingView);
module.exports = router;