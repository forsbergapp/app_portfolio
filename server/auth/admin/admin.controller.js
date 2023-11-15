/** @module server/auth/admin */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {default:{verify}} = await import('jsonwebtoken');

const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

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

export {checkSystemAdmin};
