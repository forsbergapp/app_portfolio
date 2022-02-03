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
	fetch(global_service_gps_ip + '?app_id=' + global_app_id,
        {method: 'GET',
        headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + global_rest_dt
			},
        })
        .then(function(response) {
            if (response.status == 200)
                return response.json();
            else{
                alert('Error: get_gps_from_ip: ' + response.status);
                return response;
            }
        })
        .then(function(result) {
            global_user_gps_latitude  = result.geoplugin_latitude;
            global_user_gps_longitude = result.geoplugin_longitude;
            global_user_gps_place     = result.geoplugin_city + ', ' + 
                                        result.geoplugin_regionName + ', ' + 
                                        result.geoplugin_countryName;
            app_log('INIT', global_module_type, location.hostname, global_user_gps_place, '', 
                    global_user_gps_latitude, global_user_gps_longitude); 
        })
        .catch((error) => {
            alert('Error: get_gps_from_ip:' + error)
        });

	return null;
}

function get_token() {
	//get token access
    fetch(global_auth_token_url + 1,
    {method: 'POST',
     headers: {
        'Authorization': 'Basic ' + btoa(global_rest_client_id + ':' + global_rest_client_secret)
        }
    })
      .then(function(response) {
          if (response.status == 200)
              return response.json();
          else{
              alert('Error: get_token: ' + response.status);
              return response;
          }
      })
      .then(function(result) {
          if (result.success === 1){
            global_rest_at = result.token;
            fetch(global_auth_token_url + 2,
                {method: 'POST',
                 headers: {
                   'Authorization': 'Basic ' + btoa(global_rest_client_id + ':' + global_rest_client_secret)
                   }
                })
                .then(function(response) {
                    if (response.status == 200)
                        return response.json();
                    else{
                        alert('Error: get_token2: ' + response.status);
                        return response;
                    }
                })
                .then(function(result) {
                    if (result.success === 1){
                        //set token data
			            global_rest_dt = result.token;
                        get_gps_from_ip();
                    }
                })
                .catch((error) => {
                    alert('Error: get_token2:' + error)
                });
          }
        })
      .catch((error) => {
          alert('Error: get_token:' + error)
      });
	return null;
}

function get_globals() {
    fetch(global_rest_app_globals,
      {method: 'GET'})
        .then(function(response) {
            if (response.status == 200)
                return response.json();
            else{
                alert('Error: get_globals: ' + response.status);
                return response;
            }
        })
        .then(function(result) {
            if (result.success === 1){
                global_host	                = result.host;
                global_auth_token_url       = 'https://' + global_host + result.auth_token_url;
                global_rest_client_id	    = result.rest_client_id;
                global_rest_client_secret   = result.rest_client_secret;
                global_service_geolocation 	= 'https://' + global_host + result.service_geolocation;
                global_service_gps_ip    	= global_service_geolocation + result.service_gps_ip;
                global_rest_app_log         = global_rest_url_base + result.rest_app_log;

                document.getElementById('app_email').href='mailto:' + result.email;
                document.getElementById('app_email').innerHTML=result.email;
                get_token();
            }
        })
        .catch((error) => {
            alert('Error: get_globals:' + error)
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
