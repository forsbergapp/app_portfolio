/**
 * Display apps
 * @module apps/admin/component/menu_apps
 */


/**
 * @import {CommonAppRecord,CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 * @typedef {CommonModuleCommon['commonComponentRender']} commonComponentRender
 */

/**
 * @param {{apps:CommonAppRecord[]}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_apps_content_widget1' class='widget'>
                                <div id='menu_apps_title' class='common_icon'></div>
                                <div id='menu_apps' class='common_list_scrollbar'>
                                    <div id='menu_apps_row_title' class='menu_apps_row'>
                                        <div id='menu_apps_col_title1' data-column='ID' class='menu_apps_col list_title'>ID</div>
                                        <div id='menu_apps_col_title2' data-column='NAME' class='menu_apps_col list_title'>NAME</div>
                                        <div id='menu_apps_col_title3' data-column='SUBDOMAIN' class='menu_apps_col list_title'>SUBDOMAIN</div>
                                        <div id='menu_apps_col_title4' data-column='PATH' class='menu_apps_col list_title'>PATH</div>
                                        <div id='menu_apps_col_title4' data-column='LOGO' class='menu_apps_col list_title'>LOGO</div>
                                        <div id='menu_apps_col_title4' data-column='SHOWPARAM' class='menu_apps_col list_title'>SHOWPARAM</div>
                                        <div id='menu_apps_col_title4' data-column='MANIFEST' class='menu_apps_col list_title'>MANIFEST</div>
                                        <div id='menu_apps_col_title4' data-column='JS' class='menu_apps_col list_title'>JS</div>
                                        <div id='menu_apps_col_title4' data-column='CSS' class='menu_apps_col list_title'>CSS</div>
                                        <div id='menu_apps_col_title4' data-column='CSS_REPORT' class='menu_apps_col list_title'>CSS_REPORT</div>
                                        <div id='menu_apps_col_title4' data-column='FAVICON_32x32' class='menu_apps_col list_title'>FAVICON_32x32</div>
                                        <div id='menu_apps_col_title4' data-column='FAVICON_192x192' class='menu_apps_col list_title'>FAVICON_192x192</div>
                                        <div id='menu_apps_col_title5' data-column='STATUS' class='menu_apps_col list_title'>STATUS</div>
                                    </div>
                                    ${props.apps.map(app=>
                                        `<div data-changed-record='0' data-app_id = '${app.ID}' class='menu_apps_row common_row' >
                                            <div class='menu_apps_col list_readonly' data-column='ID' >${app.ID}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='NAME' contentEditable='true' >${app.NAME}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='SUBDOMAIN' contentEditable='true' >${app.SUBDOMAIN}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='PATH' contentEditable='true' >${app.PATH}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='LOGO' contentEditable='true' >${app.LOGO}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='SHOWPARAM' contentEditable='true' >${app.SHOWPARAM}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='MANIFEST' contentEditable='true' >${app.MANIFEST}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='JS' contentEditable='true' >${app.JS}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='CSS' contentEditable='true' >${app.CSS}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='CSS_REPORT' contentEditable='true' >${app.CSS_REPORT}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='FAVICON_32x32' contentEditable='true' >${app.FAVICON_32x32}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='FAVICON_192x192' contentEditable='true' >${app.FAVICON_192x192}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='STATUS' contentEditable='true' >${app.STATUS}</div>
                                        </div>`
                                    ).join('')}
                                </div>
                            </div>
                            <div id='menu_apps_content_widget2' class='widget'>
                                <div id='menu_apps_detail_title' class='list_nav'>
                                    <div id='menu_apps_detail_parameter'    class='list_nav_list list_button common_icon list_nav_selected_tab'></div>
                                    <div id='menu_apps_detail_secret'       class='list_nav_list list_button common_icon'></div>
                                    <div id='menu_apps_detail_module'       class='list_nav_list list_button common_icon'></div>
                                </div>
                                <div id='menu_apps_detail' class='common_list_scrollbar'></div>
                                <div id='apps_buttons' class="save_buttons">
                                    <div id='menu_apps_save' class='common_dialogue_button button_save common_icon'></div>
                                </div>
                            </div>` ;
/**
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonFFB: commonFFB
 *                      },
 *          lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    /**@type{CommonAppRecord[]} */
    const apps = await props.methods.commonFFB({path:'/app-common', method:'GET', authorization_type:'ADMIN'})
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