var global_module = 'APP';
var global_module_type = 'INIT';
var global_app_id = 2;
var global_app_rest_client_id;
var global_app_rest_client_secret;
var global_service_auth;
var global_service_geolocation;
var global_service_geolocation_gps_ip;
var global_rest_url_base    = 'https://' + location.hostname + '/service/db/api/';
var global_rest_app;
var global_rest_app_parameter = 'app_parameter/';
var global_rest_app_log;
var global_rest_dt;
var global_img_datamodel_img = '/app2/info/datamodel.jpg';

function toggle_switch(){
    if(document.getElementById('toggle_checkbox').checked)
        document.body.className = 'theme_sun';
    else
        document.body.className = 'theme_moon';
    return null;
}

function app_log(app_module, app_module_type, app_module_request, app_module_result, app_user_id,
                 user_gps_latitude, user_gps_longitude){
	var status;
	var json_data = 
				 '{' + 
				 '"app_id":"' + global_app_id + '",' +
				 '"app_module":"' + app_module + '",' +
				 '"app_module_type":"' + '' + app_module_type + '",' +
				 '"app_module_request":"' + app_module_request + '",' +
				 '"app_module_result":"' + app_module_result + '",' +
				 '"app_user_id":"' + '' + app_user_id + '",' +
				 '"user_language": "' + navigator.language + '",' +
				 '"user_timezone": "' + Intl.DateTimeFormat().resolvedOptions().timeZone + '",' +
				 '"user_number_system": "' + Intl.NumberFormat().resolvedOptions().numberingSystem + '",' +
				 '"user_platform": "' + navigator.platform + '",' +
				 '"user_gps_latitude": "' + user_gps_latitude + '",' +
				 '"user_gps_longitude": "' + user_gps_longitude + '"' +
				'}';

	fetch(global_rest_url_base + global_rest_app_log,
		{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + global_rest_dt
			},
		body: json_data
		})
		.then(function(response){
			status = response.status;
			return response.text();
		})
		.then(function(response) {
			if (status === 200)
				return null;
			else
				return null;
		})
		.catch(function(error) {
            show_message('Error: app_log: ' + error);	
		});
}
async function get_gps_from_ip(){
    var status;
    var json;
	await fetch(global_service_geolocation + global_service_geolocation_gps_ip + '?app_id=' + global_app_id,
        {method: 'GET',
        headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + global_rest_dt
			},
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            if (status==200){
                json = JSON.parse(result);
                app_log(global_module, 
                        global_module_type, 
                        location.hostname, 
                        json.geoplugin_city + ', ' + 
                        json.geoplugin_regionName + ', ' + 
                        json.geoplugin_countryName, 
                        '', 
                        json.geoplugin_latitude, 
                        json.geoplugin_longitude); 
            }
            else
                show_message('Error: get_gps_from_ip: ' + result);
        });
}

async function get_token() {
	var status;
    var json;
    await fetch(global_service_auth + '?app_id=' + global_app_id + '&app_user_id=',
    {method: 'POST',
     headers: {
        'Authorization': 'Basic ' + btoa(global_app_rest_client_id + ':' + global_app_rest_client_secret)
        }
    })
      .then(function(response) {
            status = response.status;
            return response.text();
      })
      .then(function(result) {
          if (status == 200)
            json = JSON.parse(result);
            if (json.success === 1){
                global_rest_dt = json.token_dt;
            }
          else
            show_message('Error: get_token: ' + result);
        });
}

async function get_parameters() {
    var status;
    var json;
    await fetch(global_rest_url_base + global_rest_app_parameter + global_app_id,
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
                        global_app_rest_client_id = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='APP_REST_CLIENT_SECRET')
                        global_app_rest_client_secret = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_AUTH')
                        global_service_auth = 'https://' + location.hostname + json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP')
                        global_rest_app = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP_LOG')
                        global_rest_app_log = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_GEOLOCATION')
                        global_service_geolocation = 'https://' + location.hostname + json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_GEOLOCATION_GPS_IP')
                        global_service_geolocation_gps_ip = json.data[i].parameter_value;
                }
            }
            else
                show_message('Error: get_parameters: ' + result);
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
            document.getElementById('info').innerHTML = `<img src="${global_img_diagram_img}"/>`;
            break;
        }
        case 2:{
            document.getElementById('window_info').style.visibility = 'visible';
            document.getElementById('info').innerHTML = `<img src="${global_img_datamodel_img}"/>`;
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
function show_message(message){
    message = message.replace('<pre>','');
    message = message.replace('</pre>','');
    document.getElementById('message_title').innerHTML = message;
    document.getElementById('dialogue_message').style.visibility='visible'; 
}

function init(){
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
    document.getElementById('info').innerHTML = `<img src="${global_img_datamodel_img}"/>`;
    get_parameters().then(function(){
        get_token().then(function(){
            get_gps_from_ip();
        })
    })
}
