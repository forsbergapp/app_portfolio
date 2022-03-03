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
const { checkAccessToken, checkDataToken } = require("../../../auth/auth.controller");

router.post("/login", checkDataToken, userLogin);
router.post("/signup", checkDataToken, userSignup);
//local user
router.put("/activate/:id", checkDataToken, activateUser);
router.put("/:id", checkAccessToken, updateUserLocal);
//provider user
router.post("/provider/:id", checkDataToken, getUserByProviderId);
//common user
router.get("/:id", checkDataToken, getUserByUserId);
router.put("/common/:id", checkAccessToken, updateUserCommon);
router.delete("/:id", checkAccessToken, deleteUser);
//profile
router.get("/profile/detail/:id", checkDataToken, getProfileDetail);
router.get("/profile/top/:statchoice", checkDataToken, getProfileTop);
router.post("/profile/id/:id", checkDataToken, getProfileUserId);
router.post("/profile/username/:username", checkDataToken, getProfileUsername);
router.post("/profile/username/searchD/:username", checkDataToken, searchProfileUser);
router.post("/profile/username/searchA/:username", checkAccessToken, searchProfileUser);


module.exports = router;