/**
 * Displays dialogue apps and date and time in title using users locale and users timezone
 * @module apps/common/component/common_dialogue_apps
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
const template = props => ` <div id='common_dialogue_apps_list_title'>
                                <div id='common_dialogue_apps_list_title_col_date'></div>
                                <div id='common_dialogue_apps_list_title_col_info' class='common_link common_icon'></div>
                            </div>
                            <div id='common_dialogue_apps_list'>
                                ${props.apps.map(row=>
                                    `<div class='common_dialogue_apps_app_link_row common_row'>
                                        <div class='common_dialogue_apps_app_link_col'>
                                            <div data-app_id='${row.id}' class='common_dialogue_apps_app_logo common_image common_image_logo_start' style='${row.logo==null?'':`background-image:url(${row.logo});`}'></div>
                                        </div>
                                        <div class='common_dialogue_apps_app_link_col'>
                                            <div class='common_dialogue_apps_app_name'>${row.app_name_translation}</div>
                                        </div>  
                                    </div>`
                                ).join('')
                                }
                            </div>`;

/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon'],
 *                      }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show0');

    const apps = await props.methods.COMMON.commonFFB({path:'/server-db/app-info/', method:'GET', authorization_type:'APP_ID'})
                        .then((/**@type{string}*/result)=>JSON.parse(result).rows.filter((/**@type{*}*/app)=>app.app_id != props.data.app_id));

    const onMounted =()=>{
        props.methods.COMMON.commonMiscShowDateUpdate('common_dialogue_apps_list_title_col_date');
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({    
                            apps:apps
                            })
    };
};
export default component;