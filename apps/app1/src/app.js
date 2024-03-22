/** @module apps/app1 */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const { render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

/**
 * Creates Admin app
 * @param {number} app_id
 * @param {Types.app_parameter} username
 * @param {string} locale
 * @returns {Promise.<string|null>}
 */
const createApp = async (app_id, username, locale) => {
    return new Promise((resolve, reject) => {
        const main = async (/**@type{number}*/app_id) => {
            render_app_html(app_id, locale)
            .then((/**@type{string}*/app)=>{
                resolve(app);
                
            })
            .catch((/**@type{Types.error}*/err)=>reject(err));
        };
        if (username!=null){
            import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account.service.js`).then(({getProfileUser}) => {
                getProfileUser(app_id, null, username, null)
                .then((/**@type{Types.db_result_user_account_getProfileUser[]}*/result)=>{
                    if (result[0])
                        main(app_id);
                    else{
                        //redirect to /
                        resolve (null);
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