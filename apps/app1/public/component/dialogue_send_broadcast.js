/**
 * Displays dialogue to send broadcast messages
 * @module apps/app1/component/dialogue_send_broadcast
 */
/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () => `<div id='dialogue_send_broadcast_form'>
                            <div id='dialogue_send_broadcast_title' class='common_icon'></div>
                            <div id='dialogue_send_broadcast_select_broadcast_type' ></div>
                            <div id='dialogue_send_broadcast_client_id_label' class='common_icon'></div><div id='dialogue_send_broadcast_client_id'></div>
                            <div id='dialogue_send_broadcast_select_app_broadcast'></div>
                            <div id='dialogue_send_broadcast_message' contentEditable='true'></div>
                            <div id='dialogue_send_broadcast_send' class='common_dialogue_button common_icon' ></div>
                            <div id='dialogue_send_broadcast_close' class='common_dialogue_button common_icon' ></div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:        COMMON_DOCUMENT,
 *                      commonComponentRender:  CommonModuleCommon['commonComponentRender'],
 *                      commonFFB:              CommonModuleCommon['commonFFB']
 *                      }
 *          }} props 
 * @returns {Promise.<{ lifecycle:              CommonComponentLifecycle,
 *                      data:                   null, 
 *                      methods:                null,
 *                      template:               string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show0');
    props.methods.COMMON_DOCUMENT.querySelector('#dialogues').classList.add('common_dialogues_modal');

    const onMounted = async () =>{
        // select broadcast type
        await props.methods.commonComponentRender(
            {   mountDiv:'dialogue_send_broadcast_select_broadcast_type',
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
            {   mountDiv:'dialogue_send_broadcast_select_app_broadcast',
                data:{
                    default_value:'∞',
                    default_data_value:'',
                    options:[{id:'', name:'∞'}],
                    path:'/server-db/app',
                    query:'key=name',
                    method:'GET',
                    authorization_type:'ADMIN',
                    column_value:'id',
                    column_text:'name'
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