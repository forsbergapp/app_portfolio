/**
 * @module apps/admin/component/menu_apps
 */
/**
 * Displays apps
*/
/**
 * @param {{spinner:string, apps:[{ ID:Number, 
 *                                  NAME:string, 
 *                                  PROTOCOL:string, 
 *                                  SUBDOMAIN:string, 
 *                                  HOST:string, 
 *                                  PORT:string, 
 *                                  STATUS:string, 
 *                                  LOGO:string, 
 *                                  APP_CATEGORY_ID:number, 
 *                                  APP_CATEGORY_TEXT:string}]|[]}} props
 */
const template = props => ` <div id='menu_4_content_widget1' class='widget'>
                                <div id='list_apps_title' class='common_icon'></div>
                                <div id='list_apps' class='common_list_scrollbar ${props.spinner}'>
                                    ${props.spinner==''?
                                        `<div id='list_apps_row_title' class='list_apps_row'>
                                            <div id='list_apps_col_title1' class='list_apps_col list_title'>ID</div>
                                            <div id='list_apps_col_title2' class='list_apps_col list_title'>NAME</div>
                                            <div id='list_apps_col_title3' class='list_apps_col list_title'>URL</div>
                                            <div id='list_apps_col_title4' class='list_apps_col list_title'>LOGO</div>
                                            <div id='list_apps_col_title5' class='list_apps_col list_title'>STATUS</div>
                                            <div id='list_apps_col_title6' class='list_apps_col list_title'>CATEGORY ID</div>
                                            <div id='list_apps_col_title7' class='list_apps_col list_title'>CATEGORY NAME</div>
                                        </div>`:
                                        ''
                                    }
                                    ${props.apps.map(app=>
                                        `<div data-changed-record='0' data-app_id = '${app.ID}' class='list_apps_row common_row' >
                                            <div class='list_apps_col'>
                                                <div class='list_readonly'>${app.ID}</div>
                                            </div>
                                            <div class='list_apps_col'>
                                                <div contentEditable='false' class='common_input list_readonly'/>${app.NAME}</div>
                                            </div>
                                            <div class='list_apps_col'>
                                                <div contentEditable='false' class='common_input list_readonly'/>${app.PROTOCOL}${app.SUBDOMAIN}.${app.HOST}:${app.PORT}</div>
                                            </div>
                                            <div class='list_apps_col'>
                                                <div contentEditable='false' class='common_input list_readonly'/>${app.LOGO}</div>
                                            </div>
                                            <div class='list_apps_col'>
                                                <div class='list_readonly' class='list_readonly'>${app.STATUS}</div>
                                            </div>
                                            <div class='list_apps_col'>
                                                <div contentEditable='true' class='common_input list_edit common_input_lov' data-defaultValue='${app.APP_CATEGORY_ID ?? ''}'/>${app.APP_CATEGORY_ID ?? ''}</div>
                                                <div class='common_lov_button common_list_lov_click common_icon'></div>
                                            </div>
                                            <div class='list_apps_col'>
                                                <div class='list_readonly common_lov_value'>${app.APP_CATEGORY_TEXT ?? ''} </div>
                                            </div>
                                        </div>`
                                    ).join('')}
                                </div>
                            </div>
                            <div id='menu_4_content_widget2' class='widget'>
                                <div id='list_app_parameter_title' class='common_icon'></div>
                                <div id='list_app_parameter' class='common_list_scrollbar'></div>
                                <div id='apps_buttons' class="save_buttons">
                                    <div id='apps_save' class='common_dialogue_button button_save common_icon'></div>
                                </div>
                            </div>` ;
/**
* 
* @param {{data:{       common_mountdiv:string},
*          methods:{    common_document:import('../../../common_types.js').CommonAppDocument,
*                       FFB: import('../../../common_types.js').CommonModuleCommon['FFB']},
*          lifecycle:   null}} props 
* @returns {Promise.<{ props:{function_post:function}, 
*                      data:null, 
*                      template:string}>}
*/
const component = async props => {
    
    const post_component = async () =>{
        const apps = await props.methods.FFB('/app_admin/apps', null, 'GET', 'APP_ACCESS', null)
                        .then((/**@type{string}*/result)=>JSON.parse(result).rows);
        
        props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = template({spinner:'', apps:apps});
        if (apps.length>0)
            props.methods.common_document.querySelectorAll('#list_apps .list_edit')[0].focus();
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template({spinner:'css_spinner', apps:[]})
};
};
export default component;