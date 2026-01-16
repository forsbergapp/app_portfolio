/**
 * @module apps/common/component/common_app
 */  

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_toolbar_button_start:number,
 *          app_toolbar_button_framework:number,
 *          app_framework:number,
 *          icons: {home: string,
 *                  framework_js: string,
 *                  framework_vue: string,
 *                  framework_react: string,
 *                  user: string,
 *                  search: string,
 *                  user_profile_stat: string,
 *                  email: string
 *                  }}} props
 * @returns {string}
 */
const template = props =>`  
                            <link id='app_link_app_css'         rel='stylesheet'  type='text/css'     href=''/>
                            <link id='app_link_app_report_css'  rel='stylesheet'  type='text/css'     href=''/>
                            <div id='app_root'>
                                <div id='app'></div>
                                <div id='common_app'>
                                    <div id='common_app_toolbar' ${(props.app_toolbar_button_start==1 ||props.app_toolbar_button_framework==1)?'class=\'show\'':''}>
                                        <div id='common_app_toolbar_start' class='common_link common_icon_toolbar_s common_toolbar_button ${props.app_toolbar_button_start==1?'show':''}'>${props.icons.home}</div>
                                        <div id='common_app_toolbar_framework_js' class='common_link common_icon_toolbar_s common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''} ${props.app_framework==1?'common_toolbar_selected':''}'>${props.icons.framework_js}</div>
                                        <div id='common_app_toolbar_framework_vue' class='common_link common_icon_toolbar_s common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''}'>${props.icons.framework_vue}</div>
                                        <div id='common_app_toolbar_framework_react' class='common_link common_icon_toolbar_s common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''}'>${props.icons.framework_react}</div>
                                    </div>
                                    <div id='common_app_dialogues'>
                                        <div id='common_app_dialogues_info' class='common_app_dialogues_content'></div>
                                        <div id='common_app_dialogues_iam_start' class='common_app_dialogues_content'></div>
                                        <div id='common_app_dialogues_user_menu' class='common_app_dialogues_content'></div>
                                        <div id='common_app_dialogues_iam_verify' class='common_app_dialogues_content'></div>
                                        <div id='common_app_dialogues_message' class='common_app_dialogues_content'></div>
                                        <div id='common_app_dialogues_profile' class='common_app_dialogues_content'></div>
                                        <div id='common_app_dialogues_lov' class='common_app_dialogues_content'></div>
                                        <div id='common_app_dialogues_app_data_display' class='common_app_dialogues_content'></div>
                                        <div id='common_app_dialogues_app_custom' class='common_app_dialogues_content'></div>
                                    </div>
                                    <div id='common_app_print'></div>
                                    <div id='common_app_window_info'></div>
                                    <div id='common_app_broadcast'></div>
                                    <div id='common_app_profile'>
                                        <div id='common_app_profile_search'>
                                            <div id='common_app_profile_search_input_row'>
                                                <div id='common_app_profile_search_input' contentEditable='true' class='common_input '></div>
                                                <div id='common_app_profile_search_icon' class='common_link common_icon_list'>${props.icons.search}</div>
                                            </div>
                                            <div id='common_app_profile_search_list_wrap'></div>
                                        </div>
                                        <div id='common_app_profile_toolbar'>
                                            <div id='common_app_profile_toolbar_stat' class='common_link common_toolbar_button common_icon_toolbar_l' >${props.icons.user_profile_stat}</div>
                                        </div>
                                    </div>
                                    <div id='common_app_iam_user_menu'>
                                        <div id='common_app_iam_user_menu_logged_in'>
                                            <div id='common_app_iam_user_menu_avatar'>
                                                <div id='common_app_iam_user_menu_avatar_img' class='common_image common_image_avatar'></div>
                                                <div id='common_app_iam_user_menu_message_count'></div>
                                                <div id='common_app_iam_user_menu_message_count_icon'>${props.icons.email}</div>
                                            </div>
                                        </div>
                                        <div id='common_app_iam_user_menu_logged_out'>
                                            <div id='common_app_iam_user_menu_default_avatar' class='common_link common_icon_avatar'>${props.icons.user}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      globals:common['server']['app']['commonGlobals'],
*                      cssCommon:string,
*                      },
*          methods:    {
*                      COMMON:common['CommonModuleCommon']
*                      }}} props
*      }} props 
* @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
*                      data:   null,
*                      methods:null,
*                      events:common['commonComponentEvents'],
*                      template:string}>}
*/
const component = async props =>{
    //apply common css
    props.methods.COMMON.commonMiscCssApply(props.data.cssCommon);
    /**
     * @name events
     * @descption Events for map
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        const elementDiv = props.methods.COMMON.commonMiscElementDiv(event.target);
        switch (true){
        }
    }
    const onMounted = async ()=>{
        document.head.innerHTML = ` <meta charset='UTF-8'>
                                    <title></title>
                                    <meta name='viewport' content='width=device-width, minimum-scale=1.0, maximum-scale = 1'>`;
        
        //set globals
        props.methods.COMMON.commonGlobals(props.data.globals);
        
        props.methods.COMMON.commonUserPreferencesGlobalSetDefault('LOCALE');
        props.methods.COMMON.commonUserPreferencesGlobalSetDefault('TIMEZONE');
        props.methods.COMMON.commonUserPreferencesGlobalSetDefault('DIRECTION');
        props.methods.COMMON.commonUserPreferencesGlobalSetDefault('ARABIC_SCRIPT');
    
        props.methods.COMMON.commonCustomFramework();
        //set common app id
        props.methods.COMMON.commonGlobalSet('UserApp','app_id', props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id);
        
        //connect to BFF
        props.methods.COMMON.commonFFB({path:               '/server-bff/' + props.methods.COMMON.commonGlobalGet('Functions').x.uuid, 
            method:             'POST',
            body:               null,
            response_type:      'SSE',
            authorization_type: 'APP_ID'});
    
        //mount start app
        await props.methods.COMMON.commonAppMount(props.methods.COMMON.commonGlobalGet('Parameters').app_start_app_id);
    
        //apply font css
        props.methods.COMMON.commonGlobalGet('Data').app_fonts?props.methods.COMMON.commonMiscCssApply(props.methods.COMMON.commonGlobalGet('Data').app_fonts.join('@')):null;
    }
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        events:     events,
        template:   template({  app_toolbar_button_start:           props.methods.COMMON.commonGlobalGet('Parameters').app_toolbar_button_start,
                                app_toolbar_button_framework:       props.methods.COMMON.commonGlobalGet('Parameters').app_toolbar_button_framework,
                                app_framework:                      props.methods.COMMON.commonGlobalGet('Parameters').app_framework,
                                icons: {home: props.methods.COMMON.commonGlobalGet('ICONS').home,
                                        framework_js: props.methods.COMMON.commonGlobalGet('ICONS').framework_js,
                                        framework_vue: props.methods.COMMON.commonGlobalGet('ICONS').framework_vue,
                                        framework_react: props.methods.COMMON.commonGlobalGet('ICONS').framework_react,
                                        user: props.methods.COMMON.commonGlobalGet('ICONS').user,
                                        search: props.methods.COMMON.commonGlobalGet('ICONS').search,
                                        user_profile_stat: props.methods.COMMON.commonGlobalGet('ICONS').user_profile_stat,
                                        email: props.methods.COMMON.commonGlobalGet('ICONS').email
                                    }
                            })
    };
};
export default component;