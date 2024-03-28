/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='dialogue_send_broadcast_content' class='dialogue_content'>
                        <div id='send_broadcast_form'>
                            <div id='send_broadcast_title' class='common_icon'></div>
                            <div id="select_broadcast_type" class="common_select">   
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
                            <select id='select_app_broadcast'></select>
                            <div id='send_broadcast_message' contenteditable='true'></div>
                            <div id='send_broadcast_send' class='common_dialogue_button common_icon' ></div>
                            <div id='send_broadcast_close' class='common_dialogue_button common_icon' ></div>
                        </div>
                    </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    
    const render_template = () =>{
        return template;
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default component;