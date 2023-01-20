const {
    getUsersAdmin,
    getStatCountAdmin,
    updateUserSuperAdmin,
    userLogin,
    userSignup,
    activateUser,
    passwordResetUser,
    updatePassword,
    updateUserLocal,
    providerSignIn,
    getUserByUserId,
    updateUserCommon,
    deleteUser,
    getProfileDetail,
    getProfileTop,
    getProfileUser,
    searchProfileUser} = await import("./user_account.controller.js");
const { checkAccessToken, checkDataToken, checkDataTokenRegistration, checkDataTokenLogin } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const { checkAccessTokenAdmin, checkAccessTokenSuperAdmin} = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const { createLogAppRI } = await import(`file://${process.cwd()}/service/log/log.controller.js`);
const {Router} = await import('express');
const router = Router();
router.use((req,res,next)=>{
    let stack = new Error().stack;
    import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
        createLogAppRI(req, res, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), req.body).then(function(){
            next();
        })
    })
})
//admin, count user stat
router.get("/admin/count", checkAccessTokenAdmin, getStatCountAdmin);
//admin, all users with option to search
router.get("/admin/:search", checkAccessTokenAdmin, getUsersAdmin);
//admin update user, only for superadmin
router.put("/admin/:id", checkAccessTokenSuperAdmin, updateUserSuperAdmin);

router.put("/login", checkDataTokenLogin, userLogin);
router.post("/signup", checkDataTokenRegistration, userSignup);
//local user
router.put("/activate/:id", checkDataToken, activateUser);
router.put("/password_reset/", checkDataToken, passwordResetUser);
router.put("/password/:id", checkAccessToken, updatePassword);
router.put("/:id", checkAccessToken, updateUserLocal);
//provider user
router.put("/provider/:id", checkDataTokenLogin, providerSignIn);
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

export{router};