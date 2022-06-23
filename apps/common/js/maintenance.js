function app_exception(){
    null;
}
function init_maintenance(parameters){
    init_common(parameters)
    document.getElementById('maintenance_footer').innerHTML= window.global_button_spinner;
    show_maintenance(null,1);
}
