var global_rest_admin_at;

function show_menu(menu){
    document.getElementById('menu_1_content').style.display='none';
    document.getElementById('menu_2_content').style.display='none';
    document.getElementById('menu_3_content').style.display='none';
    document.getElementById('menu_4_content').style.display='none';
    document.getElementById(`menu_${menu}_content`).style.display='block';
}
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
                    document.getElementById('dashboard').style.visibility = 'visible';
                    document.getElementById('menu_1_content').style.display = 'block';
                    document.getElementById('dialogue_login').style.visibility = 'hidden';
                    document.getElementById('menu_1').addEventListener('click', function() { show_menu(1) }, false);
                    document.getElementById('menu_2').addEventListener('click', function() { show_menu(2) }, false);
                    document.getElementById('menu_3').addEventListener('click', function() { show_menu(3) }, false);
                    document.getElementById('menu_4').addEventListener('click', function() { show_menu(4) }, false);
                    document.getElementById('menu_5').addEventListener('click', function() { admin_logout() }, false);
                    document.getElementById('menu_1_content_widget').innerHTML = 'One';
                    document.getElementById('menu_2_content_widget').innerHTML = 'Two';
                    document.getElementById('menu_3_content_widget').innerHTML = 'Three';
                    document.getElementById('menu_4_content_widget').innerHTML = 'Four';
                    document.getElementById("login_username").value='';
                    document.getElementById("login_password").value='';
                }
            }
            else
                alert('Error: ' + result);
        });
}
function admin_logout(){
    document.getElementById('menu_1').removeEventListener('click', function() { show_menu(1) }, false);
    document.getElementById('menu_2').removeEventListener('click', function() { show_menu(2) }, false);
    document.getElementById('menu_3').removeEventListener('click', function() { show_menu(3) }, false);
    document.getElementById('menu_4').removeEventListener('click', function() { show_menu(4) }, false);
    document.getElementById('menu_5').removeEventListener('click', function() { admin_login() }, false);
    document.getElementById('dashboard').style.visibility = 'hidden';
    document.getElementById('menu_1_content_widget').innerHTML = '';
    document.getElementById('menu_2_content_widget').innerHTML = '';
    document.getElementById('menu_3_content_widget').innerHTML = '';
    document.getElementById('menu_4_content_widget').innerHTML = '';
    document.getElementById('dialogue_login').style.visibility = 'visible';
    document.getElementById('body').classList = 'theme_light';
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
function countdown(remaining) {
    if(remaining <= 0)
        location.reload(true);
    document.getElementById("maintenance_countdown").innerHTML = remaining;
    setTimeout(function(){ countdown(remaining - 1); }, 1000);
};
function init(module_type){
    keyfunctions();

    switch (module_type){
        case 'ADMIN':{
            break;
        }
        case 'MAINTENANCE':{
            countdown(60);
            break;
        }
        default:{
            break;
        }
    }
}
