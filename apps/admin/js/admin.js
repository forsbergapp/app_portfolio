window.global_rest_admin_at = '';

function admin_login(){
    var status;
    var json;
    var json_data = `{"user_language": "${navigator.language}",
                      "user_timezone": "${Intl.DateTimeFormat().resolvedOptions().timeZone}",
                      "user_number_system": "${Intl.NumberFormat().resolvedOptions().numberingSystem}",
                      "user_platform": "${navigator.platform}",
                      "client_latitude": "${window.global_client_latitude}",
                      "client_longitude": "${window.global_client_longitude}"}`;
    fetch('/service/auth/admin',
    {method: 'POST',
        headers: {
        'Authorization': 'Basic ' + btoa(document.getElementById("admin_login_username").value + ':' + document.getElementById("admin_login_password").value)
        },
        body: json_data
    })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            if (status == 200){
                json = JSON.parse(result);
                if (json.success == 1){
                    window.global_rest_admin_at = json.token_at;
                    fetch('/service/forms/admin/secure',
                    {method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + window.global_rest_admin_at,
                        }
                    })
                        .then(function(response) {
                            status = response.status;
                            return response.text();
                        })
                        .then(function(result) {
                            if (status == 200){
                                document.getElementById("admin_login_username").value='';
                                document.getElementById("admin_login_password").value='';                        
                                document.getElementById('dialogue_admin_login').style.visibility = 'hidden';
                                document.getElementById('secure').style.visibility = 'visible';
                                document.getElementById('secure').innerHTML = result;
                                //make script in innerHTML work:
                                var scripts = Array.prototype.slice.call(document.getElementById('secure').getElementsByTagName("script"));
                                for (var i = 0; i < scripts.length; i++) {
                                    if (scripts[i].src != "") {
                                        var tag = document.createElement("script");
                                        tag.src = scripts[i].src;
                                        document.getElementById('secure').insertBefore(tag, document.getElementById('secure').firstChild);
                                    }
                                    else {
                                        eval(scripts[i].innerHTML);
                                    }
                                }
                            }
                            else
                                show_message('EXCEPTION', null,null, result, window.global_main_app_id, window.global_lang_code);
                        });
                }
            }
            else
                show_message('EXCEPTION', null,null, result, window.global_main_app_id, window.global_lang_code);
        });
}
function setEvents(){
    document.getElementById("admin_login_username").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            admin_login();
            //unfocus
            document.getElementById("admin_login_username").blur();
        }
    });
    document.getElementById("admin_login_password").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            admin_login();
            //unfocus
            document.getElementById("admin_login_password").blur();
        }
    });
    document.getElementById('admin_login_button').addEventListener('click', function() { admin_login() }, false);
    document.getElementById('message_close').addEventListener('click', function() { document.getElementById('dialogue_message').style.visibility='hidden'; }, false);}

function admin_exception_before(){
    null;
}
function init_app(){
    document.getElementById('admin_login_button').innerHTML = window.global_button_default_icon_login;
    setEvents();
}
function init(parameters){
    init_common(parameters);
    init_app();
}
