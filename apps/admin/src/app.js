/** @module apps/admin */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const { render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

/**
 * Creates Admin app
 * @param {number} app_id 
 * @param {string} locale
 * @returns {Promise.<Types.app_create|Types.app_create_empty>}
 */
const createAdmin = async (app_id, locale) => {
    return render_app_html(app_id, locale)
            .then((/**@type{Types.render_common}*/app)=>{
                if (app.settings)
                    return {app:app.app,
                            map:app.map,
                            map_styles: app.settings.map_styles
                            };
                else
                    return{ app:app.app,
                            map:app.map,
                            map_styles: null};
            })
            .catch((/**@type{Types.error}*/err)=>{throw err;});
};
export {createAdmin};