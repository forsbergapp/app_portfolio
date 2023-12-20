/** @module apps/app2 */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const { render_report_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);
const { timetable } = await import(`file://${process.cwd()}/apps/app2/src/report/timetable.js`);

/**
 * Creates report server
 * @param {number} app_id
 * @param {Types.report_create_parameters} report_parameters
 * @returns {Promise.<string>}
 */
const createReport= async (app_id, report_parameters) => {
    return await  
        timetable({ app_id:         report_parameters.app_id,
                    reportid:       report_parameters.reportid,
                    uid_view:       report_parameters.uid_view,
                    ip:             report_parameters.ip,
                    user_agent:     report_parameters.user_agent,
                    accept_language:report_parameters.accept_language,
                    latitude:       report_parameters.latitude,
                    longitude:      report_parameters.longitude,
                    url:            report_parameters.url,
                    report:         render_report_html(app_id, report_parameters.reportname)
        });
};

export{createReport};