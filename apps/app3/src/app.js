/** @module apps/app3 */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const { render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

/**
 * Creates app
 * @param {number} app_id
 * @param {Types.app_parameter} params
 * @returns {Promise.<Types.app_create|Types.app_create_empty>}
 */
const createApp = async (app_id, params) => {
    const {ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);
    return new Promise((resolve, reject) => {
        if (params==null || params =='1' || params =='2' || params =='3' ){
            render_app_html(app_id, 'APP', null,(/**@type{Types.error}*/err, /**@type{Types.render_common}*/app)=>{
                if (err)
                    reject(err);
                else{
                    const app_config = ConfigGetApp(app_id, 'CONFIG');
                    resolve({app:app.app,
                             map:app_config.MAP,
                             map_styles: null});
                }
            });
        }
        else{
            //redirect to /
            resolve ({app: null, map: null, map_styles:null});
        }
    });
};
export{createApp};