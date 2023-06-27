const service = await import('./auth.service.js');
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

//ENDPOINT MIDDLEWARE
const checkAccessTokenCommon = (req, res, next) => {
    service.checkAccessToken(req.query.app_id, req.query.user_account_logon_user_account_id, req.ip, req.get('authorization'))
    .then(result=>{
        if (result==true)
            next();
        else
            res.status(401).send('⛔');
    });
};
const checkAccessTokenSuperAdmin = (req, res, next) => {
    if (req.query.app_id==0)
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`).then(({getUserAppRoleAdmin}) => {
            getUserAppRoleAdmin(req.query.app_id, req.query.user_account_logon_user_account_id, (err, result)=>{
                if (result[0].app_role_id == 0){
                    checkAccessTokenCommon(req, res, next);
                }
                else
                    res.status(401).send('⛔');
            });
        });
    else
        res.status(401).send('⛔');
};
const checkAccessTokenAdmin = (req, res, next) => {
    if (req.query.app_id==0){
        checkAccessTokenCommon(req, res, next);
    }
    else
        res.status(401).send('⛔');
};
const checkAccessToken = (req, res, next) => {
    //if user login is disabled then check also current logged in user
    //so they can't modify anything anymore with current accesstoken
    if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_USER_LOGIN')=='1'){
        checkAccessTokenCommon(req, res, next);
    }
    else{
        //return 401 Not authorized here instead of 403 Forbidden
        //so a user will be logged out instead of getting a message
        res.status(401).send('⛔');
    }

};
const checkDataToken = (req, res, next) => {
    service.checkDataToken(req.query.app_id, req.get('authorization'))
    .then((result)=>{
        if (result==true)
            next();
        else
            res.status(401).send('⛔');
    });
};
const checkDataTokenRegistration = (req, res, next) => {
    if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_USER_REGISTRATION')=='1')
        checkDataToken(req, res, next);
    else{
        //return 403 Forbidden
        res.status(403).send('⛔');
    }
        
};
const checkDataTokenLogin = (req, res, next) => {
    if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_USER_LOGIN')=='1')
        checkDataToken(req, res, next);
    else{
        //return 403 Forbidden
        res.status(403).send('⛔');
    }
};

export {checkAccessTokenCommon, checkAccessTokenSuperAdmin, checkAccessTokenAdmin, checkAccessToken,
        checkDataToken, checkDataTokenRegistration, checkDataTokenLogin};