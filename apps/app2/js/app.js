window.global_img_datamodel_img = '/app2/info/datamodel.jpg';

async function get_parameters() {
    var status;
    var json;
    await fetch(window.global_rest_url_base + window.global_rest_app_parameter + window.global_app_id,
      {method: 'GET'})
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            if (status==200){
                json = JSON.parse(result);
                for (var i = 0; i < json.data.length; i++) {
                    if (json.data[i].parameter_name=='APP_REST_CLIENT_ID')
                        window.global_app_rest_client_id = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='APP_REST_CLIENT_SECRET')
                        window.global_app_rest_client_secret = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_AUTH')
                        window.global_service_auth = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP')
                        window.global_rest_app = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP_LOG')
                        window.global_rest_app_log = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_GEOLOCATION')
                        window.global_service_geolocation = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_GEOLOCATION_GPS_IP')
                        window.global_service_geolocation_gps_ip = json.data[i].parameter_value;
                }
            }
            else
                show_message('EXCEPTION', null,null, result, window.global_app_id, window.global_lang_code);
        });
}
function zoom_info(zoomvalue = '') {
    var old;
    var old_scale;
    var div = document.getElementById('info');
    //called with null as argument at init() then used for zooming
    //even if css set, this property is not set at startup
    if (zoomvalue == '') {
        div.style.transform = 'scale(1)';
    } else {
        old = div.style.transform;
        old_scale = parseFloat(old.substr(old.indexOf("(") + 1, old.indexOf(")") - 1));
        div.style.transform = 'scale(' + (old_scale + ((zoomvalue*5) / 10)) + ')';
    }
    return null;
}
function move_info(move1, move2) {
    var old;
    var old_scale;
    var div = document.getElementById('info');
    if (move1==null && move2==null) {
        div.style.transformOrigin = '50% 50%';
    } else {
        old = div.style.transformOrigin;
        old_move1 = parseFloat(old.substr(0, old.indexOf("%")));
        old_move2 = parseFloat(old.substr(old.indexOf("%") +1, old.length -1));
        div.style.transformOrigin =  `${old_move1 + (move1*5)}% ${old_move2 + (move2*5)}%`;
    }
    return null;
}

function info(id){
    switch (id){
        case 1:{
            document.getElementById('window_info').style.visibility = 'visible';
            document.getElementById('info').innerHTML = `<img src="${window.global_img_diagram_img}"/>`;
            break;
        }
        case 2:{
            document.getElementById('window_info').style.visibility = 'visible';
            document.getElementById('info').innerHTML = `<img src="${window.global_img_datamodel_img}"/>`;
            break;
        }
        case 3:{
            document.getElementById('window_info').style.visibility = 'hidden';
            document.getElementById('info').innerHTML = '';
            zoom_info('');
            move_info(null,null);
            break;
        }
        default:
            break;
    }

}
function app_exception() {
    null;
}
async function init_app(){
    //window info
    document.getElementById('toolbar_btn_zoomout').innerHTML = window.global_button_default_icon_zoomout;
    document.getElementById('toolbar_btn_zoomin').innerHTML = window.global_button_default_icon_zoomin;
    document.getElementById('toolbar_btn_left').innerHTML = window.global_button_default_icon_left;
    document.getElementById('toolbar_btn_right').innerHTML = window.global_button_default_icon_right;
    document.getElementById('toolbar_btn_up').innerHTML = window.global_button_default_icon_up;
    document.getElementById('toolbar_btn_down').innerHTML = window.global_button_default_icon_down;

    document.getElementById('toolbar_btn_zoomout').addEventListener('click', function() {zoom_info(-1);}, false);
    document.getElementById('toolbar_btn_zoomin').addEventListener('click', function() {zoom_info(1);}, false);
    document.getElementById('toolbar_btn_left').addEventListener('click', function() {move_info(-1,0);}, false);
    document.getElementById('toolbar_btn_right').addEventListener('click', function() {move_info(1,0);}, false);
    document.getElementById('toolbar_btn_up').addEventListener('click', function() {move_info(0,-1);}, false);
    document.getElementById('toolbar_btn_down').addEventListener('click', function() {move_info(0,1);}, false);
    document.getElementById('message_close').addEventListener('click', function() {document.getElementById('dialogue_message').style.visibility= 'hidden'}, false);
    zoom_info('');
    move_info(null,null);
    document.getElementById('window_info').style.visibility = 'visible';
    document.getElementById('info').innerHTML = `<img src="${window.global_img_datamodel_img}"/>`;
}
function init(){
    init_common(2, 'APP', 'INIT', 'app_exception');
    init_app().then(function(){
        get_parameters().then(function(){
            get_data_token(null, window.global_lang_code).then(function(){
                get_gps_from_ip(null, window.global_lang_code).then(function(){
                    app_log(window.global_module, 
                            window.global_module_type, 
                            location.hostname, 
                            window.global_session_user_gps_place, 
                            '', 
                            window.global_session_user_gps_latitude, 
                            window.global_session_user_gps_longitude,
                            window.global_lang_code);
                });
            })
        })    
    })
}
