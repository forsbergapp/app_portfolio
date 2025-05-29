/**
 * Displays user menu
 * @module apps/common/component/common_dialogue_user_menu
 */

/**
 * @import {CommonIAMUser, CommonMessageType, CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle,
 *          MessageQueuePublishMessage, }  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_id:number,
 *          admin_app_id:number,
 *          iam_user_id:number|null,
 *          iam_user_username:string|null,
 *          countdown:0|1}} props 
 * @returns {string}
 */
const template = props =>`  <div id='common_dialogue_user_menu_content' ${props.iam_user_id==null?'':'class=\'common_dialogue_user_menu_connected\''}>
                                ${props.app_id == props.admin_app_id?
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
                                ${props.iam_user_id?
                                    `<div id='common_dialogue_user_menu_nav'>
                                        <div id='common_dialogue_user_menu_nav_messages' class='common_nav_selected common_icon'><div id='common_dialogue_user_menu_nav_messages_count'></div></div>
                                        <div id='common_dialogue_user_menu_nav_iam_user_app' class='common_icon'></div>
                                        <div id='common_dialogue_user_menu_nav_iam_user' class='common_icon'></div>
                                    </div>`:''
                                }
                                <div id='common_dialogue_user_menu_detail'>
                                </div>
                                ${(props.app_id == props.admin_app_id) || props.iam_user_username ?
                                    `<div id='common_dialogue_user_menu_logged_in'>
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
                                <div id='common_dialogue_user_menu_close' class='common_dialogue_button common_icon' ></div>
                            </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      app_id:number,
*                      iam_user_id:number|null,
*                      iam_user_username:string|null,
*                      common_app_id:number,
*                      admin_app_id:number,
*                      token_exp:number|null,
*                      token_iat:number|null,
*                      admin_only:number,
*                      user_locale:string,
*                      user_timezone:string,
*                      user_direction:string,
*                      user_arabic_script:string},
*          methods:    {
*                      COMMON_DOCUMENT:COMMON_DOCUMENT,
*                      commonMiscFormatJsonDate:CommonModuleCommon['commonMiscFormatJsonDate'],
*                      commonMiscSelectCurrentValueSet:CommonModuleCommon['commonMiscSelectCurrentValueSet'],
*                      commonWindowFromBase64:CommonModuleCommon['commonWindowFromBase64'],
*                      commonFFB:CommonModuleCommon['commonFFB'],
*                      commonComponentRender:CommonModuleCommon['commonComponentRender'],
*                      commonUserSessionCountdown:CommonModuleCommon['commonUserSessionCountdown'],
*                      commonMessageShow:CommonModuleCommon['commonMessageShow'],
*                      commonMesssageNotAuthorized:CommonModuleCommon['commonMesssageNotAuthorized'],
*                      commonUserMessageShowStat:CommonModuleCommon['commonUserMessageShowStat']
*                      }}} props
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:   null,
*                      methods:{eventClickPagination:       Function,
*                               eventClickMessage:          Function,
*                               eventClickMessageDelete:    Function,
*                               eventClickNavMessages:      Function, 
*                               eventClickNavIamUser:       Function,
*                               eventClickNavIamUserApp:    Function},
*                      template:string}>}
*/
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show1');
    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    /**
     * @description page navigation for messages
     * @param {HTMLElement} element
     * @returns {Promise.<void>}
     */
    let eventClickPaginationMessages = async element =>{element;};

    /**
     * @description page navigation for messages
     * @param {HTMLElement} element
     * @returns {Promise.<void>}
     */
    const eventClickPagination = async element => eventClickPaginationMessages(element);

    /**
     * @description read a message
     * @param {HTMLElement} element
     * @returns {Promise.<void>}
     */
    const eventClickMessage = async element =>{
        const message_id = element.getAttribute('data-id');
        element.classList.remove('common_dialogue_user_menu_messages_row_unread');
        element.classList.add('common_dialogue_user_menu_messages_row_read');

        /**@type{CommonMessageType & {created:MessageQueuePublishMessage['created'], username:CommonIAMUser['username']}} */
        const message = {sender:element.getAttribute('data-sender')==''?null:element.getAttribute('data-sender'),
                         receiver_id:Number(element.getAttribute('data-receiver_id')),
                         username:props.data.iam_user_username ??'',
                         host:element.getAttribute('data-host')??'',
                         client_ip:element.getAttribute('data-client_ip')??'',
                         subject:element.getAttribute('data-subject')??'',
                         message:element.getAttribute('data-message')??'',
                         created:element.getAttribute('data-created')??''
                        };
        
        //show message detail
        await props.methods.commonComponentRender({
            mountDiv:   'common_dialogue_user_menu_message_content',
            data:       {
                            app_id:props.data.app_id,
                            message:message
                        },
            methods:    {
                        commonMiscFormatJsonDate:props.methods.commonMiscFormatJsonDate
                        },
            path:       '/common/component/common_dialogue_user_menu_message.js'});

        await props.methods.commonFFB({ path:'/app-common-module/COMMON_MESSAGE_READ', 
                method:'POST', 
                body:{  type:'FUNCTION', 
                        IAM_iam_user_id:props.data.iam_user_id,
                        IAM_data_app_id:props.data.common_app_id,
                        message_id:message_id},
                authorization_type:'APP_ACCESS'});
        props.methods.commonUserMessageShowStat();
    };
    /**
     * @description read a message
     * @param {HTMLElement} element
     * @returns {Promise.<void>}
     */
    const eventClickMessageDelete = async element =>{
        await props.methods.commonFFB({ path:'/app-common-module/COMMON_MESSAGE_DELETE', 
                method:'POST', 
                body:{  type:'FUNCTION', 
                        IAM_iam_user_id:props.data.iam_user_id,
                        IAM_data_app_id:props.data.common_app_id,
                        message_id:element.getAttribute('data-id')},
                authorization_type:'APP_ACCESS'});
        await eventClickNavMessages();
        props.methods.commonUserMessageShowStat();
    };
        
    /**
     * @description show messages
     * @returns {Promise.<void>}
     */
    const eventClickNavMessages = async ()=>{
        await props.methods.commonComponentRender({
            mountDiv:   'common_dialogue_user_menu_detail', 
            data:       {
                            app_id:props.data.app_id,
                            iam_user_id:props.data.iam_user_id,
                            common_app_id:props.data.common_app_id,
                            admin_app_id:props.data.admin_app_id
                        },
            methods:    {
                        commonFFB:props.methods.commonFFB,
                        commonUserMessageShowStat:props.methods.commonUserMessageShowStat,
                        commonComponentRender:props.methods.commonComponentRender,
                        commonMiscFormatJsonDate:props.methods.commonMiscFormatJsonDate
                        },
            path:       '/common/component/common_dialogue_user_menu_messages.js'})
            .then(result=>eventClickPaginationMessages = result.methods.eventClickPagination);
    };
    /**
     * @description show iam user
     * @returns {Promise.<void>}
     */
    const eventClickNavIamUser = async () =>{
        await props.methods.commonComponentRender({
            mountDiv:   'common_dialogue_user_menu_detail',
            data:       {
                            app_id:props.data.app_id,
                            iam_user_id:props.data.iam_user_id,
                            admin_app_id:props.data.admin_app_id
                        },
            methods:    {
                        commonFFB:props.methods.commonFFB,
                        commonMessageShow:props.methods.commonMessageShow,
                        commonMesssageNotAuthorized:props.methods.commonMesssageNotAuthorized,
                        commonMiscFormatJsonDate:props.methods.commonMiscFormatJsonDate
                        },
            path:       '/common/component/common_dialogue_user_menu_iam_user.js'});
    };
    /**
     * @description show iam user app
     * @param {string} user_locale,
     * @param {string} user_timezone,
     * @param {string} user_direction,
     * @param {string} user_arabic_script
     * @returns {Promise.<void>}
     */
    const eventClickNavIamUserApp = async (user_locale,
                                        user_timezone,
                                        user_direction,
                                        user_arabic_script) =>{
        await props.methods.commonComponentRender({
            mountDiv:   'common_dialogue_user_menu_detail',
            data:       {
                            app_id:props.data.app_id,
                            iam_user_id:props.data.iam_user_id,
                            common_app_id:props.data.common_app_id,
                            admin_app_id:props.data.admin_app_id,
                            admin_only:props.data.admin_only,
                            user_locale:user_locale,
                            user_timezone:user_timezone,
                            user_direction:user_direction,
                            user_arabic_script:user_arabic_script
                        },
            methods:    {
                        commonMiscSelectCurrentValueSet:props.methods.commonMiscSelectCurrentValueSet,
                        commonWindowFromBase64:props.methods.commonWindowFromBase64,
                        commonFFB:props.methods.commonFFB,
                        commonComponentRender:props.methods.commonComponentRender
                        },
            path:       '/common/component/common_dialogue_user_menu_iam_user_app.js'});
    };
    const onMounted = async () =>{
        if (props.data.iam_user_id){
            //mount messages
            await eventClickNavMessages();
        }
        else{
            //mount iam_user_app
            await eventClickNavIamUserApp( props.data.user_locale,
                                        props.data.user_timezone,
                                        props.data.user_direction,
                                        props.data.user_arabic_script);
        }
        
        if (props.data.token_exp && props.data.token_iat){
            const element_id = 'common_dialogue_user_menu_token_countdown_time';
            props.methods.commonUserSessionCountdown(props.methods.COMMON_DOCUMENT.querySelector(`#${element_id}`), props.data.token_exp);
        }   
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {
                    eventClickPagination:       eventClickPagination,
                    eventClickMessage:          eventClickMessage,
                    eventClickMessageDelete:    eventClickMessageDelete,
                    eventClickNavMessages:      eventClickNavMessages, 
                    eventClickNavIamUser:       eventClickNavIamUser,
                    eventClickNavIamUserApp:    eventClickNavIamUserApp
                    },
        template:   template({  app_id:props.data.app_id,
                                admin_app_id:props.data.admin_app_id,
                                iam_user_id:props.data.iam_user_id,
                                iam_user_username:props.data.iam_user_username,
                                countdown:(props.data.token_exp && props.data.token_iat)?1:0
                            })
    };
};
export default component;