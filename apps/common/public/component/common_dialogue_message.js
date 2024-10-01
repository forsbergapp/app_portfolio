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
 *                      message_type:'ERROR_BFF'|'ERROR'|'INFO'|'EXCEPTION'|'LOG'|'CONFIRM'|'PROGRESS',
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

    const function_close = () => { props.methods.componentRemove('common_dialogue_message', true);};
    let display_message = null;
    let display_message_font_class = null;
    switch (props.data.message_type){
        case 'ERROR_BFF':{
            /**@type{import('../../../common_types.js').CommonErrorMessageISO20022} */
            const message_iso = JSON.parse(props.data.message);
            display_message = message_iso.error.text;
            display_message_font_class = 'common_font_normal';
            break;
        }
        case 'ERROR':
        case 'INFO':
        case 'EXCEPTION':
        case 'LOG':{
            display_message = props.data.message_type=='ERROR'?await props.methods.FFB(
                                                {
                                                    path:'/server-db/app_settings_display', 
                                                    query:`data_app_id=${props.data.data_app_id}&setting_type=MESSAGE&value=${props.data.code}`, 
                                                    method:'GET', 
                                                    authorization_type:'APP_DATA'
                                                })
                                .then((/**@type{string}*/result)=>JSON.parse(result)[0].display_data)
                                .catch((/**@type{Error}*/error)=>error):props.data.message;
            
            display_message_font_class = props.data.message_type=='LOG'?'common_font_log':'common_font_normal';
            break;
        }
        case 'CONFIRM':{
            display_message = null;
            display_message_font_class = null;
            break;
        }
        case 'PROGRESS':{
            display_message = props.data.message.text;
            display_message_font_class = 'common_font_log';
            break;
        }
    }
    const onMounted = async () =>{
        if (props.data.message_type == 'PROGRESS')
            props.methods.common_document.querySelector('#common_message_progressbar').style.width = `${(props.data.message.part/props.data.message.total)*100}%`;
        else{
            props.methods.common_document.querySelector('#common_message_close')['data-function'] = props.data.message_type == 'CONFIRM'?props.methods.function_event:function_close;
            props.methods.common_document.querySelector('#common_message_close').focus();
        }

    };

    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({  message:                    display_message,
                                message_type:               props.data.message_type,
                                message_title_font_class:   display_message_font_class,
                                message_title_icon_class:   props.data.text_class
                            })
    };
};
export default component;
