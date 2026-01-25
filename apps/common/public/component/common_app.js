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
 * @param {{current: 'START'|'MESSAGE'|'LOADING',
 *          app_toolbar_button_start:number,
 *          app_toolbar_button_framework:number,
 *          app_framework:number,
 *          message?:*,
 *          message_type?:string,
 *          message_title_font_class?:string|null,
 *          message_title_icon_class?:'message_text'|'message_success'|'message_fail'|null,
 *          icons: {home: string,
 *                  framework_js: string,
 *                  framework_vue: string,
 *                  framework_react: string,
 *                  user: string,
 *                  search: string,
 *                  user_profile_stat: string,
 *                  email: string,
 *                  close:string,
 *                  cancel:string,
 *                  message_text:string,
 *                  message_success:string,
 *                  message_fail:string,
 *                  message_confirm:string
 *                  }}} props
 * @returns {string}
 */
const template = props => props.current=='START'?
                            `  
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
                            </div>`:
                                props.current=='LOADING'?
                                `
                                <div class='common_loading_spinner'></div>
                                <div id='common_loading_progressbar_wrap'>
                                    <div id='common_loading_progressbar_info'></div>
                                    <div id='common_loading_progressbar'></div>
                                </div>`:
                                    props.current=='MESSAGE'?
                                        `  
                                        ${props.message_type=='CONFIRM'?
                                            `<div id='common_app_dialogues_message_confirm_question' class='common_icon_title'>${props.icons.message_confirm}</div>`:''
                                        }
                                        ${props.message_type!='CONFIRM'?
                                        `<div id='common_app_dialogues_message_title_container'>
                                            <div id='common_app_dialogues_message_title_icon' class='common_icon_title'>${props.message_title_icon_class?props.icons[props.message_title_icon_class]:''}</div>
                                            <div id='common_app_dialogues_message_title' class='${props.message_title_font_class}'>
                                                ${props.message !=null && props.message !='' && typeof props.message == 'object'?Object.entries(props.message).map((/**@type{*}*/list_row)=>
                                                    //loop manages both object and array
                                                    `<div id='common_app_dialogues_message_info_list'>
                                                        <div class='common_app_dialogues_message_info_list_row'>
                                                            <div class='common_app_dialogues_message_info_list_col'>
                                                                <div>${props.message.constructor===Array?Object.keys(list_row[1])[0]:list_row[0]}</div>
                                                            </div>
                                                            <div class='common_app_dialogues_message_info_list_col'>
                                                                <div>${props.message.constructor===Array?Object.values(list_row[1])[0]:list_row[1]}</div>
                                                            </div>
                                                        </div>
                                                    </div>`).join(''):
                                                    (props.message?props.message:'')
                                                }
                                            </div>
                                        </div>`:''
                                        }
                                        ${props.message_type=='PROGRESS'?
                                            `<div id='common_app_dialogues_message_progressbar_wrap'>
                                                <div id='common_app_dialogues_message_progressbar'></div>
                                            </div>`:''
                                        }
                                        <div id='common_app_dialogues_message_buttons'>
                                            ${props.message_type=='CONFIRM'?
                                                `<div id='common_app_dialogues_message_cancel' class='common_app_dialogues_button common_link common_icon_button' >${props.icons.cancel}</div>`:''
                                            }
                                            ${props.message_type!='PROGRESS'?
                                                `<div id='common_app_dialogues_message_close' class='common_app_dialogues_button common_link common_icon_button' >${props.icons.close}</div>`:''
                                            }
                                        </div>`:
                                        '';
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      globals:common['server']['app']['commonGlobals']
*                      },
*          methods:    {
*                      COMMON:common['CommonModuleCommon']
*                      }}} props
*      }} props 
* @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
*                      data:   null,
*                      methods:{
*                               getTemplateMessage:getTemplateMessage,
*                               getTemplateLoading:getTemplateLoading
*                               },
*                      events:null,
*                      template:string}>}
*/
const component = async props =>{
    //set globals
    props.methods.COMMON.commonGlobals(props.data.globals);
    //set current app id
    props.methods.COMMON.commonGlobalSet({  key:'Data', 
                                            subkey:'UserApp', 
                                            name:'app_id', 
                                            value: props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id});
    props.methods.COMMON.commonUserPreferencesGlobalSetDefault('LOCALE');
    props.methods.COMMON.commonUserPreferencesGlobalSetDefault('TIMEZONE');
    props.methods.COMMON.commonUserPreferencesGlobalSetDefault('DIRECTION');
    props.methods.COMMON.commonUserPreferencesGlobalSetDefault('ARABIC_SCRIPT');
    const COMMON_TEMPLATE_PARAMETERS = {
                                        app_toolbar_button_start:           props.methods.COMMON.commonGlobalGet('Parameters').app_toolbar_button_start,
                                        app_toolbar_button_framework:       props.methods.COMMON.commonGlobalGet('Parameters').app_toolbar_button_framework,
                                        app_framework:                      props.methods.COMMON.commonGlobalGet('Parameters').app_framework,
                                        icons : {   home: props.methods.COMMON.commonGlobalGet('ICONS').home,
                                                    framework_js: props.methods.COMMON.commonGlobalGet('ICONS').framework_js,
                                                    framework_vue: props.methods.COMMON.commonGlobalGet('ICONS').framework_vue,
                                                    framework_react: props.methods.COMMON.commonGlobalGet('ICONS').framework_react,
                                                    user: props.methods.COMMON.commonGlobalGet('ICONS').user,
                                                    search: props.methods.COMMON.commonGlobalGet('ICONS').search,
                                                    user_profile_stat: props.methods.COMMON.commonGlobalGet('ICONS').user_profile_stat,
                                                    email: props.methods.COMMON.commonGlobalGet('ICONS').email,
                                                    close:props.methods.COMMON.commonGlobalGet('ICONS')['ok'],
                                                    cancel:props.methods.COMMON.commonGlobalGet('ICONS')['cancel'],
                                                    message_text:props.methods.COMMON.commonGlobalGet('ICONS')['message_text'],
                                                    message_success:props.methods.COMMON.commonGlobalGet('ICONS')['message_success'],
                                                    message_fail:props.methods.COMMON.commonGlobalGet('ICONS')['message_fail'],
                                                    message_confirm:props.methods.COMMON.commonGlobalGet('ICONS')['question']
                                                }
                                    };
    /**
     * @name commonEventCopyPasteCutDisable
     * @description Disable copy cut paste
     * @function
     * @param {common['CommonAppEvent']} event 
     * @returns {void}
     */
    const commonEventCopyPasteCutDisable = event => {
        if (commonTextEditingDisabled()){
            if(event.target.nodeName !='SELECT'){
                event.preventDefault();
                event.target.focus();
            }
        }
        else{
            if (event.type=='paste'){
                event.preventDefault();
                event.target.textContent = event.clipboardData.getData('Text');
            }
        }
    };
    /**
     * @name commonEventInputDisable
     * @description Disable common input textediting
     * @function
     * @param {common['CommonAppEvent']} event 
     * @returns {void}
     */
    const commonEventInputDisable = event => {
        if (commonTextEditingDisabled())
            if (event.target.classList.contains('common_input')){
                event.preventDefault();
                event.target.focus();
            }
    };
    /**
     * @name commonTextEditingDisabled
     * @description Check if textediting is disabled
     * @function
     * @returns {boolean}
     */
    const commonTextEditingDisabled = () =>props.methods.COMMON.commonGetApp().TextEdit=='0';
    /**
     * @name getTemplateMessage
     * @description Get template message
     * @function
     * @param {{message:                    string,
     *          message_type:               string,
     *          message_title_font_class:   string|null,
     *          message_title_icon_class:   'message_text'|'message_success'|'message_fail'|null}} parameters
     * @returns {string}
     */
    const getTemplateMessage = parameters => template({ current:'MESSAGE',
                                                        ...parameters,
                                                        ...COMMON_TEMPLATE_PARAMETERS })
    /**
     * @name getTemplateLoading
     * @description Get template loading
     * @function
     * @returns {string}
     */
    const getTemplateLoading = () => template({current:'LOADING',  
                                                ...COMMON_TEMPLATE_PARAMETERS})

    
    /**
     * @name events
     * @descption Central event delegation on app root
     *            order of events: 1 common, 2 module, 3 app 
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']|null} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        if (event==null){
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.methods.COMMON.commonGlobalGet('Parameters').app_root}`).addEventListener(event_type, (/**@type{common['CommonAppEvent']}*/event) => {
                events(event_type, event);
            });
        }
        else{
            const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
            //1 common events
            //uses IIFE and waits until finished
            await (async ()=>{
                switch (event_type){
                    case 'click':{
                        if (event.target.classList.contains('common_switch')){
                            if (event.target.classList.contains('checked'))
                                event.target.classList.remove('checked');
                            else
                                event.target.classList.add('checked');
                        }
                        else{
                            switch(event_target_id){
                                case 'common_app_profile_search_icon':{
                                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_profile_search_input').focus();
                                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_profile_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                                    break;
                                }
                                /**Dialogue message */
                                case 'common_app_dialogues_message_close':{
                                    if (props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_message_close')['data-function'])
                                        await props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_message_close')['data-function']();
                                    break;
                                }
                                case 'common_app_dialogues_message_cancel':{
                                    props.methods.COMMON.commonComponentRemove('common_app_dialogues_message');
                                    break;
                                }
                                /* Dialogue user menu*/
                                case 'common_app_iam_user_menu':
                                case 'common_app_iam_user_menu_logged_in':
                                case 'common_app_iam_user_menu_avatar':
                                case 'common_app_iam_user_menu_avatar_img':
                                case 'common_app_iam_user_menu_logged_out':
                                case 'common_app_iam_user_menu_default_avatar':{
                                    await props.methods.COMMON.commonComponentRender({
                                        mountDiv:   'common_app_dialogues_user_menu',
                                        data:       null,
                                        methods:    null,
                                        path:       '/common/component/common_app_dialogues_user_menu.js'});
                                    break;
                                }
                                //dialogue button stat
                                case 'common_app_profile_toolbar_stat':{
                                    await props.methods.COMMON.commonProfileStat(1, null);
                                    break;
                                }
                                // common app toolbar
                                case 'common_app_toolbar_start':{
                                    props.methods.COMMON.commonAppSwitch(props.methods.COMMON.commonGlobalGet('Parameters').app_start_app_id);
                                    break;
                                }
                                case 'common_app_toolbar_framework_js':
                                case 'common_app_toolbar_framework_vue':
                                case 'common_app_toolbar_framework_react':{
                                    props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('#common_app_toolbar .common_toolbar_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_toolbar_selected'));
                                    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_toolbar_selected');
                                    if (event_target_id=='common_app_toolbar_framework_js')
                                        await props.methods.COMMON.commonFrameworkSwitch(1);
                                    if (event_target_id=='common_app_toolbar_framework_vue')
                                        await props.methods.COMMON.commonFrameworkSwitch(2);
                                    if (event_target_id=='common_app_toolbar_framework_react')
                                        await props.methods.COMMON.commonFrameworkSwitch(3);
                                    break;
                                }
                            }
                        }
                        break;
                    }
                    case 'keydown':{
                        if (event.code=='Enter')
                            event.preventDefault();
                        if (commonTextEditingDisabled() &&
                            event.target.classList.contains('common_input') && 
                                (event.code=='' || event.code=='Enter' || event.altKey == true || event.ctrlKey == true || 
                                (event.shiftKey ==true && (event.code=='ArrowLeft' || 
                                                            event.code=='ArrowRight' || 
                                                            event.code=='ArrowUp' || 
                                                            event.code=='ArrowDown'|| 
                                                            event.code=='Home'|| 
                                                            event.code=='End'|| 
                                                            event.code=='PageUp'|| 
                                                            event.code=='PageDown') ) )
                            ){
                                event.preventDefault();
                        }
                        break;                
                    }
                    case 'keyup':{
                        if (event.target.classList.contains('common_password')){   
                            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event.target.id}_mask`).textContent = 
                                event.target.textContent.replace(event.target.textContent, '*'.repeat(props.methods.COMMON.commonMiscLengthWithoutDiacrites(event.target.textContent)));
                        }
                        else
                            switch (event.target.id){
                                case 'common_app_profile_search_input':{
                                    props.methods.COMMON.commonMiscListKeyEvent({event:event,
                                                            event_function:props.methods.COMMON.commonProfileSearch,
                                                            event_parameters:null,
                                                            rows_element:'common_app_profile_search_list',
                                                            search_input:'common_app_profile_search_input'});
                                    break;
                                }
                            }
                        break;
                    }
                    case 'mousedown':{
                        //common event only
                        commonEventCopyPasteCutDisable(event);
                        break;
                    }
                    case 'touchstart':{
                        //common event only
                        commonEventInputDisable(event);
                        break;
                    }
                    case 'copy':{
                        //common event only
                        commonEventCopyPasteCutDisable(event);
                        break;
                    }
                    case 'paste':{
                        //common event only
                        commonEventCopyPasteCutDisable(event);
                        break;
                    }
                    case 'cut':{
                        //common event only
                        commonEventCopyPasteCutDisable(event);
                        break;
                    }
                    default:{
                        break;
                    }
                }
            })();
            //2 component events
            //fire component events defined in each component in COMMON_GLOBAL.Functions.component[component].events key
            //component events should be for component elements, use app events to add addional functionality after common event and component events
            for (const component of Object.values(props.methods.COMMON.commonGlobalGet('Functions').component))
                component.events?
                    await component.events(event_type, event):
                        null;
            //3 app events
            props.methods.COMMON.commonGlobalGet('Functions').app_metadata.events[event_type]?await props.methods.COMMON.commonGlobalGet('Functions').app_metadata.events[event_type](event):null;
        }
    }
    const onMounted = async ()=>{
        //apply common css
        props.methods.COMMON.commonMiscCssApply();
        
    
        props.methods.COMMON.commonCustomFramework();
        //set common app id
        props.methods.COMMON.commonGlobalSet({key:'Data', subkey:'UserApp', name:'app_id', value:props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id});
        
        //connect to BFF
        props.methods.COMMON.commonFFB({path:               '/server-bff/' + props.methods.COMMON.commonGlobalGet('Functions').x.uuid, 
            method:             'POST',
            body:               null,
            response_type:      'SSE',
            authorization_type: 'APP_ID'});
        //Set event delegation
        //App events are not supported on other frameworks
        //All events are managed in event delegation
        //call event function to add listeners using null parameter
        events('click', null);
        events('change', null);
        events('focusin', null);
        events('input', null);
        events('keydown', null);
        events('keyup', null);
        events('mousedown', null);
        events('mouseup', null);
        events('mousemove', null);
        events('mouseleave', null);
        events('wheel', null);
    
        events('touchstart', null);
        events('touchend', null);
        events('touchcancel', null);
        events('touchmove', null);
    
        //common only security events
        events('copy', null);
        events('paste', null);
        events('cut', null);
        //mount start app
        await props.methods.COMMON.commonAppSwitch(props.methods.COMMON.commonGlobalGet('Parameters').app_start_app_id);
        //replace old head wtith start styles and start script with new content
        props.methods.COMMON.COMMON_DOCUMENT.head.innerHTML = ` <meta charset='UTF-8'>
                                        <title></title>
                                        <meta name='viewport' content='width=device-width, minimum-scale=1.0, maximum-scale = 1'>`;
        
    }
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {
                    getTemplateMessage:getTemplateMessage,
                    getTemplateLoading:getTemplateLoading
                    },
        events:     null,
        template:   template({  current: 'START',
                                ...COMMON_TEMPLATE_PARAMETERS
                            })
    };
};
export default component;