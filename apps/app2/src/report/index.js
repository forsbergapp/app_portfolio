/** @module apps/app2 */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const { render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

/**
 * Creates report
 * @param {number} app_id
 * @param {string} module
 * @returns {Promise.<string>}
 */

const createReport = (app_id, module) => {
    return new Promise((resolve, reject) => {
        const files = [
            ['REPORT', process.cwd() + '/apps/app2/src/report/' + module],
            ['<ReportHead/>', process.cwd() + '/apps/app2/src/report/head.html'],
            ['<AppCommonFonts/>', process.cwd() + '/apps/app2/src/fonts.html'],
            ['<ReportPaper/>', process.cwd() + '/apps/app2/src/report/paper.html']
        ];
        render_app_html(app_id, files, {locale:null, 
                                        module_type:'REPORT', 
                                        map: false, 
                                        custom_tag_profile_search:null,
                                        custom_tag_user_account:null,
                                        custom_tag_profile_top:null,
                                        app_themes:false, 
                                        render_locales:false, 
                                        render_settings:false, 
                                        render_provider_buttons:false
                                    },(/**@type{Types.error}*/err, /**@type{Types.render_common}*/report)=>{
            if (err)
                reject(err);
            else{
                resolve(report.app);
            }
        });
    });
};
export{createReport};