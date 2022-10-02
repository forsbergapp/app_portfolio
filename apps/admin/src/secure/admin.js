<script>
    /*
    Functions and globals in this order:
    MISC
    BROADCAST
    DB INFO
    USER STAT
    APP ADMIN
    MONITOR
    MAP
    EXCEPTION
    INIT
    */
/*----------------------- */
/* MISC                   */
/*----------------------- */
function show_menu(menu){
    document.getElementById('menu_1_content').style.display='none';
    document.getElementById('menu_2_content').style.display='none';
    document.getElementById('menu_3_content').style.display='none';
    document.getElementById('menu_4_content').style.display='none';
    document.getElementById(`menu_${menu}_content`).style.display='block';
    let current_year = new Date().getFullYear();
    let yearvalues =   `<option value="${current_year}">${current_year}</option>
                        <option value="${current_year -1}">${current_year-1}</option>
                        <option value="${current_year -2}">${current_year-2}</option>
                        <option value="${current_year -3}">${current_year-3}</option>
                        <option value="${current_year -4}">${current_year-4}</option>
                        <option value="${current_year -5}">${current_year-5}</option>
                        `;
    switch(menu){
        case 1:{
            show_db_info().then(function(){
                show_db_info_space().then(function(){
                    check_maintenance();
                })
            })
            break;
        }
        case 2:{
            document.getElementById('select_year_menu2').innerHTML = yearvalues;
            document.getElementById('select_year_menu2').selectedIndex = 0;
            document.getElementById('select_month_menu2').selectedIndex = new Date().getMonth();
            show_chart(1).then(function(){
                show_chart(2).then(function(){
                    count_users();
                });
            });                
            break;    
        }
        case 3:{
            show_apps();
            break;    
        }
        case 4:{
            window.global_page = 0;
            //connected
            document.getElementById('select_year_menu4_list_connected').innerHTML = yearvalues;
            document.getElementById('select_year_menu4_list_connected').selectedIndex = 0;
            document.getElementById('select_month_menu4_list_connected').selectedIndex = new Date().getMonth();
            //log
            document.getElementById('select_year_menu4_app_log').innerHTML = yearvalues;
            document.getElementById('select_year_menu4_app_log').selectedIndex = 0;
            document.getElementById('select_month_menu4_app_log').selectedIndex = new Date().getMonth();
            //server log
            document.getElementById('select_year_menu4').innerHTML = yearvalues;
            document.getElementById('select_year_menu4').selectedIndex = 0;
            document.getElementById('select_month_menu4').selectedIndex = new Date().getMonth();
            document.getElementById('select_day_menu4').selectedIndex = new Date().getDate() -1;
            nav_click(document.getElementById('list_connected_title'));
            get_server_log_parameters().then(function() {
                if (admin_token_has_value()){
                    window.global_session_map.resize();
                }
            })
            break;
        }
    }            
}
function show_user_agent(user_agent){
    return null;
}
function close_lov(){
    document.getElementById('dialogue_lov').style.visibility = 'hidden';
    document.getElementById('lov_title').innerHTML='';
    document.getElementById('lov_list').innerHTML='';
}
function show_lov(title_text, lov_list_content){
    document.getElementById('lov_title').innerHTML = title_text;
    document.getElementById('dialogue_lov').style.visibility = 'visible';
    document.getElementById('lov_list').innerHTML = lov_list_content;
}    

async function get_apps() {
    let json;

    common_fetch(window.global_rest_url_base + window.global_rest_app + '/admin?id=0', 
                 'GET', 2, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            json = JSON.parse(result);
            
            let html=`<option value="">${window.global_icon_infinite}</option>`;
            for (var i = 0; i < json.data.length; i++) {
                    html +=
                    `<option value='${json.data[i].id}'>${json.data[i].id} - ${json.data[i].app_name}</option>`;
            }
            document.getElementById('select_app_menu2').innerHTML = html;
            document.getElementById('select_app_menu4_app_log').innerHTML = html;
            document.getElementById('select_app_menu4_list_connected').innerHTML = html;
            document.getElementById('select_app_menu4').innerHTML = html;
            document.getElementById('select_app_broadcast').innerHTML = html;
        
        }
    })
}

/*----------------------- */
/* BROADCAST              */
/*----------------------- */
function sendBroadcast(){
    let broadcast_type = document.getElementById('select_broadcast_type').options[document.getElementById('select_broadcast_type').selectedIndex].value;
    let client_id;
    let app_id;
    let broadcast_message = document.getElementById('send_broadcast_message').value;
    let destination_app;

    if (broadcast_message==''){
        show_message('INFO', null, null, `${window.global_icon_message_text}!`, window.global_app_id);
        return null;
    }
    
    if (document.getElementById('client_id').innerHTML==''){
        destination_app=true;
        app_id = document.getElementById('select_app_broadcast').options[document.getElementById('select_app_broadcast').selectedIndex].value;
        if (app_id == '')
            app_id = 'null';
        client_id = 'null';
    }
    else{
        destination_app=false;
        client_id = document.getElementById('client_id').innerHTML;
        app_id = 'null';
    }
        
    let json_data =`{"destination_app": ${destination_app},
                        "app_id": ${app_id},
                        "client_id": ${client_id},
                        "broadcast_type" :"${broadcast_type}", 
                        "broadcast_message":"${broadcast_message}"}`;
    common_fetch('/service/broadcast?',
                 'POST', 2, json_data, null, null, (err, result) =>{
        if (err)
            null;
        else{
            show_message('INFO', null, null, `${window.global_icon_app_send}!`, window.global_app_id);
        }
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
/*----------------------- */
/* DB INFO                */
/*----------------------- */
async function show_db_info(){
    if (admin_token_has_value()){
        let json;
        await common_fetch('/service/db/admin/getDBInfo?',
                           'GET', 2, null, null, null, (err, result) =>{
            if (err)
                null;
            else{
                json = JSON.parse(result);
                document.getElementById('menu_1_db_info_database_data').innerHTML = json.data.database_use;
                document.getElementById('menu_1_db_info_name_data').innerHTML = json.data.database_name;
                document.getElementById('menu_1_db_info_version_data').innerHTML = json.data.version;
                document.getElementById('menu_1_db_info_database_schema_data').innerHTML = json.data.database_schema;
                document.getElementById('menu_1_db_info_host_data').innerHTML = json.data.hostname;
                document.getElementById('menu_1_db_info_connections_data').innerHTML = json.data.connections;
                document.getElementById('menu_1_db_info_started_data').innerHTML = json.data.started;
            }
        })
    }
}
async function show_db_info_space(){
    if (admin_token_has_value()){
        let json;
        let size = '(Mb)';
        let roundOff = (num) => {
            const x = Math.pow(10,2);
            return Math.round(num * x) / x;
          }
        document.getElementById('menu_1_db_info_space_detail').innerHTML = window.global_app_spinner;
        await common_fetch('/service/db/admin/getDBInfoSpace?', 'GET', 2, null, null, null, (err, result) =>{
            if (err)
                null;
            else{
                json = JSON.parse(result);
                let html = `<div id='menu_1_db_info_space_detail_row_title' class='menu_1_db_info_space_detail_row'>
                                <div id='menu_1_db_info_space_detail_col_title1' class='menu_1_db_info_space_detail_col list_title'>
                                    <div>TABLE NAME</div>
                                </div>
                                <div id='menu_1_db_info_space_detail_col_title2' class='menu_1_db_info_space_detail_col list_title'>
                                    <div>SIZE ${size}</div>
                                </div>
                                <div id='menu_1_db_info_space_detail_col_title3' class='menu_1_db_info_space_detail_col list_title'>
                                    <div>DATA USED ${size}</div>
                                </div>
                                <div id='menu_1_db_info_space_detail_col_title4' class='menu_1_db_info_space_detail_col list_title'>
                                    <div>DATA FREE ${size}</div>
                                </div>
                                <div id='menu_1_db_info_space_detail_col_title5' class='menu_1_db_info_space_detail_col list_title'>
                                    <div>% USED</div>
                                </div>
                            </div>`;
                for (i = 0; i < json.data.length; i++) {
                    html += 
                    `<div id='menu_1_db_info_space_detail_row_${i}' class='menu_1_db_info_space_detail_row' >
                        <div class='menu_1_db_info_space_detail_col'>
                            <div>${json.data[i].table_name}</div>
                        </div>
                        <div class='menu_1_db_info_space_detail_col'>
                            <div>${roundOff(json.data[i].total_size)}</div>
                        </div>
                        <div class='menu_1_db_info_space_detail_col'>
                            <div>${roundOff(json.data[i].data_used)}</div>
                        </div>
                        <div class='menu_1_db_info_space_detail_col'>
                            <div>${roundOff(json.data[i].data_free)}</div>
                        </div>
                        <div class='menu_1_db_info_space_detail_col'>
                            <div>${roundOff(json.data[i].pct_used)}</div>
                        </div>
                    </div>`;
                }
                document.getElementById('menu_1_db_info_space_detail').innerHTML = html;
                common_fetch('/service/db/admin/getDBInfoSpaceSum?', 'GET', 2, null, null, null, (err, result) =>{
                    if (err)
                        null;
                    else{
                        json = JSON.parse(result);
                        document.getElementById('menu_1_db_info_space_detail').innerHTML += 
                            `<div id='menu_1_db_info_space_detail_row_total' class='menu_1_db_info_space_detail_row' >
                                <div class='menu_1_db_info_space_detail_col'>
                                    <div>TOTAL</div>
                                </div>
                                <div class='menu_1_db_info_space_detail_col'>
                                    <div>${roundOff(json.data.total_size)}</div>
                                </div>
                                <div class='menu_1_db_info_space_detail_col'>
                                    <div>${roundOff(json.data.data_used)}</div>
                                </div>
                                <div class='menu_1_db_info_space_detail_col'>
                                    <div>${roundOff(json.data.data_free)}</div>
                                </div>
                                <div class='menu_1_db_info_space_detail_col'>
                                    <div>${roundOff(json.data.pct_used)}</div>
                                </div>
                            </div>`;
                    }
                })
            }
        })
    }
}
async function check_maintenance(){
    if (admin_token_has_value()){
        let json;
        await common_fetch(window.global_rest_url_base + window.global_rest_app_parameter + 'admin/0?parameter_name=SERVER_MAINTENANCE',
                           'GET', 2, null, null, null, (err, result) =>{
            if (err)
                null;
            else{
                json = JSON.parse(result);
                if (json.data==1)
                    document.getElementById('menu_1_checkbox_maintenance').checked =true;
                else
                    document.getElementById('menu_1_checkbox_maintenance').checked =false;
            }
        })
    }
}
function set_maintenance(){
    let check_value;
    if (document.getElementById('menu_1_checkbox_maintenance').checked ==true)
        check_value = 1;
    else
        check_value = 0;
    let json_data = `{"app_id" : ${window.global_app_id}, 
                      "parameter_name":"SERVER_MAINTENANCE",
                      "parameter_value":${check_value}}`;
    common_fetch(window.global_rest_url_base + window.global_rest_app_parameter + 'admin/value?',
                 'PATCH', 2, json_data, null, null, (err, result) =>{
        null;
    })
}
/*----------------------- */
/* USER STAT              */
/*----------------------- */
//chart 1=Left Piechart, 2= Right Barchart
async function show_chart(chart){
    if (admin_token_has_value()){
        let app_id =document.getElementById('select_app_menu2').value;
        let year = document.getElementById('select_year_menu2').value;
        let month = document.getElementById('select_month_menu2').value;
        let json;
        let old_html = document.getElementById(`box${chart}_title`).innerHTML;
        document.getElementById(`box${chart}_title`).innerHTML = window.global_app_spinner;

        document.getElementById(`Chart${chart}`).outerHTML = `<canvas id='Chart${chart}'></canvas>`;

        await common_fetch(window.global_rest_url_base + `app_log/admin/stat/uniquevisitor?select_app_id=${app_id}&statchoice=${chart}&year=${year}&month=${month}`,
                 'GET', 2, null, null, null, (err, result) =>{
            if (err)
                document.getElementById(`box${chart}_title`).innerHTML = old_html;
            else{
                json = JSON.parse(result);
                document.getElementById(`box${chart}_title`).innerHTML = old_html;
                //document.getElementById(`box${chart}`).innerHTML = `<canvas id="Chart${chart}"></canvas>`;
                const ctx = document.getElementById(`Chart${chart}`).getContext('2d');
                if (chart==1){
                    let app_id_array = [];
                    let amount_array = [];
                    function SearchAndGetText(item, search){
                        for (let i=0;i<item.options.length;i++){
                            if (item.options[i].value == search)
                                return item.options[i].text
                        }
                        return null;
                    }
                    for (let i = 0; i < json.data.length; i++) {
                        if (json.data[i].app_id>0){
                            app_id_array.push(SearchAndGetText(document.getElementById('select_app_menu2'), json.data[i].app_id));
                            amount_array.push(json.data[i].amount);
                        }
                    }
                    const pieChart = new Chart(ctx, {
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
                            responsive:true
                        }
                        
                    });
                }
                else
                    if (chart==2){
                        let day_array = [];
                        let amount_array = [];
                        let bar_color;
                        if (app_id == '')
                            bar_color = 'rgb(81, 171, 255)';
                        else
                            bar_color = 'rgb(197 227 255)';
                        for (let i = 0; i < json.data.length; i++) {
                            day_array.push(json.data[i].day);
                            amount_array.push(json.data[i].amount);
                        }
                        const barChart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: day_array,
                                datasets: [{
                                    label:document.getElementById('select_app_menu2').options[document.getElementById('select_app_menu2').selectedIndex].text,
                                    data: amount_array,
                                    backgroundColor: [
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color,
                                        bar_color
                                    ]
                                }]
                            },
                            options: {
                                responsive:true,
                                scale: {
                                    ticks: {
                                        precision: 0
                                    }
                                },
                                plugins: {
                                    title: {
                                        display: false
                                    }
                                }
                            }
                        });
                    }       
            }
        })
    }
}
async function count_connected(identity_provider_id, count_logged_in, callBack){
    if (admin_token_has_value()){
        let json;
        await common_fetch(`/service/broadcast/connected/count?identity_provider_id=${identity_provider_id}&count_logged_in=${count_logged_in}`,
                 'GET', 2, null, null, null, (err, result) =>{
            if (err)
                callBack(result, null);
            else{
                callBack(null, result);
            }
        });
    }
}
async function count_users(){
    if (admin_token_has_value()){
        let json;
        let old_html = document.getElementById('list_user_stat').innerHTML;
        document.getElementById('list_user_stat').innerHTML = window.global_app_spinner;

        await common_fetch(window.global_rest_url_base + window.global_rest_user_account + '/admin/count?',
                           'GET', 2, null, null, null, (err, result) =>{
            if (err)
                document.getElementById('list_user_stat').innerHTML = old_html;
            else{
                json = JSON.parse(result);
                let html='';
                let i;
                for (i=0;i<=json.data.length-1;i++){
                    html +=  `<div id='list_user_stat_row_${i}' class='list_user_stat_row'>
                                    <div class='list_user_stat_col'>
                                        <div>${json.data[i].identity_provider_id==null?'':json.data[i].identity_provider_id}</div>
                                    </div>
                                    <div class='list_user_stat_col'>
                                        <div>${json.data[i].provider_name}</div>
                                    </div>
                                    <div class='list_user_stat_col'>
                                        <div>${json.data[i].count_users}</div>
                                    </div>
                                    <div class='list_user_stat_col'>
                                        <div></div>
                                    </div>
                              </div>`;
                }
                //count not logged in
                html += `<div id='list_user_stat_row_not_connected' class='list_user_stat_row'>
                            <div class='list_user_stat_col'>
                                <div></div>
                            </div>
                            <div class='list_user_stat_col'>
                                <div>Not logged in</div>
                            </div>
                            <div class='list_user_stat_col'>
                                <div></div>
                            </div>
                            <div class='list_user_stat_col'>
                                <div></div>
                            </div>
                        </div>`;
                document.getElementById('list_user_stat').innerHTML = html;
                //count logged in
                document.querySelectorAll('.list_user_stat_row').forEach(e => {
                    if (e.id !='list_user_stat_row_title'){
                        if (e.id=='list_user_stat_row_not_connected')
                            count_connected(e.children[0].children[0].innerHTML,0, (err, result)=>{
                                e.children[3].children[0].innerHTML = JSON.parse(result).data;
                            })
                        else
                            count_connected(e.children[0].children[0].innerHTML,1, (err, result)=>{
                                    e.children[3].children[0].innerHTML = JSON.parse(result).data;
                            })
                    }
                })
            }
        });
    }
}
/*----------------------- */
/* APP ADMIN              */
/*----------------------- */
async function show_apps(){
    let json;
    document.getElementById('list_apps').innerHTML = window.global_app_spinner;

    await common_fetch(window.global_rest_url_base + window.global_rest_app + '/admin?id=0',
                       'GET', 2, null, null, null, (err, result) =>{
        if (err)
            document.getElementById('list_apps').innerHTML = '';
        else{
            json = JSON.parse(result);
            let html = `<div id='list_apps_row_title' class='list_apps_row'>
                            <div id='list_apps_col_title1' class='list_apps_col list_title'>
                                <div>ID</div>
                            </div>
                            <div id='list_apps_col_title2' class='list_apps_col list_title'>
                                <div>NAME</div>
                            </div>
                            <div id='list_apps_col_title3' class='list_apps_col list_title'>
                                <div>URL</div>
                            </div>
                            <div id='list_apps_col_title4' class='list_apps_col list_title'>
                                <div>LOGO</div>
                            </div>
                            <div id='list_apps_col_title5' class='list_apps_col list_title'>
                                <div>ENABLED</div>
                            </div>
                        </div>`;
            for (i = 0; i < json.data.length; i++) {
                html += 
                `<div id='list_apps_row_${i}' data-changed-record='0' class='list_apps_row' >
                    <div class='list_apps_col'>
                        <div class='list_readonly_app'>${json.data[i].id}</div>
                    </div>
                    <div class='list_apps_col'>
                        <input type=text class='list_edit_app' value='${json.data[i].app_name}'>
                    </div>
                    <div class='list_apps_col'>
                        <input type=text class='list_edit_app' value='${json.data[i].url}'>
                    </div>
                    <div class='list_apps_col'>
                        <input type=text class='list_edit_app' value='${json.data[i].logo}'>
                    </div>
                    <div class='list_apps_col'>
                        <input type='checkbox' class='list_edit_app' ${json.data[i].enabled==1?'checked':''} />
                    </div>
                </div>`;
            }
            document.getElementById('list_apps').innerHTML = html;
            list_events('list_apps_row', '.list_edit_app', 1);
            //disable enebaled checkbox for app 0 common
            document.getElementById('list_apps_row_0').children[4].children[0].disabled = true;

            //set focus first column in first row
            //this will trigger to show detail records
            document.querySelectorAll('.list_edit_app')[0].focus();
        }
    })
}
function show_app_parameter(app_id){
    let json;
    document.getElementById('list_app_parameter').innerHTML = window.global_app_spinner;

    common_fetch(window.global_rest_url_base + window.global_rest_app_parameter + `admin/all/${parseInt(app_id)}?`,
                 'GET', 2, null, null, null, (err, result) =>{
        if (err)
            document.getElementById('list_app_parameter').innerHTML = '';
        else{
            json = JSON.parse(result);
            let html = `<div id='list_app_parameter_row_title' class='list_app_parameter_row'>
                            <div id='list_app_parameter_col_title1' class='list_app_parameter_col list_title'>
                                <div>APP ID</div>
                            </div>
                            <div id='list_app_parameter_col_title1' class='list_app_parameter_col list_title'>
                                <div>TYPE ID</div>
                            </div>
                            <div id='list_app_parameter_col_title1' class='list_app_parameter_col list_title'>
                                <div>TYPE NAME</div>
                            </div>
                            <div id='list_app_parameter_col_title2' class='list_app_parameter_col list_title'>
                                <div>NAME</div>
                            </div>
                            <div id='list_app_parameter_col_title3' class='list_app_parameter_col list_title'>
                                <div>VALUE</div>
                            </div>
                            <div id='list_app_parameter_col_title4' class='list_app_parameter_col list_title'>
                                <div>COMMENT</div>
                            </div>
                        </div>`;
            for (i = 0; i < json.data.length; i++) {
                html += 
                `<div id='list_app_parameter_row_${i}' data-changed-record='0' class='list_app_parameter_row'>
                    <div class='list_app_parameter_col'>
                        <input type=number class='list_edit_app_parameter' value=${json.data[i].app_id}>
                    </div>
                    <div class='list_app_parameter_col'>
                        <input type=number class='list_edit_app_parameter' value=${json.data[i].parameter_type_id}>
                    </div>
                    <div class='list_app_parameter_col'>
                        <div class='list_readonly_app_parameter list_lov_click'>${json.data[i].parameter_type_name}</div>
                    </div>
                    <div class='list_app_parameter_col'>
                        <div class='list_readonly_app_parameter'>${json.data[i].parameter_name}</div>
                    </div>
                    <div class='list_app_parameter_col'>
                        <input type=text class='list_edit_app_parameter' value='${json.data[i].parameter_value==null?'':json.data[i].parameter_value}'>
                    </div>
                    <div class='list_app_parameter_col'>
                        <input type=text class='list_edit_app_parameter' value='${json.data[i].parameter_comment==null?'':json.data[i].parameter_comment}'>
                    </div>
                </div>`;
            }
            document.getElementById('list_app_parameter').innerHTML = html;
            list_events('list_app_parameter_row', '.list_edit_app_parameter', 1);
            document.querySelectorAll('.list_lov_click').forEach(e => e.addEventListener('click', function(event) {
                show_parameter_type_names(1, this, 1);
            }));
        }
    })
}
async function apps_save(){
    //save changes in list_apps
    let x = document.querySelectorAll('.list_apps_row');
    for (let i=0;i<x.length;i++){
        if (x[i].getAttribute('data-changed-record')=='1'){
            await update_record('app',
                          x[i],
                          x[i].children[0].children[0].innerHTML,//id
                          x[i].children[1].children[0].value,    //app_name
                          x[i].children[2].children[0].value,    //url
                          x[i].children[3].children[0].value,    //logo
                          x[i].children[4].children[0].checked); //enabled
        }
    };
    //save changes in list_app_parameter
    x = document.querySelectorAll('.list_app_parameter_row');
    for (let i=0;i<x.length;i++){
        if (x[i].getAttribute('data-changed-record')=='1'){
            await update_record('app_parameter',
                          x[i],
                          null, null, null, null, null,
                          x[i].children[0].children[0].value,    //app_id
                          x[i].children[1].children[0].value,    //parameter_type_id
                          x[i].children[3].children[0].innerHTML,//parameter_name
                          x[i].children[4].children[0].value,    //parameter_value
                          x[i].children[5].children[0].value);   //parameter_comment
        }
    };
}
async function update_record(table, 
                        element,
                        id=null, app_name=null, url=null, logo=null, enabled=null,
                        app_id=null, parameter_type_id=null, parameter_name=null, parameter_value=null, parameter_comment=null){
    if (admin_token_has_value()){
        let rest_url;
        let json_data;
        let old_button = document.getElementById('apps_save').innerHTML;
        document.getElementById('apps_save').innerHTML = window.global_app_spinner;
        switch (table){
            case 'app':{
                if (id==window.global_common_app_id){
                    if (element.children[4].children[0].checked == false){
                        //app window.global_common_app_id should always be enabled
                        element.children[4].children[0].checked = true;
                        enabled=true;
                    }
                }
                json_data = `{"app_name": "${app_name}",
                              "url": "${url}",
                              "logo": "${logo}",
                              "enabled": "${enabled==true?1:0}"}`;
                rest_url = `${window.global_rest_app}/admin/${id}?`;
                break;
            }
            case 'app_parameter':{
                json_data = `{"app_id": ${app_id},
                              "parameter_name":"${parameter_name}",
                              "parameter_type_id":"${parameter_type_id}",
                              "parameter_value":"${parameter_value}",
                              "parameter_comment":"${parameter_comment}"}`;
                rest_url = `${window.global_rest_app_parameter}admin?`;
                break;
            }
        }
        await common_fetch(window.global_rest_url_base + rest_url,
                     'PUT', 2, json_data, null, null,(err, result) =>{
            document.getElementById('apps_save').innerHTML = old_button;
            if (err)
                null;
            else{
                element.setAttribute('data-changed-record', '0');
            }
        })
    }
}
function get_parameter_type_name(row_item, item, old_value){
    common_fetch(`${window.global_rest_url_base}${window.global_rest_parameter_type}admin?id=${item.value}`,
                 'GET', 2, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            json = JSON.parse(result);
            if (json.data.length == 1)
                document.getElementById(row_item).children[2].children[0].innerHTML = json.data[0].parameter_type_name;
            else{
                item.value = old_value;
                item.focus();
            }
        }
    });
}
function list_events(item_row, item_edit, column_start_index){
    //on change on all editable fields
    //mark record as changed if any editable field is changed
    //get parameter_type_name for app_parameter rows
    document.querySelectorAll(item_edit).forEach(e => e.addEventListener('change', function(event) {
        event.target.parentNode.parentNode.setAttribute('data-changed-record','1')
        if (item_row == 'list_app_parameter_row' && event.target.parentNode.parentNode.children[1].children[0] == event.target)
            if (this.value=='')
                this.value = event.target.defaultValue;
            else
                get_parameter_type_name(event.target.parentNode.parentNode.id, this, event.target.defaultValue);
    }));
    //key navigation key-up and key-down
    document.querySelectorAll(item_edit).forEach(e => e.addEventListener('keydown', function(event) {
        //up arrow
        if (event.keyCode === 38) {
            if (item_row=='list_apps_row')
                window.global_previous_row = event.target.parentNode.parentNode;
            event.preventDefault();
            let index = parseInt(event.target.parentNode.parentNode.id.substr(item_row.length+1));
            if (index>0)
                document.getElementById(`${item_row}_${index - 1}`).children[column_start_index].children[0].focus();
        }
        //down arrow
        if (event.keyCode === 40) {
            if (item_row=='list_apps_row')
                window.global_previous_row = event.target.parentNode.parentNode;
            event.preventDefault();
            let index = parseInt(event.target.parentNode.parentNode.id.substr(item_row.length+1)) +1;
            if (document.getElementById(`${item_row}_${index}`)!= null)
                document.getElementById(`${item_row}_${index}`).children[column_start_index].children[0].focus();
        }
    }));
    //focus event on master to automatically show detail records
    if (item_row=='list_apps_row'){
        document.querySelectorAll(item_edit).forEach(e => 
            e.addEventListener('focus', function(event) {
                if (window.global_previous_row != event.target.parentNode.parentNode){
                    window.global_previous_row = event.target.parentNode.parentNode;
                    show_app_parameter(e.parentNode.parentNode.children[0].children[0].innerHTML);
                }
            }
        ));
    }
}
function show_parameter_type_names(lov, row_item, item_index){
    switch(lov){
        case 1:{
            let json;
            show_lov('PARAMETER TYPE', window.global_app_spinner);

            common_fetch(window.global_rest_url_base + window.global_rest_parameter_type + `admin?`,
                         'GET', 2, null, null, null, (err, result) =>{
                if (err)
                    document.getElementById('lov_list').innerHTML = '';
                else{
                    json = JSON.parse(result);
                    let lov_list = document.getElementById('lov_list');
                    lov_list.innerHTML = '';
                    let html = '';
                    for (i = 0; i < json.data.length; i++) {
                        html += 
                        `<div id='list_lov_row_${i}' class='list_lov_row'>
                            <div class='list_lov_col'>
                                <div>${json.data[i].id}</div>
                            </div>
                            <div class='list_lov_col'>
                                <div>${json.data[i].parameter_type_name}</div>
                            </div>
                        </div>`;
                    }
                    lov_list.innerHTML = html;
                    document.querySelectorAll('.list_lov_row').forEach(e => e.addEventListener('click', function(event) {
                        row_item.parentNode.parentNode.children[item_index].children[0].value = this.children[0].children[0].innerHTML;
                        row_item.parentNode.parentNode.children[item_index].children[0].focus();
                        row_item.parentNode.parentNode.children[item_index].children[0].dispatchEvent(new Event('change'));
                        close_lov();
                    }));
                }
            })
            break;
        }
    }
}
/*----------------------- */
/* MONITOR                */
/*----------------------- */
function nav_click(item){
    document.getElementById('list_monitor_nav_1').classList='';
    document.getElementById('list_monitor_nav_2').classList='';
    document.getElementById('list_monitor_nav_3').classList='';
    document.getElementById('list_monitor_nav_4').classList='';
    switch (item.id){
        case 'list_connected_title':{
            document.getElementById('list_connected_form').style.display='flex';
            document.getElementById('list_app_log_form').style.display='none';
            document.getElementById('list_server_log_form').style.display='none';
            document.getElementById('list_pm2_log_form').style.display='none';
            document.getElementById('list_monitor_nav_1').classList= 'list_monitor_nav_selected_tab';
            show_connected();
            break;
        }
        case 'list_app_log_title':{
            document.getElementById('list_connected_form').style.display='none';
            document.getElementById('list_app_log_form').style.display='flex';
            document.getElementById('list_server_log_form').style.display='none';
            document.getElementById('list_pm2_log_form').style.display='none';
            document.getElementById('list_monitor_nav_2').classList= 'list_monitor_nav_selected_tab';
            window.global_page = 0;
            show_app_log();
            break;
        }
        case 'list_server_log_title':{
            document.getElementById('list_connected_form').style.display='none';
            document.getElementById('list_app_log_form').style.display='none';
            document.getElementById('list_server_log_form').style.display='block';
            document.getElementById('list_pm2_log_form').style.display='none';
            document.getElementById('list_monitor_nav_3').classList= 'list_monitor_nav_selected_tab';
            show_server_logs();
            break;
        }
        case 'list_pm2_log_title':{
            document.getElementById('list_connected_form').style.display='none';
            document.getElementById('list_app_log_form').style.display='none';
            document.getElementById('list_server_log_form').style.display='none';
            document.getElementById('list_pm2_log_form').style.display='block';
            document.getElementById('list_monitor_nav_4').classList= 'list_monitor_nav_selected_tab';
            show_pm2_logs();
            break;
        }
    }
}
async function show_list(list_div, list_div_col_title, url, sort, order_by, cols){
    if (admin_token_has_value()){
        let json;
        //set spinner
        switch (list_div){
            case 'list_pm2_log':{
                document.getElementById(list_div + '_out').innerHTML = window.global_app_spinner;
                document.getElementById(list_div + '_err').innerHTML = window.global_app_spinner;
                document.getElementById(list_div + '_process_event').innerHTML = window.global_app_spinner;
                //sort not implemented for pm2 with different content in one json file
                break;
            }
            default:{
                document.getElementById(list_div).innerHTML = window.global_app_spinner;
                break;
            }
        }
        await common_fetch(url, 'GET', 2, null, null, null, (err, result) =>{
            if (err){
                switch (list_div){
                    case 'list_pm2_log':{
                        document.getElementById(list_div + '_path').innerHTML = '';
                        document.getElementById(list_div + '_out').innerHTML = '';
                        document.getElementById(list_div + '_err').innerHTML = '';
                        document.getElementById(list_div + '_process_event').innerHTML = '';
                        break;
                    }
                    default:{
                        document.getElementById(list_div).innerHTML = '';
                        break;
                    }
                }
            }
            else{
                json = JSON.parse(result);
                let html = '';
                let html_out = '';
                let html_err = '';
                let html_process_event = '';
                switch (list_div){
                    /*
                    use this grouping to decide column orders
                    [log colums][server columns][user columns][detail columms][app columns(broadcast, edit etc)]
                    */
                    case 'list_connected':{
                        html = `<div id='list_connected_row_title' class='list_connected_row'>
                                    <div id='list_connected_col_title1' class='list_connected_col list_connected_sort_click list_title'>
                                        <div>ID</div>
                                    </div>
                                    <div id='list_connected_col_title5' class='list_connected_col list_connected_sort_click list_title'>
                                        <div>CONNECTION DATE</div>
                                    </div>
                                    <div id='list_connected_col_title2' class='list_connected_col list_connected_sort_click list_title'>
                                        <div>APP ID</div>
                                    </div>
                                    <div id='list_connected_col_title3' class='list_connected_col list_connected_sort_click list_title'>
                                        <div>USER ID</div>
                                    </div>
                                    <div id='list_connected_col_title6' class='list_connected_col list_connected_sort_click list_title'>
                                        <div>IP</div>
                                    </div>
                                    <div id='list_connected_col_title7' class='list_connected_col list_connected_sort_click list_title'>
                                        <div>GPS LAT</div>
                                    </div>
                                    <div id='list_connected_col_title8' class='list_connected_col list_connected_sort_click list_title'>
                                        <div>GPS LONG</div>
                                    </div>
                                    <div id='list_connected_col_title4' class='list_connected_col list_connected_sort_click list_title'>
                                        <div>USER AGENT</div>
                                    </div>
                                    <div id='list_connected_col_title9' class='list_connected_col list_title'>
                                        <div>BROADCAST</div>
                                    </div>
                                </div>`;
                        break;
                    }
                    case 'list_app_log':{
                        window.global_page_last = Math.floor(json.data[0].total_rows/window.global_limit) * window.global_limit;
                        html = `<div id='list_app_log_row_title' class='list_app_log_row'>
                                    <div id='list_app_log_col_title1' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>ID</div>
                                    </div>
                                    <div id='list_app_log_col_title2' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>DATE</div>
                                    </div>
                                    <div id='list_app_log_col_title3' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>HOST</div>
                                    </div>
                                    <div id='list_app_log_col_title3' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>APP ID</div>
                                    </div>
                                    <div id='list_app_log_col_title4' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>MODULE</div>
                                    </div>
                                    <div id='list_app_log_col_title5' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>MODULE TYPE</div>
                                    </div>
                                    <div id='list_app_log_col_title6' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>MODULE REQUEST</div>
                                    </div>
                                    <div id='list_app_log_col_title7' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>MODULE RESULT</div>
                                    </div>
                                    <div id='list_app_log_col_title8' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>USER ID</div>
                                    </div>
                                    <div id='list_app_log_col_title9' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>IP</div>
                                    </div>
                                    <div id='list_app_log_col_title10' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>GPS LAT</div>
                                    </div>
                                    <div id='list_app_log_col_title11' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>GPS LONG</div>
                                    </div>
                                    <div id='list_app_log_col_title12' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>USER LANGUAGE</div>
                                    </div>
                                    <div id='list_app_log_col_title13' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>USER TIMEZONE</div>
                                    </div>
                                    <div id='list_app_log_col_title14' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>USER NUMBER_SYSTEM</div>
                                    </div>
                                    <div id='list_app_log_col_title15' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>USER PLATFORM</div>
                                    </div>
                                    <div id='list_app_log_col_title16' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>USER AGENT</div>
                                    </div>
                                    <div id='list_app_log_col_title17' class='list_app_log_col list_app_log_sort_click list_title'>
                                        <div>ACCEPT LANGUAGE</div>
                                    </div>
                                </div>`;
                        break;
                    }
                    case 'list_server_log':{
                        html =`<div id='list_server_log_row_title' class='list_server_log_row'>
                                    <div id='list_server_log_col_title1' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>LOGDATE</div>
                                    </div>
                                    <div id='list_server_log_col_title3' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>HOST</div>
                                    </div>
                                    <div id='list_server_log_col_title11' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>APP ID</div>
                                    </div>
                                    <div id='list_server_log_col_title2' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>IP</div>
                                    </div>
                                    <div id='list_server_log_col_title4' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>PROTOCOL</div>
                                    </div>
                                    <div id='list_server_log_col_title5' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>URL</div>
                                    </div>
                                    <div id='list_server_log_col_title6' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>METHOD</div>
                                    </div>
                                    <div id='list_server_log_col_title7' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>STATUSCODE</div>
                                    </div>
                                    <div id='list_server_log_col_title8' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>USER AGENT</div>
                                    </div>
                                    <div id='list_server_log_col_title9' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>ACCEPT LANGUAGE</div>
                                    </div>
                                    <div id='list_server_log_col_title10' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>HTTP REFERER</div>
                                    </div>
                                    <div id='list_server_log_col_title12' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>APP FILENAME</div>
                                    </div>
                                    <div id='list_server_log_col_title13' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>APP FUNCTION NAME</div>
                                    </div>
                                    <div id='list_server_log_col_title14' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>APP APP LINE</div>
                                    </div>
                                    <div id='list_server_log_col_title15' class='list_server_log_col list_server_log_sort_click list_title'>
                                        <div>LOG TEXT</div>
                                    </div>
                                </div>`;
                        break;
                    }
                    case 'list_pm2_log':{
                        document.getElementById(list_div + '_path').innerHTML = json.path + json.file;
                        html_out = `<div id='list_pm2_log_out_row_title' class='list_pm2_log_row'>
                                        <div id='list_pm2_log_out_col_title1' class='list_pm2_log_col list_title'>
                                            <div>TIMESTAMP</div>
                                        </div>
                                        <div id='list_pm2_log_out_col_title2' class='list_pm2_log_col list_title'>
                                            <div>APP_NAME</div>
                                        </div>
                                        <div id='list_pm2_log_out_col_title3' class='list_pm2_log_col list_title'>
                                            <div>PROCESS_ID</div>
                                        </div>
                                        <div id='list_pm2_log_out_col_title4' class='list_pm2_log_col list_title'>
                                            <div>MESSAGE</div>
                                        </div>
                                    </div>`;
                        html_err = `<div id='list_pm2_log_err_row_title' class='list_pm2_log_row'>
                                        <div id='list_pm2_log_err_col_title1' class='list_pm2_log_col list_title'>
                                            <div>TIMESTAMP</div>
                                        </div>
                                        <div id='list_pm2_log_err_col_title2' class='list_pm2_log_col list_title'>
                                            <div>APP_NAME</div>
                                        </div>
                                        <div id='list_pm2_log_err_col_title3' class='list_pm2_log_col list_title'>
                                            <div>PROCESS_ID</div>
                                        </div>
                                        <div id='list_pm2_log_err_col_title4' class='list_pm2_log_col list_title'>
                                            <div>MESSAGE</div>
                                        </div>
                                    </div>`;
                        html_process_event = `<div id='list_pm2_log_process_event_row_title' class='list_pm2_log_row'>
                                                <div id='list_pm2_log_process_event_col_title2' class='list_pm2_log_process_event_col list_title'>
                                                    <div>TIMESTAMP</div>
                                                </div>
                                                <div id='list_pm2_log_process_event_col_title5' class='list_pm2_log_process_event_col list_title'>
                                                    <div>APP_NAME</div>
                                                </div>
                                                <div id='list_pm2_log_process_event_col_title4' class='list_pm2_log_process_event_col list_title'>
                                                    <div>STATUS</div>
                                                </div>
                                            </div>`;
                        break;
                    }
                }
                if (json.data.length >0){
                    for (i = 0; i < json.data.length; i++) {
                        switch (list_div){
                            case 'list_connected':{
                                html += `<div class='list_connected_row'>
                                            <div class='list_connected_col'>
                                                <div>${json.data[i].id}</div>
                                            </div>
                                            <div class='list_connected_col'>
                                                <div>${json.data[i].connection_date}</div>
                                            </div>
                                            <div class='list_connected_col'>
                                                <div>${json.data[i].app_id}</div>
                                            </div>
                                            <div class='list_connected_col'>
                                                <div>${json.data[i].user_account_id}</div>
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
                                            <div class='list_connected_col'>
                                                <div>${show_user_agent(json.data[i].user_agent)}</div>
                                            </div>
                                            <div class='list_connected_col list_connected_chat_click chat_click'>
                                                <div>${window.global_icon_app_chat}</div>
                                            </div>
                                        </div>`;
                                break;
                            }
                            case 'list_app_log':{
                                html += `<div class='list_app_log_row'>
                                            <div class='list_app_log_col'>
                                                <div>${json.data[i].id}</div>
                                            </div>
                                            <div class='list_app_log_col'>
                                                <div>${json.data[i].date_created}</div>
                                            </div>
                                            <div class='list_app_log_col'>
                                                <div>${json.data[i].server_http_host}</div>
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
                                                <div>${json.data[i].app_module_request}</div>
                                            </div>
                                            <div class='list_app_log_col'>
                                                <div>${json.data[i].app_module_result}</div>
                                            </div>
                                            <div class='list_app_log_col'>
                                                <div>${json.data[i].app_user_id}</div>
                                            </div>
                                            <div class='list_app_log_col'>
                                                <div>${json.data[i].server_remote_addr.replace('::ffff:','')}</div>
                                            </div>
                                            <div class='list_app_log_col list_app_log_gps_click gps_click'>
                                                <div>${json.data[i].client_latitude}</div>
                                            </div>
                                            <div class='list_app_log_col list_app_log_gps_click gps_click'>
                                                <div>${json.data[i].client_longitude}</div>
                                            </div>
                                            <div class='list_app_log_col'>
                                                <div>${json.data[i].user_language}</div>
                                            </div>
                                            <div class='list_app_log_col'>
                                                <div>${json.data[i].user_timezone}</div>
                                            </div>
                                            <div class='list_app_log_col'>
                                                <div>${json.data[i].user_number_system}</div>
                                            </div>
                                            <div class='list_app_log_col'>
                                                <div>${json.data[i].user_platform}</div>
                                            </div>
                                            <div class='list_app_log_col'>
                                                <div>${json.data[i].server_user_agent}</div>
                                            </div>
                                            <div class='list_app_log_col'>
                                                <div>${json.data[i].server_http_accept_language}</div>
                                            </div>
                                        </div>`;
                                break;
                            }
                            case 'list_server_log':{
                                for (i = 0; i < json.data.length; i++) {
                                    //test if JSON in logtext
                                    if (typeof json.data[i].logtext === 'object')
                                        json.data[i].logtext = JSON.stringify(json.data[i].logtext);
                                    html += 
                                    `<div class='list_server_log_row'>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i].logdate}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i].host}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i].app_id}</div>
                                        </div>
                                        <div class='list_server_log_col list_server_log_gps_click gps_click'>
                                            <div>${json.data[i].ip==""?"":json.data[i].ip.replace('::ffff:','')}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i].protocol}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i].url}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i].method}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i].statusCode}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i]['user-agent']}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i]['accept-language']}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i].http_referer}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i].app_filename}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i].app_function_name}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i].app_app_line}</div>
                                        </div>
                                        <div class='list_server_log_col'>
                                            <div>${json.data[i].logtext}</div>
                                        </div>
                                    </div>`;
                                }
                                break;
                            }
                            case 'list_pm2_log':{
                                //original pm2 attributes:
                                //out               message, timestamp, type, process_id, app_name
                                //err               message, timestamp, type, process_id, app_name
                                //process event,    timestamp, type, status, app_name
                                switch (json.data[i].type){
                                    case 'out':{
                                        html_out += 
                                        `<div class='list_pm2_log_row'>
                                            <div class='list_pm2_log_col'>
                                                <div>${json.data[i].timestamp}</div>
                                            </div>
                                            <div class='list_pm2_log_col'>
                                                <div>${json.data[i].app_name}</div>
                                            </div>
                                            <div class='list_pm2_log_col'>
                                                <div>${json.data[i].process_id}</div>
                                            </div>
                                            <div class='list_pm2_log_col'>
                                                <div>${json.data[i].message}</div>
                                            </div>
                                        </div>`;        
                                        break;
                                    }
                                    case 'err':{
                                        html_err += 
                                        `<div class='list_pm2_log_row'>
                                            <div class='list_pm2_log_col'>
                                                <div>${json.data[i].timestamp}</div>
                                            </div>
                                            <div class='list_pm2_log_col'>
                                                <div>${json.data[i].app_name}</div>
                                            </div>
                                            <div class='list_pm2_log_col'>
                                                <div>${json.data[i].process_id}</div>
                                            </div>
                                            <div class='list_pm2_log_col'>
                                                <div>${json.data[i].message}</div>
                                            </div>
                                        </div>`;
                                        break;
                                    }
                                    case 'process_event':{
                                        html_process_event += 
                                        `<div class='list_pm2_log_row'>
                                            <div class='list_pm2_log_col'>
                                                <div>${json.data[i].timestamp}</div>
                                            </div>
                                            <div class='list_pm2_log_col'>
                                                <div>${json.data[i].app_name}</div>
                                            </div>
                                            <div class='list_pm2_log_col'>
                                                <div>${json.data[i].status}</div>
                                            </div>
                                        </div>`;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    switch (list_div){
                        case 'list_connected':{
                            document.getElementById(list_div).innerHTML = html;
                            document.getElementById(list_div_col_title + sort).classList.add(order_by);
                            //add sort events on title
                            set_list_eventlisteners('connected', 'sort',1);
                            //add events on some columns searching in all rows
                            set_list_eventlisteners('connected', 'gps',1);
                            set_list_eventlisteners('connected', 'chat',1);
                            break;
                        }
                        case 'list_app_log':{
                            document.getElementById(list_div).innerHTML = html;
                            document.getElementById(list_div_col_title + sort).classList.add(order_by);
                            //add events on some columns searching in all rows
                            set_list_eventlisteners('app_log', 'sort',1);
                            set_list_eventlisteners('app_log', 'gps',1);
                            break;
                        }
                        case 'list_server_log':{
                            document.getElementById(list_div).innerHTML = html;
                            document.getElementById(list_div_col_title + sort).classList.add(order_by);
                            //add events on some columns searching in all rows
                            set_list_eventlisteners('server_log', 'sort',1);
                            set_list_eventlisteners('server_log', 'gps',1);
                            break;
                        }
                        case 'list_pm2_log':{
                            document.getElementById(list_div + '_out').innerHTML = html_out;
                            document.getElementById(list_div + '_err').innerHTML = html_err;
                            document.getElementById(list_div + '_process_event').innerHTML = html_process_event;
                            break;
                        }
                    }
                }   
            }
        })        
    }
}
async function show_connected(sort=4, order_by='desc'){
    let app_id = document.getElementById('select_app_menu4_list_connected').options[document.getElementById('select_app_menu4_list_connected').selectedIndex].value;
    let year = document.getElementById('select_year_menu4_list_connected').value;
    let month = document.getElementById('select_month_menu4_list_connected').value;
    show_list('list_connected', 
              'list_connected_col_title', 
              `/service/broadcast/connected?select_app_id=${app_id}&year=${year}&month=${month}&sort=${sort}&order_by=${order_by}&limit=${window.global_limit}`, 
              sort,
              order_by,
              8);
}    

async function show_app_log(sort=8, order_by='desc', offset=0, limit=window.global_limit){
    let app_id = document.getElementById('select_app_menu4_app_log').options[document.getElementById('select_app_menu4_app_log').selectedIndex].value;
    let year = document.getElementById('select_year_menu4_app_log').value;
    let month = document.getElementById('select_month_menu4_app_log').value;
    show_list('list_app_log', 
              'list_app_log_col_title', 
              window.global_rest_url_base + `app_log?select_app_id=${app_id}&year=${year}&month=${month}&sort=${sort}&order_by=${order_by}&offset=${offset}&limit=${limit}`, 
              sort,
              order_by,
              8);
} 
function set_list_eventlisteners(list_type, list_function, event_action){
    let click_function_title = function() { list_sort_click(this)};
    let click_function_rowcolumn = function() { list_item_click(this)};
    let elements = document.querySelectorAll(`.list_${list_type}_${list_function}_click`);   
    
    let elementsArray = Array.prototype.slice.call(elements);
    if (event_action==1)
        elementsArray.forEach(function(elem){
            if (list_function=='sort')
                elem.addEventListener("click", click_function_title);
            else
                elem.addEventListener("click", click_function_rowcolumn);
        });
    else
        elementsArray.forEach(function(elem){
            if (list_function=='sort')
                elem.removeEventListener("click", click_function_title);
            else
                elem.removeEventListener("click", click_function_rowcolumn);
        });
}
function get_sort(order_by=0){
    let sort = '';
    for (let i=1;i <=8;i++){
        if (document.getElementById('list_app_log_col_title' + i).classList.contains('asc'))
            if (order_by==0)
                sort = i;
            else
                sort = 'asc';
        if (document.getElementById('list_app_log_col_title' + i).classList.contains('desc'))
            if (order_by==0)
                sort = i;
            else
                sort = 'desc';
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
    switch (item.id.substring(0, item.id.indexOf('_col_title'))){
        case 'list_app_log':{
            show_app_log(item.id.substr(item.id.length - 1), get_order(item));    
            break;
        }
        case 'list_connected':{
            show_connected(item.id.substr(item.id.length - 1), get_order(item));    
            break;
        }
        case 'list_server_log':{
            show_server_logs(item.id.substr(item.id.length - 1), get_order(item));
            break;
        }
    }
}
function page_navigation(item){
    
    let sort = get_sort();
    let order_by = get_sort(1);
    if (sort =='')
        sort = 8;
    switch (item.id){
        case 'list_app_log_first':{
            window.global_page = 0;
            show_app_log(sort, order_by, 0,window.global_limit);
            break;
        }
        case 'list_app_log_previous':{
            window.global_page = window.global_page - window.global_limit;
            if (window.global_page - window.global_limit < 0)
                window.global_page = 0;
            else
                window.global_page = window.global_page - window.global_limit;
            show_app_log(sort, order_by, window.global_page, window.global_limit);
            break;
        }
        case 'list_app_log_next':{
            if (window.global_page + window.global_limit > window.global_page_last)
                window.global_page = window.global_page_last;
            else
                window.global_page = window.global_page + window.global_limit;
            show_app_log(sort, order_by, window.global_page, window.global_limit);
            break;
        }
        case 'list_app_log_last':{
            window.global_page = window.global_page_last;
            show_app_log(sort, order_by, window.global_page, window.global_limit);
            break;
        }
    }
}
function list_item_click(item){
    if (item.className.indexOf('gps_click')>0){
        if (item.parentNode.parentNode.id =='list_server_log'){
            //clicking on IP, get GPS, show on map
            let ip_filter='';
            //if localhost show default position
            if (item.children[0].innerHTML != '::1')
                ip_filter = `&ip=${item.children[0].innerHTML}`;
            common_fetch(window.global_service_geolocation + window.global_service_geolocation_gps_ip + 
                            `/admin?app_user_id=${ip_filter}`,
                            'GET', 2, null, null, null, (err, result) =>{
                    if (err)
                        null;
                    else{
                        let json = JSON.parse(result);
                        update_map(json.geoplugin_longitude,
                                    json.geoplugin_latitude,
                                    window.global_gps_map_zoom,
                                    json.geoplugin_city + ', ' +
                                    json.geoplugin_regionName + ', ' +
                                    json.geoplugin_countryName,
                                    window.global_gps_map_marker_div_gps,
                                    window.global_gps_map_jumpto);
                    }
            })
        }
        else{
            //clicking on GPS, show on map
            let lat;
            let long;
            //make sure column lat and long are beside eachother and lat is before long
            for (let i=0;i<item.parentNode.children.length;i++){
                if (item.parentNode.children[i].classList.contains('gps_click')){
                    lat = item.parentNode.children[i].children[0].innerHTML;
                    long = item.parentNode.children[i+1].children[0].innerHTML;
                    break;
                }       
            }    
            common_fetch(window.global_service_geolocation + window.global_service_geolocation_gps_place + 
                            '/admin?app_user_id=' +
                            '&latitude=' + lat +
                            '&longitude=' + long,
                            'GET', 2, null, null, null, (err, result) =>{
                    if (err)
                        null;
                    else{
                        let json = JSON.parse(result);
                        update_map(long,
                                    lat,
                                    window.global_gps_map_zoom,
                                    json.geoplugin_place + ', ' + 
                                    json.geoplugin_region + ', ' + 
                                    json.geoplugin_countryCode,
                                    window.global_gps_map_marker_div_gps,
                                    window.global_gps_map_jumpto);
                    }
            })
        }
    }
    else
        if (item.className.indexOf('chat_click')>0){
            show_broadcast_dialogue('CLIENT', item.parentNode.children[0].children[0].innerHTML);
        }
    
}
async function get_server_log_parameters(){
    let json;
    await common_fetch(window.global_service_log + '/parameters?',
                       'GET', 2, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            json = JSON.parse(result);
            window.global_service_log_scope_server = json.data.SERVICE_LOG_SCOPE_SERVER;
            window.global_service_log_scope_service = json.data.SERVICE_LOG_SCOPE_SERVICE;
            window.global_service_log_scope_db = json.data.SERVICE_LOG_SCOPE_DB;
            window.global_service_log_scope_router = json.data.SERVICE_LOG_SCOPE_ROUTER;
            window.global_service_log_scope_controller = json.data.SERVICE_LOG_SCOPE_CONTROLLER;

            document.getElementById('menu4_row_parameters_col1_1').style.display = 'none';
            document.getElementById('menu4_row_parameters_col1_0').style.display = 'none';
            document.getElementById('menu4_row_parameters_col2_1').style.display = 'none';
            document.getElementById('menu4_row_parameters_col2_0').style.display = 'none';
            document.getElementById('menu4_row_parameters_col3_1').style.display = 'none';
            document.getElementById('menu4_row_parameters_col3_0').style.display = 'none';
            document.getElementById('menu4_row_parameters_col4_1').style.display = 'none';
            document.getElementById('menu4_row_parameters_col4_0').style.display = 'none';
            document.getElementById('menu4_row_parameters_col5_1').style.display = 'none';
            document.getElementById('menu4_row_parameters_col5_0').style.display = 'none';

            if (json.data.SERVICE_LOG_ENABLE_SERVER_INFO==1)
                document.getElementById('menu4_row_parameters_col1_1').style.display = 'inline-block';
            else
                document.getElementById('menu4_row_parameters_col1_0').style.display = 'inline-block';
            if (json.data.SERVICE_LOG_ENABLE_SERVER_VERBOSE==1)
                document.getElementById('menu4_row_parameters_col2_1').style.display = 'inline-block';
            else
                document.getElementById('menu4_row_parameters_col2_0').style.display = 'inline-block';
            if (json.data.SERVICE_LOG_ENABLE_DB==1)
                document.getElementById('menu4_row_parameters_col3_1').style.display = 'inline-block';
            else
                document.getElementById('menu4_row_parameters_col3_0').style.display = 'inline-block';
            if (json.data.SERVICE_LOG_ENABLE_ROUTER==1)
                document.getElementById('menu4_row_parameters_col4_1').style.display = 'inline-block';
            else
                document.getElementById('menu4_row_parameters_col4_0').style.display = 'inline-block';
            if (json.data.SERVICE_LOG_PM2_FILE && json.data.SERVICE_LOG_PM2_FILE!=null)
                document.getElementById('menu4_row_parameters_col5_1').style.display = 'inline-block';
            else
                document.getElementById('menu4_row_parameters_col5_0').style.display = 'inline-block';

            window.global_service_log_level_verbose = json.data.SERVICE_LOG_LEVEL_VERBOSE;
            window.global_service_log_level_error = json.data.SERVICE_LOG_LEVEL_ERROR;
            window.global_service_log_level_info = json.data.SERVICE_LOG_LEVEL_INFO;

            window.global_service_log_file_interval = json.data.SERVICE_LOG_FILE_INTERVAL;

            let html = '';
            html +=`<option value=0 log_scope='${window.global_service_log_scope_server}'       log_level='${window.global_service_log_level_info}'>${window.global_service_log_scope_server} - ${window.global_service_log_level_info}</option>`;
            html +=`<option value=1 log_scope='${window.global_service_log_scope_server}'       log_level='${window.global_service_log_level_error}'>${window.global_service_log_scope_server} - ${window.global_service_log_level_error}</option>`;
            html +=`<option value=2 log_scope='${window.global_service_log_scope_server}'       log_level='${window.global_service_log_level_verbose}'>${window.global_service_log_scope_server} - ${window.global_service_log_level_verbose}</option>`;
            html +=`<option value=3 log_scope='${window.global_service_log_scope_service}'      log_level='${window.global_service_log_level_info}'>${window.global_service_log_scope_service} - ${window.global_service_log_level_info}</option>`;
            html +=`<option value=4 log_scope='${window.global_service_log_scope_service}'      log_level='${window.global_service_log_level_error}'>${window.global_service_log_scope_service} - ${window.global_service_log_level_error}</option>`;
            html +=`<option value=5 log_scope='${window.global_service_log_scope_db}'           log_level='${window.global_service_log_level_info}'>${window.global_service_log_scope_db} - ${window.global_service_log_level_info}</option>`;
            html +=`<option value=6 log_scope='${window.global_service_log_scope_router}'       log_level='${window.global_service_log_level_info}'>${window.global_service_log_scope_router} - ${window.global_service_log_level_info}</option>`;
            html +=`<option value=7 log_scope='${window.global_service_log_scope_controller}'   log_level='${window.global_service_log_level_info}'>${window.global_service_log_scope_controller} - ${window.global_service_log_level_info}</option>`;
            html +=`<option value=8 log_scope='${window.global_service_log_scope_controller}'   log_level='${window.global_service_log_level_error}'>${window.global_service_log_scope_controller} - ${window.global_service_log_level_error}</option>`;
            
            document.getElementById('select_logscope4').innerHTML = html;

            if (window.global_service_log_file_interval=='1M')
                document.getElementById('select_day_menu4').style.display = 'none';
            else
                document.getElementById('select_day_menu4').style.display = 'inline-block';
        }
    })
}
function show_server_logs(sort=1, order_by='desc'){
    let logscope = document.getElementById('select_logscope4')[document.getElementById('select_logscope4').selectedIndex].getAttribute('log_scope');
    let loglevel = document.getElementById('select_logscope4')[document.getElementById('select_logscope4').selectedIndex].getAttribute('log_level');
    let year = document.getElementById('select_year_menu4').value;
    let month= document.getElementById('select_month_menu4').value;
    let day  = document.getElementById('select_day_menu4').value;
    let app_id_filter='';
    if (logscope=='SERVER'){
        //no app filter for server, since this is a server log
        document.getElementById('select_app_menu4').style.display = 'none';
        app_id_filter = `select_app_id=&`;
    }
    else{
        //show app filter and use it
        document.getElementById('select_app_menu4').style.display = 'inline-block';
        app_id_filter = `select_app_id=${document.getElementById('select_app_menu4').options[document.getElementById('select_app_menu4').selectedIndex].value}&`;
    }
    let url_parameters;
    if (window.global_service_log_file_interval=='1M')
        url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}`;
    else
        url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}&day=${day}`;
    show_list('list_server_log', 
                'list_server_log_col_title', 
                window.global_service_log + `/logs?${url_parameters}&sort=${sort}&order_by=${order_by}`,
                sort,
                order_by,
                15);
}
function show_existing_logfiles(){
    if (admin_token_has_value()){
        let json;
        let url_parameters;
        show_lov('SERVER LOG FILES', window.global_app_spinner);

        common_fetch(window.global_service_log + '/files?',
                     'GET', 2, null, null, null, (err, result) =>{
            if (err)
                document.getElementById('lov_list').innerHTML = '';
            else{
                json = JSON.parse(result);
                let logfiles_list = document.getElementById('lov_list');
                logfiles_list.innerHTML = '';
                let html = '';
                for (i = 0; i < json.length; i++) {
                    html += 
                    `<div id='list_logfiles_row_${i}' class='list_lov_row'>
                        <div class='list_logfiles_col'>
                            <div>${json[i]}</div>
                        </div>
                    </div>`;
                }
                logfiles_list.innerHTML = html;
                function setlogscopelevel(select, logscope, loglevel){
                    for (let i = 0; i < select.options.length; i++) {
                        if (select[i].getAttribute('log_scope') == logscope &&
                            select[i].getAttribute('log_level') == loglevel) {
                            select.selectedIndex = i;
                            return null;
                        }
                    }
                }
                document.querySelectorAll('.list_lov_row').forEach(e => e.addEventListener('click', function(event) {                    
                    //format: 'LOGSCOPE_LOGLEVEL_20220101.log'
                    //logscope and loglevel
                    let filename = this.children[0].children[0].innerHTML;
                    let logscope = filename.substring(0,filename.indexOf('_'));
                    filename = filename.substring(filename.indexOf('_')+1);
                    let loglevel = filename.substring(0,filename.indexOf('_'));
                    filename = filename.substring(filename.indexOf('_')+1);
                    let year     = parseInt(filename.substring(0, 4));
                    let month    = parseInt(filename.substring(4, 6));
                    let day      = parseInt(filename.substring(6, 8));
                    setlogscopelevel(document.getElementById('select_logscope4'),
                                     logscope, 
                                     loglevel);
                    //year
                    document.getElementById('select_year_menu4').value = year;
                    //month
                    document.getElementById('select_month_menu4').value = month;
                    //day if applicable
                    if (window.global_service_log_file_interval=='1D')
                        document.getElementById('select_day_menu4').value = day;

                    document.getElementById('select_logscope4').dispatchEvent(new Event('change'));
                    close_lov();
                }));
            }
        })
    }
}
function show_pm2_logs(){
    let sort = '';
    let order_by = '';
    show_list('list_pm2_log', 
              'list_pm2_log_XXX_row_title', //list_pm2_log_out, list_pm2_log_err, list_pm2_log_process_event
              window.global_service_log + `/pm2logs?`,
              sort,
              order_by,
              3); //skip last process id column
}
/*----------------------- */
/* MAP                    */
/*----------------------- */
function init_map() {
    mapboxgl.accessToken = window.global_gps_map_access_token;
    window.global_session_map = new mapboxgl.Map({
        container: window.global_gps_map_container,
        style: window.global_gps_map_style_baseurl + window.global_gps_map_style,
        center: [window.global_client_latitude,
                 window.global_client_longitude
        ],
        zoom: window.global_gps_map_zoom
    });

    window.global_session_map.addControl(new mapboxgl.NavigationControl());
    window.global_session_map.addControl(new mapboxgl.FullscreenControl());
}
function update_map(longitude, latitude, zoom, text_place, marker_id, flyto) {
    if (flyto == 1) {
        window.global_session_gps_map_mymap.flyTo({
            'center': [longitude, latitude],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    } else {
        if (zoom == '')
            window.global_session_map.jumpTo({ 'center': [longitude, latitude] });
        else
            window.global_session_map.jumpTo({ 'center': [longitude, latitude], 'zoom': zoom });
    }
    common_fetch(window.global_service_geolocation + window.global_service_geolocation_gps_timezone + `/admin?latitude=${latitude}&longitude=${longitude}`,
                 'GET', 2, null, null, null, (err, text_timezone) =>{
        if (err)
            null;
        else{
            let popuptext = `<div id="map_popup_title">${text_place}</div>
                             <div id="map_popup_sub_title">Timezone</div>
                             <div id="map_popup_sub_title_timezone">${text_timezone}</div>`;
            let popup = new mapboxgl.Popup({ offset: window.global_gps_map_popup_offset, closeOnClick: false })
            .setLngLat([longitude, latitude])
            .setHTML(popuptext)
            .addTo(window.global_session_map);
            let el = document.createElement('div');
            el.id = marker_id;
            new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .addTo(window.global_session_map);
            return null;
        }
    })
}
function map_set_style(){
    window.global_session_map.setStyle(window.global_gps_map_style_baseurl + document.getElementById('select_maptype').value);
}

/*----------------------- */
/* EXCEPTION              */
/*----------------------- */
function delete_globals(){
    //delete all globals in this file, not globals declared elsewhere
    //and not some start variables
    delete window.global_rest_app;
    delete window.global_rest_parameter_type;
    delete window.global_rest_user_account;
    delete window.global_service_geolocation;
    delete window.global_service_geolocation_gps_ip;
    delete window.global_service_geolocation_gps_place;
    delete window.global_service_log;
    delete window.global_service_log_scope_server;
    delete window.global_service_log_scope_service;
    delete window.global_service_log_scope_db;
    delete window.global_service_log_scope_router;
    delete window.global_service_log_scope_controller;
    delete window.global_service_log_level_verbose;
    delete window.global_service_log_level_error;
    delete window.global_service_log_level_info;                        
    delete window.global_service_log_destination;
    delete window.global_service_log_url_destination;
    delete window.global_service_log_url_destination_username;
    delete window.global_service_log_url_destination_password;
    delete window.global_service_log_file_interval;
    delete window.global_service_log_file_path_server;
    delete window.global_service_log_date_format;
    delete window.global_gps_map_container;
    delete window.global_gps_map_style_baseurl;
    delete window.global_gps_map_style;
    delete window.global_gps_map_zoom;
    delete window.global_gps_map_flyto;
    delete window.global_gps_map_jumpto;
    delete window.global_gps_map_marker_div_gps;
    delete window.global_gps_map_popup_offset;
    delete window.global_session_map;
    delete window.global_client_latitude;
    delete window.global_client_longitude;
    delete window.global_client_place;
    delete window.global_page;
    delete window.global_page_last;
    delete window.global_limit;
    delete window.global_previous_row;
}
function admin_logoff_app(){
    window.global_rest_admin_at = '';
    delete_globals();
    document.getElementById('menu_1').removeEventListener('click', function() { show_menu(1) }, false);
    document.getElementById('menu_2').removeEventListener('click', function() { show_menu(2) }, false);
    document.getElementById('menu_3').removeEventListener('click', function() { show_menu(3) }, false);
    document.getElementById('menu_4').removeEventListener('click', function() { show_menu(4) }, false);
    document.getElementById('menu_5').removeEventListener('click', function() { admin_login() }, false);
    document.getElementById('dialogue_admin_login').style.visibility = 'visible';
    document.getElementById('secure').style.visibility = 'hidden';
    document.getElementById('secure').innerHTML = '';
}
/*----------------------- */
/* INIT                   */
/*----------------------- */
function admin_token_has_value(){
    if (window.global_rest_admin_at =='')
        return false;
    else
        return true;
}

function init_admin_secure(){

    window.global_service_log = '/service/log';
    window.global_service_log_scope_server= '';
    window.global_service_log_scope_service= '';
    window.global_service_log_scope_db= '';
    window.global_service_log_scope_router= '';
    window.global_service_log_scope_controller= '';
    window.global_service_log_level_verbose= '';
    window.global_service_log_level_error= '';
    window.global_service_log_level_info= '';
                    
    window.global_service_log_destination= '';
    window.global_service_log_url_destination= '';
    window.global_service_log_url_destination_username= '';
    window.global_service_log_url_destination_password= '';
    window.global_service_log_file_interval= '';
    window.global_service_log_file_path_server= '';
    window.global_service_log_date_format= '';
    //map variables
    window.global_gps_map_container      ='mapid';
    window.global_gps_map_style_baseurl  ='mapbox://styles/mapbox/';
    window.global_gps_map_style          ='satellite-streets-v11';
    window.global_gps_map_zoom           = 14;
    window.global_gps_map_flyto          = 1;
    window.global_gps_map_jumpto         = 0;
    window.global_gps_map_marker_div_gps = 'map_marker_gps';
    window.global_gps_map_popup_offset   = 25;
    //session variables
    window.global_client_latitude = '';
    window.global_client_longitude = '';
    window.global_client_place = '';



    window.global_page = 0;
    window.global_page_last =0;
    window.global_limit =1000;
    window.global_previous_row= '';

    //common, since ui=false when called init_common, set some common items here
    document.getElementById('message_close').innerHTML = window.global_icon_app_close;
    //if CONFIRM message is used
    document.getElementById('message_cancel').innerHTML = window.global_icon_app_cancel;
    document.getElementById('message_cancel').addEventListener('click', function() { document.getElementById("dialogue_message").style.visibility = "hidden"; }, false);

    //other in admin
    document.getElementById('menu_open').innerHTML = window.global_icon_app_menu_open;
    document.getElementById('menu_close').innerHTML = window.global_icon_app_menu_close;
    document.getElementById('menu_1_broadcast_button').innerHTML = window.global_icon_app_chat;
    document.getElementById('apps_save').innerHTML = window.global_icon_app_save;
    document.getElementById('list_app_log_first').innerHTML = window.global_icon_app_first;
    document.getElementById('list_app_log_previous').innerHTML = window.global_icon_app_previous;
    document.getElementById('list_app_log_next').innerHTML = window.global_icon_app_next;
    document.getElementById('list_app_log_last').innerHTML = window.global_icon_app_last;
    document.getElementById('map_my_location').innerHTML = window.global_icon_gps_map_my_location;

    document.getElementById('filesearch_menu4').innerHTML =  window.global_icon_app_search;
    document.getElementById('menu4_row_parameters_col1_1').innerHTML = window.global_icon_app_checkbox_checked;
    document.getElementById('menu4_row_parameters_col1_0').innerHTML = window.global_icon_app_checkbox_empty;
    document.getElementById('menu4_row_parameters_col2_1').innerHTML = window.global_icon_app_checkbox_checked;
    document.getElementById('menu4_row_parameters_col2_0').innerHTML = window.global_icon_app_checkbox_empty
    document.getElementById('menu4_row_parameters_col3_1').innerHTML = window.global_icon_app_checkbox_checked;
    document.getElementById('menu4_row_parameters_col3_0').innerHTML = window.global_icon_app_checkbox_empty
    document.getElementById('menu4_row_parameters_col4_1').innerHTML = window.global_icon_app_checkbox_checked;
    document.getElementById('menu4_row_parameters_col4_0').innerHTML = window.global_icon_app_checkbox_empty
    document.getElementById('menu4_row_parameters_col5_1').innerHTML = window.global_icon_app_checkbox_checked;
    document.getElementById('menu4_row_parameters_col5_0').innerHTML = window.global_icon_app_checkbox_empty

    document.getElementById('send_broadcast_send').innerHTML = window.global_icon_app_send;
    document.getElementById('send_broadcast_close').innerHTML = window.global_icon_app_close;
    document.getElementById('lov_close').innerHTML = window.global_icon_app_close;

    document.getElementById('menu_1_content').style.display = 'block';

    document.getElementById('menu_open').addEventListener('click', function() { document.getElementById('menu').style.display = 'block' }, false);
    document.getElementById('menu_close').addEventListener('click', function() { document.getElementById('menu').style.display = 'none' }, false);

    document.getElementById('menu_1').addEventListener('click', function() { show_menu(1) }, false);
    document.getElementById('menu_2').addEventListener('click', function() { show_menu(2) }, false);
    document.getElementById('menu_3').addEventListener('click', function() { show_menu(3) }, false);
    document.getElementById('menu_4').addEventListener('click', function() { show_menu(4) }, false);
    document.getElementById('menu_5').addEventListener('click', function() { admin_logoff_app() }, false);

    document.getElementById('select_app_menu2').addEventListener('change', function() { show_chart(1); show_chart(2);}, false);
    document.getElementById('select_year_menu2').addEventListener('change', function() { show_chart(1);show_chart(2);}, false);
    document.getElementById('select_month_menu2').addEventListener('change', function() { show_chart(1);show_chart(2);}, false);
    document.getElementById('menu_1_broadcast_button').addEventListener('click', function() { show_broadcast_dialogue('ALL'); }, false);
    document.getElementById('menu_1_checkbox_maintenance').addEventListener('click', function() { set_maintenance() }, false);
    document.getElementById('select_broadcast_type').addEventListener('change', function() { set_broadcast_type(); }, false);
    document.getElementById('send_broadcast_send').addEventListener('click', function() { sendBroadcast(); }, false);
    document.getElementById('send_broadcast_close').addEventListener('click', function() { closeBroadcast()}, false);


    document.getElementById('lov_close').addEventListener('click', function() { close_lov()}, false); 
    document.getElementById('apps_save').addEventListener('click', function() { apps_save()}, false); 

    document.getElementById('list_app_log_title').addEventListener('click', function() { nav_click(this)}, false);
    document.getElementById('select_app_menu4_app_log').addEventListener('change', function() { nav_click(document.getElementById('list_app_log_title'))}, false);
    document.getElementById('select_year_menu4_app_log').addEventListener('change', function() { nav_click(document.getElementById('list_app_log_title'))}, false);
    document.getElementById('select_month_menu4_app_log').addEventListener('change', function() { nav_click(document.getElementById('list_app_log_title'))}, false);
    
    document.getElementById('list_app_log_first').addEventListener('click', function() { page_navigation(this)}, false);
    document.getElementById('list_app_log_previous').addEventListener('click', function() { page_navigation(this)}, false);
    document.getElementById('list_app_log_next').addEventListener('click', function() { page_navigation(this)}, false);
    document.getElementById('list_app_log_last').addEventListener('click', function() { page_navigation(this)}, false);
    
    document.getElementById('list_connected_title').addEventListener('click', function() { nav_click(this)}, false);
    document.getElementById('select_app_menu4_list_connected').addEventListener('change', function() { nav_click(document.getElementById('list_connected_title'))}, false);
    document.getElementById('select_year_menu4_list_connected').addEventListener('change', function() { nav_click(document.getElementById('list_connected_title'))}, false);
    document.getElementById('select_month_menu4_list_connected').addEventListener('change', function() { nav_click(document.getElementById('list_connected_title'))}, false);

    document.getElementById('list_server_log_title').addEventListener('click', function() { nav_click(this)}, false);
    document.getElementById('select_logscope4').addEventListener('change', function() { nav_click(document.getElementById('list_server_log_title'))}, false);    
    document.getElementById('select_app_menu4').addEventListener('change', function() { nav_click(document.getElementById('list_server_log_title'))}, false);
    document.getElementById('select_year_menu4').addEventListener('change', function() { nav_click(document.getElementById('list_server_log_title'))}, false);
    document.getElementById('select_month_menu4').addEventListener('change', function() { nav_click(document.getElementById('list_server_log_title'))}, false);
    document.getElementById('select_day_menu4').addEventListener('change', function() { nav_click(document.getElementById('list_server_log_title'))}, false);

    document.getElementById('filesearch_menu4').addEventListener('click', function() { show_existing_logfiles();}, false);
    
    document.getElementById('list_pm2_log_title').addEventListener('click', function() { nav_click(this)}, false);
    document.getElementById('select_maptype').addEventListener('change', function() { map_set_style(); }, false);
    document.getElementById('map_my_location').addEventListener('click', function() { get_gps_from_ip().then(function(){
        update_map(window.global_client_longitude,
                   window.global_client_latitude,
                   window.global_gps_map_zoom,
                   window.global_client_place,
                   window.global_gps_map_marker_div_gps,
                   window.global_gps_map_jumpto);})}, false);

    //set texts
    document.getElementById('menu_1').innerHTML = 'DASHBOARD';
    document.getElementById('menu_2').innerHTML = 'USER STAT';
    document.getElementById('menu_3').innerHTML = 'APP ADMIN';
    document.getElementById('menu_4').innerHTML = 'MONITOR';
    document.getElementById('menu_5').innerHTML = 'LOGOUT';

    //menu 1
    document.getElementById('menu_1_db_info_database_title').innerHTML = 'Database';
    document.getElementById('menu_1_db_info_name_title').innerHTML = 'Name';
    document.getElementById('menu_1_db_info_version_title').innerHTML = 'Version';
    document.getElementById('menu_1_db_info_database_schema_title').innerHTML = 'Database schema';
    document.getElementById('menu_1_db_info_host_title').innerHTML = 'Host';
    document.getElementById('menu_1_db_info_connections_title').innerHTML = 'Connections';
    document.getElementById('menu_1_db_info_started_title').innerHTML = 'Started';

    document.getElementById('menu_1_db_info_space_title').innerHTML = 'Database space statistics';

    document.getElementById('menu_1_maintenance_title').innerHTML = 'Maintenance';
    //menu 2
    document.getElementById('box1_title').innerHTML = 'Unique Visitors';
    document.getElementById('box2_title').innerHTML = 'Unique Visitors';
    document.getElementById('list_user_stat_col_title1').innerHTML = 'ID';
    document.getElementById('list_user_stat_col_title2').innerHTML = 'PROVIDER';
    document.getElementById('list_user_stat_col_title3').innerHTML = 'COUNT';
    document.getElementById('list_user_stat_col_title4').innerHTML = 'CONNECTED';
    //menu 3
    document.getElementById('list_apps_title').innerHTML = 'APPS';
    document.getElementById('list_app_parameter_title').innerHTML = 'APP PARAMETERS';
    //menu 4
    document.getElementById('list_connected_title').innerHTML = 'Connected';
    document.getElementById('list_app_log_title').innerHTML = 'App Log';
    document.getElementById('list_server_log_title').innerHTML = 'Server Log';
    document.getElementById('list_pm2_log_title').innerHTML = 'PM2 Log';

    document.getElementById('menu4_row_parameters_col1').innerHTML = 'Server info';
    document.getElementById('menu4_row_parameters_col2').innerHTML = 'Server verbose';
    document.getElementById('menu4_row_parameters_col3').innerHTML = 'DB';
    document.getElementById('menu4_row_parameters_col4').innerHTML = 'Router';
    document.getElementById('menu4_row_parameters_col5').innerHTML = 'PM2 JSON log';

    document.getElementById('list_pm2_log_path_title').innerHTML = 'FILE PATH';

    document.getElementById('list_pm2_log_title_out').innerHTML = 'PM2 Log Out';
    document.getElementById('list_pm2_log_title_err').innerHTML = 'PM2 Log Error';
    document.getElementById('list_pm2_log_title_process_event').innerHTML = 'PM2 Log Process event';

    document.getElementById('map_my_location').title = 'My location';

    document.getElementById('send_broadcast_title').innerHTML = 'Broadcast';
    document.getElementById('select_broadcast_type').options[0].text = 'INFO';
    document.getElementById('select_broadcast_type').options[1].text = 'MAINTENANCE';

    document.getElementById('client_id_label').innerHTML = 'CLIENT ID';

    get_apps().then(function(){
        get_gps_from_ip().then(function(){
            if (!window.global_session_map)
                init_map();
            update_map(window.global_client_longitude,
                        window.global_client_latitude,
                        window.global_gps_map_zoom,
                        window.global_client_place,
                        window.global_gps_map_marker_div_gps,
                        window.global_gps_map_jumpto);
            show_menu(1);
        })                
    })
}
init_common({
    app_id: window.global_app_id,
    app_name: 'ADMIN',
    app_url: window.location.href,
    app_logo: '/app1/images/logo.png',
    exception_app_function: 'admin_logoff_app',
    close_eventsource: true,
    ui: false,
    admin: true,
    service_auth: window.global_service_auth,
    app_rest_client_id: window.global_app_rest_client_id,
    app_rest_client_secret: window.global_app_rest_client_secret,
    rest_app_parameter: window.global_rest_app_parameter,
    gps_lat: window.global_client_latitude, 
    gps_long: window.global_client_longitude, 
    gps_place: window.global_client_place 
    }, (err, global_app_parameters)=>{
    if (err)
        null;
    else{
        init_admin_secure();
    }
})

</script>