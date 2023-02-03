const common = await import('/common/js/common.js');
const common_icons = await import('/common/js/common_icons.js');
function app_exception(){
    null;
}
function init(parameters){
    common_icons.seticons();
    document.title = window.global_icon_app_maintenance;
    document.getElementById('broadcast_close').innerHTML = window.global_icon_app_broadcast_close;
    document.getElementById('maintenance_footer').innerHTML= window.global_app_spinner;
    document.getElementById('maintenance_message').innerHTML = window.global_icon_app_maintenance;
    
    window.global_app_id = parameters.app_id;
    window.global_user_account_id = '';
    window.global_user_identity_provider_id= '';
    common.connectOnline();    
    common.show_maintenance(null,1);
}
export{app_exception, init}