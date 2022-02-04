var global_module_type;
var global_app_id = 0;
var global_host;
var global_auth_token_url;
var global_rest_client_id;
var global_rest_client_secret;
var global_rest_dt;
var global_service_geolocation;
var global_service_gps_ip;
var global_user_gps_place;
var global_rest_url_base    = 'https://' + location.hostname + '/service/db/api/';
var global_rest_app_log;
var global_rest_app_globals = global_rest_url_base + 'app/mainglobals';

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

	fetch(global_rest_app_log,
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
	fetch(global_service_gps_ip + '?app_id=' + global_app_id,
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
                global_user_gps_latitude  = json.geoplugin_latitude;
                global_user_gps_longitude = json.geoplugin_longitude;
                global_user_gps_place     = json.geoplugin_city + ', ' + 
                                            json.geoplugin_regionName + ', ' + 
                                            json.geoplugin_countryName;
                app_log('INIT', global_module_type, location.hostname, global_user_gps_place, '', 
                        global_user_gps_latitude, global_user_gps_longitude); 
            }
            else
                alert('Error: get_gps_from_ip: ' + result);
        });

	return null;
}

function get_token() {
	var status;
    var json;
    fetch(global_auth_token_url + '?app_id=0&app_user_id=',
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
            }
          else
            alert('Error: get_token: ' + result);
        });
	return null;
}

function get_globals() {
    var status;
    var json;
    fetch(global_rest_app_globals,
      {method: 'GET'})
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            if (status==200){
                json = JSON.parse(result);
                if (json.success === 1){    
                    global_host	                = json.host;
                    global_auth_token_url       = 'https://' + global_host + json.auth_token_url;
                    global_rest_client_id	    = json.rest_client_id;
                    global_rest_client_secret   = json.rest_client_secret;
                    global_service_geolocation 	= 'https://' + global_host + json.service_geolocation;
                    global_service_gps_ip    	= global_service_geolocation + json.service_gps_ip;
                    global_rest_app_log         = global_rest_url_base + json.rest_app_log;

                    document.getElementById('app_email').href='mailto:' + json.email;
                    document.getElementById('app_email').innerHTML=json.email;
                    get_token();
                }
            }
            else
                alert('Error: get_globals: ' + result);
        });
    return null;
}

function open_app(app_no){
    switch (app_no){
        case 1:{
            window.open ("https://timetables." + global_host);	
            break;
        }
        case 2:{
            window.open ("https://propertymanagement." + global_host);
            break;
        }
        default:
            break;
    }
    return null;
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
    get_globals();
}

function init(){
    global_module_type='INIT';
    document.getElementById("toggle_checkbox").checked = true;
    get_globals();
}
