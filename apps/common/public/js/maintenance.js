/**@type{{body:{className:string, classList:{add:function}},
 *        querySelector:function,
 *        title: string}} */
 const AppDocument = document;

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
    AppDocument.querySelector('#common_maintenance_footer').innerHTML= '';
    
    common.COMMON_GLOBAL.common_app_id= parameters.common_app_id;
    common.COMMON_GLOBAL.app_id = parameters.app_id;
    common.COMMON_GLOBAL.exception_app_function = app_exception; 
    common.COMMON_GLOBAL.rest_resource_bff = parameters.rest_resource_bff;
    common.COMMON_GLOBAL.user_account_id = '';
    common.COMMON_GLOBAL.user_identity_provider_id = '';
    common.COMMON_GLOBAL.system_admin = '';
    common.connectOnline();    
    common.show_maintenance(null,1);
};
export{app_exception, init};