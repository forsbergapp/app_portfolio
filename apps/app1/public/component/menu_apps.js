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
 * @param {{apps:common['server']['ORM']['Object']['App'][]}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_apps_content_widget1' class='widget'>
                                <div id='menu_apps_title' class='common_icon'></div>
                                <div id='menu_apps' class='common_list_scrollbar'>
                                    <div id='menu_apps_row_title' class='menu_apps_row'>
                                        <div data-column='Id' class='menu_apps_col list_title'>ID</div>
                                        <div data-column='Name' class='menu_apps_col list_title'>NAME</div>
                                        <div data-column='Path' class='menu_apps_col list_title'>PATH</div>
                                        <div data-column='Logo' class='menu_apps_col list_title'>LOGO</div>
                                        <div data-column='Js' class='menu_apps_col list_title'>JS</div>
                                        <div data-column='Css' class='menu_apps_col list_title'>CSS</div>
                                        <div data-column='CssReport' class='menu_apps_col list_title'>CSS_REPORT</div>
                                        <div data-column='Favicon32x32' class='menu_apps_col list_title'>FAVICON_32x32</div>
                                        <div data-column='Favicon192x192' class='menu_apps_col list_title'>FAVICON_192x192</div>
                                        <div data-column='TextEdit' class='menu_apps_col list_title'>TEXT_EDIT</div>
                                        <div data-column='Copyright' class='menu_apps_col list_title'>COPYRIGHT</div>
                                        <div data-column='LinkTitle' class='menu_apps_col list_title'>LINK_TITLE</div>
                                        <div data-column='LinkUrl' class='menu_apps_col list_title'>LINK_URL</div>
                                        <div id='menu_apps_col_title5' data-column='Status' class='menu_apps_col list_title'>STATUS</div>
                                    </div>
                                    ${props.apps.map(app=>
                                        `<div data-changed-record='0' data-app_id = '${app.Id}' class='menu_apps_row common_row' >
                                            <div class='menu_apps_col list_readonly' data-column='Id' >${app.Id}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='Name' contentEditable='true' >${app.Name}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='Path' contentEditable='true' >${app.Path}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='Logo' contentEditable='true' >${app.Logo}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='Js' contentEditable='true' >${app.Js}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='Css' contentEditable='true' >${app.Css}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='CssReport' contentEditable='true' >${app.CssReport}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='Favicon32x32' contentEditable='true' >${app.Favicon32x32}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='Favicon192x192' contentEditable='true' >${app.Favicon192x192}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='TextEdit' contentEditable='true' >${app.TextEdit}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='Copyright' contentEditable='true' >${app.Copyright}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='LinkTitle' contentEditable='true' >${app.LinkTitle}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='LinkUrl' contentEditable='true' >${app.LinkUrl}</div>
                                            <div class='menu_apps_col common_input list_edit' data-column='Status' contentEditable='true' >${app.Status}</div>
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
    /**@type{common['server']['ORM']['Object']['App'][]} */
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