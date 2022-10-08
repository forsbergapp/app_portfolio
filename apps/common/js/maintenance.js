function app_exception(){
    null;
}
function init_maintenance(parameters){
    seticons();
    document.title = window.global_icon_app_maintenance;
    document.getElementById('broadcast_close').innerHTML = window.global_icon_app_broadcast_close;
    document.getElementById('maintenance_footer').innerHTML= window.global_app_spinner;
    document.getElementById('maintenance_message').innerHTML = window.global_icon_app_maintenance;
    
    window.global_app_id = parameters.app_id;
    window.global_user_account_id = '';
    window.global_user_identity_provider_id= '';
    window.global_admin = '';
    connectOnline();    
    show_maintenance(null,1);
}
