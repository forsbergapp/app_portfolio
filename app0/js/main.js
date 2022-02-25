var global_module = 'APP';
var global_app_id = 0;
var global_app_copyright;
var global_app_email;
var global_service_auth_token_url;
var global_service_geolocation;
var global_service_gps_ip;
var global_rest_url_base    = 'https://' + location.hostname + '/service/db/api/';
var global_rest_app;
var global_rest_app_parameter = 'app_parameter/';
var global_rest_app_log;
var global_rest_client_id;
var global_rest_client_secret;
var global_rest_dt;
var global_img_diagram_img = '/app0/info/app_portfolio.jpg';
var global_img_datamodel_img = '/app0/info/datamodel.jpg';

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
			alert(responseText_get_error('app_log', error));
		});
}
async function get_gps_from_ip(module_type){
    var status;
    var json;
	await fetch(global_service_geolocation + global_service_gps_ip + '?app_id=' + global_app_id,
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
                        module_type, 
                        location.hostname, 
                        json.geoplugin_city + ', ' + 
                        json.geoplugin_regionName + ', ' + 
                        json.geoplugin_countryName, 
                        '', 
                        json.geoplugin_latitude, 
                        json.geoplugin_longitude); 
            }
            else
                alert('Error: get_gps_from_ip: ' + result);
        });
}
function get_apps() {
	var status;
    var json;
    fetch(global_rest_url_base + global_rest_app + '?id=' + global_app_id,
    {method: 'GET',
     headers: {
			'Authorization': 'Bearer ' + global_rest_dt
        }
    })
      .then(function(response) {
            status = response.status;
            return response.text();
      })
      .then(function(result) {
          if (status == 200){
            json = JSON.parse(result);
            let html='';
            for (var i = 0; i < json.data.length; i++) {
                    html +=
                    `<div class='app_link' onclick='window.open("${json.data[i].url}");'>
                            <div class='app_logo_div'><img class='app_logo' src='${json.data[i].logo}' /></div>
                            <div class='app_name'>${json.data[i].app_name}</div>
                    </div>`;
            }
            document.getElementById('apps').innerHTML = html;
          }
          else
            alert('Error: get_apps: ' + result);
        });
}

async function get_token() {
	var status;
    var json;
    await fetch(global_service_auth_token_url + '?app_id=' + global_app_id + '&app_user_id=',
    {method: 'POST',
     headers: {
        'Authorization': 'Basic ' + btoa(global_rest_client_id + ':' + global_rest_client_secret)
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
                global_rest_at = json.token_at;
                global_rest_dt = json.token_dt;
            }
          else
            alert('Error: get_token: ' + result);
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
                        global_rest_client_id = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='APP_REST_CLIENT_SECRET')
                        global_rest_client_secret = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_AUTH_TOKEN_URL')
                        global_service_auth_token_url = 'https://' + location.hostname + json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP')
                        global_rest_app = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP_LOG')
                        global_rest_app_log = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='COPYRIGHT')
                        global_app_copyright =json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='EMAIL')
                        global_app_email = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_GEOLOCATION')
                        global_service_geolocation = 'https://' + location.hostname + json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_GPS_IP')
                        global_service_gps_ip = json.data[i].parameter_value;
                }
            }
            else
                alert('Error: get_parameters: ' + result);
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
function countdown(remaining) {
    if(remaining <= 0)
        location.reload(true);
    document.getElementById("maintenance_countdown").innerHTML = remaining;
    setTimeout(function(){ countdown(remaining - 1); }, 1000);
};
function init(module_type){
    switch (module_type){
        case 'HOME':{
            document.getElementById("toggle_checkbox").checked = true;
            get_parameters().then(function(){
                document.getElementById('copyright').innerHTML = global_app_copyright;
                document.getElementById('app_email').href='mailto:' + global_app_email;
                document.getElementById('app_email').innerHTML=global_app_email;
                get_token().then(function(){
                    get_gps_from_ip(module_type).then(function(){
                        get_apps();
                    })
                })
            })
            break;
        }
        case 'INIT':{
            document.getElementById('info_diagram_img').src=global_img_diagram_img;
            document.getElementById('info_datamodel_img').src=global_img_datamodel_img;        
            get_parameters().then(function(){
                document.getElementById('copyright').innerHTML = global_app_copyright;
                document.getElementById('app_email').href='mailto:' + global_app_email;
                document.getElementById('app_email').innerHTML=global_app_email;
                get_token().then(function(){
                    get_gps_from_ip(module_type);
                    zoom_info('');
                    move_info(null,null);
                    document.getElementById('info_diagram').addEventListener('click', function() {info(1);}, false);
                    document.getElementById('info_datamodel').addEventListener('click', function() {info(2);}, false);
                    document.getElementById('toolbar_btn_close').addEventListener('click', function() {info(3);}, false);
                    document.getElementById('toolbar_btn_zoomout').addEventListener('click', function() {zoom_info(-1);}, false);
                    document.getElementById('toolbar_btn_zoomin').addEventListener('click', function() {zoom_info(1);}, false);
                    document.getElementById('toolbar_btn_left').addEventListener('click', function() {move_info(-1,0);}, false);
                    document.getElementById('toolbar_btn_right').addEventListener('click', function() {move_info(1,0);}, false);
                    document.getElementById('toolbar_btn_up').addEventListener('click', function() {move_info(0,-1);}, false);
                    document.getElementById('toolbar_btn_down').addEventListener('click', function() {move_info(0,1);}, false);
                })
            })
            break;
        }
        case 'MAINTENANCE':{
            countdown(60);
            get_parameters().then(function(){
                get_token().then(function(){
                    get_gps_from_ip(module_type);
                })
            })
            break;
        }
        default:{
            break;
        }
    }
}
