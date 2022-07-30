window.global_rest_admin_at = '';

function admin_login(){
    var json;
    var json_data = `{${get_uservariables()}}`;
    common_fetch_token(1,
                       json_data,
                       document.getElementById("admin_login_username").value, 
                       document.getElementById("admin_login_password").value, (err, result) =>{
        if (err)
            null;
        else{
            json = JSON.parse(result);
            if (json.success == 1){
                common_fetch('/service/forms/admin/secure' + '?', 
                                'GET', 2, null, null, (err, result) =>{
                    if (err)
                        null;
                    else{
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
                })
            }
        }
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
}
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
