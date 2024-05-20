/**@type{import('../../../types.js').AppDocument}} */
const AppDocument = document;
/**
 * @typedef {{  APP_ID:number,
 *              SUBDOMAIN:string,
 *              PROTOCOL:string,
 *              HOST:string,
 *              PORT:string,
 *              LOGO:string,
 *              NAME:string,
 *              APP_CATEGORY:string,
 *              APP_DESCRIPTION:string,
 *              APP_NAME_TRANSLATION:string}} app_record_type
 */
/**
 * 
 * @param {{apps:app_record_type[],
 *          app_copyright:string,
 *          app_email:string,
 *          app_link_url:string,
 *          app_link_title:string,
 *          img_diagram_img:string,
 *          img_diagram_img_small:string,
 *          img_datamodel_img:string,
 *          img_datamodel_img_small:string,
 *          info_link_policy_name:string,
 *          info_link_disclaimer_name:string,
 *          info_link_terms_name:string,
 *          info_link_about_name:string}} props 
 * @returns {string}
 */
const template = props => ` 
                            <div id='common_dialogue_info_home' class='common_dialogue_button common_icon' ></div>
                            <div id='common_dialogue_info_app_page'>
                                <div id='common_dialogue_info_app_menu'>
                                    <div id='common_dialogue_info_app_menu_apps' class='common_dialogue_button common_icon'></div>
                                    <div id='common_dialogue_info_app_menu_space'></div>
                                    <div id='common_dialogue_info_app_menu_info' class='common_dialogue_button common_icon'></div>
                                </div>
                                <div id='common_dialogue_info_app_menu_content'>
                                    <div id='common_dialogue_info_app_menu_content_apps'>
                                        <div id='common_dialogue_info_app_menu_content_apps_screenshot'></div>
                                        <div id='common_dialogue_info_app_menu_content_apps_list'>
                                            ${props.apps.map(row=>
                                                `<div class='common_dialogue_apps_app_link_row common_row'>
                                                    <div class='common_dialogue_apps_app_link_col'>
                                                        <div class='common_dialogue_apps_app_id'>${row.APP_ID}</div>
                                                    </div>
                                                    <div class='common_dialogue_apps_app_link_col'>
                                                        <div class='common_dialogue_apps_app_url'>${row.PROTOCOL}${row.SUBDOMAIN}.${row.HOST}:${row.PORT}</div>
                                                    </div>
                                                    <div class='common_dialogue_apps_app_link_col'>
                                                        <img class='common_dialogue_apps_app_logo' src='${row.LOGO}' />
                                                    </div>
                                                    <div class='common_dialogue_apps_app_link_col'>
                                                        <div class='common_dialogue_apps_app_name'>${row.NAME} - ${row.APP_NAME_TRANSLATION}</div>
                                                        <div class='common_dialogue_apps_app_category'>${row.APP_CATEGORY==null?'':row.APP_CATEGORY}</div>
                                                        <div class='common_dialogue_apps_app_description'>${row.APP_DESCRIPTION==null?'':row.APP_DESCRIPTION}</div>
                                                    </div>
                                                </div>`
                                            ).join('')
                                            }
                                            ${props.apps.length & 1?
                                                `<div class='common_dialogue_apps_app_link_row common_row'>
                                                    <div class='common_dialogue_apps_app_link_col'></div>
                                                    <div class='common_dialogue_apps_app_link_col'></div>
                                                    <div class='common_dialogue_apps_app_link_col'></div>
                                                </div>`:''
                                            }
                                        </div>
                                    </div>
                                    <div id='common_dialogue_info_app_menu_content_info'>
                                        <div id='common_dialogue_info_app_portfolio'>
                                            <div id='common_dialogue_info_title1' class='common_icon'></div>
                                            <div id='common_dialogue_info_info_diagram'><img loading='lazy' id='common_dialogue_info_info_diagram_img' data-src='${props.img_diagram_img}' src='${props.img_diagram_img_small}'/></div>
                                        </div>
                                        <div id='common_dialogue_info_datamodel'>
                                            <div id='common_dialogue_info_title2' class='common_icon'></div>
                                            <div id='common_dialogue_info_info_datamodel'><img loading='lazy' id='common_dialogue_info_info_datamodel_img' data-src='${props.img_datamodel_img}' src='${props.img_datamodel_img_small}'/></div>
                                        </div>
                                        <div id='common_dialogue_info_contact'>
                                            <div id='common_dialogue_info_contact_text' class='common_icon'></div>
                                            <div id="common_dialogue_info_app_email" class='common_link'>${props.app_email}</div>
                                        </div>
                                        <div id='common_dialogue_info_start_links'>
                                            <div id='common_dialogue_info_app_link_row'>
                                                <div id='common_dialogue_info_app_link' class='common_link'>${props.app_link_url==null?'':props.app_link_title}</div>
                                            </div>
                                            <div id='common_dialogue_info_info_link_row'>
                                                <div id='common_dialogue_info_info_link1' class='common_link'>${props.info_link_policy_name}</div>
                                                <div id='common_dialogue_info_info_link2' class='common_link'>${props.info_link_disclaimer_name}</div>
                                                <div id='common_dialogue_info_info_link3' class='common_link'>${props.info_link_terms_name}</div>
                                                <div id='common_dialogue_info_info_link4' class='common_link'>${props.info_link_about_name}</div>
                                            </div>
                                        </div>
                                        <div id='common_dialogue_info_app_copyright'>${props.app_copyright}</div>
                                    </div>
                                </div>
                            </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          apps:app_record_type[],
 *          app_copyright:string,
 *          app_email:string,
 *          app_link_url:string,
 *          app_link_title:string,
 *          info_link_policy_name:string,
 *          info_link_disclaimer_name:string,
 *          info_link_terms_name:string,
 *          info_link_about_name:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show0');
    /**
     * 
     * @returns {string}
     */
    const render_template = () =>{
        return template({
            apps:props.apps,
            app_copyright:props.app_copyright,
            app_email:props.app_email,
            app_link_url:props.app_link_url,
            app_link_title:props.app_link_title,
            img_diagram_img:'/common/documents/app_portfolio.webp',
            img_diagram_img_small:'/common/documents/app_portfolio_small.webp',
            img_datamodel_img:'/common/documents/data_model.webp',
            img_datamodel_img_small:'/common/documents/data_model_small.webp',
            info_link_policy_name:props.info_link_policy_name,
            info_link_disclaimer_name:props.info_link_disclaimer_name,
            info_link_terms_name:props.info_link_terms_name,
            info_link_about_name:props.info_link_about_name
        });
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default component;