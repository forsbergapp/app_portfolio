/** @module apps/admin */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const { render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

/**
 * Creates Admin app
 * @param {number} app_id 
 * @param {string} locale
 * @returns {Promise.<string|null>}
 */
const createAdmin = async (app_id, locale) => {
    return render_app_html(app_id, locale)
            .then((/**@type{string}*/app)=>{
                return app;
            })
            .catch((/**@type{Types.error}*/err)=>{throw err;});
};
export {createAdmin};