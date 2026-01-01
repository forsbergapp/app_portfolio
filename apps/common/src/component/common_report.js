/**
 * @module apps/common/src/component/common_report
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{papersize:'A4'|'Letter',
 *          function_report:function,
 *          data:*
 *          }} props
 * @returns {Promise.<string>}
 */
const template = async props =>`  <div id='paper' class='${props.papersize}'>
                                    ${await props.function_report(props.data)}
                                </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      data:import('../../../../server/types.js').server_apps_report_create_parameters,
 *                      papersize:'A4'|'Letter'
 *                      },
 *          methods:    {function_report:function}}} props 
 * @returns {Promise.<string>}
 */
const component = async props => {
    return template({papersize:props.data.papersize, function_report:props.methods.function_report, data:props.data.data});
};
export default component;