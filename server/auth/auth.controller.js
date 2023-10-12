/** @module server/auth */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./auth.service.js');
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * Middleware check access token common
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 * @returns {Types.res|*}
 */
const checkAccessTokenCommon = (req, res, next) => {
    service.checkAccessToken(req.query.app_id, req.query.user_account_logon_user_account_id, req.ip, req.get('authorization'))
    .then(result=>{
        if (result==true)
            next();
        else
            res.status(401).send('⛔');
    });
};
/**
 * Middleware check access token superadmin
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 * @returns {Types.res|*}
 */
const checkAccessTokenSuperAdmin = (req, res, next) => {
    if (req.query.app_id==0)
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`).then(({getUserAppRoleAdmin}) => {
            getUserAppRoleAdmin(req.query.app_id, req.query.user_account_logon_user_account_id, (/**@type{Types.error}*/err, /**@type{Types.db_UserAppRoleAdmin[]}*/result)=>{
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
/**
 * Middleware check access token admin
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 * @returns {Types.res|*}
 */
const checkAccessTokenAdmin = (req, res, next) => {
    if (req.query.app_id==0){
        checkAccessTokenCommon(req, res, next);
    }
    else
        res.status(401).send('⛔');
};
/**
 * Middleware check access token
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const checkAccessToken = (req, res, next) => {
    //if user login is disabled then check also current logged in user
    //so they can't modify anything anymore with current accesstoken
    if (ConfigGet('SERVICE_AUTH', 'ENABLE_USER_LOGIN')=='1'){
        checkAccessTokenCommon(req, res, next);
    }
    else{
        //return 401 Not authorized here instead of 403 Forbidden
        //so a user will be logged out instead of getting a message
        res.status(401).send('⛔');
    }
};
/**
 * Middleware check data token
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const checkDataToken = (req, res, next) => {
    service.checkDataToken(req.query.app_id, req.get('authorization'))
    .then((result)=>{
        if (result==true)
            next();
        else
            res.status(401).send('⛔');
    });
};
/**
 * Middleware check data token registration
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const checkDataTokenRegistration = (req, res, next) => {
    if (ConfigGet('SERVICE_AUTH', 'ENABLE_USER_REGISTRATION')=='1')
        checkDataToken(req, res, next);
    else{
        //return 403 Forbidden
        res.status(403).send('⛔');
    }
};
/**
 * Middleware check data token login
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const checkDataTokenLogin = (req, res, next) => {
    if (ConfigGet('SERVICE_AUTH', 'ENABLE_USER_LOGIN')=='1')
        checkDataToken(req, res, next);
    else{
        //return 403 Forbidden
        res.status(403).send('⛔');
    }
};

export {checkAccessTokenCommon, checkAccessTokenSuperAdmin, checkAccessTokenAdmin, checkAccessToken,
        checkDataToken, checkDataTokenRegistration, checkDataTokenLogin};