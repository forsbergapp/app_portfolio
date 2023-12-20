/** @module apps/app1 */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const { render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

/**
 * Creates Admin app
 * @param {number} app_id
 * @param {Types.app_parameter} username
 * @param {string} locale
 * @returns {Promise.<Types.app_create|Types.app_create_empty>}
 */
const createApp = async (app_id, username, locale) => {
    const {ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);
    return new Promise((resolve, reject) => {
        const main = async (/**@type{number}*/app_id) => {
            render_app_html(app_id, 'APP', locale,(/**@type{Types.error}*/err, /**@type{Types.render_common}*/app)=>{
                if (err)
                    reject(err);
                else{
                    const app_config = ConfigGetApp(app_id, 'CONFIG');
                    resolve({app:app.app,
                             map:app_config.MAP,
                             map_styles: null});
                }
            });
        };
        if (username!=null){
            import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account.service.js`).then(({getProfileUser}) => {
                getProfileUser(app_id, null, username, null)
                .then((/**@type{Types.db_result_user_account_getProfileUser[]}*/result)=>{
                    if (result[0])
                        main(app_id);
                    else{
                        //redirect to /
                        resolve ({app: null, map: null, map_styles:null});
                    }
                })
                .catch((/**@type{Types.error}*/error)=>{
                    reject(error);
                });
            });
        }
        else
            main(app_id);          
    });
};
export {createApp};