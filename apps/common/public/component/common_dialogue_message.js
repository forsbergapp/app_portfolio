/**
 * @module apps/common/component/common_dialogue_message
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
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      text_class:string,
 *                      message_type:string,
 *                      data_app_id:number,
 *                      code:string,
 *                      message:*},
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB'],
 *                      function_event:function,
 *                      componentRemove:import('../../../common_types.js').CommonModuleCommon['ComponentRemove']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null, 
 *                      template:string}>}
 */
const component = async props => {
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_dialogue_show3');
    props.methods.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    /**
     * 
     * @param {*} display_message
     * @param {string|null} display_message_font_class
     * @returns{void}
     */
    const render_message = (display_message, display_message_font_class) =>{
        props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = template(
            {   message:display_message,
                message_type:props.data.message_type,
                message_title_font_class:display_message_font_class,
                message_title_icon_class:props.data.text_class,
            });
    };
    const onMounted = async () => {
        const function_close = () => { props.methods.componentRemove('common_dialogue_message', true);};
        
        switch (props.data.message_type){
            case 'ERROR_BFF':{
                /**@type{import('../../../common_types.js').CommonErrorMessageISO20022} */
                const message_iso = JSON.parse(props.data.message);
                render_message(message_iso.error.text, 'common_font_normal');
                props.methods.common_document.querySelector('#common_message_close')['data-function'] = function_close;
                props.methods.common_document.querySelector('#common_message_close').focus();
                break;
            }
            case 'ERROR':
            case 'INFO':
            case 'EXCEPTION':
            case 'LOG':{
                const display_message = props.data.message_type=='ERROR'?await props.methods.FFB(
                                                    '/server-db/app_settings_display', 
                                                    `data_app_id=${props.data.data_app_id}&setting_type=MESSAGE&value=${props.data.code}`, 
                                                    'GET', 'APP_DATA')
                                    .then((/**@type{string}*/result)=>JSON.parse(result)[0].display_data)
                                    .catch((/**@type{Error}*/error)=>error):props.data.message;
                render_message(display_message, props.data.message_type=='LOG'?'common_font_log':'common_font_normal');
                props.methods.common_document.querySelector('#common_message_close')['data-function'] = function_close;
                props.methods.common_document.querySelector('#common_message_close').focus();
                break;
            }
            case 'CONFIRM':{
                render_message(null, null);
                props.methods.common_document.querySelector('#common_message_close')['data-function'] = props.methods.function_event;
                props.methods.common_document.querySelector('#common_message_close').focus();
                break;
            }
            case 'PROGRESS':{
                render_message(props.data.message.text, 'common_font_log');
                props.methods.common_document.querySelector('#common_message_progressbar').style.width = `${(props.data.message.part/props.data.message.total)*100}%`;
                break;
            }
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({    message:'',
                                message_type:'',
                                message_title_font_class:'',
                                message_title_icon_class:''
                            })
    };
};
export default component;
