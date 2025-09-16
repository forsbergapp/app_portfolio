/**
 * Displays user menu
 * @module apps/common/component/common_app_dialogues_user_menu
 */

/**
 * @import {common}  from '../../../common_types.js'
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
const template = props =>`  <div id='common_app_dialogues_user_menu_content' ${props.iam_user_id==null?'':'class=\'common_app_dialogues_user_menu_connected\''}>
                                ${props.app_id == props.admin_app_id?
                                `<div id='common_app_dialogues_user_menu_admin'>${props.iam_user_username ?? ''}</div>`:
                                `${props.iam_user_username?
                                    `<div id='common_app_dialogues_user_menu_username'>${props.iam_user_username}</div>`:
                                    ''
                                }`
                                }
                                ${props.countdown==1?
                                    `<div id='common_app_dialogues_user_menu_token_countdown'>
                                        <div id='common_app_dialogues_user_menu_token_countdown_time'></div>
                                    </div>`:''
                                }
                                ${props.iam_user_id?
                                    `<div id='common_app_dialogues_user_menu_nav'>
                                        <div id='common_app_dialogues_user_menu_nav_messages' class='common_nav_selected common_icon'>
                                            <div id='common_app_dialogues_user_menu_nav_messages_count'></div>
                                        </div>
                                        <div id='common_app_dialogues_user_menu_nav_iam_user_app' class='common_icon'></div>
                                        <div id='common_app_dialogues_user_menu_nav_iam_user' class='common_icon'></div>
                                    </div>`:''
                                }
                                <div id='common_app_dialogues_user_menu_detail'>
                                </div>
                                ${(props.app_id == props.admin_app_id) || props.iam_user_username ?
                                    `<div id='common_app_dialogues_user_menu_logged_in'>
                                        ${props.app_id == props.admin_app_id?
                                            '':
                                            '<div id=\'common_app_dialogues_user_menu_log_out\' class=\'common_icon\'></div>'
                                        }
                                    </div>`:
                                    `${props.app_id == props.admin_app_id?'':
                                        `<div id='common_app_dialogues_user_menu_logged_out'>
                                            <div id='common_app_dialogues_user_menu_signup' class='common_icon'></div>
                                            <div id='common_app_dialogues_user_menu_log_in' class='common_icon'></div>
                                        </div>`
                                    }`
                                }
                                <div id='common_app_dialogues_user_menu_close' class='common_app_dialogues_button common_icon' ></div>
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
*                      COMMON:common['CommonModuleCommon']
*                      }}} props
* @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
*                      data:   null,
*                      methods:{eventClickPagination:       Function,
*                               eventClickMessage:          Function,
*                               eventClickMessageDelete:    Function},
*                      events:  common['commonComponentEvents'],
*                      template:string}>}
*/
const component = async props => {
    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_app_dialogues_show1');
    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues').classList.add('common_app_dialogues_modal');

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
        element.classList.remove('common_app_dialogues_user_menu_messages_row_unread');
        element.classList.add('common_app_dialogues_user_menu_messages_row_read');

        /**@type{common['CommonMessageType'] & {created:common['MessageQueuePublishMessage']['created'], username:common['CommonIAMUser']['username']}} */
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
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'common_app_dialogues_user_menu_message_content',
            data:       {
                            app_id:props.data.app_id,
                            message:message
                        },
            methods:    null,
            path:       '/common/component/common_app_dialogues_user_menu_message.js'});

        await props.methods.COMMON.commonFFB({ path:'/app-common-module/COMMON_MESSAGE_READ', 
                method:'POST', 
                body:{  type:'FUNCTION', 
                        IAM_iam_user_id:props.data.iam_user_id,
                        IAM_data_app_id:props.data.common_app_id,
                        message_id:message_id},
                authorization_type:'APP_ACCESS'});
        props.methods.COMMON.commonUserMessageShowStat();
    };
    /**
     * @description read a message
     * @param {HTMLElement} element
     * @returns {Promise.<void>}
     */
    const eventClickMessageDelete = async element =>{
        await props.methods.COMMON.commonFFB({ path:'/app-common-module/COMMON_MESSAGE_DELETE', 
                method:'POST', 
                body:{  type:'FUNCTION', 
                        IAM_iam_user_id:props.data.iam_user_id,
                        IAM_data_app_id:props.data.common_app_id,
                        message_id:element.getAttribute('data-id')},
                authorization_type:'APP_ACCESS'});
        await eventClickNavMessages();
        props.methods.COMMON.commonUserMessageShowStat();
    };
        
    /**
     * @description show messages
     * @returns {Promise.<void>}
     */
    const eventClickNavMessages = async ()=>{
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'common_app_dialogues_user_menu_detail', 
            data:       {
                            app_id:props.data.app_id,
                            iam_user_id:props.data.iam_user_id,
                            common_app_id:props.data.common_app_id,
                            admin_app_id:props.data.admin_app_id
                        },
            methods:    null,
            path:       '/common/component/common_app_dialogues_user_menu_messages.js'})
            .then(result=>eventClickPaginationMessages = result.methods.eventClickPagination);
    };
    /**
     * @description show iam user
     * @returns {Promise.<void>}
     */
    const eventClickNavIamUser = async () =>{
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'common_app_dialogues_user_menu_detail',
            data:       {
                            app_id:props.data.app_id,
                            iam_user_id:props.data.iam_user_id,
                            admin_app_id:props.data.admin_app_id
                        },
            methods:    null,
            path:       '/common/component/common_app_dialogues_user_menu_iam_user.js'});
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
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'common_app_dialogues_user_menu_detail',
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
            methods:    null,
            path:       '/common/component/common_app_dialogues_user_menu_iam_user_app.js'});
    };
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
                    case event_target_id=='common_app_dialogues_user_menu_nav_messages_count':
                    case event_target_id=='common_app_dialogues_user_menu_nav_messages':{
                            props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('.common_nav_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_nav_selected'));
                            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_nav_selected');
                            await eventClickNavMessages();
                            break;
                        }

                    case event_target_id=='common_app_dialogues_user_menu_nav_iam_user_app':{
                        props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('.common_nav_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_nav_selected'));
                        props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_nav_selected');
                        await eventClickNavIamUserApp(
                            props.methods.COMMON.commonGlobalGet('user_locale'),
                            props.methods.COMMON.commonGlobalGet('user_timezone'),
                            props.methods.COMMON.commonGlobalGet('user_direction'),
                            props.methods.COMMON.commonGlobalGet('user_arabic_script'));
                        break;
                    }
                    case event_target_id=='common_app_dialogues_user_menu_nav_iam_user':{
                        props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('.common_nav_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_nav_selected'));
                        props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_nav_selected');
                        await eventClickNavIamUser();
                        break;
                    }
                    case event_target_id=='common_app_dialogues_user_menu_username':{
                        props.methods.COMMON.commonComponentRemove('common_app_dialogues_user_menu');
                        await props.methods.COMMON.commonProfileShow();
                        break;
                    }
                    case event_target_id=='common_app_dialogues_user_menu_close':{
                        props.methods.COMMON.commonComponentRemove('common_app_dialogues_user_menu', true);
                        break;
                    }
                    case event_target_id=='common_app_dialogues_user_menu_log_in':{
                        props.methods.COMMON.commonComponentRemove('common_app_dialogues_user_menu');
                        props.methods.COMMON.commonDialogueShow('LOGIN');
                        break;
                    }      
                    case event_target_id=='common_app_dialogues_user_menu_signup':{
                        props.methods.COMMON.commonComponentRemove('common_app_dialogues_user_menu');
                        props.methods.COMMON.commonDialogueShow('SIGNUP');
                        break;
                    }
                }
            }
        }
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
            const element_id = 'common_app_dialogues_user_menu_token_countdown_time';
            props.methods.COMMON.commonUserSessionCountdown(props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${element_id}`), props.data.token_exp);
        }   
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {
                    eventClickPagination:       eventClickPagination,
                    eventClickMessage:          eventClickMessage,
                    eventClickMessageDelete:    eventClickMessageDelete
                    },
        events:     events,
        template:   template({  app_id:props.data.app_id,
                                admin_app_id:props.data.admin_app_id,
                                iam_user_id:props.data.iam_user_id,
                                iam_user_username:props.data.iam_user_username,
                                countdown:(props.data.token_exp && props.data.token_iat)?1:0
                            })
    };
};
export default component;