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
    return new Promise((resolve, reject) => {
        if (params==null || params =='1' || params =='2' || params =='3' ){
            render_app_html(app_id, null)
            .then((/**@type{Types.render_common}*/app)=>{
                resolve({   app:app.app});
                
            })
            .catch((/**@type{Types.error}*/err)=>reject(err));
        }
        else{
            //redirect to /
            resolve ({app: null});
        }
    });
};
export{createApp};