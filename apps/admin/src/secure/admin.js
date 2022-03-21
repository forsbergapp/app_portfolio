<script>

    var global_rest_dt;
    var global_app_rest_client_id;
    var global_app_rest_client_secret;
    var global_service_auth;
    var global_rest_app;
    var global_rest_user_account;
    var global_service_geolocation;
    var global_service_geolocation_gps_ip;

    document.getElementById('menu_1_content').style.display = 'block';
    document.getElementById('menu_1').addEventListener('click', function() { show_menu(1) }, false);
    document.getElementById('menu_2').addEventListener('click', function() { show_menu(2) }, false);
    document.getElementById('menu_3').addEventListener('click', function() { show_menu(3) }, false);
    document.getElementById('menu_4').addEventListener('click', function() { show_menu(4) }, false);
    document.getElementById('menu_5').addEventListener('click', function() { admin_logout() }, false);
    document.getElementById('select_app').addEventListener('click', function() { show_chart(2); }, false);
    document.getElementById('checkbox_maintenance').addEventListener('click', function() { set_maintenance() }, false);


    document.getElementById('button_spinner').style.visibility = 'visible';
    get_parameters().then(function(){
        get_token().then(function(){
            get_apps().then(function(){
                show_menu(1);
                document.getElementById('button_spinner').style.visibility = 'hidden';
            })
        })
    })
    

    async function get_parameters() {
        let status;
        let json;
        await fetch('/service/db/api/app_parameter/0',
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
                        if (json.data[i].parameter_name=='REST_USER_ACCOUNT')
                            global_rest_user_account = json.data[i].parameter_value;
                        if (json.data[i].parameter_name=='SERVICE_GEOLOCATION')
                            global_service_geolocation = 'https://' + location.hostname + json.data[i].parameter_value;
                        if (json.data[i].parameter_name=='SERVICE_GEOLOCATION_GPS_IP')
                            global_service_geolocation_gps_ip = json.data[i].parameter_value;
                    }
                }
                else
                    alert('Error: get_parameters: ' + result);
            });
    }
    async function get_token() {
        let status;
        let json;
        await fetch(global_service_auth + '?app_id=0' + '&app_user_id=',
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
                alert('Error: get_token: ' + result);
            });
    }
    async function get_apps() {
        let status;
        let json;
        await fetch('/service/db/api/' + global_rest_app + '?id=0',
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
                        `<option value='${json.data[i].id}'>APP${json.data[i].id}</option>`;
                }
                document.getElementById('select_app').innerHTML = html;
            }
            else
                alert('Error: get_apps: ' + result);
            });
    }
    function admin_logout(){
        document.getElementById('menu_1').removeEventListener('click', function() { show_menu(1) }, false);
        document.getElementById('menu_2').removeEventListener('click', function() { show_menu(2) }, false);
        document.getElementById('menu_3').removeEventListener('click', function() { show_menu(3) }, false);
        document.getElementById('menu_4').removeEventListener('click', function() { show_menu(4) }, false);
        document.getElementById('menu_5').removeEventListener('click', function() { admin_login() }, false);
        document.getElementById('dialogue_login').style.visibility = 'visible';
        document.getElementById('secure').style.visibility = 'hidden';
        document.getElementById('secure').innerHTML = '';
    }
    function show_menu(menu){
        document.getElementById('menu_1_content').style.display='none';
        document.getElementById('menu_2_content').style.display='none';
        document.getElementById('menu_3_content').style.display='none';
        document.getElementById('menu_4_content').style.display='none';
        document.getElementById(`menu_${menu}_content`).style.display='block';
        switch(menu){
            case 1:{
                show_chart();
                count_connected();
                count_users();
                show_maintenance();
                break;    
            }
            case 2:{
                break;    
            }
            case 3:{
                show_connections();
                break;    
            }
            case 4:{
                break;    
            }
        }            
    }
    function show_chart(chart=''){
        let current_year = new Date().getFullYear();
        let current_month = new Date().getMonth()+1;
        if (chart==1 || chart==''){
            let json;
            let status;
            let app_id ='';
            fetch(`/service/db/api/app_log/admin/stat/uniquevisitor?app_id=${app_id}&statchoice=1&year=${current_year}&month=${current_month}`,
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
                    json = JSON.parse(result);
                    if (json.success == 1){
                        let app_id_array = [];
                        let amount_array = [];
                        for (let i = 0; i < json.data.length; i++) {
                            app_id_array.push('APP' + json.data[i].app_id);
                            amount_array.push(json.data[i].amount);
                        }
                        document.getElementById('box1').innerHTML = '<canvas id="pieChart"></canvas>';
                        const ctx1 = document.getElementById('pieChart').getContext('2d');
                        const pieChart = new Chart(ctx1, {
                            type: 'pie',
                            data: {
                                labels: app_id_array,
                                datasets: [{
                                    label: '',
                                    data: amount_array,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)'
                                    ]
                                }]
                            },
                            options: {
                                responsive:true,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: `Unique Visitors ${current_year}-${current_month} per app`
                                    }
                                }
                            }
                            
                        });
                    }
                }
            })
        }
        if (chart==2 || chart==''){
            let json2;
            let status2;
            let app_id2 = document.getElementById('select_app').options[document.getElementById('select_app').selectedIndex].value;
            fetch(`/service/db/api/app_log/admin/stat/uniquevisitor?app_id=${app_id2}&statchoice=2&year=${current_year}&month=${current_month}`,
            {method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + global_rest_admin_at,
                }
            })
            .then(function(response) {
                status2 = response.status;
                return response.text();
            })
            .then(function(result) {
                if (status2 == 200){
                    json2 = JSON.parse(result);
                    if (json2.success == 1){
                        let day_array = [];
                        let amount_array = [];
                        for (let i = 0; i < json2.data.length; i++) {
                            day_array.push(json2.data[i].day);
                            amount_array.push(json2.data[i].amount);
                        }
                        document.getElementById('box2').innerHTML = '<canvas id="barChart"></canvas>';
                        const ctx2 = document.getElementById('barChart').getContext('2d');
                        const barChart = new Chart(ctx2, {
                            type: 'bar',
                            data: {
                                labels: day_array,
                                datasets: [{
                                    label: `Unique Visitors ${current_year}-${current_month} per day`,
                                    data: amount_array,
                                    backgroundColor: [
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(54, 162, 235, 1)'
                                    ]
                                }]
                            },
                            options: {
                                responsive:true,
                                scale: {
                                  ticks: {
                                    precision: 0
                                  }
                                }
                            }
                        });
                    }
                }
            })
        }
    }
    function count_connected(){
        let status;
        let json;
        fetch('/service/broadcast/connected',
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
                json = JSON.parse(result);
                document.getElementById('count_connected').innerHTML = json.data.length;
            }
            else
                alert('Error: count_connected: ' + result);
            });
    }
    function count_users(){
        let status;
        let json;
        fetch('/service/db/api/' + global_rest_user_account + '/admin/count',
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
                json = JSON.parse(result);
                document.getElementById('count_local').innerHTML = json.data.count_local;
                document.getElementById('count_google').innerHTML = json.data.count_google;
                document.getElementById('count_facebook').innerHTML = json.data.count_facebook;
            }
            else
                alert('Error: show_maintenance: ' + result);
            });
    }
    function show_maintenance(){
        let status;
        let json;
        fetch('/service/db/api/app_parameter/admin/0?parameter_name=SERVER_MAINTENANCE',
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
                json = JSON.parse(result);
                if (json.data==1)
                    document.getElementById('checkbox_maintenance').checked =true;
                else
                    document.getElementById('checkbox_maintenance').checked =false;
            }
            else
                alert('Error: show_maintenance: ' + result);
            });
    }
    function set_maintenance(){
        let status;
        let json;
        let check_value;
        if (document.getElementById('checkbox_maintenance').checked ==true)
            check_value = 1;
        else
            check_value = 0;
        let json_data = `{"parameter_name":"SERVER_MAINTENANCE",
                          "parameter_value":${check_value}}`;
        fetch('/service/db/api/app_parameter/admin/0',
        {method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + global_rest_admin_at,
        },
        body: json_data
        })
        .then(function(response) {
                status = response.status;
                return response.text();
        })
        .then(function(result) {
            if (status == 200){
                null;
            }
            else
                alert('Error: show_maintenance: ' + result);
            });
    }
    async function show_connections(){
        let status;
        let json;
        await fetch(`/service/db/api/app_log?limit=100`,
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
            if (status == 200)
                json = JSON.parse(result);
                if (json.success === 1){
                    let list_connections = document.getElementById('list_connections');
                    list_connections.innerHTML = '';
                    let html = '';
                    html += 
                        `<div id='list_connections_row_title' class='list_connections_row'>
                            <div class='list_connections_col'>
                                <div>ID</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>APP_ID</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>MODULE</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>TYPE</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>IP</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>GPS LAT</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>GPS_LONG</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>DATE</div>
                            </div>
                        </div>`;
                    for (i = 0; i < json.data.length; i++) {
                        html += 
                        `<div class='list_connections_row'>
                            <div class='list_connections_col'>
                                <div>${json.data[i].id}</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>${json.data[i].app_id}</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>${json.data[i].app_module}</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>${json.data[i].app_module_type}</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>${json.data[i].server_remote_addr.replace('::ffff:','')}</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>${json.data[i].user_gps_latitude}</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>${json.data[i].user_gps_longitude}</div>
                            </div>
                            <div class='list_connections_col'>
                                <div>${json.data[i].date_created}</div>
                            </div>
                        </div>`;
                    }
                    list_connections.innerHTML = html;
                }
            else
                alert('Error: show_connections: ' + result);
            });
    }    
</script>
