/** @module apps/admin */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const { app_start } = await import(`file://${process.cwd()}/apps/apps.service.js`);
const { render_app_with_data, render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

/**
 * Creates Admin app
 * @param {number} app_id 
 * @param {string} locale
 * @returns {Types.res|*}
 */
const createAdmin = (app_id, locale) => {
    return new Promise((resolve, reject) => {
        const files = [
            ['APP', process.cwd() + '/apps/admin/src/index.html'],
            ['<AppHead/>', process.cwd() + '/apps/admin/src/head.html'],
            ['<AppMenu/>', process.cwd() + '/apps/admin/src/menu.html'],
            ['<AppDialogues/>', process.cwd() + '/apps/admin/src/dialogues.html'],
            ['<AppSecure/>', process.cwd() + '/apps/admin/src/secure.html']
            ];
        let render_locales, render_settings, render_provider_buttons;
        app_start().then((/**@type{boolean}*/result)=>{
            if (result==true){
                render_locales = true;
                render_settings= true;
                render_provider_buttons=true;
            }
            else{
                render_locales = false;
                render_settings= false;
                render_provider_buttons=false;
            }
            render_app_html(app_id, files, {locale:locale, 
                                            module_type:'APP', 
                                            map: true, 
                                            custom_tag_profile_search:null,
                                            custom_tag_user_account:'<AppUserAccount/>',
                                            custom_tag_profile_top:null,
                                            app_themes:true, 
                                            render_locales:render_locales, 
                                            render_settings:render_settings, 
                                            render_provider_buttons:render_provider_buttons
                                        }, (/**@type{Types.error}*/err, /**@type{Types.render_common}*/app)=>{
                if (err)
                    reject(err);
                else{
                    const render_variables = [];
                    //APP Profile tag not used in common body
                    render_variables.push(['AppProfileInfo','']);
                    //APP Profile tag not used in common body
                    render_variables.push(['AppProfileTop','']);
                    if (app.settings)
                        resolve({   app:render_app_with_data(app.app, render_variables),
                                    map_styles: app.settings.map_styles,
                                    map:true});
                    else
                        resolve({   app:render_app_with_data(app.app, render_variables),
                                    map_styles: null,
                                    map:true});
                }
            });
        });
    });
};
export {createAdmin};