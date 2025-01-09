/**
 * Displays dialogue apps
 * @module apps/common/component/common_dialogue_apps
 */

/**
 * @import {CommonAppRecord, CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{apps:CommonAppRecord[],
 *          app_copyright:string,
 *          app_email:string,
 *          app_link_url:string,
 *          app_link_title:string,
 *          info_link_policy_name:string,
 *          info_link_disclaimer_name:string,
 *          info_link_terms_name:string}} props 
 * @returns {string}
 */
const template = props => ` 
                            <div id='common_dialogue_apps_list'>
                                ${props.apps.map(row=>
                                    `<div class='common_dialogue_apps_app_link_row common_row'>
                                        <div class='common_dialogue_apps_app_link_col'>
                                            <div data-url='${row.protocol}${row.subdomain}.${row.host}:${row.port}'class='common_dialogue_apps_app_logo common_image common_image_logo_start' style='${row.logo==null?'':`background-image:url(${row.logo});`}'></div>
                                        </div>
                                        <div class='common_dialogue_apps_app_link_col'>
                                            <div class='common_dialogue_apps_app_name'>${row.app_name_translation}</div>
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
                            <div id='common_dialogue_apps_info'>
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
                                    </div>
                                </div>
                                <div id='common_dialogue_info_app_copyright'>${props.app_copyright}</div>
                            </div>`;

/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      common_app_id:number,
 *                      app_id:number,
 *                      app_copyright:string,
 *                      app_email:string,
 *                      app_link_url:string,
 *                      app_link_title:string,
 *                      info_link_policy_name:string,
 *                      info_link_disclaimer_name:string,
 *                      info_link_terms_name:string
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonFFB:CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show0');

    const apps = await props.methods.commonFFB({path:'/app-common/', method:'GET', authorization_type:'APP_ID'})
                        .then((/**@type{string}*/result)=>JSON.parse(result).rows.filter((/**@type{*}*/app)=>app.app_id != props.data.app_id));


    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({    
                            apps:apps,
                            app_copyright:props.data.app_copyright,
                            app_email:props.data.app_email,
                            app_link_url:props.data.app_link_url,
                            app_link_title:props.data.app_link_title,
                            info_link_policy_name:props.data.info_link_policy_name,
                            info_link_disclaimer_name:props.data.info_link_disclaimer_name,
                            info_link_terms_name:props.data.info_link_terms_name
                            })
    };
};
export default component;