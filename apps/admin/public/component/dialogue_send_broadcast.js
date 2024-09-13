/**
 * @module apps/admin/component/dialogue_send_broadcast
 */
/**
 * @param {{admin_class:string}} props
 */
const template = props => ` <div id='send_broadcast_form'>
                                <div id='send_broadcast_title' class='common_icon'></div>
                                <div id='select_broadcast_type' class='${props.admin_class}'></div>
                                <div id='client_id_label' class='common_icon'></div><div id='client_id'></div>
                                <div id='select_app_broadcast'></div>
                                <div id='send_broadcast_message' contentEditable='true'></div>
                                <div id='send_broadcast_send' class='common_dialogue_button common_icon' ></div>
                                <div id='send_broadcast_close' class='common_dialogue_button common_icon' ></div>
                            </div>`;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          system_admin:boolean,
 *          function_ComponentRender:function
 *          function_FFB:function}} props 
 * @returns {Promise.<{ props:{function_post:function},
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show0');
    props.common_document.querySelector('#dialogues').classList.add('common_dialogues_modal');

    const post_component =() =>{
        // select broadcast type
        props.function_ComponentRender('select_broadcast_type', 
            {
              default_data_value:'ALERT',
              options:[{VALUE:'ALERT', TEXT:''}, {VALUE:'MAINTENANCE', TEXT:''}],
              path:'',
              query:'',
              method:'',
              authorization_type:'',
              column_value:'VALUE',
              column_text:'TEXT',
              function_FFB:props.function_FFB
            }, '/common/component/select.js');
        // select apps
        props.function_ComponentRender('select_app_broadcast', 
            {
              default_value:'∞',
              options:[{APP_ID:'', NAME:'∞'}],
              path:'/server-config/config-apps/',
              query:'key=NAME',
              method:'GET',
              authorization_type:props.system_admin?'SYSTEMADMIN':'APP_ACCESS',
              column_value:'APP_ID',
              column_text:'NAME',
              function_FFB:props.function_FFB
            }, '/common/component/select.js');
    };
    const render_template = () =>{
        return template({   admin_class:props.system_admin?'system_admin':'admin'
        });
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template()
    };
};
export default component;