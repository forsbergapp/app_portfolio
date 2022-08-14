const router = require("express").Router();
const { insertUserSettingView} = require ("./app2_user_setting_view.controller");
const { checkDataToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.post("/", checkDataToken, insertUserSettingView);
module.exports = router;