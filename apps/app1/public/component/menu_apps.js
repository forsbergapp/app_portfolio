/**
 * Display apps
 * @module apps/app1/component/menu_apps
 */


/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{apps:common['CommonAppRecord'][]}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_apps_content_widget1' class='widget'>
                                <div id='menu_apps_title' class='common_icon'></div>
                                <div id='menu_apps' class='common_list_scrollbar'>
                                    <div id='menu_apps_row_title' class='menu_apps_row'>
                                        <div data-column='id' class='menu_apps_col list_title'>ID</div>
                                        <div data-column='name' class='menu_apps_col list_title'>NAME</div>
                                        <div data-column='path' class='menu_apps_col list_title'>PATH</div>
                                        <div data-column='logo' class='menu_apps_col list_title'>LOGO</div>
                                        <div data-column='js' class='menu_apps_col list_title'>JS</div>
                                        <div data-column='css' class='menu_apps_col list_title'>CSS</div>
                                        <div data-column='css_reprot' class='menu_apps_col list_title'>CSS_REPORT</div>
                                        <div data-column='favicon_32x32' class='menu_apps_col list_title'>FAVICON_32x32</div>
                                        <div data-column='favicon_192x192' class='menu_apps_col list_title'>FAVICON_192x192</div>
                                        <div data-column='text_edit' class='menu_apps_col list_title'>TEXT_EDIT</div>
                                        <div data-column='copyright' class='menu_apps_col list_title'>COPYRIGHT</div>
                                        <div data-column='link_title' class='menu_apps_col list_title'>LINK_TITLE</div>
                                        <div data-column='link_url' class='menu_apps_col list_title'>LINK_URL</div>
                                        <div id='menu_apps_col_title5' data-column='status' class='menu_apps_col list_title'>STATUS</div>
                                    </div>
                                    ${props.apps.map(app=>
                                        `<div data-changed-record='0' data-app_id = '${app.id}' class='menu_apps_row common_row' >
                                            <div class='menu_apps_col list_readonly' data-column='id' >${app.id}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='name' contentEditable='true' >${app.name}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='path' contentEditable='true' >${app.path}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='logo' contentEditable='true' >${app.logo}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='js' contentEditable='true' >${app.js}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='css' contentEditable='true' >${app.css}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='css_report' contentEditable='true' >${app.css_report}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='favicon_32x32' contentEditable='true' >${app.favicon_32x32}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='favicon_192x192' contentEditable='true' >${app.favicon_192x192}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='text_edit' contentEditable='true' >${app.text_edit}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='copyright' contentEditable='true' >${app.copyright}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='link_title' contentEditable='true' >${app.link_title}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='link_url' contentEditable='true' >${app.link_url}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='status' contentEditable='true' >${app.status}</div>
                                        </div>`
                                    ).join('')}
                                </div>
                            </div>
                            <div id='menu_apps_content_widget2' class='widget'>
                                <div id='menu_apps_detail_title' class='list_nav'>
                                    <div id='menu_apps_detail_data'    class='list_nav_list list_button common_icon list_nav_selected_tab'></div>
                                    <div id='menu_apps_detail_module'  class='list_nav_list list_button common_icon'></div>
                                </div>
                                <div id='menu_apps_detail' class='common_list_scrollbar'></div>
                                <div id='apps_buttons' class="save_buttons">
                                    <div id='menu_apps_save' class='common_app_dialogues_button button_save common_icon'></div>
                                </div>
                            </div>` ;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      },
 *          lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    /**@type{common['CommonAppRecord'][]} */
    const apps = await props.methods.COMMON.commonFFB({path:'/server-db/app', method:'GET', authorization_type:'ADMIN'})
                    .then((/**@type{string}*/result)=>JSON.parse(result).rows);

    const onMounted = async () =>{
        if (apps.length>0)
            props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('#menu_apps .list_edit')[0].focus();
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({apps:apps})
};
};
export default component;