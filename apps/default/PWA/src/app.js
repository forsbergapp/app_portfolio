/** @module apps/app4 */

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
    return new Promise((resolve, reject) => {
        if (params==null){
            render_app_html(app_id, null)
            .then((/**@type{Types.render_common}*/app)=>{
                resolve({   app:app.app,
                            map:app.map,
                            map_styles: app.settings.map_styles});
                
            })
            .catch((/**@type{Types.error}*/err)=>reject(err));
        }
        else{
            //redirect to /
            resolve ({app: null, map: null, map_styles:null});
        }
    });
};
export{createApp};