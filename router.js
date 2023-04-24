//ConfigGet function in service.js used to get parameter values
const {ConfigGet:ConfigGetService } = await import(`file://${process.cwd()}/server/server.service.js`);
const rest_resource_service = ConfigGetService(1, 'SERVER', 'REST_RESOURCE_SERVICE');
const rest_resource_service_db_schema = ConfigGetService(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA');
//server (ConfigGet function from controller to mount on router)
const { ConfigMaintenanceGet, ConfigMaintenanceSet, ConfigGet, ConfigGetSaved, ConfigSave, ConfigInfo, Info} = await import(`file://${process.cwd()}/server/server.controller.js`);
//auth
const { dataToken, checkAccessToken, checkDataToken, checkDataTokenRegistration, checkDataTokenLogin,
        checkAccessTokenAdmin, checkAccessTokenSuperAdmin} = await import(`file://${process.cwd()}${ConfigGetService(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/auth/auth.controller.js`);
//auth admin
const { authAdmin, checkAdmin} = await import(`file://${process.cwd()}${rest_resource_service}/auth/admin/admin.controller.js`);
//broadcast
const { BroadcastConnect, BroadcastSendSystemAdmin, BroadcastSendAdmin, ConnectedList, ConnectedListSystemAdmin, ConnectedCount, ConnectedUpdate, ConnectedCheck} = await import(`file://${process.cwd()}${rest_resource_service}/broadcast/broadcast.controller.js`);
//service db admin
const { DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop } = await import(`file://${process.cwd()}${rest_resource_service}/db/admin/admin.controller.js`);
//service db app_portfolio app
const { getApp, getAppsAdmin, updateAppAdmin } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/app/app.controller.js`);
//service db app_portfolio app category
const {getAppCategoryAdmin} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/app_category/app_category.controller.js`);
//service db app_portfolio app log
const { getLogsAdmin, getStatUniqueVisitorAdmin} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/app_log/app_log.controller.js`);
//service db app_portfolio app object
const { getObjects } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/app_object/app_object.controller.js`);
//service db app_portfolio app parameter
const { getParameters, getParametersAdmin, getParametersAllAdmin, setParameter_admin, setParameterValue_admin } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/app_parameter/app_parameter.controller.js`);
//service db app_portfolio app role
const { getAppRoleAdmin} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/app_role/app_role.controller.js`);
//service db app_portfolio country
const { getCountries } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/country/country.controller.js`);
//service db app_portfolio identity provider
const { getIdentityProviders} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/identity_provider/identity_provider.controller.js`);
//service db app_portfolio locale
const { getLocales } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/language/locale/locale.controller.js`);
//service db app_portfolio message translation
const { getMessage } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/message_translation/message_translation.controller.js`);
//service db app_portfolio parameter type
const { getParameterTypeAdmin} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/parameter_type/parameter_type.controller.js`);
//service db app_portfolio setting
const { getSettings } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/setting/setting.controller.js`);
//service db app_portfolio user account
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
    searchProfileUser} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account/user_account.controller.js`);
//service db app_portfolio user account app
const { createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app/user_account_app.controller.js`);

const { createUserSetting, 
    getUserSettingsByUserId, 
    getProfileUserSetting,
    getProfileUserSettings,
    getProfileUserSettingDetail,
    getProfileTopSetting,
    getUserSetting,
    updateUserSetting, 
    deleteUserSetting} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting/user_account_app_setting.controller.js`);
  const { likeUserSetting, unlikeUserSetting} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting_like/user_account_app_setting_like.controller.js`);
  const { insertUserSettingView} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting_view/user_account_app_setting_view.controller.js`);



//service db app_portfolio user account follow
const { followUser, unfollowUser} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_follow/user_account_follow.controller.js`);
//service db app_portfolio user account like
const { likeUser, unlikeUser} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_like/user_account_like.controller.js`);
//service db app_portfolio user account logon
const { getUserAccountLogonAdmin} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_logon/user_account_logon.controller.js`);
//service forms
const { getFormAdminSecure } = await import(`file://${process.cwd()}${ConfigGetService(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/forms/forms.controller.js`);
//service geolocation
const { getPlace, getPlaceAdmin, getPlaceSystemAdmin, getIp, getIpAdmin, getIpSystemAdmin, getTimezone, getTimezoneAdmin, getTimezoneSystemAdmin} = await import(`file://${process.cwd()}${ConfigGetService(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/geolocation/geolocation.controller.js`);
//service log
const {getLogParameters, getLogs, getFiles, getPM2Logs} = await import(`file://${process.cwd()}${ConfigGetService(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.controller.js`);
//service mail
const { getLogo } = await import(`file://${process.cwd()}${ConfigGetService(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/mail/mail.controller.js`);
//service report
const { getReport } = await import(`file://${process.cwd()}${rest_resource_service}/report/report.controller.js`);
//service worldcities
const { getCities} = await import(`file://${process.cwd()}${rest_resource_service}/worldcities/worldcities.controller.js`);

const log_router = ((req,res,next)=>{
    let stack = new Error().stack;
    import(`file://${process.cwd()}${ConfigGetService(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/common/common.service.js`).then(({COMMON}) => {
        import(`file://${process.cwd()}${ConfigGetService(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`).then(({createLogAppRI}) => {
            createLogAppRI(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), req.body,
                        req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
                        req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                next();
            })
        })
    })
})
const setRouters = async (app) =>{
    //router
    const {Router} = await import('express');
    const router = [Router()];
    
    //endpoints
    //server
    router[0].use(log_router);
    router[0].put("/config/systemadmin", checkAdmin, ConfigSave);
    router[0].get("/config/systemadmin", checkAdmin, ConfigGet);
    router[0].get("/config/systemadmin/saved", checkAdmin, ConfigGetSaved);
    router[0].get("/config/systemadmin/maintenance", checkAdmin, ConfigMaintenanceGet);
    router[0].patch("/config/systemadmin/maintenance", checkAdmin, ConfigMaintenanceSet);
    router[0].get("/config/info", checkAdmin, ConfigInfo);
    router[0].get("/info", checkAdmin, Info);
    router[0].get("/config/admin", checkAccessTokenAdmin, ConfigGet);
    app.use(ConfigGetService(1, 'SERVER', 'REST_RESOURCE_SERVER'), router[0]);
    //auth
    router.push(Router());
    router[1].use(log_router);
    router[1].post("/", dataToken);
    app.use(`${rest_resource_service}/auth`, router[1]);
    //auth admin
    router.push(Router());
    router[2].use(log_router);
    router[2].post("/", authAdmin);
    app.use(`${rest_resource_service}/auth/admin`, router[2]);
    //broadcast
    router.push(Router());
    router[3].use(log_router);
    //message:
    router[3].post("/message/SystemAdmin",checkAdmin, BroadcastSendSystemAdmin);
    router[3].post("/message/Admin",checkAccessTokenAdmin, BroadcastSendAdmin);
    //connection:
    router[3].get("/connection/SystemAdmin", checkAdmin, ConnectedListSystemAdmin);
    router[3].patch("/connection/SystemAdmin", checkAdmin, ConnectedUpdate);
    router[3].get("/connection/Admin", checkAccessTokenAdmin, ConnectedList);
    router[3].get("/connection/Admin/count", checkAccessTokenAdmin, ConnectedCount);
    router[3].get("/connection/:clientId",BroadcastConnect);
    router[3].patch("/connection", checkDataToken, ConnectedUpdate);
    router[3].get("/connection/check/:user_account_id", checkDataToken, ConnectedCheck);
    app.use(`${rest_resource_service}/broadcast`, router[3]);
    //service db admin
    router.push(Router());
    router[4].use(log_router);
    router[4].get("/DBInfo",  checkAdmin, DBInfo);
    router[4].get("/DBInfoSpace",  checkAdmin, DBInfoSpace);
    router[4].get("/DBInfoSpaceSum",  checkAdmin, DBInfoSpaceSum);
    router[4].get("/DBStart",  checkAdmin, DBStart);
    router[4].get("/DBStop",  checkAdmin, DBStop);
    app.use(`${rest_resource_service}/db/admin`, router[4]);
    //service db app_portfolio app
    router.push(Router());
    router[5].use(log_router);
    router[5].get("/",  checkDataToken, getApp);
    router[5].get("/admin",  checkAccessTokenAdmin, getAppsAdmin);
    router[5].put("/admin/:id",  checkAccessTokenAdmin, updateAppAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app`, router[5]);
    //service db app_portfolio app category
    router.push(Router());
    router[6].use(log_router);
    router[6].get("/admin",  checkAccessTokenAdmin, getAppCategoryAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_category`, router[6]);
    //service db app_portfolio app log
    router.push(Router());
    router[7].use(log_router);
    router[7].get("/admin",  checkAccessTokenAdmin, getLogsAdmin);
    router[7].get("/admin/stat/uniquevisitor", checkAccessTokenAdmin, getStatUniqueVisitorAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_log`, router[7]);
    //service db app_portfolio app object
    router.push(Router());
    router[8].use(log_router);
    router[8].get("/:lang_code",  checkDataToken, getObjects);
    router[8].get("/admin/:lang_code",  checkDataToken, getObjects);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_object`, router[8]);
    //service db app_portfolio app parameter
    router.push(Router());
    router[9].use(log_router);
    router[9].get("/admin/all/:app_id", checkAccessTokenAdmin, getParametersAllAdmin);
    router[9].put("/admin", checkAccessTokenAdmin, setParameter_admin);
    router[9].patch("/admin/value", checkAccessTokenAdmin, setParameterValue_admin);
    router[9].get("/admin/:app_id", checkDataToken, getParametersAdmin);
    router[9].get("/:app_id", checkDataToken, getParameters);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_parameter`, router[9]);
    //service db app_portfolio app role
    router.push(Router());
    router[10].use(log_router);
    router[10].get("/admin",  checkAccessTokenAdmin, getAppRoleAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_role`, router[10]);
    //service db app_portfolio country
    router.push(Router());
    router[11].use(log_router);
    router[11].get("/:lang_code",  checkDataToken, getCountries);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/country`, router[11]);
    //service db app_portfolio identity provider
    router.push(Router());
    router[12].use(log_router);
    router[12].get("/", checkDataToken, getIdentityProviders);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/identity_provider`, router[12]);
    //service db app_portfolio language locale
    router.push(Router());
    router[13].use(log_router);
    router[13].get("/:lang_code", checkDataToken, getLocales);
    router[13].get("/admin/:lang_code", checkDataToken, getLocales);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/language/locale`, router[13]);
    //service db app_portfolio message translation
    router.push(Router());
    router[14].use(log_router);
    router[14].get("/:code",  checkDataToken, getMessage);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/message_translation`, router[14]);
    //service db app_portfolio parameter type
    router.push(Router());
    router[15].use(log_router);
    router[15].get("/admin", checkAccessTokenAdmin, getParameterTypeAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/parameter_type`, router[15]);
    //service db app_portfolio setting
    router.push(Router());
    router[16].use(log_router);
    router[16].get("/",  checkDataToken, getSettings);
    router[16].get("/admin",  checkDataToken, getSettings);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/setting`, router[16]);
    //service db app_portfolio user account
    router.push(Router());
    router[17].use(log_router);
        //admin, count user stat
    router[17].get("/admin/count", checkAccessTokenAdmin, getStatCountAdmin);
        //admin, all users with option to search
    router[17].get("/admin", checkAccessTokenAdmin, getUsersAdmin);
        //admin update user, only for superadmin
    router[17].put("/admin/:id", checkAccessTokenSuperAdmin, updateUserSuperAdmin);
    router[17].put("/login", checkDataTokenLogin, userLogin);
    router[17].post("/signup", checkDataTokenRegistration, userSignup);
        //local user
    router[17].put("/activate/:id", checkDataToken, activateUser);
    router[17].put("/password_reset/", checkDataToken, passwordResetUser);
    router[17].put("/password/:id", checkAccessToken, updatePassword);
    router[17].put("/:id", checkAccessToken, updateUserLocal);
        //provider user
    router[17].put("/provider/:id", checkDataTokenLogin, providerSignIn);
        //common user
    router[17].get("/:id", checkAccessToken, getUserByUserId);
    router[17].put("/common/:id", checkAccessToken, updateUserCommon);
    router[17].delete("/:id", checkAccessToken, deleteUser);
        //profile
    router[17].get("/profile/detail/:id", checkAccessToken, getProfileDetail);
    router[17].get("/profile/top/:statchoice", checkDataToken, getProfileTop);
    router[17].post("/profile/id/:id", checkDataToken, getProfileUser);
    router[17].post("/profile/username", checkDataToken, getProfileUser);
    router[17].post("/profile/username/searchD", checkDataToken, searchProfileUser);
    router[17].post("/profile/username/searchA", checkAccessToken, searchProfileUser);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account`, router[17]);
    //service db app_portfolio user account app
    router.push(Router());
    router[18].use(log_router);
    router[18].post("/", checkAccessToken, createUserAccountApp);
    router[18].get("/:user_account_id", checkAccessToken, getUserAccountApp);
    router[18].get("/apps/:user_account_id", checkAccessToken, getUserAccountApps);
    router[18].patch("/:user_account_id", checkAccessToken, updateUserAccountApp);
    router[18].delete("/:user_account_id/:app_id", checkAccessToken, deleteUserAccountApps);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app`, router[18]);
    //service db app_portfolio user account app setting
    router.push(Router());
    router[19].get("/:id", checkDataToken, getUserSetting);
    router[19].get("/user_account_id/:id", checkDataToken, getUserSettingsByUserId);
    router[19].get("/profile/:id", checkDataToken, getProfileUserSetting);
    router[19].get("/profile/all/:id", checkDataToken, getProfileUserSettings);
    router[19].get("/profile/detail/:id", checkAccessToken, getProfileUserSettingDetail);
    router[19].get("/profile/top/:statchoice", checkDataToken, getProfileTopSetting);
    router[19].post("/", checkAccessToken, createUserSetting);
    router[19].put("/:id", checkAccessToken, updateUserSetting);
    router[19].delete("/:id", checkAccessToken, deleteUserSetting);  
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting`, router[19]);
    //service db app_portfolio user account app setting like
    router.push(Router());
    router[20].use(log_router);
    router[20].post("/:id", checkAccessToken, likeUserSetting);
    router[20].delete("/:id", checkAccessToken, unlikeUserSetting);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting_like`, router[20]);
    //service db app_portfolio user account app setting view
    router.push(Router());
    router[21].use(log_router);
    router[21].post("/", checkDataToken, insertUserSettingView);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting_view`, router[21]);
    //service db app_portfolio user account follow
    router.push(Router());
    router[22].use(log_router);
    router[22].post("/:id", checkAccessToken, followUser);
    router[22].delete("/:id", checkAccessToken, unfollowUser);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_follow`, router[22]);
    //service db app_portfolio user account like
    router.push(Router());
    router[23].use(log_router);
    router[23].post("/:id", checkAccessToken, likeUser);
    router[23].delete("/:id", checkAccessToken, unlikeUser);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_like`, router[23]);
    //service db app_portfolio user account logon
    router.push(Router());
    router[24].use(log_router);
    router[24].get("/admin/:user_account_id/:app_id",  checkAccessTokenAdmin, getUserAccountLogonAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_logon`, router[24]);
    //service forms
    router.push(Router());
    router[25].use(log_router);
    router[25].post("/admin/secure", checkAdmin, getFormAdminSecure);
    app.use(`${rest_resource_service}/forms`, router[25]);
    //service geolocation
    router.push(Router());
    router[26].use(log_router);
    router[26].get("/place", checkDataToken, getPlace);
    router[26].get("/place/admin", checkAccessTokenAdmin, getPlaceAdmin);
    router[26].get("/place/systemadmin", checkAdmin, getPlaceSystemAdmin);
    router[26].get("/ip", checkDataToken, getIp);
    router[26].get("/ip/admin", checkAccessTokenAdmin, getIpAdmin);
    router[26].get("/ip/systemadmin", checkAdmin, getIpSystemAdmin);
    router[26].get("/timezone", checkDataToken, getTimezone);
    router[26].get("/timezone/admin", checkAccessTokenAdmin, getTimezoneAdmin);
    router[26].get("/timezone/systemadmin", checkAdmin, getTimezoneSystemAdmin);    
    app.use(`${rest_resource_service}/geolocation`, router[26]);
    //service log
    router.push(Router());
    router[27].use(log_router);
    router[27].get("/parameters", checkAdmin, getLogParameters);
    router[27].get("/logs", checkAdmin, getLogs);
    router[27].get("/files", checkAdmin, getFiles);
    router[27].get("/pm2logs", checkAdmin, getPM2Logs);
    app.use(`${rest_resource_service}/log`, router[27]);
    //service mail
    router.push(Router());
    router[28].use(log_router);
    router[28].get("/logo", getLogo);
    app.use(`${rest_resource_service}/mail`, router[28]);
    //service report
    router.push(Router());
    router[29].use(log_router);
    router[29].get("/", getReport);
    app.use(`${rest_resource_service}/report`, router[29]);
    //service worldcities
    router.push(Router());
    router[30].use(log_router);
    router[30].get("/:country", checkDataToken, getCities);
    app.use(`${rest_resource_service}/worldcities`, router[30]);
}

export {log_router, setRouters};