/**
 * @module apps/common/component/dialogue_message
 */

/**
 * @param {{message:*,
 *          message_type:string,
 *          message_title_font_class:string|null,
 *          message_title_icon_class:string}} props 
 * @returns 
 */
const template = props =>`  ${props.message_type=='CONFIRM'?
                                '<div id=\'common_message_confirm_question\' class=\'common_icon\'></div>':''
                            }
                            ${props.message_type!='CONFIRM'?
                            `<div id='common_message_title_container'>
                                <div id='common_message_title_icon' data-text_class='${props.message_title_icon_class}' class='common_icon'></div>
                                <div id='common_message_title' class='${props.message_title_font_class}'>
                                    ${typeof props.message == 'object'?Object.entries(props.message).map((/**@type{*}*/list_row)=>
                                        //loop manages both object and array
                                        `<div id='common_message_info_list'>
                                            <div class='common_message_info_list_row'>
                                                <div class='common_message_info_list_col'>
                                                    <div>${props.message.constructor===Array?Object.keys(list_row[1])[0]:list_row[0]}</div>
                                                </div>
                                                <div class='common_message_info_list_col'>
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
                                `<div id='common_message_progressbar_wrap'>
                                    <div id='common_message_progressbar'></div>
                                </div>`:''
                            }
                            <div id='common_message_buttons'>
                                ${props.message_type=='CONFIRM'?
                                    '<div id=\'common_message_cancel\' class=\'common_dialogue_button common_icon\' ></div>':''
                                }
                                ${props.message_type!='PROGRESS'?
                                    '<div id=\'common_message_close\' class=\'common_dialogue_button common_icon\' ></div>':''
                                }
                            </div>`;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          text_class:string,
 *          message_type:string,
 *          data_app_id:number,
 *          code:string,
 *          message:*,
 *          function_FFB:function,
 *          function_event:function,
 *          function_componentremove:function,
 *          }} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show3');
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    /**
     * 
     * @param {*} display_message
     * @param {string|null} display_message_font_class
     * @returns{void}
     */
    const render_message = (display_message, display_message_font_class) =>{
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template(
            {   message:display_message,
                message_type:props.message_type,
                message_title_font_class:display_message_font_class,
                message_title_icon_class:props.text_class,
            });
    };
    const post_component = async () => {
        const function_close = () => { props.function_componentremove('common_dialogue_message', true);};
        
        switch (props.message_type){
            case 'ERROR_BFF':{
                /**@type{import('../../../common_types.js').CommonErrorMessageISO20022} */
                const message_iso = JSON.parse(props.message);
                render_message(message_iso.error.text, 'common_font_normal');
                props.common_document.querySelector('#common_message_close')['data-function'] = function_close;
                props.common_document.querySelector('#common_message_close').focus();
                break;
            }
            case 'ERROR':
            case 'INFO':
            case 'EXCEPTION':
            case 'LOG':{
                const display_message = props.message_type=='ERROR'?await props.function_FFB(
                                                    '/server-db/app_settings_display', 
                                                    `data_app_id=${props.data_app_id}&setting_type=MESSAGE&value=${props.code}`, 
                                                    'GET', 'APP_DATA')
                                    .then((/**@type{string}*/result)=>JSON.parse(result)[0].display_data)
                                    .catch((/**@type{Error}*/error)=>error):props.message;
                render_message(display_message, props.message_type=='LOG'?'common_font_log':'common_font_normal');
                props.common_document.querySelector('#common_message_close')['data-function'] = function_close;
                props.common_document.querySelector('#common_message_close').focus();
                break;
            }
            case 'CONFIRM':{
                render_message(null, null);
                props.common_document.querySelector('#common_message_close')['data-function'] = props.function_event;
                props.common_document.querySelector('#common_message_close').focus();
                break;
            }
            case 'PROGRESS':{
                render_message(props.message.text, 'common_font_log');
                props.common_document.querySelector('#common_message_progressbar').style.width = `${(props.message.part/props.message.total)*100}%`;
                break;
            }
        }
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template({    message:'',
                                message_type:'',
                                message_title_font_class:'',
                                message_title_icon_class:''
                            })
    };
};
export default component;
