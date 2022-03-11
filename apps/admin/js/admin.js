var global_rest_admin_at;

function admin_login(){
    var status;
    var json;
    fetch('/service/auth/admin',
    {method: 'POST',
        headers: {
        'Authorization': 'Basic ' + btoa(document.getElementById("login_username").value + ':' + document.getElementById("login_password").value)
        }
    })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            if (status == 200){
                json = JSON.parse(result);
                if (json.success == 1){
                    global_rest_admin_at = json.token_at;
                    fetch('/service/forms/admin/secure',
                    {method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + global_rest_admin_at,
                        }
                    })
                        .then(function(response) {
                            status = response.status;
                            return response.text();
                        })
                        .then(function(result) {
                            if (status == 200){
                                document.getElementById("login_username").value='';
                                document.getElementById("login_password").value='';                        
                                document.getElementById('dialogue_login').style.visibility = 'hidden';
                                document.getElementById('secure').style.visibility = 'visible';
                                document.getElementById('secure').innerHTML = result;
                                //make script in innerHTML work:
                                var scripts = Array.prototype.slice.call(document.getElementById('secure').getElementsByTagName("script"));
                                for (var i = 0; i < scripts.length; i++) {
                                    if (scripts[i].src != "") {
                                        var tag = document.createElement("script");
                                        tag.src = scripts[i].src;
                                        document.getElementsByTagName("head")[0].appendChild(tag);
                                    }
                                    else {
                                        eval(scripts[i].innerHTML);
                                    }
                                }
                            }
                            else
                                alert('Error: ' + result);
                        });
                }
            }
            else
                alert('Error: ' + result);
        });
}
function keyfunctions(){
    document.getElementById("login_username").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            admin_login();
            //unfocus
            document.getElementById("login_username").blur();
        }
    });
    document.getElementById("login_password").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            admin_login();
            //unfocus
            document.getElementById("login_password").blur();
        }
    });
    document.getElementById('login_button').addEventListener('click', function() { admin_login() }, false);
}
function init(){
    keyfunctions();
}
