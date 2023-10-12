/** @module apps/app3 */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const { render_app_with_data, render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

/**
 * Creates app
 * @param {number} app_id
 * @param {Types.app_parameter} params
 * @returns {Promise.<Types.app_create|Types.app_create_empty>}
 */
const createApp = (app_id, params) => {
    return new Promise((resolve, reject) => {
        const files = [ 
            ['APP', process.cwd() + '/apps/app3/src/index.html'],
            ['<AppHead/>', process.cwd() + '/apps/app3/src/head.html'],
            ['<AppDialogues/>', process.cwd() + '/apps/app3/src/dialogues.html']
            ];
        if (params==null || params =='1' || params =='2' || params =='3' ){
            render_app_html(app_id, files, {locale:null, 
                                            module_type:'APP', 
                                            map: false, 
                                            custom_tag_profile_search:null,
                                            custom_tag_user_account:null,
                                            custom_tag_profile_top:null,
                                            app_themes:false, 
                                            render_locales:false,
                                            render_settings:false, 
                                            render_provider_buttons:false
                                        },(/**@type{Types.error}*/err, /**@type{Types.render_common}*/app)=>{
                if (err)
                    reject(err);
                else{
                    //APP Profile tag not used in common body
                    const render_variables = [];
                    render_variables.push(['AppProfileInfo','']);
                    //APP Profile tag not used in common body
                    render_variables.push(['AppProfileTop','']);
                    resolve({app:render_app_with_data(app.app, render_variables),
                             map:false,
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