/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='send_broadcast_form'>
                        <div id='send_broadcast_title' class='common_icon'></div>
                        <div id="select_broadcast_type" class="common_select <ADMIN_CLASS/>">
                            <div class="common_select_dropdown">
                                <div class="common_select_dropdown_value" data-value='ALERT'></div>
                                <div class="common_select_dropdown_icon common_icon"></div>
                            </div>
                            <div class="common_select_options">
                                <div class="common_select_option" data-value='ALERT'></div>
                                <div class="common_select_option" data-value='MAINTENANCE'></div>
                            </div>
                        </div>
                        <div id='client_id_label' class='common_icon'></div><div id='client_id'></div>
                        <select id='select_app_broadcast'><APPS/></select>
                        <div id='send_broadcast_message' contentEditable='true'></div>
                        <div id='send_broadcast_send' class='common_dialogue_button common_icon' ></div>
                        <div id='send_broadcast_close' class='common_dialogue_button common_icon' ></div>
                    </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          system_admin:boolean,
 *          apps:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show0');
    props.common_document.querySelector('#dialogues').classList.add('common_dialogues_modal');
    const render_template = () =>{
        return template
                .replace('<ADMIN_CLASS/>', props.system_admin?'system_admin':'admin')
                .replace('<APPS/>', props.apps);
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default component;