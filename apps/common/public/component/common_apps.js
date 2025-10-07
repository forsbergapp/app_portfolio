/**
 * Displays dialogue apps and date and time in title using users locale and users timezone
 * @module apps/common/component/common_apps
 */

/**
 * @import {common}  from '../../../common_types.js'
 */
/**@type{(common['server']['ORM']['View']['AppGetInfo'])[]} */
const APPS = [];
/**
 * @name template
 * @description Template
 * @function
 * @param {{apps:(common['server']['ORM']['View']['AppGetInfo'])[]}} props 
 * @returns {string}
 */
const template = props => ` <div id='common_apps_list_title'>
                                <div id='common_apps_list_title_col_date'></div>
                                <div id='common_apps_list_title_col_info' class='common_link common_icon'></div>
                            </div>
                            <div id='common_apps_list'>
                                ${props.apps.map(row=>
                                    `<div class='common_apps_app_link_row common_row'>
                                        <div class='common_apps_app_link_col'>
                                            <div data-app_id='${row.Id}' class='common_apps_app_logo common_image common_image_logo_start' style='${row.Logo==null?'':`background-image:url(${row.Logo});`}'></div>
                                        </div>
                                        <div class='common_apps_app_link_col'>
                                            <div class='common_apps_app_name'>${row.Name}</div>
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
 *                      events:common['commonComponentEvents'],
 *                      template:string}>}
 */
const component = async props => {
    if (APPS.length==0)
        APPS.push(...await props.methods.COMMON.commonFFB({path:'/server-db/app-info/', method:'GET', authorization_type:'APP_ID'})
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows.filter((/**@type{*}*/app)=>app.app_id != props.data.app_id)));

    /**
     * @name events
     * @descption Events
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        switch (event_type){
            case 'click':{
                switch (true){
                    case event_target_id=='common_apps_list_title_col_info':{
                        props.methods.COMMON.commonComponentRender({
                            mountDiv:   'common_app_dialogues_info',
                            data:       {
                                        common_app_id:props.methods.COMMON.commonGlobalGet('app_common_app_id'),
                                        app_copyright:props.methods.COMMON.commonGlobalGet('app_copyright'),
                                        app_link_url:props.methods.COMMON.commonGlobalGet('app_link_url'),
                                        app_link_title:props.methods.COMMON.commonGlobalGet('app_link_title'),
                                        info_link_policy_name:props.methods.COMMON.commonGlobalGet('info_link_policy_name'),
                                        info_link_disclaimer_name:props.methods.COMMON.commonGlobalGet('info_link_disclaimer_name'),
                                        info_link_terms_name:props.methods.COMMON.commonGlobalGet('info_link_terms_name')
                                        },
                            methods:    {
                                        commonFFB:props.methods.COMMON.commonFFB,
                                        commonMessageShow:props.methods.COMMON.commonMessageShow
                                        },
                            path:       '/common/component/common_app_dialogues_info.js'});
                        break;
                    }            
                    case event_target_id=='common_apps_list':{
                        if (event.target.classList.contains('common_apps_app_logo')){
                            props.methods.COMMON.commonAppMount(event.target.getAttribute('data-app_id'));
                        }
                        break;
                    }
                }
            }
        }
    };    
    const onMounted =()=>{
        props.methods.COMMON.commonMiscShowDateUpdate('common_apps_list_title_col_date');
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        events:     events,
        template:   template({    
                            apps:APPS
                            })
    };
};
export default component;