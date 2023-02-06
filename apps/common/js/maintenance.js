const common = await import('/common/js/common.js');
function app_exception(){
    null;
}
function init(parameters){
    document.title = common.ICONS['app_maintenance'];
    document.getElementById('broadcast_close').innerHTML = common.ICONS['app_broadcast_close'];
    document.getElementById('maintenance_footer').innerHTML= common.APP_SPINNER;
    document.getElementById('maintenance_message').innerHTML = common.ICONS['app_maintenance'];;
    
    common.COMMON_GLOBAL['app_id'] = parameters.app_id;
    common.COMMON_GLOBAL['user_account_id'] = '';
    common.COMMON_GLOBAL['user_identity_provider_id'] = '';
    common.connectOnline();    
    common.show_maintenance(null,1);
}
export{app_exception, init}