function app_exception(){
    null;
}
function init_maintenance(app_id){
    init_common(app_id, 'APP', 'MAINTENANCE', 'app_exception')
    document.getElementById('maintenance_footer').innerHTML= window.global_button_spinner;
    show_maintenance(null,1);
}
