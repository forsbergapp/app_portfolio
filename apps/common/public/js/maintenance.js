/**@type{{body:{className:string, classList:{add:function}},
 *        querySelector:function,
 *        title: string}} */
 const AppDocument = document;
/**
 * @typedef {object} AppEvent
 * @property {{}}  target
 */
/**@ts-ignore */
const common = await import('common');
/**
 * App exception function
 * @returns {void}
 */
const app_exception = () => {
    null;
};
/**
 * Init common
 * @param {{app_id:number,
 *          common_app_id:number,
 *          rest_resource_bff:string}} parameters 
 * @returns {void}
 */
const init = (parameters) => {
    AppDocument.title = '⚒';
    AppDocument.querySelector('#common_broadcast').addEventListener('click', (/**@type{AppEvent}*/event) => {
        const event_target_id = common.element_id(event.target);
        if (event_target_id=='common_broadcast_close')
            common.ComponentRemove('common_broadcast');
    });
    const decoded_parameters = JSON.parse(common.fromBase64(parameters));
    common.COMMON_GLOBAL.common_app_id= decoded_parameters.common_app_id;
    common.COMMON_GLOBAL.app_id = decoded_parameters.app_id;
    common.COMMON_GLOBAL.app_function_exception = app_exception; 
    common.COMMON_GLOBAL.rest_resource_bff = decoded_parameters.rest_resource_bff;
    common.COMMON_GLOBAL.user_account_id = null;
    common.COMMON_GLOBAL.user_identity_provider_id = null;
    common.COMMON_GLOBAL.system_admin = null;
    common.COMMON_GLOBAL.token_dt = decoded_parameters.app_datatoken
    common.connectOnline();    
    common.show_maintenance(null,1);
};
export{app_exception, init};