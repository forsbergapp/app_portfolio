<script>

    var global_rest_dt;
    var global_app_rest_client_id;
    var global_app_rest_client_secret;
    var global_service_auth;
    var global_rest_app;
    var global_rest_user_account;
    var global_service_geolocation;
    var global_service_geolocation_gps_ip;
    var global_service_geolocation_gps_place;
    //map variables
    var global_gps_map_container      ='mapid';
    var global_gps_map_style_baseurl  ='mapbox://styles/mapbox/';
    var global_gps_map_style          ='satellite-streets-v11';
    var global_gps_map_zoom           = 14;
    var global_gps_map_flyto          = 1;
    var global_gps_map_jumpto         = 0;
    var global_gps_map_marker_div_gps = 'map_marker_gps';
    var global_gps_map_popup_offset   = 25;
    //session variables
    var global_session_map;
    var global_session_gps_latitude;
    var global_session_gps_longitude;
    var global_page = 0;

    document.getElementById('menu_1_content').style.display = 'block';
    document.getElementById('menu_1').addEventListener('click', function() { show_menu(1) }, false);
    document.getElementById('menu_2').addEventListener('click', function() { show_menu(2) }, false);
    document.getElementById('menu_3').addEventListener('click', function() { show_menu(3) }, false);
    document.getElementById('menu_4').addEventListener('click', function() { show_menu(4) }, false);
    document.getElementById('menu_5').addEventListener('click', function() { admin_logout() }, false);
    document.getElementById('select_app_menu1').addEventListener('change', function() { show_chart(2); }, false);
    document.getElementById('select_app_menu3').addEventListener('change', function() { show_app_log(); show_connected();}, false);
    document.getElementById('select_maptype').addEventListener('change', function() { map_set_style(); }, false);
    document.getElementById('select_broadcast_type').addEventListener('change', function() { set_broadcast_type(); }, false);
    document.getElementById('maintenance_broadcast_info').addEventListener('click', function() { show_broadcast_dialogue('ALL'); }, false);
    document.getElementById('send_broadcast_send').addEventListener('click', function() { sendBroadcast(); }, false);
    document.getElementById('send_broadcast_close').addEventListener('click', function() { closeBroadcast()}, false);
    
    document.getElementById('list_app_log_col_title1').addEventListener('click', function() { list_sort_click(this)}, false); 
    document.getElementById('list_app_log_col_title2').addEventListener('click', function() { list_sort_click(this)}, false);
    document.getElementById('list_app_log_col_title3').addEventListener('click', function() { list_sort_click(this)}, false);
    document.getElementById('list_app_log_col_title4').addEventListener('click', function() { list_sort_click(this)}, false);
    document.getElementById('list_app_log_col_title5').addEventListener('click', function() { list_sort_click(this)}, false);
    document.getElementById('list_app_log_col_title6').addEventListener('click', function() { list_sort_click(this)}, false);
    document.getElementById('list_app_log_col_title7').addEventListener('click', function() { list_sort_click(this)}, false);
    document.getElementById('list_app_log_col_title8').addEventListener('click', function() { list_sort_click(this)}, false);
    document.getElementById('list_connected_col_title1').addEventListener('click', function() { list_sort_click(this)}, false); 
    document.getElementById('list_connected_col_title2').addEventListener('click', function() { list_sort_click(this)}, false);
    document.getElementById('list_connected_col_title3').addEventListener('click', function() { list_sort_click(this)}, false);
    document.getElementById('list_connected_col_title4').addEventListener('click', function() { list_sort_click(this)}, false);
    document.getElementById('list_connected_col_title5').addEventListener('click', function() { list_sort_click(this)}, false);
    document.getElementById('list_connected_col_title6').addEventListener('click', function() { list_sort_click(this)}, false);
    document.getElementById('list_connected_col_title7').addEventListener('click', function() { list_sort_click(this)}, false);
    
    document.getElementById('select_year_menu3').addEventListener('change', function() { show_app_log()}, false);
    document.getElementById('select_month_menu3').addEventListener('change', function() { show_app_log()}, false);
    document.getElementById('list_connected_title1').addEventListener('click', function() { list_click(this)}, false);
    document.getElementById('list_app_log_title2').addEventListener('click', function() { list_click(this)}, false);
    
    document.getElementById('list_app_log_first').addEventListener('click', function() { page_navigation(this)}, false);
    document.getElementById('list_app_log_previous').addEventListener('click', function() { page_navigation(this)}, false);
    document.getElementById('list_app_log_next').addEventListener('click', function() { page_navigation(this)}, false);
    document.getElementById('list_app_log_last').addEventListener('click', function() { page_navigation(this)}, false);
    
    document.getElementById('checkbox_maintenance').addEventListener('click', function() { set_maintenance() }, false);


    document.getElementById('button_spinner').style.visibility = 'visible';
    get_parameters().then(function(){
        get_token().then(function(){
            get_apps().then(function(){
                get_gps_from_ip().then(function(){
                    show_menu(1);
                    document.getElementById('button_spinner').style.visibility = 'hidden';
                })                
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
                        if (json.data[i].parameter_name=='SERVICE_GEOLOCATION_GPS_PLACE')
                            global_service_geolocation_gps_place = json.data[i].parameter_value;
                        if (json.data[i].parameter_name=='GPS_MAP_ACCESS_TOKEN')
                            global_gps_map_access_token = json.data[i].parameter_value;        
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
                let html='<option value="">ALL</option>';
                for (var i = 0; i < json.data.length; i++) {
                        html +=
                        `<option value='${json.data[i].id}'>APP${json.data[i].id}</option>`;
                }
                document.getElementById('select_app_menu1').innerHTML = html;
                document.getElementById('select_app_menu3').innerHTML = html;
                document.getElementById('select_app_broadcast').innerHTML = html;
            }
            else
                alert('Error: get_apps: ' + result);
            });
    }
    async function get_gps_from_ip() {
        let status;
        await fetch(global_service_geolocation + global_service_geolocation_gps_ip + 
                    '?app_id=' + 0 + 
                    '&app_user_id=' +
                    '&lang_code=en',
            {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + global_rest_dt,
            }
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            if (status === 200) {
                let json = JSON.parse(result);
                global_session_gps_latitude = json.geoplugin_latitude;
                global_session_gps_longitude = json.geoplugin_longitude;
                if (!global_session_map)
                    init_map();
                update_map(global_session_gps_longitude,
                    global_session_gps_latitude,
                    global_gps_map_zoom,
                    json.geoplugin_city + ', ' + 
                    json.geoplugin_region + ', ' + 
                    json.geoplugin_countryCode,
                    global_gps_map_marker_div_gps,
                    global_gps_map_jumpto);
            }
        })
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
                global_page = 0;
                let current_year = new Date().getFullYear();
                document.getElementById('select_year_menu3').innerHTML = 
                    `<option value="${current_year}">${current_year}</option>
                     <option value="${current_year -1}">${current_year-1}</option>
                     <option value="${current_year -2}">${current_year-2}</option>
                     <option value="${current_year -3}">${current_year-3}</option>
                     <option value="${current_year -4}">${current_year-4}</option>
                     <option value="${current_year -5}">${current_year-5}</option>
                     `;
                document.getElementById('select_year_menu3').selectedIndex = 0;
                document.getElementById('select_month_menu3').selectedIndex = new Date().getMonth();
                show_app_log();
                show_connected();
                get_gps_from_ip();
                global_session_map.resize();
                break;    
            }
            case 4:{
                break;    
            }
        }            
    }
    /* MENU 1*/
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
            let app_id2 = document.getElementById('select_app_menu1').options[document.getElementById('select_app_menu1').selectedIndex].value;
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
        let app_id = document.getElementById('select_app_menu1').options[document.getElementById('select_app_menu1').selectedIndex].value;
        fetch(`/service/broadcast/connected?app_id=${app_id}`,
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
    /*MENU 3*/
    function show_user_agent(user_agent){
        return null;
    }
    
    function set_list_eventlisteners(list_type, list_function, event_action){
        let elements = document.querySelectorAll(`.list_${list_type}_${list_function}_click`);   
        let click_function = function() { list_item_action(this)};
        let elementsArray = Array.prototype.slice.call(elements);
        if (event_action==1)
            elementsArray.forEach(function(elem){
                elem.addEventListener("click", click_function);
            });
        else
            elementsArray.forEach(function(elem){
                elem.removeEventListener("click", click_function);
            });
    }
    function list_click(item){
        if (item.id == 'list_connected_title1'){
            document.getElementById('list_connected_form').style.display='block';
            document.getElementById('list_app_log_form').style.display='none';
            show_connected();
        }
        else
            if (item.id == 'list_app_log_title2'){
                document.getElementById('list_app_log_form').style.display='block';
                document.getElementById('list_connected_form').style.display='none';
                global_page = 0;
                show_app_log();
            }
    }
    function get_sort(){
        let sort = '';
        for (let i=1;i <=8;i++){
            if (document.getElementById('list_app_log_col_title' + i).classList.contains('asc'))
                sort = i;
            if (document.getElementById('list_app_log_col_title' + i).classList.contains('desc'))
                sort = i;
        }
        return sort;
    }
    function get_order(item){
        let order_by = '';
        if (document.getElementById(item.id).classList.contains('asc'))
            order_by = 'desc';
        if (document.getElementById(item.id).classList.contains('desc'))
            order_by = 'asc';
        if (order_by=='')
            order_by = 'desc';
        return order_by;
    }
    function list_sort_click(item){
        if (item.id.indexOf('list_app_log_col_title')==0){
            show_app_log(item.id.substr(item.id.length - 1), get_order(item));
        }
        else{
            if (item.id.indexOf('list_connected_col_title')==0){
                show_connected(item.id.substr(item.id.length - 1), get_order(item));
            }
        }
    }
    function page_navigation(item){
        
        let sort = get_sort();
        if (sort =='')
            sort = 8;
        switch (item.id){
            case 'list_app_log_first':{
                global_page = 0;
                show_app_log(sort, get_order(item), 0, 1000);
                break;
            }
            case 'list_app_log_previous':{
                global_page = global_page - 1000;
                if (global_page < 0)
                    global_page = 0;
                show_app_log(sort, get_order(item), global_page, 1000);
                break;
            }
            case 'list_app_log_next':{
                global_page = global_page + 1000;
                show_app_log(sort, get_order(item), global_page, 1000);
                break;
            }
            case 'list_app_log_last':{
                global_page = global_page + 1000;
                show_app_log(sort, get_order(item), global_page, 1000);
                break;
            }
        }
    }
    async function show_connected(sort=4, order_by='desc'){
        let status;
        let json;
        let app_id = document.getElementById('select_app_menu3').options[document.getElementById('select_app_menu3').selectedIndex].value;
        for (let i=1;i<=7;i++){
            document.getElementById('list_connected_col_title' + i).classList.remove('asc');
            document.getElementById('list_connected_col_title' + i).classList.remove('desc');
        }
        document.getElementById('list_connected_col_title' + sort).classList.add(order_by);

        await fetch(`/service/broadcast/connected?app_id=${app_id}&sort=${sort}&order_by=${order_by}&limit=1000`,
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
                    
                    set_list_eventlisteners('connected', 'gps',0);
                    set_list_eventlisteners('connected', 'chat',0);
                    let list_connected = document.getElementById('list_connected');
                    list_connected.innerHTML = '';
                    let html = '';
                    for (i = 0; i < json.data.length; i++) {
                        html += 
                        `<div class='list_connected_row'>
                            <div class='list_connected_col'>
                                <div>${json.data[i].id}</div>
                            </div>
                            <div class='list_connected_col'>
                                <div>${json.data[i].app_id}</div>
                            </div>
                            <div class='list_connected_col'>
                                <div>${show_user_agent(json.data[i].user_agent)}</div>
                            </div>
                            <div class='list_connected_col'>
                                <div>${json.data[i].connection_date}</div>
                            </div>
                            <div class='list_connected_col'>
                                <div>${json.data[i].ip.replace('::ffff:','')}</div>
                            </div>
                            <div class='list_connected_col list_connected_gps_click gps_click'>
                                <div>${json.data[i].gps_latitude}</div>
                            </div>
                            <div class='list_connected_col list_connected_gps_click gps_click'>
                                <div>${json.data[i].gps_longitude}</div>
                            </div>
                            <div class='list_connected_col list_connected_chat_click chat_click'>
                                <div><i class="fas fa-comment"></i></div>
                            </div>
                            
                        </div>`;
                    }
                    list_connected.innerHTML = html;
                    set_list_eventlisteners('connected', 'gps',1);
                    set_list_eventlisteners('connected', 'chat',1);
                }
            else
                alert('Error: show_connected: ' + result);
            });
    }    
    async function show_app_log(sort=8, order_by='desc', offset=0, limit=1000){
        let status;
        let json;
        let app_id = document.getElementById('select_app_menu3').options[document.getElementById('select_app_menu3').selectedIndex].value;
        let year = document.getElementById('select_year_menu3').value;
        let month = document.getElementById('select_month_menu3').value;
        for (let i=1;i <=8;i++){
            document.getElementById('list_app_log_col_title' + i).classList.remove('asc');
            document.getElementById('list_app_log_col_title' + i).classList.remove('desc');
        }
        document.getElementById('list_app_log_col_title' + sort).classList.add(order_by);
        await fetch(`/service/db/api/app_log?app_id=${app_id}&year=${year}&month=${month}&sort=${sort}&order_by=${order_by}&offset=${offset}&limit=${limit}`,
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
                    set_list_eventlisteners('app_log', 'gps',0);
                    let list_app_log = document.getElementById('list_app_log');
                    list_app_log.innerHTML = '';
                    let html = '';
                    for (i = 0; i < json.data.length; i++) {
                        html += 
                        `<div class='list_app_log_row'>
                            <div class='list_app_log_col'>
                                <div>${json.data[i].id}</div>
                            </div>
                            <div class='list_app_log_col'>
                                <div>${json.data[i].app_id}</div>
                            </div>
                            <div class='list_app_log_col'>
                                <div>${json.data[i].app_module}</div>
                            </div>
                            <div class='list_app_log_col'>
                                <div>${json.data[i].app_module_type}</div>
                            </div>
                            <div class='list_app_log_col'>
                                <div>${json.data[i].server_remote_addr.replace('::ffff:','')}</div>
                            </div>
                            <div class='list_app_log_col list_app_log_gps_click gps_click'>
                                <div>${json.data[i].user_gps_latitude}</div>
                            </div>
                            <div class='list_app_log_col list_app_log_gps_click gps_click'>
                                <div>${json.data[i].user_gps_longitude}</div>
                            </div>
                            <div class='list_app_log_col'>
                                <div>${json.data[i].date_created}</div>
                            </div>
                        </div>`;
                    }
                    list_app_log.innerHTML = html;
                    set_list_eventlisteners('app_log', 'gps',1);
                }
            else
                alert('Error: show_app_log: ' + result);
            });
    }    
    function init_map() {
        mapboxgl.accessToken = global_gps_map_access_token;
        global_session_map = new mapboxgl.Map({
            container: global_gps_map_container,
            style: global_gps_map_style_baseurl + global_gps_map_style,
            center: [global_session_gps_latitude,
                     global_session_gps_longitude
            ],
            zoom: global_gps_map_zoom
        });

        global_session_map.addControl(new mapboxgl.NavigationControl());
    }
    function update_map(longitude, latitude, zoom, text_place, marker_id, flyto) {
        if (flyto == 1) {
            global_session_gps_map_mymap.flyTo({
                'center': [longitude, latitude],
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });
        } else {
            if (zoom == '')
                global_session_map.jumpTo({ 'center': [longitude, latitude] });
            else
                global_session_map.jumpTo({ 'center': [longitude, latitude], 'zoom': zoom });
        }
        fetch(`/service/geolocation/getTimezone?latitude=${latitude}&longitude=${longitude}`,
            {method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + global_rest_dt,
                }
            })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(text_timezone) {
            let popuptext = `<div id="map_popup_title">${text_place}</div>
                             <div id="map_popup_sub_title">Timezone</div>
                             <div id="map_popup_sub_title_timezone">${text_timezone}</div>`;
            let popup = new mapboxgl.Popup({ offset: global_gps_map_popup_offset, closeOnClick: false })
            .setLngLat([longitude, latitude])
            .setHTML(popuptext)
            .addTo(global_session_map);
            let el = document.createElement('div');
            el.id = marker_id;
            new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .addTo(global_session_map);
            return null;    
        })
    }
    function map_set_style(){
        global_session_map.setStyle(global_gps_map_style_baseurl + document.getElementById('select_maptype').value);
    }
    function list_item_action(item){
        if (item.className.indexOf('gps_click')>0){
            let status;
            fetch(global_service_geolocation + global_service_geolocation_gps_place + 
                        '?app_id=' + 0 +
                        '&app_user_id=' + 
                        '&latitude=' + item.parentNode.children[5].children[0].innerHTML +
                        '&longitude=' + item.parentNode.children[6].children[0].innerHTML +
                        '&lang_code=en', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + global_rest_dt,
                }
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(result) {
                if (status === 200) {
                    let json = JSON.parse(result);
                    update_map(item.parentNode.children[6].children[0].innerHTML,
                        item.parentNode.children[5].children[0].innerHTML,
                        global_gps_map_zoom,
                        json.geoplugin_place + ', ' + 
                        json.geoplugin_region + ', ' + 
                        json.geoplugin_countryCode,
                        global_gps_map_marker_div_gps,
                        global_gps_map_jumpto);
                }
            })
        }
        else
            if (item.className.indexOf('chat_click')>0){
                show_broadcast_dialogue('CLIENT', item.parentNode.children[0].children[0].innerHTML);
            }
        
    }
    function sendBroadcast(){
        let broadcast_type = document.getElementById('select_broadcast_type').options[document.getElementById('select_broadcast_type').selectedIndex].value;
        let client_id;
        let app_id;
        let broadcast_message = document.getElementById('send_broadcast_message').value;
        let destination_app;

        if (broadcast_message==''){
            alert('Please enter message');
            return null;
        }
        
        if (document.getElementById('client_id').innerHTML==''){
            destination_app=1;
            app_id = document.getElementById('select_app_broadcast').options[document.getElementById('select_app_broadcast').selectedIndex].value;
            if (app_id == '')
                app_id = 'null';
            client_id = 'null';
        }
        else{
            destination_app=0;
            client_id = document.getElementById('client_id').innerHTML;
            app_id = 'null';
        }
            
        let json_data =`{"destination_app": ${destination_app},
                         "app_id": ${app_id},
                         "client_id": ${client_id},
                         "broadcast_type" :"${broadcast_type}", 
                         "broadcast_message":"${broadcast_message}"}`;
        fetch('/service/broadcast',
        {method: 'POST',
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
                alert('Sent!');
            }
            else
                alert('Error: sendBroadcast: ' + result);
            });
    }    
    function closeBroadcast(){
        document.getElementById('dialogue_send_broadcast').style.visibility='hidden'; 
        document.getElementById('client_id_label').style.display='inline-block';
        document.getElementById('client_id').style.display='inline-block';
        document.getElementById('select_app_broadcast').style.display='inline-block';
        document.getElementById('client_id').innerHTML='';
        document.getElementById('send_broadcast_message').value='';
    }
    function show_broadcast_dialogue(dialogue_type, client_id=null){
        switch (dialogue_type){
            case 'CLIENT':{
                //hide and set INFO, should not be able to send MAINTENANCE message here
                document.getElementById('select_broadcast_type').style.display='none';
                document.getElementById('select_broadcast_type').selectedIndex = 0;
                //hide app selection
                document.getElementById('select_app_broadcast').style.display='none';
                //show client id
                document.getElementById('client_id_label').style.display = 'inline-block';
                document.getElementById('client_id').style.display = 'inline-block';
                document.getElementById('client_id').innerHTML = client_id;
                break;
            }
            case 'APP':{
                //hide and set INFO, should not be able to send MAINTENANCE message here
                document.getElementById('select_broadcast_type').style.display='none';
                document.getElementById('select_broadcast_type').selectedIndex = 0;
                //show app selection
                document.getElementById('select_app_broadcast').style.display='block';
                //hide client id
                document.getElementById('client_id_label').style.display = 'none';
                document.getElementById('client_id').style.display = 'none';
                document.getElementById('client_id').innerHTML = '';
                break;
            }
            case 'ALL':{
                //show broadcast type and INFO
                document.getElementById('select_broadcast_type').style.display='inline-block';
                document.getElementById('select_broadcast_type').selectedIndex = 0;
                //show app selection
                document.getElementById('select_app_broadcast').style.display='block';
                //hide client id
                document.getElementById('client_id_label').style.display = 'none';
                document.getElementById('client_id').style.display = 'none';
                document.getElementById('client_id').innerHTML = '';
                break;
            }
        }
        document.getElementById('dialogue_send_broadcast').style.visibility='visible';
    }
    function set_broadcast_type(){
        switch (document.getElementById('select_broadcast_type').value){
            case 'INFO':{
                //show app selection
                document.getElementById('select_app_broadcast').style.display='block';
                //hide client id
                document.getElementById('client_id_label').style.display = 'none';
                document.getElementById('client_id').style.display = 'none';
                document.getElementById('client_id').innerHTML = '';
                break;
            }
            case 'MAINTENANCE':{
                //hide app selection
                document.getElementById('select_app_broadcast').style.display='none';
                //hide client id
                document.getElementById('client_id_label').style.display = 'none';
                document.getElementById('client_id').style.display = 'none';
                document.getElementById('client_id').innerHTML = '';
                break;
            }
        }
    }
</script>
