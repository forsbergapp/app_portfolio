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
 *          countdown:0|1,
 *          icons:{ email:string,
 *                  settings:string,
 *                  user:string,
 *                  signup:string,
 *                  login:string,
 *                  logout:string,
 *                  close:string}}} props 
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
                                        <div id='common_app_dialogues_user_menu_nav_messages' class='common_nav_selected common_link'>
                                            <div id='common_app_dialogues_user_menu_nav_messages_count'></div>
                                            ${props.icons.email}
                                        </div>
                                        <div id='common_app_dialogues_user_menu_nav_iam_user_app' class='common_link'>${props.icons.settings}</div>
                                        <div id='common_app_dialogues_user_menu_nav_iam_user' class='common_link'>${props.icons.user}</div>
                                    </div>`:''
                                }
                                <div id='common_app_dialogues_user_menu_detail'>
                                </div>
                                ${(props.app_id == props.admin_app_id) || props.iam_user_username ?
                                    `<div id='common_app_dialogues_user_menu_logged_in'>
                                        ${props.app_id == props.admin_app_id?
                                            '':
                                            `<div id='common_app_dialogues_user_menu_log_out' class='common_link common_icon_button'>${props.icons.logout}</div>`
                                        }
                                    </div>`:
                                    `${props.app_id == props.admin_app_id?'':
                                        `<div id='common_app_dialogues_user_menu_logged_out'>
                                            <div id='common_app_dialogues_user_menu_signup' class='common_link common_icon_button'>${props.icons.signup}</div>
                                            <div id='common_app_dialogues_user_menu_log_in' class='common_link common_icon_button'>${props.icons.login}</div>
                                        </div>`
                                    }`
                                }
                                <div id='common_app_dialogues_user_menu_close' class='common_link common_app_dialogues_button common_icon_button' >${props.icons.close}</div>
                            </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string
*                      },
*          methods:    {
*                      COMMON:common['CommonModuleCommon']
*                      }}} props
* @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
*                      data:   null,
*                      methods:null,
*                      events:  common['commonComponentEvents'],
*                      template:string}>}
*/
const component = async props => {
    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_app_dialogues_show1');

    /**
     * @description read a message
     * @param {HTMLElement} element
     * @returns {Promise.<void>}
     */
    const eventClickMessage = async element =>{
        const message_id = element.getAttribute('data-id');
        element.classList.remove('common_app_dialogues_user_menu_messages_list_row_unread');
        element.classList.add('common_app_dialogues_user_menu_messages_list_row_read');

        /**@type{common['server']['ORM']['Object']['MessageQueuePublish']['Message'] & {Username:common['server']['ORM']['Object']['IamUser']['Username']}}} */
        const message = {Sender:element.getAttribute('data-sender')==''?null:element.getAttribute('data-sender'),
                         ReceiverId:Number(element.getAttribute('data-receiver_id')),
                         Username:props.methods.COMMON.commonGlobalGet('User').iam_user_username ??'',
                         Host:element.getAttribute('data-host')??'',
                         ClientIp:element.getAttribute('data-client_ip')??'',
                         Subject:element.getAttribute('data-subject')??'',
                         Message:element.getAttribute('data-message')??'',
                         Created:element.getAttribute('data-created')??''
                        };
        
        //show message detail
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'common_app_dialogues_user_menu_message_content',
            data:       {
                            message:message
                        },
            methods:    null,
            path:       '/common/component/common_app_dialogues_user_menu_message.js'});

        await props.methods.COMMON.commonFFB({ path:'/app-common-module/COMMON_MESSAGE_READ', 
                method:'POST', 
                body:{  type:'FUNCTION', 
                        IAM_iam_user_id:props.methods.COMMON.commonGlobalGet('User').iam_user_id,
                        IAM_data_app_id:props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id,
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
                        IAM_iam_user_id:props.methods.COMMON.commonGlobalGet('User').iam_user_id,
                        IAM_data_app_id:props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id,
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
            data:       null,
            methods:    {},
            path:       '/common/component/common_app_dialogues_user_menu_messages.js'});
    };
    /**
     * @description show iam user
     * @returns {Promise.<void>}
     */
    const eventClickNavIamUser = async () =>{
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'common_app_dialogues_user_menu_detail',
            data:       null,
            methods:    null,
            path:       '/common/component/common_app_dialogues_user_menu_iam_user.js'});
    };
    /**
     * @description show iam user app
     * @returns {Promise.<void>}
     */
    const eventClickNavIamUserApp = async () =>{
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'common_app_dialogues_user_menu_detail',
            data:       null,
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
                        await eventClickNavIamUserApp();
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
                        props.methods.COMMON.commonComponentRemove('common_app_dialogues_user_menu');
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
                    case event.target.classList.contains('common_app_dialogues_user_menu_messages_list_col_delete') && event_target_id != 'common_app_dialogues_user_menu_messages_list_col_delete':{
                        //clicked on delete on row, not the title
                        eventClickMessageDelete( props.methods.COMMON.commonMiscElementRow(event.target));
                        break;
                    }
                    case event_target_id=='common_app_dialogues_user_menu_messages_list':{
                        eventClickMessage( props.methods.COMMON.commonMiscElementRow(event.target));
                        break;
                    }
                }
            }
        }
    };
    const onMounted = async () =>{
        if (props.methods.COMMON.commonGlobalGet('User').iam_user_id){
            //mount messages
            await eventClickNavMessages();
        }
        else{
            //mount iam_user_app
            await eventClickNavIamUserApp();
        }
        
        if (props.methods.COMMON.commonGlobalGet('Data').token_exp && props.methods.COMMON.commonGlobalGet('Data').token_iat){
            const element_id = 'common_app_dialogues_user_menu_token_countdown_time';
            props.methods.COMMON.commonUserSessionCountdown(props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${element_id}`), props.methods.COMMON.commonGlobalGet('Data').token_exp);
        }   
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        events:     events,
        template:   template({  app_id:props.methods.COMMON.commonGlobalGet('UserApp').app_id,
                                admin_app_id:props.methods.COMMON.commonGlobalGet('Parameters').app_admin_app_id,
                                iam_user_id:props.methods.COMMON.commonGlobalGet('User').iam_user_id,
                                iam_user_username:props.methods.COMMON.commonGlobalGet('User').iam_user_username,
                                countdown:(props.methods.COMMON.commonGlobalGet('Data').token_exp && props.methods.COMMON.commonGlobalGet('Data').token_iat)?1:0,
                                icons:{ email:props.methods.COMMON.commonGlobalGet('ICONS')['email'],
                                        settings:props.methods.COMMON.commonGlobalGet('ICONS')['settings'],
                                        user:props.methods.COMMON.commonGlobalGet('ICONS')['user'],
                                        signup:props.methods.COMMON.commonGlobalGet('ICONS')['signup'],
                                        login:props.methods.COMMON.commonGlobalGet('ICONS')['login'],
                                        logout:props.methods.COMMON.commonGlobalGet('ICONS')['logout'],
                                        close:props.methods.COMMON.commonGlobalGet('ICONS')['close']
                                }
                            })
    };
};
export default component;