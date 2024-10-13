/**
 * @module apps/admin/component/dialogue_send_broadcast
 */

const template = () => `<div id='send_broadcast_form'>
                            <div id='send_broadcast_title' class='common_icon'></div>
                            <div id='select_broadcast_type' ></div>
                            <div id='client_id_label' class='common_icon'></div><div id='client_id'></div>
                            <div id='select_app_broadcast'></div>
                            <div id='send_broadcast_message' contentEditable='true'></div>
                            <div id='send_broadcast_send' class='common_dialogue_button common_icon' ></div>
                            <div id='send_broadcast_close' class='common_dialogue_button common_icon' ></div>
                        </div>`;
/**
 * 
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
 *                      commonComponentRender:import('../../../common_types.js').CommonModuleCommon['commonComponentRender'],
 *                      commonFFB:import('../../../common_types.js').CommonModuleCommon['commonFFB']
 *                      }
 *          }} props 
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle,
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show0');
    props.methods.COMMON_DOCUMENT.querySelector('#dialogues').classList.add('common_dialogues_modal');

    const onMounted = async () =>{
        // select broadcast type
        await props.methods.commonComponentRender(
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
                methods:{commonFFB:props.methods.commonFFB},
                path:'/common/component/common_select.js'});
        // select apps
        await props.methods.commonComponentRender( 
            {   mountDiv:'select_app_broadcast',
                data:{
                    default_value:'∞',
                    options:[{APP_ID:'', NAME:'∞'}],
                    path:'/server-config/config-apps/',
                    query:'key=NAME',
                    method:'GET',
                    authorization_type:'ADMIN',
                    column_value:'APP_ID',
                    column_text:'NAME'
                  },
                methods:{commonFFB:props.methods.commonFFB},
                path:'/common/component/common_select.js'});
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template()
    };
};
export default component;