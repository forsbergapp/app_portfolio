<script>
    /*
    Functions and globals in this order:
    MISC
    BROADCAST
    MAP
    DASHBOARD
    APP ADMIN
    APP STAT
    SERVER LOGS
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
            document.getElementById('select_year_menu1').innerHTML = yearvalues;
            document.getElementById('select_year_menu1').selectedIndex = 0;
            document.getElementById('select_month_menu1').selectedIndex = new Date().getMonth();
            show_chart(1).then(function(){
                show_chart(2).then(function(){
                    count_users().then(function(){
                        show_maintenance();
                    });
                });
            });                
            break;    
        }
        case 2:{
            show_apps();
            break;    
        }
        case 3:{
            window.global_page = 0;
            document.getElementById('select_year_menu3').innerHTML = yearvalues;
            document.getElementById('select_year_menu3').selectedIndex = 0;
            document.getElementById('select_month_menu3').selectedIndex = new Date().getMonth();
            show_app_stat().then(function(){
                if (admin_token_has_value()){
                    window.global_session_map.resize();
                }
            });
            break;    
        }
        case 4:{
            document.getElementById('select_year_menu4').innerHTML = yearvalues;
            document.getElementById('select_year_menu4').selectedIndex = 0;
            document.getElementById('select_month_menu4').selectedIndex = new Date().getMonth();
            document.getElementById('select_day_menu4').selectedIndex = new Date().getDate() -1;
            get_server_log_parameters().then(function() {
                show_server_logs();
            });
            break;
        }
    }            
}
function show_user_agent(user_agent){
    return null;
}
function list_click(item){
    switch (item.id){
        case 'list_connected_title1':{
            document.getElementById('list_connected_form').style.display='block';
            document.getElementById('list_app_log_form').style.display='none';
            show_connected();
            break;
        }
        case 'list_app_log_title2':{
            document.getElementById('list_app_log_form').style.display='block';
            document.getElementById('list_connected_form').style.display='none';
            window.global_page = 0;
            show_app_log();
            break;
        }
        case 'list_pm2_log_title1':{
            document.getElementById('list_pm2_log_form').style.display='block';
            document.getElementById('list_server_log_form').style.display='none';
            show_pm2_logs();
            break;
        }
        case 'list_server_log_title2':{
            document.getElementById('list_server_log_form').style.display='block';
            document.getElementById('list_pm2_log_form').style.display='none';
            show_server_logs();
            break;
        }
    }
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
            let html='<option value="">ALL</option>';
            html +='<option value="ADMIN">ADMIN SQL</option>';
            for (var i = 1; i < json.data.length; i++) {
                    html +=
                    `<option value='${json.data[i].id}'>APP${json.data[i].id}</option>`;
            }
            document.getElementById('select_app_menu1').innerHTML = html;
            document.getElementById('select_app_menu3').innerHTML = html;
            document.getElementById('select_app_menu4').innerHTML = html;
            document.getElementById('select_app_broadcast').innerHTML = html;
        }
    })
}
async function show_list(list_div, list_div_col_title, url, sort, order_by, cols){
    if (admin_token_has_value()){
        let json;
        let app_id = document.getElementById('select_app_menu3').options[document.getElementById('select_app_menu3').selectedIndex].value;
        let year = document.getElementById('select_year_menu3').value;
        let month = document.getElementById('select_month_menu3').value;
        switch (list_div){
            case 'list_pm2_log':{
                let old_html1 = document.getElementById(list_div + '_out').innerHTML;
                let old_html2 = document.getElementById(list_div + '_err').innerHTML;
                let old_html3 = document.getElementById(list_div + '_process_event').innerHTML;
                document.getElementById(list_div + '_out').innerHTML = window.global_button_spinner;
                document.getElementById(list_div + '_err').innerHTML = window.global_button_spinner;
                document.getElementById(list_div + '_process_event').innerHTML = window.global_button_spinner;
                //sort not implemented for pm2 with different content in one json file
                break;
            }
            case 'list_server_log':{
                //remove sort events, title is included in list
                set_list_eventlisteners('server_log', '',0);
                let old_html = document.getElementById(list_div).innerHTML;
                document.getElementById(list_div).innerHTML = window.global_button_spinner;
                break;
            }
            default:{
                let old_html = document.getElementById(list_div).innerHTML;
                document.getElementById(list_div).innerHTML = window.global_button_spinner;
                //sort on all columns except last column for list connect with chat icon
                for (let i=1;i<=cols;i++){
                    document.getElementById(list_div_col_title + i).classList.remove('asc');
                    document.getElementById(list_div_col_title + i).classList.remove('desc');
                }
                document.getElementById(list_div_col_title + sort).classList.add(order_by);
                break;
            }
        }
        await common_fetch(url, 
                           'GET', 2, null, null, null, (err, result) =>{
            if (err){
                switch (list_div){
                    case 'list_pm2_log':{
                        document.getElementById(list_div + '_out').innerHTML = old_html1;
                        document.getElementById(list_div + '_err').innerHTML = old_html2;
                        document.getElementById(list_div + '_process_event').innerHTML = old_html3;
                        break;
                    }
                    default:{
                        document.getElementById(list_div).innerHTML = old_html;
                        break;
                    }
                }
            }
            else{
                json = JSON.parse(result);
                if (json.success === 1){
                    let html = '';
                    let html_out = '';
                    let html_err = '';
                    let html_process_event = '';
                    switch (list_div){
                        case 'list_connected':{
                            set_list_eventlisteners('connected', 'gps',0);
                            set_list_eventlisteners('connected', 'chat',0);
                            document.getElementById(list_div).innerHTML = '';
                            break;
                        }
                        case 'list_app_log':{
                            window.global_page_last = Math.floor(json.data[0].total_rows/window.global_limit) * window.global_limit;
                            set_list_eventlisteners('app_log', 'gps',0);
                            document.getElementById(list_div).innerHTML = '';
                            break;
                        }
                        case 'list_server_log':{
                            document.getElementById(list_div).innerHTML = '';
                            html =`<div id='list_server_log_row_title' class='list_server_log_row'>
                                        <div id='list_server_log_col_title1' class='list_server_log_col'>
                                            <div>LOGDATE</div>
                                        </div>
                                        <div id='list_server_log_col_title2' class='list_server_log_col'>
                                            <div>IP</div>
                                        </div>
                                        <div id='list_server_log_col_title3' class='list_server_log_col'>
                                            <div>HOST</div>
                                        </div>
                                        <div id='list_server_log_col_title4' class='list_server_log_col'>
                                            <div>PROTOCOL</div>
                                        </div>
                                        <div id='list_server_log_col_title5' class='list_server_log_col'>
                                            <div>URL</div>
                                        </div>
                                        <div id='list_server_log_col_title6' class='list_server_log_col'>
                                            <div>METHOD</div>
                                        </div>
                                        <div id='list_server_log_col_title7' class='list_server_log_col'>
                                            <div>STATUSCODE</div>
                                        </div>
                                        <div id='list_server_log_col_title8' class='list_server_log_col'>
                                            <div>USER AGENT</div>
                                        </div>
                                        <div id='list_server_log_col_title9' class='list_server_log_col'>
                                            <div>ACCEPT LANGUAGE</div>
                                        </div>
                                        <div id='list_server_log_col_title10' class='list_server_log_col'>
                                            <div>HTTP REFERER</div>
                                        </div>
                                        <div id='list_server_log_col_title11' class='list_server_log_col'>
                                            <div>APP ID</div>
                                        </div>
                                        <div id='list_server_log_col_title12' class='list_server_log_col'>
                                            <div>APP FILENAME</div>
                                        </div>
                                        <div id='list_server_log_col_title13' class='list_server_log_col'>
                                            <div>APP FUNCTION NAME</div>
                                        </div>
                                        <div id='list_server_log_col_title14' class='list_server_log_col'>
                                            <div>APP APP LINE</div>
                                        </div>
                                        <div id='list_server_log_col_title15' class='list_server_log_col'>
                                            <div>LOG TEXT</div>
                                        </div>
                                    </div>`;
                            break;
                        }
                        case 'list_pm2_log':{
                            document.getElementById(list_div + '_path').innerHTML = json.path + json.file;
                            document.getElementById(list_div + '_out').innerHTML = '';
                            document.getElementById(list_div + '_err').innerHTML = '';
                            document.getElementById(list_div + '_process_event').innerHTML = '';
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
                                                    <div>${json.data[i].app_id}</div>
                                                </div>
                                                <div class='list_connected_col'>
                                                    <div>${json.data[i].user_account_id}</div>
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
                                                    <div>${json.data[i].client_latitude}</div>
                                                </div>
                                                <div class='list_app_log_col list_app_log_gps_click gps_click'>
                                                    <div>${json.data[i].client_longitude}</div>
                                                </div>
                                                <div class='list_app_log_col'>
                                                    <div>${json.data[i].date_created}</div>
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
                                                <div>${json.data[i].ip==""?"":json.data[i].ip.replace('::ffff:','')}</div>
                                            </div>
                                            <div class='list_server_log_col'>
                                                <div>${json.data[i].host}</div>
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
                                                <div>${json.data[i].app_id}</div>
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
                                                    <div>${json.data[i].message}</div>
                                                </div>
                                                <div class='list_pm2_log_col'>
                                                    <div>${json.data[i].process_id}</div>
                                                </div>
                                            </div><br>`;        
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
                                                    <div>${json.data[i].message}</div>
                                                </div>
                                                <div class='list_pm2_log_col'>
                                                    <div>${json.data[i].process_id}</div>
                                                </div>
                                            </div><br>`;
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
                                            </div><br>`;
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
                                set_list_eventlisteners('connected', 'gps',1);
                                set_list_eventlisteners('connected', 'chat',1);
                                break;
                            }
                            case 'list_app_log':{
                                document.getElementById(list_div).innerHTML = html;
                                set_list_eventlisteners('app_log', 'gps',1);
                                break;
                            }
                            case 'list_server_log':{
                                document.getElementById(list_div).innerHTML = html;
                                document.getElementById(list_div_col_title + sort).classList.add(order_by);
                                set_list_eventlisteners('server_log', '',1);
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
            }
        })        
    }
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
        show_message('INFO', null, null, 'Please enter message', window.global_common_app_id);
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
            show_message('INFO', null, null, 'Sent!', window.global_common_app_id);
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
    common_fetch(`/service/geolocation/getTimezone/admin?latitude=${latitude}&longitude=${longitude}`,
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
/* DASHBOARD              */
/*----------------------- */
//chart 1=Left Piechart, 2= Right Barchart
async function show_chart(chart){
    if (admin_token_has_value()){
        let year = document.getElementById('select_year_menu1').value;
        let month = document.getElementById('select_month_menu1').value;
        let json;
        let app_id ='';
        let old_html = document.getElementById(`box${chart}`).innerHTML;
        document.getElementById(`box${chart}`).innerHTML = window.global_button_spinner;

        await common_fetch(window.global_rest_url_base + `app_log/admin/stat/uniquevisitor?select_app_id=${app_id}&statchoice=${chart}&year=${year}&month=${month}`,
                 'GET', 2, null, null, null, (err, result) =>{
            if (err)
                document.getElementById(`box${chart}`).innerHTML = old_html;
            else{
                json = JSON.parse(result);
                if (json.success == 1){
                    document.getElementById(`box${chart}`).innerHTML = `<canvas id="Chart${chart}"></canvas>`;
                    const ctx = document.getElementById(`Chart${chart}`).getContext('2d');
                    if (chart==1){
                        let app_id_array = [];
                        let amount_array = [];
                        for (let i = 0; i < json.data.length; i++) {
                            app_id_array.push('APP' + json.data[i].app_id);
                            amount_array.push(json.data[i].amount);
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
                                responsive:true,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: `Unique Visitors ${year}-${month} per app`
                                    }
                                }
                            }
                            
                        });
                    }
                    else
                        if (chart==2){
                            let day_array = [];
                            let amount_array = [];
                            for (let i = 0; i < json.data.length; i++) {
                                day_array.push(json.data[i].day);
                                amount_array.push(json.data[i].amount);
                            }
                            const barChart = new Chart(ctx, {
                                type: 'bar',
                                data: {
                                    labels: day_array,
                                    datasets: [{
                                        label: `Unique Visitors ${year}-${month} per day`,
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
        document.getElementById('list_user_stat').innerHTML = window.global_button_spinner;

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
async function show_maintenance(){
    if (admin_token_has_value()){
        let json;
        await common_fetch(window.global_rest_url_base + window.global_rest_app_parameter + 'admin/0?parameter_name=SERVER_MAINTENANCE',
                           'GET', 2, null, null, null, (err, result) =>{
            if (err)
                null;
            else{
                json = JSON.parse(result);
                if (json.data==1)
                    document.getElementById('checkbox_maintenance').checked =true;
                else
                    document.getElementById('checkbox_maintenance').checked =false;
            }
        })
    }
}
function set_maintenance(){
    let check_value;
    if (document.getElementById('checkbox_maintenance').checked ==true)
        check_value = 1;
    else
        check_value = 0;
    let json_data = `{"app_id" : ${window.global_common_app_id}, 
                      "parameter_name":"SERVER_MAINTENANCE",
                      "parameter_value":${check_value}}`;
    common_fetch(window.global_rest_url_base + window.global_rest_app_parameter + 'admin/value?',
                 'PATCH', 2, json_data, null, null, (err, result) =>{
        null;
    })
}
/*----------------------- */
/* APP ADMIN              */
/*----------------------- */
async function show_apps(){
    let json;
    let old_html = document.getElementById('list_apps').innerHTML;
    document.getElementById('list_apps').innerHTML = window.global_button_spinner;

    await common_fetch(window.global_rest_url_base + window.global_rest_app + '/admin?id=0',
                       'GET', 2, null, null, null, (err, result) =>{
        if (err)
            document.getElementById('list_apps').innerHTML = old_html;
        else{
            json = JSON.parse(result);
            if (json.success === 1){
                let list_apps = document.getElementById('list_apps');
                list_apps.innerHTML = '';
                let html = '';
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
                list_apps.innerHTML = html;
                list_events('list_apps_row', '.list_edit_app', 1);

                //set focus first column in first row
                //this will trigger to show detail records
                document.querySelectorAll('.list_edit_app')[0].focus();
            }
        }
    })
}
function show_app_parameter(app_id){
    let json;
    let old_html = document.getElementById('list_app_parameter').innerHTML;
    document.getElementById('list_app_parameter').innerHTML = window.global_button_spinner;

    common_fetch(window.global_rest_url_base + window.global_rest_app_parameter + `admin/all/${parseInt(app_id)}?`,
                 'GET', 2, null, null, null, (err, result) =>{
        if (err)
            document.getElementById('list_app_parameter').innerHTML = old_html;
        else{
            json = JSON.parse(result);
            if (json.success === 1){
                let list_app_parameter = document.getElementById('list_app_parameter');
                list_app_parameter.innerHTML = '';
                let html = '';
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
                list_app_parameter.innerHTML = html;
                list_events('list_app_parameter_row', '.list_edit_app_parameter', 1);
                document.querySelectorAll('.list_lov_click').forEach(e => e.addEventListener('click', function(event) {
                    show_parameter_type_names(1, this, 1);
                }));
            }
        }
    })
}
function apps_save(){
    //save changes in list_apps
    document.querySelectorAll('.list_apps_row').forEach(e => {
        if (e.getAttribute('data-changed-record')=='1'){
            update_record('app',
                            e,
                            e.children[0].children[0].innerHTML,//id
                            e.children[1].children[0].value,    //app_name
                            e.children[2].children[0].value,    //url
                            e.children[3].children[0].value,    //logo
                            e.children[4].children[0].checked); //enabled
        }
    });
    //save changes in list_app_parameter
    document.querySelectorAll('.list_app_parameter_row').forEach(e => {
        if (e.getAttribute('data-changed-record')=='1'){
            update_record('app_parameter',
                            e,
                            null, null, null, null, null,
                            e.children[0].children[0].value,    //app_id
                            e.children[1].children[0].value,    //parameter_type_id
                            e.children[3].children[0].innerHTML,//parameter_name
                            e.children[4].children[0].value,    //parameter_value
                            e.children[5].children[0].value);   //parameter_comment
        }
    });
}
function update_record(table, 
                        element,
                        id=null, app_name=null, url=null, logo=null, enabled=null,
                        app_id=null, parameter_type_id=null, parameter_name=null, parameter_value=null, parameter_comment=null){
    if (admin_token_has_value()){
        let rest_url;
        let json_data;
        let old_button = document.getElementById('apps_save').innerHTML;
        document.getElementById('apps_save').innerHTML = window.global_button_spinner;
        switch (table){
            case 'app':{
                if (id==window.global_common_app_id){
                    //app window.global_common_app_id should always be enabled
                    element.children[4].children[0].checked = true;
                    enabled=true;
                    show_message('INFO', null, null, `App ${window.global_common_app_id} should always be enabled`, window.global_common_app_id);
                }
                json_data = `{"app_name": "${app_name}",
                                "url": "${url}",
                                "logo": "${logo}",
                                "enabled": "${enabled==true?1:0}"}`;
                rest_url = `${window.global_rest_app}/admin/${id}`;
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
        common_fetch(window.global_rest_url_base + rest_url,
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
            let old_html = document.getElementById('lov_list').innerHTML;
            show_lov('PARAMETER TYPE', window.global_button_spinner);

            common_fetch(window.global_rest_url_base + window.global_rest_parameter_type + `admin?`,
                         'GET', 2, null, null, null, (err, result) =>{
                if (err)
                    document.getElementById('lov_list').innerHTML = old_html;
                else{
                    json = JSON.parse(result);
                    if (json.success === 1){
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
                }
            })
            break;
        }
    }
}
/*----------------------- */
/* APP STAT               */
/*----------------------- */
async function show_connected(sort=4, order_by='desc'){
    let app_id = document.getElementById('select_app_menu3').options[document.getElementById('select_app_menu3').selectedIndex].value;
    let year = document.getElementById('select_year_menu3').value;
    let month = document.getElementById('select_month_menu3').value;
    show_list('list_connected', 
              'list_connected_col_title', 
              `/service/broadcast/connected?select_app_id=${app_id}&year=${year}&month=${month}&sort=${sort}&order_by=${order_by}&limit=${window.global_limit}`, 
              sort,
              order_by,
              8);
}    
async function show_app_stat(){
    if (document.getElementById('list_connected_form').style.display=='block')
        list_click(document.getElementById('list_connected_title1'));
    else
        list_click(document.getElementById('list_app_log_title2'));
}
async function show_app_log(sort=8, order_by='desc', offset=0, limit=window.global_limit){
    let app_id = document.getElementById('select_app_menu3').options[document.getElementById('select_app_menu3').selectedIndex].value;
    let year = document.getElementById('select_year_menu3').value;
    let month = document.getElementById('select_month_menu3').value;
    show_list('list_app_log', 
              'list_app_log_col_title', 
              window.global_rest_url_base + `app_log?select_app_id=${app_id}&year=${year}&month=${month}&sort=${sort}&order_by=${order_by}&offset=${offset}&limit=${limit}`, 
              sort,
              order_by,
              8);
} 
function set_list_eventlisteners(list_type, list_function, event_action){
    let click_function;
    if (list_type=='server_log'){
        click_function = function() { list_sort_click(this)};
        if (event_action==1){
            for (let i=1;i <=15;i++){
                document.getElementById('list_server_log_col_title' + i).addEventListener('click', click_function); 
            }
        }
        else
            for (let i=1;i <=15;i++){
                if (document.getElementById('list_server_log_col_title' + i))
                    document.getElementById('list_server_log_col_title' + i).removeEventListener('click', click_function); 
            }
    }
    else{
        let elements = document.querySelectorAll(`.list_${list_type}_${list_function}_click`);   
        click_function = function() { list_item_action(this)};
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
function list_item_action(item){
    if (item.className.indexOf('gps_click')>0){
        common_fetch(window.global_service_geolocation + window.global_service_geolocation_gps_place + 
                     '/admin?app_user_id=' +
                     '&latitude=' + item.parentNode.children[5].children[0].innerHTML +
                     '&longitude=' + item.parentNode.children[6].children[0].innerHTML,
                     'GET', 2, null, null, null, (err, result) =>{
                if (err)
                    null;
                else{
                    let json = JSON.parse(result);
                    update_map(item.parentNode.children[6].children[0].innerHTML,
                               item.parentNode.children[5].children[0].innerHTML,
                               window.global_gps_map_zoom,
                               json.geoplugin_place + ', ' + 
                               json.geoplugin_region + ', ' + 
                               json.geoplugin_countryCode,
                               window.global_gps_map_marker_div_gps,
                               window.global_gps_map_jumpto);
                }
        })
    }
    else
        if (item.className.indexOf('chat_click')>0){
            show_broadcast_dialogue('CLIENT', item.parentNode.children[0].children[0].innerHTML);
        }
    
}
/*----------------------- */
/* SERVER LOGS            */
/*----------------------- */
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
            html +=`<option value='${window.global_service_log_scope_server}'>${window.global_service_log_scope_server}</option>`;
            html +=`<option value='${window.global_service_log_scope_service}'>${window.global_service_log_scope_service}</option>`;
            html +=`<option value='${window.global_service_log_scope_db}'>${window.global_service_log_scope_db}</option>`;
            html +=`<option value='${window.global_service_log_scope_router}'>${window.global_service_log_scope_router}</option>`;
            html +=`<option value='${window.global_service_log_scope_controller}'>${window.global_service_log_scope_controller}</option>`;
            document.getElementById('select_logscope4').innerHTML = html;
            html =`<option value='${window.global_service_log_level_info}'>${window.global_service_log_level_info}</option>`;
            html +=`<option value='${window.global_service_log_level_verbose}'>${window.global_service_log_level_verbose}</option>`;
            html +=`<option value='${window.global_service_log_level_error}'>${window.global_service_log_level_error}</option>`;

            document.getElementById('select_loglevel4').innerHTML = html;
            if (window.global_service_log_file_interval=='1M')
                document.getElementById('select_day_menu4').style.display = 'none';
            else
                document.getElementById('select_day_menu4').style.display = 'inline-block';
        }
    })
}
function show_server_logs(sort=1, order_by='desc'){
    let logscope = document.getElementById('select_logscope4').value;
    let loglevel = document.getElementById('select_loglevel4').value;
    let year = document.getElementById('select_year_menu4').value;
    let month= document.getElementById('select_month_menu4').value;
    let day  = document.getElementById('select_day_menu4').value;
    let app_id = document.getElementById('select_app_menu4').options[document.getElementById('select_app_menu4').selectedIndex].value;
    let url_parameters;
    if (window.global_service_log_file_interval=='1M')
        url_parameters = `select_app_id=${app_id}&logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}`;
    else
        url_parameters = `select_app_id=${app_id}&logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}&day=${day}`;
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
        let old_html = document.getElementById('lov_list').innerHTML;
        show_lov('SERVER LOG FILES', window.global_button_spinner);

        common_fetch(window.global_service_log + '/files?',
                     'GET', 2, null, null, null, (err, result) =>{
            if (err)
                document.getElementById('lov_list').innerHTML = old_html;
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
                document.querySelectorAll('.list_lov_row').forEach(e => e.addEventListener('click', function(event) {
                    let i = 0;
                    this.children[0].children[0].innerHTML.split('_').forEach(function (record) {
                        i++;
                        switch (i){
                            case 1:{
                                document.getElementById('select_logscope4').value = record;
                                break;
                            }
                            case 2:{
                                document.getElementById('select_loglevel4').value = record;
                                break;
                            }
                            case 3:{
                                document.getElementById('select_year_menu4').value = parseInt(record.substring(0,4));
                                document.getElementById('select_month_menu4').value = parseInt(record.substring(4,6));
                                if (window.global_service_log_file_interval=='1D')
                                    document.getElementById('select_day_menu4').value = parseInt(record.substring(6,8));
                                break;
                            }
                        } 
                    })   
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

    document.getElementById('menu_open').innerHTML = window.global_icon_app_menu_open;
    document.getElementById('menu_close').innerHTML = window.global_icon_app_menu_close;
    document.getElementById('maintenance_broadcast_info').innerHTML = window.global_icon_app_chat;
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

    document.getElementById('select_app_menu1').addEventListener('change', function() { show_chart(2); }, false);
    document.getElementById('select_year_menu1').addEventListener('change', function() { show_chart(1);show_chart(2);}, false);
    document.getElementById('select_month_menu1').addEventListener('change', function() { show_chart(1);show_chart(2);}, false);
    document.getElementById('select_broadcast_type').addEventListener('change', function() { set_broadcast_type(); }, false);
    document.getElementById('maintenance_broadcast_info').addEventListener('click', function() { show_broadcast_dialogue('ALL'); }, false);
    document.getElementById('send_broadcast_send').addEventListener('click', function() { sendBroadcast(); }, false);
    document.getElementById('send_broadcast_close').addEventListener('click', function() { closeBroadcast()}, false);
    document.getElementById('checkbox_maintenance').addEventListener('click', function() { set_maintenance() }, false);

    document.getElementById('lov_close').addEventListener('click', function() { close_lov()}, false); 
    document.getElementById('apps_save').addEventListener('click', function() { apps_save()}, false); 

    document.getElementById('select_app_menu3').addEventListener('change', function() { show_app_stat()}, false);
    document.getElementById('select_maptype').addEventListener('change', function() { map_set_style(); }, false);
    document.getElementById('select_year_menu3').addEventListener('change', function() { show_app_stat()}, false);
    document.getElementById('select_month_menu3').addEventListener('change', function() { show_app_stat()}, false);
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
    document.getElementById('list_connected_title1').addEventListener('click', function() { list_click(this)}, false);
    document.getElementById('list_app_log_title2').addEventListener('click', function() { list_click(this)}, false);
    document.getElementById('list_app_log_first').addEventListener('click', function() { page_navigation(this)}, false);
    document.getElementById('list_app_log_previous').addEventListener('click', function() { page_navigation(this)}, false);
    document.getElementById('list_app_log_next').addEventListener('click', function() { page_navigation(this)}, false);
    document.getElementById('list_app_log_last').addEventListener('click', function() { page_navigation(this)}, false);
    document.getElementById('map_my_location').addEventListener('click', function() { get_gps_from_ip().then(function(){
        update_map(window.global_client_longitude,
                   window.global_client_latitude,
                   window.global_gps_map_zoom,
                   window.global_client_place,
                   window.global_gps_map_marker_div_gps,
                   window.global_gps_map_jumpto);})}, false);
    document.getElementById('select_logscope4').addEventListener('change', function() { show_server_logs();}, false);
    document.getElementById('select_loglevel4').addEventListener('change', function() { show_server_logs();}, false);
    document.getElementById('select_app_menu4').addEventListener('change', function() { show_server_logs();}, false);
    document.getElementById('select_year_menu4').addEventListener('change', function() { show_server_logs();}, false);
    document.getElementById('select_month_menu4').addEventListener('change', function() { show_server_logs();}, false);
    document.getElementById('select_day_menu4').addEventListener('change', function() { show_server_logs();}, false);
    document.getElementById('filesearch_menu4').addEventListener('click', function() { show_existing_logfiles();}, false);
    document.getElementById('list_pm2_log_title1').addEventListener('click', function() { list_click(this)}, false);
    document.getElementById('list_server_log_title2').addEventListener('click', function() { list_click(this)}, false);

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
    app_id: '',
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