const common = await import('/common/js/common.js');
const app_exception = () => {
    null;
}
const init = (parameters) => {
    document.title = common.ICONS['app_maintenance'];
    document.getElementById('common_broadcast_close').innerHTML = common.ICONS['app_broadcast_close'];
    document.getElementById('common_maintenance_footer').innerHTML= common.APP_SPINNER;
    document.getElementById('common_maintenance_message').innerHTML = common.ICONS['app_maintenance'];;
    
    common.COMMON_GLOBAL['app_id'] = parameters.app_id;
    common.COMMON_GLOBAL['user_account_id'] = '';
    common.COMMON_GLOBAL['user_identity_provider_id'] = '';
    common.connectOnline();    
    common.show_maintenance(null,1);
}
export{app_exception, init}