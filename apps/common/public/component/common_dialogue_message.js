/**
 * Displays message
 * @module apps/common/component/common_dialogue_message
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{message:*,
 *          message_type:string,
 *          message_title_font_class:string|null,
 *          message_title_icon_class:string}} props 
 * @returns {string}
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
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      text_class:string,
 *                      message_type:'ERROR_BFF'|'INFO'|'EXCEPTION'|'LOG'|'CONFIRM'|'PROGRESS',
 *                      message:*},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      function_event:function,
 *                      commonComponentRemove:CommonModuleCommon['commonComponentRemove']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null, 
 *                      template:string}>}
 */
const component = async props => {
    if (props.data.commonMountdiv){
        props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show3');
        props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');      
    }

    const function_close = () => { props.methods.commonComponentRemove('common_dialogue_message', true);};
    let display_message = null;
    let display_message_font_class = null;
    switch (props.data.message_type){
        case 'ERROR_BFF':{
            try {
                /**@type{import('../../../common_types.js').CommonErrorMessageISO20022} */
                const message_iso = JSON.parse(props.data.message);
                display_message = message_iso.error?.text ?? message_iso;
            } catch (error) {
                display_message = props.data.message;
            }
            display_message_font_class = 'common_font_normal';
            break;
        }
        case 'INFO':
        case 'EXCEPTION':
        case 'LOG':{
            /**
             * @param {*} message
             */
            const format_message = message =>{
                try {
                    return (JSON.parse(message).error?JSON.parse(message).error.text:JSON.parse(message));
                } catch (error) {
                    return message;
                }
            };
            //parse error key or message
            display_message = format_message(props.data.message);
            
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
        if (props.data.commonMountdiv)
            if (props.data.message_type == 'PROGRESS')
                props.methods.COMMON_DOCUMENT.querySelector('#common_message_progressbar').style.width = `${(props.data.message.part/props.data.message.total)*100}%`;
            else{
                props.methods.COMMON_DOCUMENT.querySelector('#common_message_close')['data-function'] = props.data.message_type == 'CONFIRM'?props.methods.function_event:function_close;
                props.methods.COMMON_DOCUMENT.querySelector('#common_message_close').focus();
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
