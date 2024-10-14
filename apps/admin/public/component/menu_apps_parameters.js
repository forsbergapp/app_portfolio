/**
 * @module apps/admin/component/menu_apps_parameters
 */
/**
 * Displays app parameters
*/
/**
 * @param {{app_id:number,
 *          app_parameters:[{COMMENT:string}]|[]}} props
 */
const template = props => ` <div id='menu_apps_parameters_row_title' class='menu_apps_parameters_row'>
                                    <div id='menu_apps_parameters_col_title1' class='menu_apps_parameters_col list_title'>APP ID</div>
                                    <div id='menu_apps_parameters_col_title2' class='menu_apps_parameters_col list_title'>NAME</div>
                                    <div id='menu_apps_parameters_col_title3' class='menu_apps_parameters_col list_title'>VALUE</div>
                                    <div id='menu_apps_parameters_col_title4' class='menu_apps_parameters_col list_title'>COMMENT</div>
                            </div>
                            ${props.app_parameters.map(app_parameter=>
                                `<div data-changed-record='0' class='menu_apps_parameters_row common_row'>
                                    <div class='menu_apps_parameters_col'>
                                        <div class='list_readonly'>${props.app_id}</div>
                                    </div>
                                    <div class='menu_apps_parameters_col'>
                                        <div class='list_readonly'>${Object.keys(app_parameter).filter(key=>key != 'app_id' && key != 'COMMENT')[0]}</div>
                                    </div>
                                    <div class='menu_apps_parameters_col'>
                                        <div contentEditable='true' class='common_input list_edit'/>${app_parameter[Object.keys(app_parameter).filter(key=>key != 'app_id' && key != 'COMMENT')[0]] ?? ''}</div>
                                    </div>
                                    <div class='menu_apps_parameters_col'>
                                        <div contentEditable='true' class='common_input list_edit'/>${app_parameter.COMMENT ?? ''}</div>
                                    </div>
                                </div>`
                            ).join('')
                            }`;
/**
 * 
 * @param {{data:{      commonMountdiv:string,
 *                      app_id_data:number},
 *          methods:{   COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
 *                      commonFFB:import('../../../common_types.js').CommonModuleCommon['commonFFB']}}} props 
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const app_parameters = await props.methods.commonFFB({path:`/server-config/config-apps/${props.data.app_id_data}`, query:'key=PARAMETERS', method:'GET', authorization_type:'ADMIN'})
                            .then((/**@type{string}*/result)=>JSON.parse(result)[0].PARAMETERS);

    return {
       lifecycle:   null,
       data:        null,
       methods:     null,
       template: template({
                            app_id:props.data.app_id_data, 
                            app_parameters:app_parameters})
    };
};
export default component;