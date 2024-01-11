/** @module server/express/server */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

/**
 * Calculate responsetime
 * @param {Types.res} res
 * @returns {number}
 */
 const responsetime = (res) => {
    const diff = process.hrtime(res.getHeader('X-Response-Time'));
    return diff[0] * 1e3 + diff[1] * 1e-6;
};    

/**
 * server Express
 * @async
 * @returns {Promise<Types.express>} app
 */
const serverExpress = async () => {
    const {default:express} = await import('express');
    const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
    const {default:compression} = await import('compression');
    const {LogRequestE} = await import(`file://${process.cwd()}/server/log.service.js`);
    /**@type{Types.express} */
    const app = express();
    //
    //MIDDLEWARES
    //
    //use compression for better performance
    const shouldCompress = (/**@type{Types.req}*/req) => {
        //exclude broadcast messages using socket
        if (req.headers.accept == 'text/event-stream')
            return false;
        else
            return true;
        };
    app.set('trust proxy', true);
    /* Ignore compression typescript error:
        Type '(req: Types.req) => boolean' is not assignable to type 'CompressionFilter'.
        Types of parameters 'req' and 'req' are incompatible.
        Type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>' is not assignable to type 'req'.
        Types of property 'params' are incompatible.
        Type 'ParamsDictionary' is missing the following properties from type '{ sub: string; info: string; }': sub, info
    */
    /**@ts-ignore */
    app.use(compression({ filter: shouldCompress }));
    // set JSON maximum size
    app.use(express.json({ limit: ConfigGet('SERVER', 'JSON_LIMIT') }));
    
    //ROUTES
    //apps
    const { BFF_init, BFF_start, BFF_app, BFF_app_data, BFF_app_signup, BFF_app_access, BFF_admin, BFF_superadmin, BFF_systemadmin, BFF_socket, BFF_iam} = await import(`file://${process.cwd()}/server/bff.js`);
    //auth
    const iam = await import(`file://${process.cwd()}/server/iam.js`);
    app.route('*').all                  (BFF_init);
    app.route('*').get                  (BFF_start);
    app.route('/bff/app_data').all      (iam.AuthenticateDataToken, BFF_app_data);
    app.route('/bff/app_signup').post   (iam.AuthenticateDataTokenRegistration, BFF_app_signup);
    app.route('/bff/app_access').all    (iam.AuthenticateAccessToken, BFF_app_access);
    app.route('/bff/admin').all         (iam.AuthenticateAccessTokenAdmin, BFF_admin);    
    app.route('/bff/superadmin').put    (iam.AuthenticateAccessTokenSuperAdmin, BFF_superadmin);
    app.route('/bff/systemadmin').all   (iam.AuthenticateAccessTokenSystemAdmin, BFF_systemadmin);
    app.route('/bff/socket').get        (iam.AuthenticateSocket, BFF_socket);
    app.route('/bff/iam').post          (iam.AuthenticateIAM, BFF_iam);
    app.route('*').get                  (BFF_app);
    
    //ERROR LOGGING
    app.use((/**@type{Types.error}*/err,/**@type{Types.req}*/req,/**@type{Types.res}*/res, /**@type{function}*/next) => {
        LogRequestE(req, res.statusCode, res.statusMessage, responsetime(res), err).then(() => {
            next();
        });
    });
    return app;
};
export {responsetime, serverExpress};