/**
 * Displays user menu
 * @module apps/common/component/common_dialogue_user_menu
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 * @typedef {CommonModuleCommon['commonComponentRender']} commonComponentRender
 * @typedef {CommonModuleCommon['commonMiscSelectCurrentValueSet']} commonMiscSelectCurrentValueSet
 * @typedef {CommonModuleCommon['commonUserSessionCountdown']} commonUserSessionCountdown
 * @typedef {CommonModuleCommon['commonMessageShow']} commonMessageShow
 */

/**
 * 
 * @param {{app_id:number,
 *          common_app_id:number,
 *          user_account_id:number|null,
 *          username:string,
 *          admin:string,
 *          countdown:0|1,
 *          function_is_provider_user:function}} props 
 * @returns {string}
 */
const template = props =>`  ${props.app_id == props.common_app_id?
                                `<div id='common_dialogue_user_menu_admin'>${props.admin ?? ''}</div>`:
                                `${props.username?
                                    `<div id='common_dialogue_user_menu_username'>${props.username}</div>`:
                                    ''
                                }`
                            }
                            ${props.countdown==1?
                                `<div id='common_dialogue_user_menu_token_countdown'>
                                    <div id='common_dialogue_user_menu_token_countdown_time'></div>
                                </div>`:''
                            }
                            <div id='common_dialogue_user_menu_app_theme'></div>
                            <div id='common_dialogue_user_menu_preferences'>
                                <div id='common_dialogue_user_menu_preference_locale' class='common_dialogue_user_menu_preference_col1 common_icon'></div>
                                <div class='common_dialogue_user_menu_preference_col2'>
                                    <div id='common_dialogue_user_menu_user_locale_select'></div>
                                </div>
                                <div id='common_dialogue_user_menu_preference_timezone' class='common_dialogue_user_menu_preference_col1 common_icon'></div>
                                <div class='common_dialogue_user_menu_preference_col2'>
                                    <div id='common_dialogue_user_menu_user_timezone_select'></div>
                                </div>
                                <div id='common_dialogue_user_menu_preference_direction' class='common_dialogue_user_menu_preference_col1 common_icon'></div>
                                <div class='common_dialogue_user_menu_preference_col2'>
                                    <div id='common_dialogue_user_menu_user_direction_select'></div>
                                </div>
                                <div id='common_dialogue_user_menu_preference_arabic_script' class='common_dialogue_user_menu_preference_col1 common_icon'></div>
                                <div class='common_dialogue_user_menu_preference_col2'>
                                    <div id='common_dialogue_user_menu_user_arabic_script_select'></div>
                                </div>
                            </div>
                            ${props.app_id == props.common_app_id || props.username || (props.user_account_id!=null && props.function_is_provider_user())?
                                `<div id='common_dialogue_user_menu_logged_in'>
                                    <div id='common_dialogue_user_menu_edit' class='common_icon'></div>
                                    ${props.app_id == props.common_app_id?
                                        '':
                                        '<div id=\'common_dialogue_user_menu_log_out\' class=\'common_icon\'></div>'
                                    }
                                </div>`:
                                `${props.app_id == props.common_app_id?'':
                                    `<div id='common_dialogue_user_menu_logged_out'>
                                        <div id='common_dialogue_user_menu_signup' class='common_icon'></div>
                                        <div id='common_dialogue_user_menu_log_in' class='common_icon'></div>
                                    </div>`
                                }`
                            }
                            <div id='common_dialogue_user_menu_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * div common_dialogue_user_menu_app_theme used to show optional component app_theme.js
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number,
 *                      user_account_id:number,
 *                      common_app_id:number,
 *                      data_app_id:number,
 *                      username:string,
 *                      token_exp:number|null,
 *                      token_iat:number|null,
 *                      token_timestamp:number|null,
 *                      admin:string,
 *                      admin_only:number,
 *                      user_locale:string,
 *                      user_timezone:string,
 *                      user_direction:string,
 *                      user_arabic_script:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonMiscSelectCurrentValueSet:commonMiscSelectCurrentValueSet,
 *                      commonFFB:commonFFB,
 *                      commonComponentRender:commonComponentRender,
 *                      commonUserSessionCountdown:commonUserSessionCountdown,
 *                      commonMessageShow:commonMessageShow
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show1');
    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    //Fetch settings with direction, timezone and arabic script
    /**@type{{id:number, app_setting_type_name:string, value:string, display_data:string}[]} */
    const settings = props.data.admin_only == 1?[]:await props.methods.commonFFB({path:'/server-db/app_settings_display', query:`data_app_id=${props.data.data_app_id}`, method:'GET', authorization_type:'APP_DATA'})
                                                                .then((/**@type{string}*/result)=>JSON.parse(result).rows);

    const user = (props.data.username || props.data.user_account_id!=null)?await props.methods.commonFFB({path:`/server-db/user_account/${props.data.user_account_id ?? ''}`, method:'GET', authorization_type:'APP_ACCESS'})
                                                                .then((/**@type{string}*/result)=>JSON.parse(result))
                                                                .catch((/**@type{Error}*/error)=>{throw error;}):null;
    /**@type{{locale:string, text:string}[]} */
    const locales = await props.methods.commonFFB({
                                                    path:'/app-module-function/COMMON_LOCALE', 
                                                    query:`lang_code=${props.data.user_locale}`, 
                                                    method:'POST', authorization_type:'APP_DATA',
                                                    body:{data_app_id : props.data.common_app_id}
                                                })
                                                .then((/**@type{string}*/result)=>JSON.parse(result).rows);
    const is_provider_user = () =>{
        if (props.data.user_account_id == parseInt(user.id))
            return user.identity_provider_id!=null;
        else {
            //User not found
            props.methods.commonMessageShow('ERROR', '20305', null, null, null, props.data.common_app_id);
            return null;
        }
    };
    
    const onMounted = async () =>{                                                               
        
        //mount select
        //Locale, no db access
        await props.methods.commonComponentRender({
            mountDiv:   'common_dialogue_user_menu_user_locale_select', 
            data:       {
                        default_data_value:props.data.user_locale,
                        default_value:'',
                        options: locales,
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'locale',
                        column_text:'text'
                        },
            methods:    {commonFFB:props.methods.commonFFB},
            path:       '/common/component/common_select.js'});
        if (props.data.admin_only!=1){
            //db access
            //Timezone
            await props.methods.commonComponentRender({
                mountDiv:  'common_dialogue_user_menu_user_timezone_select', 
                data:       {
                            default_data_value:props.data.user_timezone,
                            default_value:'',
                            options: settings.filter(setting=>setting.app_setting_type_name=='TIMEZONE'),
                            path:null,
                            query:null,
                            method:null,
                            authorization_type:null,
                            column_value:'value',
                            column_text:'display_data'
                            },
                methods:    {commonFFB:props.methods.commonFFB},
                path:'/common/component/common_select.js'});
            //Direction with default ' '
            await props.methods.commonComponentRender({
                mountDiv:   'common_dialogue_user_menu_user_direction_select', 
                data:       {
                            default_data_value:props.data.user_direction,
                            default_value:' ',
                            options: [{value:'', display_data:' '}].concat(settings.filter(setting=>setting.app_setting_type_name=='DIRECTION')),
                            path:null,
                            query:null,
                            method:null,
                            authorization_type:null,
                            column_value:'value',
                            column_text:'display_data'
                            },
                methods:    {commonFFB:props.methods.commonFFB},
                path:       '/common/component/common_select.js'});   
            //Arabic script with default ' '
            await props.methods.commonComponentRender({
                mountDiv:   'common_dialogue_user_menu_user_arabic_script_select', 
                data:       {
                            default_data_value:props.data.user_arabic_script,
                            default_value:' ',
                            options: [{value:'', display_data:' '}].concat(settings.filter(setting=>setting.app_setting_type_name=='ARABIC_SCRIPT')),
                            path:null,
                            query:null,
                            method:null,
                            authorization_type:null,
                            column_value:'value',
                            column_text:'display_data'
                            },
                methods:    {commonFFB:props.methods.commonFFB},
                path:       '/common/component/common_select.js'});
        }
        //set current value on all the selects
        props.methods.commonMiscSelectCurrentValueSet('common_dialogue_user_menu_user_locale_select', props.data.user_locale);
        if ((props.data.admin_only == 1)==false){
            props.methods.commonMiscSelectCurrentValueSet('common_dialogue_user_menu_user_timezone_select', props.data.user_timezone);
            props.methods.commonMiscSelectCurrentValueSet('common_dialogue_user_menu_user_direction_select', props.data.user_direction ?? '');
            props.methods.commonMiscSelectCurrentValueSet('common_dialogue_user_menu_user_arabic_script_select', props.data.user_arabic_script ?? '');
        }
        if (props.data.token_exp && props.data.token_iat){
            const element_id = 'common_dialogue_user_menu_token_countdown_time';
            props.methods.commonUserSessionCountdown(props.methods.COMMON_DOCUMENT.querySelector(`#${element_id}`), props.data.token_exp);
        }   
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({  app_id:props.data.app_id,
                                common_app_id:props.data.common_app_id,
                                user_account_id:props.data.user_account_id,
                                username:props.data.username,
                                admin:props.data.admin,
                                countdown:(props.data.token_exp && props.data.token_iat)?1:0,
                                function_is_provider_user:is_provider_user
                            })
    };
};
export default component;