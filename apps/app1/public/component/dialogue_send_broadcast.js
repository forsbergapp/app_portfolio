/**
 * Displays dialogue to send broadcast messages
 * @module apps/app1/component/dialogue_send_broadcast
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{icons:{ send:string,
 *                  close:string,
 *                  broadcast:string,
 *                  user:string}}} props
 * @returns {string}
 */
const template = props => `<div id='dialogue_send_broadcast_form'>
                            <div id='dialogue_send_broadcast_title'>${props.icons.broadcast}</div>
                            <div id='dialogue_send_broadcast_select_broadcast_type' ></div>
                            <div id='dialogue_send_broadcast_client_id_label'>${props.icons.user}</div><div id='dialogue_send_broadcast_client_id'></div>
                            <div id='dialogue_send_broadcast_select_app_broadcast'></div>
                            <div id='dialogue_send_broadcast_message' contentEditable='true'></div>
                            <div id='dialogue_send_broadcast_send' class='common_app_dialogues_button common_link common_icon_button' >${props.icons.send}</div>
                            <div id='dialogue_send_broadcast_close' class='common_app_dialogues_button common_link common_icon_button' >${props.icons.close}</div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON:                 common['CommonModuleCommon']
 *                      }
 *          }} props 
 * @returns {Promise.<{ lifecycle:              common['CommonComponentLifecycle'],
 *                      data:                   null, 
 *                      methods:                null,
 *                      template:               string}>}
 */
const component = async props => {
    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_app_dialogues_show0');
    const apps = await props.methods.COMMON.commonFFB({ path:'/server-db/app', 
                                                        query:'key=Name', 
                                                        method:'GET', authorization_type:'ADMIN'})
                .then((/**@type{string}*/result)=>JSON.parse(result).rows);
    const onMounted = async () =>{
        // select broadcast type
        await props.methods.COMMON.commonComponentRender(
            {   mountDiv:'dialogue_send_broadcast_select_broadcast_type',
                data:{
                    default_value:props.methods.COMMON.commonGlobalGet('ICONS')['alert'],
                    default_data_value:'ALERT',
                    options:[{VALUE:'ALERT', TEXT:props.methods.COMMON.commonGlobalGet('ICONS')['alert']}, {VALUE:'MAINTENANCE', TEXT:props.methods.COMMON.commonGlobalGet('ICONS')['maintenance']}],
                    column_value:'VALUE',
                    column_text:'TEXT'
                },
                methods:null,
                path:'/common/component/common_select.js'});
        // select apps
        await props.methods.COMMON.commonComponentRender( 
            {   mountDiv:'dialogue_send_broadcast_select_app_broadcast',
                data:{
                    default_value:props.methods.COMMON.commonGlobalGet('ICONS').infinite,
                    default_data_value:'',
                    options:apps.map((/**@type{common['server']['ORM']['Object']['App']}*/row)=>{return {Id:row.Id, Name:row.Name}}).concat({Id:'',Name:props.methods.COMMON.commonGlobalGet('ICONS').infinite}),
                    column_value:'Id',
                    column_text:'Name'
                  },
                methods:null,
                path:'/common/component/common_select.js'});
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({icons:{ send:props.methods.COMMON.commonGlobalGet('ICONS')['send'],
                                    close:props.methods.COMMON.commonGlobalGet('ICONS')['close'],
                                    broadcast:props.methods.COMMON.commonGlobalGet('ICONS')['broadcast'],
                                    user:props.methods.COMMON.commonGlobalGet('ICONS')['user']}
                        })
    };
};
export default component;