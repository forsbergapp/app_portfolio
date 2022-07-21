const router = require("express").Router();
const {
    userSignup,
    activateUser,
    passwordResetUser,
    getUserByUserId,
    getProfileUser,
    searchProfileUser,
    getProfileDetail,
    getProfileTop,
    updateUserLocal,
    updatePassword,
    updateUserCommon,
    deleteUser,
    userLogin,
    getUserByProviderId,
    getStatCount
} = require("./user_account.controller");
const { checkAccessToken, checkDataToken } = require("../../../auth/auth.controller");
const { checkAdmin} = require ("../../../auth/admin/admin.controller");
const { createLogAppRI } = require("../../../log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, req.query.id, __appfilename, __appfunction, __appline, req.body);
    next();
})
router.post("/login", checkDataToken, userLogin);
router.post("/signup", checkDataToken, userSignup);
//local user
router.put("/activate/:id", checkDataToken, activateUser);
router.post("/password_reset/", checkDataToken, passwordResetUser);
router.post("/password/:id", checkAccessToken, updatePassword);
router.put("/:id", checkAccessToken, updateUserLocal);
//provider user
router.post("/provider/:id", checkDataToken, getUserByProviderId);
//common user
router.get("/:id", checkAccessToken, getUserByUserId);
router.put("/common/:id", checkAccessToken, updateUserCommon);
router.delete("/:id", checkAccessToken, deleteUser);
//profile
router.get("/profile/detail/:id", checkAccessToken, getProfileDetail);
router.get("/profile/top/:statchoice", checkDataToken, getProfileTop);
router.post("/profile/id/:id", checkDataToken, getProfileUser);
router.post("/profile/username/:username", checkDataToken, getProfileUser);
router.post("/profile/username/searchD/:username", checkDataToken, searchProfileUser);
router.post("/profile/username/searchA/:username", checkAccessToken, searchProfileUser);
router.get("/admin/count", checkAdmin, getStatCount);

module.exports = router;