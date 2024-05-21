/** @module apps/app2 */

/**@type{import('../../../../apps/apps.service')} */
const { render_report_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);
const { timetable } = await import(`file://${process.cwd()}/apps/app2/src/report/timetable.js`);

/**
 * Creates report
 * @param {number} app_id
 * @param {import('../../../../types.js').report_create_parameters} report_parameters
 * @returns {Promise.<string>}
 */
const createReport= async (app_id, report_parameters) => {
    return await  
        timetable({ app_id:         report_parameters.app_id,
                    reportid:       report_parameters.reportid,
                    ip:             report_parameters.ip,
                    user_agent:     report_parameters.user_agent,
                    accept_language:report_parameters.accept_language,
                    latitude:       report_parameters.latitude,
                    longitude:      report_parameters.longitude,
                    report:         render_report_html(app_id, report_parameters.reportname)
        });
};

export{createReport};