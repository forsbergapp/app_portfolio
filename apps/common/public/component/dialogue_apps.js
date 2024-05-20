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
 * @param {{apps:app_record_type[]}} props 
 * @returns {string}
 */
const template = props => ` 
                            <div id='common_dialogue_apps_info' class='common_dialogue_button common_icon' ></div>
                            <div id='common_dialogue_apps_list' <CLASS_SPINNER/>>
                                ${props.apps.map(row=>
                                    `<div class='common_dialogue_apps_app_link_row common_row'>
                                        <div class='common_dialogue_apps_app_link_col'>
                                            <div class='common_dialogue_apps_app_url'>${row.PROTOCOL}${row.SUBDOMAIN}.${row.HOST}:${row.PORT}</div>
                                        </div>
                                        <div class='common_dialogue_apps_app_link_col'>
                                            <img class='common_dialogue_apps_app_logo' src='${row.LOGO}' />
                                        </div>
                                        <div class='common_dialogue_apps_app_link_col'>
                                            <div class='common_dialogue_apps_app_name'>${row.APP_NAME_TRANSLATION}</div>
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
                            </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          common_app_id:number,
 *          app_copyright:string,
 *          app_email:string,
 *          app_link_url:string,
 *          app_link_title:string,
 *          info_link_policy_name:string,
 *          info_link_disclaimer_name:string,
 *          info_link_terms_name:string,
 *          info_link_about_name:string,
 *          function_FFB:function,
 *          function_ComponentRender:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show0');
    let class_spinner = `class='css_spinner'`;        
    /**
     * @returns {Promise<void>}
     */
    const post_component = async () =>{
        const apps = await props.function_FFB('/app/apps/', null, 'GET', 'APP_DATA', null)
                            .then((/**@type{string}*/result)=>JSON.parse(result))
                            .catch((/**@type{Error}*/error)=>{throw error});
        class_spinner = '';
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template({apps:apps});
        props.function_ComponentRender('common_dialogue_info', {apps:apps,
                                                                app_copyright:props.app_copyright,
                                                                app_email:props.app_email,
                                                                app_link_url:props.app_link_url,
                                                                app_link_title:props.app_link_title,
                                                                info_link_policy_name:props.info_link_policy_name,
                                                                info_link_disclaimer_name:props.info_link_disclaimer_name,
                                                                info_link_terms_name:props.info_link_terms_name,
                                                                info_link_about_name:props.info_link_about_name
                                                                }, '/common/component/dialogue_info.js');
    }
    /**
     * 
     * @param {*} props 
     * @returns 
     */
    const render_template = props =>{
        return template(props)
                .replace('<CLASS_SPINNER/>', class_spinner);
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template({apps:[]})
    };
}
export default component;