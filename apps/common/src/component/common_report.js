/**
 * @module apps/common/src/component/common_report
 */

/**
 * @param {{config:*, 
 *          data:import('../../../../server/types.js').server_apps_report_create_parameters, 
 *          function_report:function}} props
 */
const template = props =>` ${props.config?'':''} `;
/**
 * 
 * @param {{data:       {
 *                      CONFIG_APP:*, 
 *                      data:import('../../../../server/types.js').server_apps_report_create_parameters
 *                      },
 *          methods:    {function_report:function}}} props 
 * @returns {Promise.<string>}
 */
const component = async props => template({config:props.data.CONFIG_APP, data:props.data.data, function_report:props.methods.function_report});
export default component;