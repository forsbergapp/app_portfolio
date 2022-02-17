var global_module_type;
var global_app_id = 0;
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
function get_gps_from_ip(){
    var status;
    var json;
	fetch(global_service_geolocation + global_service_gps_ip + '?app_id=' + global_app_id,
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
                app_log('INIT', 
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
                if (json.data[i].id !==0){
                    html +=
                    `<div class='app_link' onclick='window.open("${json.data[i].url}");'>
                            <div class='app_logo_div'><img class='app_logo' src='${json.data[i].logo}' /></div>
                            <div class='app_name'>${json.data[i].app_name}</div>
                    </div>`;
                }
            }
            document.getElementById('apps').innerHTML = html;
          }
          else
            alert('Error: get_apps: ' + result);
        });
}

function get_token() {
	var status;
    var json;
    fetch(global_service_auth_token_url + '?app_id=' + global_app_id + '&app_user_id=',
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
                get_gps_from_ip();
                get_apps();
            }
          else
            alert('Error: get_token: ' + result);
        });
}

function get_parameters() {
    var status;
    var json;
    fetch(global_rest_url_base + global_rest_app_parameter + global_app_id,
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
                        document.getElementById('copyright').innerHTML=json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='EMAIL'){
                        document.getElementById('app_email').href='mailto:' + json.data[i].parameter_value;
                        document.getElementById('app_email').innerHTML=json.data[i].parameter_value;    
                    }
                    if (json.data[i].parameter_name=='SERVICE_GEOLOCATION')
                        global_service_geolocation = 'https://' + location.hostname + json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_GPS_IP')
                        global_service_gps_ip = json.data[i].parameter_value;
                }
                get_token();
            }
            else
                alert('Error: get_parameters: ' + result);
        });
}

function countdown(remaining) {
    if(remaining <= 0)
        location.reload(true);
    document.getElementById("maintenance_countdown").innerHTML = remaining;
    setTimeout(function(){ countdown(remaining - 1); }, 1000);
};
function init_maintenance(){
    global_module_type='MAINTENANCE';
    countdown(60);
    get_parameters();
}

function init(){
    global_module_type='INIT';
    document.getElementById("toggle_checkbox").checked = true;
    get_parameters();
}
