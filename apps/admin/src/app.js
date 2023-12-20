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
    const {ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);
    return new Promise((resolve, reject) => {
        render_app_html(app_id, 'APP', locale, (/**@type{Types.error}*/err, /**@type{Types.render_common}*/app)=>{
            if (err)
                reject(err);
            else{
                const app_config = ConfigGetApp(app_id, 'CONFIG');
                if (app.settings)
                    resolve({   app:app.app,
                                map_styles: app.settings.map_styles,
                                map:app_config.MAP});
                else
                    resolve({   app:app.app,
                                map_styles: null,
                                map:app_config.MAP});
            }
        });
    });
};
export {createAdmin};