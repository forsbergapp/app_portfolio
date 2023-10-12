/** @module server/auth/admin */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {default:{sign, verify}} = await import('jsonwebtoken');

const {CheckFirstTime, ConfigGet, ConfigGetUser, CreateSystemAdmin} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * Middleware checks system admin token
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const checkSystemAdmin = (req, res, next) => {
    let token = req.get('authorization');
    if (token){
        token = token.slice(7);
        verify(token, ConfigGet('SERVICE_AUTH', 'ADMIN_TOKEN_SECRET'), (/**@type{Types.error}*/err) => {
            if (err){
                res.status(401).send({
                    message: '⛔'
                });
            } else {
                next();
            }
        });
        
    }else{
        res.status(401).send({
            message: '⛔'
        });
    }
};
/**
 * Middleware checks system admin username and password
 * @param {Types.req} req
 * @param {Types.res} res
 */
const authSystemAdmin = (req, res) => {
    const check_user = async (/**@type{string}*/username, /**@type{string}*/password) => {
        const { default: {compareSync} } = await import('bcryptjs');
        const config_username = ConfigGetUser('username');
        const config_password = ConfigGetUser('password');
        if (username == config_username && compareSync(password, config_password)) {
            const jsontoken_at = sign ({tokentimstamp: Date.now()}, ConfigGet('SERVICE_AUTH', 'ADMIN_TOKEN_SECRET'), {
                                expiresIn: ConfigGet('SERVICE_AUTH', 'ADMIN_TOKEN_EXPIRE_ACCESS')
                                });
            res.status(200).json({ 
                token_at: jsontoken_at
            });
        }
        else{
            res.status(401).send('⛔');
        }            
    };
    if(req.headers.authorization){       
                 
        const userpass =  Buffer.from((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
        const username = userpass.split(':')[0];
        const password = userpass.split(':')[1];
        if (CheckFirstTime())
            CreateSystemAdmin(username, password, () =>{
                check_user(username, password);
            });
        else
            check_user(username, password);
    }
    else
        res.status(401).send('⛔');
};
export {checkSystemAdmin, authSystemAdmin};
