/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='common_confirm_question' class='common_icon'><COMMON_TRANSLATION_CONFIRM_QUESTION/></div>
                    <div id='common_message_title_container'>
                        <div id='common_message_title_icon' class='common_icon'></div>
                        <div id='common_message_title'></div>
                    </div>
                    <div id='common_message_progressbar_wrap'>
                        <div id='common_message_progressbar'></div>
                    </div>
                    <div id='common_message_buttons'>
                        <div id='common_message_cancel' class='common_dialogue_button common_icon' ></div>
                        <div id='common_message_close' class='common_dialogue_button common_icon' ></div>
                    </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          text_class:string,
 *          message_type:string,
 *          data_app_id:number,
 *          code:string,
 *          message:{message:string, sqlMessage:string,errorNum:string, text:string}|*,
 *          translation_confirm_question:string,
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
    
    const show_message = async () => {
        const confirm_question = props.common_document.querySelector('#common_confirm_question');
        const progressbar = props.common_document.querySelector('#common_message_progressbar');
        const progressbar_wrap = props.common_document.querySelector('#common_message_progressbar_wrap');
        const message_title = props.common_document.querySelector('#common_message_title');
        const dialogue = props.common_document.querySelector('#common_dialogue_message');
        const button_close = props.common_document.querySelector('#common_message_close');
        const button_cancel = props.common_document.querySelector('#common_message_cancel');
        const function_close = () => { props.function_componentremove('common_dialogue_message', true)};
        const fontsize_normal = '1em';
        const fontsize_log = '0.5em';
        const show = 'inline-block';
        const hide = 'none';
        props.common_document.querySelector('#common_message_title_icon').setAttribute('data-text_class',props.text_class);
        props.common_document.querySelector('#common_message_title_container').style.display = show;
        switch (props.message_type){
            case 'ERROR':{
                message_title.innerHTML = '';
                confirm_question.style.display = hide;
                message_title.style.display = show;
                message_title.style.fontSize = fontsize_normal;
                progressbar.style.display = hide;
                progressbar_wrap.style.display = hide;
                button_cancel.style.display = hide;
                button_close.style.display = show;
                const text = await props.function_FFB('DB_API', `/app_settings_display?data_app_id=${props.data_app_id}&setting_type=MESSAGE&value=${props.code}`, 'GET', 'APP_DATA')
                            .then((/**@type{string}*/result)=>JSON.parse(result)[0].display_data)
                            .catch((/**@type{Error}*/error)=>error);
                message_title.innerHTML = text;
                button_close['data-function'] = function_close;
                dialogue.style.visibility = 'visible';
                button_close.focus();
                break;
            }
            case 'INFO':{
                confirm_question.style.display = hide;
                message_title.style.display = show;
                message_title.style.fontSize = fontsize_normal;
                message_title.innerHTML = props.message;
                progressbar.style.display = hide;
                progressbar_wrap.style.display = hide;
                button_cancel.style.display = hide;
                button_close.style.display = show;
                button_close['data-function'] = function_close;
                dialogue.style.visibility = 'visible';
                button_close.focus();
                break;
            }
            case 'EXCEPTION':{
                confirm_question.style.display = hide;
                message_title.style.display = show;
                message_title.style.fontSize = fontsize_normal;
                progressbar.style.display = hide;
                progressbar_wrap.style.display = hide;
                button_cancel.style.display = hide;
                button_close.style.display = show;
                try {
                    // dont show code or errno returned from json
                    if (typeof JSON.parse(props.message).message !== 'undefined'){
                        // message from Node controller.js and service.js files
                        message_title.innerHTML= JSON.parse(props.message).message;
                    }
                    else{
                        //message from Mysql, code + sqlMessage
                        if (typeof JSON.parse(props.message).sqlMessage !== 'undefined')
                            message_title.innerHTML= 'DB Error: ' + JSON.parse(props.message).sqlMessage;
                        else{
                            //message from Oracle, errorNum, offset
                            if (typeof JSON.parse(props.message).errorNum !== 'undefined')
                                message_title.innerHTML= 'DB Error: ' + props.message;
                            else
                                message_title.innerHTML= props.message;
                        }    
                    }
                } catch (e) {
                    //other error and json not returned, return the whole text
                    message_title.innerHTML = props.message;
                }
                button_close['data-function'] = function_close;
                dialogue.style.visibility = 'visible';
                button_close.focus();
                break;
            }
            case 'CONFIRM':{
                confirm_question.style.display = show;
                message_title.style.display = hide;
                props.common_document.querySelector('#common_message_title_container').style.display = hide;
                message_title.style.fontSize = fontsize_normal;
                message_title.innerHTML = '';
                progressbar.style.display = hide;
                progressbar_wrap.style.display = hide;
                button_cancel.style.display = show;
                button_close.style.display = show;
                button_close['data-function'] = props.function_event;
                dialogue.style.visibility = 'visible';
                button_close.focus();
                break;
            }
            case 'LOG':{
                confirm_question.style.display = hide;
                message_title.style.display = show;
                message_title.style.fontSize = fontsize_log;
                message_title.innerHTML = props.message;
                progressbar.style.display = hide;
                progressbar_wrap.style.display = hide;
                button_cancel.style.display = hide;
                button_close.style.display = show;
                button_close['data-function'] = function_close;
                dialogue.style.visibility = 'visible';
                button_close.focus();
                break;
            }
            case 'PROGRESS':{
                confirm_question.style.display = hide;
                message_title.style.display = show;
                message_title.style.fontSize = fontsize_log;
                message_title.innerHTML = props.message.text;
                progressbar.style.display = show;
                progressbar_wrap.style.display = show;
                progressbar.style.width = `${(props.message.part/props.message.total)*100}%`;
                button_cancel.style.display = hide;
                button_close.style.display = hide;
                dialogue.style.visibility = 'visible';
                break;
            }
        }
    }

    const render_template = () =>{
        return template
                .replaceAll('<COMMON_TRANSLATION_CONFIRM_QUESTION/>',props.translation_confirm_question);
    }
    return {
        props:  {function_post:show_message},
        data:   null,
        template: render_template()
    };
}
export default component;
