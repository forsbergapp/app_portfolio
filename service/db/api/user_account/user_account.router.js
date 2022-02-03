const {
    userSignup,
    activateUser,
    getUserByUserId,
    getProfileUserId,
    getProfileUsername,
    searchProfileUser,
    getProfileDetail,
    getProfileTop,
    updateUserLocal,
    updateUserCommon,
    deleteUser,
    userLogin,
    getUserByProviderId
} = require("./user_account.controller");
const router = require("express").Router();
const { checkToken } = require("../../../auth/auth.controller");

router.post("/login", checkToken, userLogin);
router.post("/signup", checkToken, userSignup);
//local user
router.put("/activate/:id", checkToken, activateUser);
router.put("/:id", checkToken, updateUserLocal);
//provider user
router.post("/provider/:id", checkToken, getUserByProviderId);
//common user
router.put("/common/:id", checkToken, updateUserCommon);
router.get("/:id", checkToken, getUserByUserId);
router.delete("/:id", checkToken, deleteUser);
//profile
router.get("/profile/detail/:id", checkToken, getProfileDetail);
router.get("/profile/top/:statchoice", checkToken, getProfileTop);
router.post("/profile/username/:username", checkToken, getProfileUsername);
router.post("/profile/username/search/:username", checkToken, searchProfileUser);
router.post("/profile/id/:id", checkToken, getProfileUserId);

module.exports = router;