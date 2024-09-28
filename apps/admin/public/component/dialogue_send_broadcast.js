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
 * @param {{data:{      common_mountdiv:string,
 *                      system_admin:boolean},
 *          methods:{   common_document:import('../../../common_types.js').CommonAppDocument,
 *                      ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender']
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB']},
 *          lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn,
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_dialogue_show0');
    props.methods.common_document.querySelector('#dialogues').classList.add('common_dialogues_modal');

    const onMounted = async () =>{
        // select broadcast type
        await props.methods.ComponentRender(
            {   mountDiv:'select_broadcast_type',
                data:{
                    default_data_value:'ALERT',
                    options:[{VALUE:'ALERT', TEXT:''}, {VALUE:'MAINTENANCE', TEXT:''}],
                    path:'',
                    query:'',
                    method:'',
                    authorization_type:'',
                    column_value:'VALUE',
                    column_text:'TEXT'
                },
                methods:{FFB:props.methods.FFB},
                lifecycle:null,
                path:'/common/component/select.js'});
        // select apps
        await props.methods.ComponentRender( 
            {   mountDiv:'select_app_broadcast',
                data:{
                    default_value:'∞',
                    options:[{APP_ID:'', NAME:'∞'}],
                    path:'/server-config/config-apps/',
                    query:'key=NAME',
                    method:'GET',
                    authorization_type:props.data.system_admin?'SYSTEMADMIN':'APP_ACCESS',
                    column_value:'APP_ID',
                    column_text:'NAME'
                  },
                methods:{FFB:props.methods.FFB},
                lifecycle:null,
                path:'/common/component/select.js'});
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({ admin_class:props.data.system_admin?'system_admin':'admin'})
    };
};
export default component;