/**
 * Displays user menu
 * @module apps/common/component/common_dialogue_user_menu
 */

/**
 * @import {CommonAppDataRecord, CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_id:number,
 *          admin_app_id:number,
 *          iam_user_username:string|null,
 *          countdown:0|1}} props 
 * @returns {string}
 */
const template = props =>`  ${props.app_id == props.admin_app_id?
                                `<div id='common_dialogue_user_menu_admin'>${props.iam_user_username ?? ''}</div>`:
                                `${props.iam_user_username?
                                    `<div id='common_dialogue_user_menu_username'>${props.iam_user_username}</div>`:
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
                            ${(props.app_id == props.admin_app_id) || props.iam_user_username ?
                                `<div id='common_dialogue_user_menu_logged_in'>
                                    <div id='common_dialogue_user_menu_edit' class='common_icon'></div>
                                    ${props.app_id == props.admin_app_id?
                                        '':
                                        '<div id=\'common_dialogue_user_menu_log_out\' class=\'common_icon\'></div>'
                                    }
                                </div>`:
                                `${props.app_id == props.admin_app_id?'':
                                    `<div id='common_dialogue_user_menu_logged_out'>
                                        <div id='common_dialogue_user_menu_signup' class='common_icon'></div>
                                        <div id='common_dialogue_user_menu_log_in' class='common_icon'></div>
                                    </div>`
                                }`
                            }
                            <div id='common_dialogue_user_menu_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number,
 *                      iam_user_username:string|null,
 *                      common_app_id:number,
 *                      admin_app_id:number,
 *                      username:string,
 *                      token_exp:number|null,
 *                      token_iat:number|null,
 *                      token_timestamp:number|null,
 *                      admin_only:number,
 *                      user_locale:string,
 *                      user_timezone:string,
 *                      user_direction:string,
 *                      user_arabic_script:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonMiscSelectCurrentValueSet:CommonModuleCommon['commonMiscSelectCurrentValueSet'],
 *                      commonWindowFromBase64:CommonModuleCommon['commonWindowFromBase64'],
 *                      commonFFB:CommonModuleCommon['commonFFB'],
 *                      commonComponentRender:CommonModuleCommon['commonComponentRender'],
 *                      commonUserSessionCountdown:CommonModuleCommon['commonUserSessionCountdown'],
 *                      commonMessageShow:CommonModuleCommon['commonMessageShow'],
 *                      commonMesssageNotAuthorized:CommonModuleCommon['commonMesssageNotAuthorized']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show1');
    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    //fetch all settings for common app id
    /**@type{CommonAppDataRecord[]} */
    const settings = props.data.admin_only == 1?[]:await props.methods.commonFFB({  path:'/server-db/appdata/', 
                                                                                    query:`IAM_data_app_id=${props.data.common_app_id}`, 
                                                                                    method:'GET', 
                                                                                    authorization_type:'APP_ID'})
                                                                .then((/**@type{string}*/result)=>JSON.parse(props.methods.commonWindowFromBase64(JSON.parse(result).rows[0].data)));

    /**@type{{locale:string, text:string}[]} */
    const locales = await props.methods.commonFFB({
                                                    path:'/appmodule/COMMON_LOCALE', 
                                                    query:`locale=${props.data.user_locale}`, 
                                                    method:'POST', authorization_type:'APP_ID',
                                                    body:{type:'FUNCTION',IAM_data_app_id : props.data.common_app_id}
                                                })
                                                .then((/**@type{string}*/result)=>JSON.parse(props.methods.commonWindowFromBase64(JSON.parse(result).rows[0].data)));
    const onMounted = async () =>{                                                               
        
        //mount select
        //Locale
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
            //Timezone
            await props.methods.commonComponentRender({
                mountDiv:  'common_dialogue_user_menu_user_timezone_select', 
                data:       {
                            default_data_value:props.data.user_timezone,
                            default_value:'',
                            options: settings.filter(setting=>setting.name=='TIMEZONE'),
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
                            options: [{value:'', display_data:' '}].concat(settings.filter(setting=>setting.name=='DIRECTION')),
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
                            options: [{value:'', display_data:' '}].concat(settings.filter(setting=>setting.name=='ARABIC_SCRIPT')),
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
                                admin_app_id:props.data.admin_app_id,
                                iam_user_username:props.data.iam_user_username,
                                countdown:(props.data.token_exp && props.data.token_iat)?1:0
                            })
    };
};
export default component;