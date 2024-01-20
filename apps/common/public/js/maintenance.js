const common = await import('common');
const app_exception = () => {
    null;
};
const init = (parameters) => {
    

    document.title = '⚒';
    document.querySelector('#common_maintenance_footer').innerHTML= '';
    
    common.COMMON_GLOBAL.common_app_id= parseInt(parameters.common_app_id);
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