/**
 * @module apps/admin/component/menu_apps_parameters
 */
/**
 * Displays app parameters
*/
/**
 * @param {{app_id:number,app_parameters:Object.<String,{VALUE:string, COMMENT:string}>}} props
 */
const template = props => ` <div id='menu_apps_parameters_row_title' class='menu_apps_parameters_row'>
                                    <div class='menu_apps_parameters_col list_title' data-column='APP_ID'>APP_ID</div>
                                    <div class='menu_apps_parameters_col list_title' data-column='NAME'>NAME</div>
                                    <div class='menu_apps_parameters_col list_title' data-column='VALUE'>VALUE</div>
                                    <div class='menu_apps_parameters_col list_title' data-column='COMMENT'>COMMENT</div>
                            </div>
                            ${Object.entries(props.app_parameters).map(app_parameter=>
                                `<div data-changed-record='0' class='menu_apps_parameters_row common_row' data-fk='${app_parameter[0]=='APP_ID'?1:0}'>
                                    <div class='menu_apps_parameters_col list_readonly' data-column='APP_ID'>${props.app_id}</div>
                                    <div class='menu_apps_parameters_col list_readonly' data-column='NAME'>${app_parameter[0]}</div>
                                    <div class='menu_apps_parameters_col common_input list_edit' contentEditable='true' data-column='VALUE'>${app_parameter[1].VALUE ?? app_parameter[1]}</div>
                                    <div class='menu_apps_parameters_col common_input list_edit' contentEditable='true' data-column='COMMENT'>${app_parameter[1].COMMENT ?? ''}</div>
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
    /**@type{import('../../../common_types.js').CommonAppParametersRecord} */
    const app_parameters = await props.methods.commonFFB({path:`/app-common-app-parameter/${props.data.app_id_data}`, method:'GET', authorization_type:'ADMIN'})
                            .then((/**@type{string}*/result)=>JSON.parse(result));

    return {
       lifecycle:   null,
       data:        null,
       methods:     null,
       template: template({app_id:props.data.app_id_data,
                            app_parameters:app_parameters})
    };
};
export default component;