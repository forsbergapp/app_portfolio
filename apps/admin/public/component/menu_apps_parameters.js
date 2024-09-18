/**
 * @module apps/admin/component/menu_apps_parameters
 */
/**
 * Displays app parameters
*/
/**
 * @param {{spinner:string, 
 *          app_id:number,
 *          app_parameters:[{COMMENT:string}]|[]}} props
 */
const template = props => ` ${props.spinner==''?
                                `<div id='list_app_parameter_row_title' class='list_app_parameter_row'>
                                        <div id='list_app_parameter_col_title1' class='list_app_parameter_col list_title'>APP ID</div>
                                        <div id='list_app_parameter_col_title2' class='list_app_parameter_col list_title'>NAME</div>
                                        <div id='list_app_parameter_col_title3' class='list_app_parameter_col list_title'>VALUE</div>
                                        <div id='list_app_parameter_col_title4' class='list_app_parameter_col list_title'>COMMENT</div>
                                </div>
                                ${props.app_parameters.map(app_parameter=>
                                    `<div data-changed-record='0' class='list_app_parameter_row common_row'>
                                        <div class='list_app_parameter_col'>
                                            <div class='list_readonly'>${props.app_id}</div>
                                        </div>
                                        <div class='list_app_parameter_col'>
                                            <div class='list_readonly'>${Object.keys(app_parameter).filter(key=>key != 'app_id' && key != 'COMMENT')[0]}</div>
                                        </div>
                                        <div class='list_app_parameter_col'>
                                            <div contentEditable='true' class='common_input list_edit'/>${app_parameter[Object.keys(app_parameter).filter(key=>key != 'app_id' && key != 'COMMENT')[0]] ?? ''}</div>
                                        </div>
                                        <div class='list_app_parameter_col'>
                                            <div contentEditable='true' class='common_input list_edit'/>${app_parameter.COMMENT ?? ''}</div>
                                        </div>
                                    </div>`
                                ).join('')
                                }`:
                                `<div class='${props.spinner}'></div>`
                            }` ;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          app_id_data:number,
 *          function_FFB:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
   
    const post_component = async () =>{
        const app_parameters = await props.function_FFB(`/server-config/config-apps/${props.app_id_data}`, 'key=PARAMETERS', 'GET', 'APP_ACCESS', null)
                                .then((/**@type{string}*/result)=>JSON.parse(result)[0].PARAMETERS);
        
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template({spinner:'', app_id:props.app_id_data, app_parameters:app_parameters});
        
    };
    /**
     * @param {{spinner:string, 
     *          app_id:number,
     *          app_parameters:[{COMMENT:string}]|[]}} template_props
     */
    const render_template = template_props =>{
        return template({spinner:template_props.spinner, app_id:template_props.app_id, app_parameters:template_props.app_parameters});
    };
    return {
       props:  {function_post:post_component},
       data:   null,
       template: render_template({spinner:'css_spinner', app_id:props.app_id_data, app_parameters:[]})
    };
};
export default component;