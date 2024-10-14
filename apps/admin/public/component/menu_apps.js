/**
 * @module apps/admin/component/menu_apps
 */
/**
 * Displays apps
*/
/**
 * @param {{apps:[{ ID:Number, 
 *                  NAME:string, 
 *                  PROTOCOL:string, 
 *                  SUBDOMAIN:string, 
 *                  HOST:string, 
 *                  PORT:string, 
 *                  STATUS:string, 
 *                  LOGO:string, 
 *                  APP_CATEGORY_ID:number, 
 *                  APP_CATEGORY_TEXT:string}]|[]}} props
 */
const template = props => ` <div id='menu_apps_content_widget1' class='widget'>
                                <div id='menu_apps_title' class='common_icon'></div>
                                <div id='menu_apps' class='common_list_scrollbar'>
                                    <div id='menu_apps_row_title' class='menu_apps_row'>
                                        <div id='menu_apps_col_title1' class='menu_apps_col list_title'>ID</div>
                                        <div id='menu_apps_col_title2' class='menu_apps_col list_title'>NAME</div>
                                        <div id='menu_apps_col_title3' class='menu_apps_col list_title'>URL</div>
                                        <div id='menu_apps_col_title4' class='menu_apps_col list_title'>LOGO</div>
                                        <div id='menu_apps_col_title5' class='menu_apps_col list_title'>STATUS</div>
                                        <div id='menu_apps_col_title6' class='menu_apps_col list_title'>CATEGORY ID</div>
                                        <div id='menu_apps_col_title7' class='menu_apps_col list_title'>CATEGORY NAME</div>
                                    </div>
                                    ${props.apps.map(app=>
                                        `<div data-changed-record='0' data-app_id = '${app.ID}' class='menu_apps_row common_row' >
                                            <div class='menu_apps_col'>
                                                <div class='list_readonly'>${app.ID}</div>
                                            </div>
                                            <div class='menu_apps_col'>
                                                <div contentEditable='false' class='common_input list_readonly'/>${app.NAME}</div>
                                            </div>
                                            <div class='menu_apps_col'>
                                                <div contentEditable='false' class='common_input list_readonly'/>${app.PROTOCOL}${app.SUBDOMAIN}.${app.HOST}:${app.PORT}</div>
                                            </div>
                                            <div class='menu_apps_col'>
                                                <div contentEditable='false' class='common_input list_readonly'/>${app.LOGO}</div>
                                            </div>
                                            <div class='menu_apps_col'>
                                                <div class='list_readonly' class='list_readonly'>${app.STATUS}</div>
                                            </div>
                                            <div class='menu_apps_col'>
                                                <div contentEditable='true' class='common_input list_edit common_input_lov' data-defaultValue='${app.APP_CATEGORY_ID ?? ''}'/>${app.APP_CATEGORY_ID ?? ''}</div>
                                                <div class='common_lov_button common_list_lov_click common_icon'></div>
                                            </div>
                                            <div class='menu_apps_col'>
                                                <div class='list_readonly common_lov_value'>${app.APP_CATEGORY_TEXT ?? ''} </div>
                                            </div>
                                        </div>`
                                    ).join('')}
                                </div>
                            </div>
                            <div id='menu_apps_content_widget2' class='widget'>
                                <div id='menu_apps_parameters_title' class='common_icon'></div>
                                <div id='menu_apps_parameters' class='common_list_scrollbar'></div>
                                <div id='apps_buttons' class="save_buttons">
                                    <div id='menu_apps_save' class='common_dialogue_button button_save common_icon'></div>
                                </div>
                            </div>` ;
/**
* 
* @param {{data:{       commonMountdiv:string},
*          methods:{    COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
 *                      commonFFB: import('../../../common_types.js').CommonModuleCommon['commonFFB']},
*          lifecycle:   null}} props 
* @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
*                      data:null, 
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
    const apps = await props.methods.commonFFB({path:'/app_admin/apps', method:'GET', authorization_type:'ADMIN'})
                    .then((/**@type{string}*/result)=>JSON.parse(result).rows);

    const onMounted = async () =>{
        if (apps.length>0)
            props.methods.COMMON_DOCUMENT.querySelectorAll('#menu_apps .list_edit')[0].focus();
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({apps:apps})
};
};
export default component;