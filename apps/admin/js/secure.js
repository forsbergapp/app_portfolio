const common = await import('/common/js/common.js');
/*
    Functions and globals in this order:
    GLOBALS
    MISC
    BROADCAST
    USER STAT
    USERS
    APP ADMIN
    MONITOR
    SERVER CONFIG
    INSTALLATION
    DB INFO
    SERVER
    EXCEPTION
    INIT
*/
/*----------------------- */
/* GLOBALS                */
/*----------------------- */
const APP_GLOBAL = {
    "page":"",
    "page_last":"",
    "limit":"",
    "previous_row":"",
    "module_leaflet_map_container":"",
    "module_leaflet_map_zoom":"",
    "module_leaflet_map_marker_div_gps":"",
    "service_log_scope_server":"",
    "service_log_scope_service":"",
    "service_log_scope_db":"",
    "service_log_scope_router":"",
    "service_log_scope_controller":"",
    "service_log_level_verbose":"",
    "service_log_level_error":"",
    "service_log_level_info":"",
    "service_log_file_interval":"",
    "service_log_file_path_server":"",
    "service_log_destination":"",
    "service_log_url_destination":"",
    "service_log_url_destination_username":"",
    "service_log_url_destination_password":"",
    "service_log_date_format":""
}
const delete_globals = () => {
    APP_GLOBAL['page'] = null;
    APP_GLOBAL['page_last'] = null;
    APP_GLOBAL['limit'] = null;
    APP_GLOBAL['previous_row'] = null;
    APP_GLOBAL['module_leaflet_map_zoom'] = null;
    APP_GLOBAL['module_leaflet_map_marker_div_gps'] = null;
    APP_GLOBAL['module_leaflet_map_container'] = null;
    APP_GLOBAL['service_log_scope_server'] = null;
    APP_GLOBAL['service_log_scope_service'] = null;
    APP_GLOBAL['service_log_scope_db'] = null;
    APP_GLOBAL['service_log_scope_router'] = null;
    APP_GLOBAL['service_log_scope_controller'] = null;
    APP_GLOBAL['service_log_level_verbose'] = null;
    APP_GLOBAL['service_log_level_error'] = null;
    APP_GLOBAL['service_log_level_info'] = null;
    APP_GLOBAL['service_log_destination'] = null;
    APP_GLOBAL['service_log_url_destination'] = null;
    APP_GLOBAL['service_log_url_destination_username'] = null;
    APP_GLOBAL['service_log_url_destination_password'] = null;
    APP_GLOBAL['service_log_file_interval'] = null;
    APP_GLOBAL['service_log_file_path_server'] = null;
    APP_GLOBAL['service_log_date_format'] = null;

    common.COMMON_GLOBAL['client_latitude'] = null;
    common.COMMON_GLOBAL['client_longitude'] = null;
    common.COMMON_GLOBAL['client_place'] = null;
    common.COMMON_GLOBAL['module_leaflet_style'] = null;
    common.COMMON_GLOBAL['module_leaflet_jumpto'] = null;
    common.COMMON_GLOBAL['module_leaflet_popup_offset'] = null;
}

/*----------------------- */
/* MISC                   */
/*----------------------- */
const list_generate = (amount)=>{
    let html = '';
    for (let i=1; i<=amount;i++){
        html += `<option value='${i}'>${i}</option>`;
    }
    return html;
}
const show_menu = (menu) => {
    document.getElementById('menu_1_content').style.display='none';
    document.getElementById(`menu_1`).classList.remove('menuitem_selected');
    document.getElementById('menu_2_content').style.display='none';
    document.getElementById(`menu_2`).classList.remove('menuitem_selected');
    document.getElementById('menu_3_content').style.display='none';
    document.getElementById(`menu_3`).classList.remove('menuitem_selected');
    document.getElementById('menu_4_content').style.display='none';
    document.getElementById(`menu_4`).classList.remove('menuitem_selected');
    document.getElementById('menu_5_content').style.display='none';
    document.getElementById(`menu_5`).classList.remove('menuitem_selected');
    document.getElementById('menu_6_content').style.display='none';
    document.getElementById(`menu_6`).classList.remove('menuitem_selected');
    document.getElementById('menu_7_content').style.display='none';
    document.getElementById(`menu_7`).classList.remove('menuitem_selected');
    document.getElementById('menu_8_content').style.display='none';
    document.getElementById(`menu_8`).classList.remove('menuitem_selected');
    document.getElementById('menu_9_content').style.display='none';
    document.getElementById(`menu_9`).classList.remove('menuitem_selected');
    document.getElementById('menu_10_content').style.display='none';
    document.getElementById(`menu_10`).classList.remove('menuitem_selected');
    document.getElementById(`menu_${menu}_content`).style.display='block';
    document.getElementById(`menu_${menu}`).classList.add('menuitem_selected');
    let current_year = new Date().getFullYear();
    let yearvalues =   `<option value="${current_year}">${current_year}</option>
                        <option value="${current_year -1}">${current_year-1}</option>
                        <option value="${current_year -2}">${current_year-2}</option>
                        <option value="${current_year -3}">${current_year-3}</option>
                        <option value="${current_year -4}">${current_year-4}</option>
                        <option value="${current_year -5}">${current_year-5}</option>
                        `;
    switch(menu){
        //START
        case 1:{
            show_start(yearvalues);
            break;
        }
        //USER STAT
        case 2:{
            count_users();
            break;    
        }
        //USERS
        case 3:{
            show_users();
            break;
        }
        //APP ADMIN
        case 4:{
            show_apps();
            break;    
        }
        //MONITOR
        case 5:{
            show_monitor(yearvalues);
            break;
        }
        //SERVER CONFIG
        case 6:{
            show_server_config();
            break;
        }
        //INSTALLATION
        case 7:{
            show_installation();
            break;
        }
        //DATABASE
        case 8:{
            show_db_info();
            break;
        }
        //BACKUP/RESTORE
        case 9:{
            break;
        }
        //SERVER
        case 10:{
            show_server_info();
            break;
        }
    }            
}

const show_start = async (yearvalues) =>{
    const show_charts = async () => {
        if (admin_token_has_value()){
            //chart 1 shows for all apps, app id used for chart 2
            let app_id = document.getElementById('select_app_menu1').value; 
            let year = document.getElementById('select_year_menu1').value;
            let month = document.getElementById('select_month_menu1').value;
            let result_obj;
            document.getElementById('box1_chart').innerHTML = common.APP_SPINNER;
            document.getElementById('box1_legend').innerHTML = common.APP_SPINNER;
            document.getElementById('box2_chart').innerHTML = common.APP_SPINNER;
            document.getElementById('box2_legend').innerHTML = common.APP_SPINNER;
            //return result for both charts
            common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/app_log/admin/stat/uniquevisitor?select_app_id=${app_id}&year=${year}&month=${month}`,
                                'GET', 1, null, null, null, (err, result) =>{
                if (err){
                    document.getElementById('box1_chart').innerHTML = '';
                    document.getElementById('box1_legend').innerHTML = '';
                    document.getElementById('box2_chart').innerHTML = '';
                    document.getElementById('box2_legend').innerHTML = '';
                }
                else{
                    let html = '';
                    result_obj = JSON.parse(result);
                    //chart 1=Piechart, 2= Barchart
                    //CHART 1
                    const SearchAndGetText = (item, search) => {
                        for (let i=1;i<item.options.length;i++){
                            if (item.options[i].value == search)
                                return item.options[i].text
                        }
                        return null;
                    }
                    let sum_amount =0;
                    let chart_1 = result_obj.data.filter((row)=> row.chart==1);
                    for (let stat of chart_1) {
                        sum_amount += +stat.amount;
                    }
                    let apps_color = '';
                    let degree_start = 0;
                    let degree_stop = 0;

                    let app_color;
                    chart_1.forEach((stat, i)=>{
                        //calculate colors and degree
                        degree_stop = degree_start + +stat.amount/sum_amount*360;
                        app_color = `rgb(${i/chart_1.length*200},${i/chart_1.length*200},255) ${degree_start}deg ${degree_stop}deg`;
                        if (i < chart_1.length - 1)
                            apps_color += app_color + ',';
                        else
                            apps_color += app_color;
                        //add to legend below chart
                        html += `<div id='box1_legend_row' class='box_legend_row'>
                                    <div id='box1_legend_col1' class='box_legend_col' style='background-color:rgb(${i/chart_1.length*200},${i/chart_1.length*200},255)'></div>
                                    <div id='box1_legend_col2' class='box_legend_col'>${SearchAndGetText(document.getElementById('select_app_menu1'), stat.app_id)}</div>
                                </div>`;
                        degree_start = degree_start + stat.amount/sum_amount*360;
                    })
                    //display pie chart
                    document.getElementById('box1_chart').innerHTML = `<div id='box1_pie'></div>`;
                    document.getElementById('box1_pie').style.backgroundImage = `conic-gradient(${apps_color})`
                    //show legend below chart
                    document.getElementById('box1_legend').innerHTML = html;

                    //CHART 2
                    html = '';
                    let max_amount =0;
                    let chart_2 = result_obj.data.filter((row)=> row.chart==2);
                    for (let stat of chart_2) {
                        if (+stat.amount>max_amount)
                            max_amount = +stat.amount;
                    }
                    //set bar data
                    let bar_color;
                    if (app_id == '')
                        bar_color = 'rgb(81, 171, 255)';
                    else
                        bar_color = 'rgb(197 227 255)';

                    for (let stat of chart_2) {
                        html += `<div class='box2_barcol box2_barcol_display' style='width:${100/stat.length}%'>
                                    <div class='box2_barcol_color' style='background-color:${bar_color};height:${+stat.amount/max_amount*100}%'></div>
                                    <div class='box2_barcol_legendX'>${stat.day}</div>
                                </div>`;
                    }
                    //create bar chart
                    document.getElementById('box2_chart').innerHTML = `<div id='box2_bar_legendY'>
                                                                            <div id='box2_bar_legend_max'>${max_amount}</div>
                                                                            <div id='box2_bar_legend_medium'>${max_amount/2}</div>
                                                                            <div id='box2_bar_legend_min'>0</div>
                                                                    </div>
                                                                    <div id='box2_bar_data'>${html}</div>`;
                    //legend below chart
                    document.getElementById('box2_legend').innerHTML = `<div id='box2_legend_row' class='box_legend_row'>
                                                                            <div id='box2_legend_col1' class='box_legend_col' style='background-color:${bar_color}'></div>
                                                                            <div id='box2_legend_col2' class='box_legend_col'>${document.getElementById('select_app_menu1').options[document.getElementById('select_app_menu1').selectedIndex].text}</div>
                                                                        </div>` ;
                }
            })
        }
    }
    document.querySelector('#menu_1_content').innerHTML = common.APP_SPINNER;
    document.querySelector('#menu_1_content').innerHTML = 
            `<div id='menu_1_content_widget1' class='widget'>
                <div id='menu_1_row_sample'>
                    <select id='select_app_menu1'>${await get_apps()}</select>
                    <select id='select_year_menu1'>${yearvalues}</select>
                    <select id='select_month_menu1'>${list_generate(12)}</select>
                </div>
                <div id='graphBox'>
                    <div id='box1'>
                        <div id='box1_title' class='box_title'>${common.ICONS['app_users'] + ' ' + common.ICONS['app_chart']}</div>
                        <div id='box1_chart' class='box_chart'></div>
                        <div id='box1_legend' class='box_legend'></div>
                    </div>
                    <div id='box2'>
                        <div id='box2_title' class='box_title'>${common.ICONS['app_users'] + ' ' + common.ICONS['regional_numbersystem']}</div>
                        <div id='box2_chart' class='box_chart'></div>
                        <div id='box2_legend' class='box_legend'></div>
                    </div>
                </div>
            </div>
            <div id='menu_1_content_widget2' class='widget'>
                <div id='menu_1_maintenance'>
                    <div id='menu_1_maintenance_title'>${common.ICONS['app_maintenance']}</div>
                    <div id='menu_1_maintenance_checkbox'>
                        <input id='menu_1_checkbox_maintenance' type='checkbox' class='common_switch_input' />
                        <label for='menu_1_checkbox_maintenance' class='common_switch_label'></label>
                    </div>
                </div>
                <div id='menu_1_broadcast'>
                    <div id='menu_1_broadcast_title'>${common.ICONS['app_broadcast']}</div>
                    <div id='menu_1_broadcast_button' class='chat_click'>${common.ICONS['app_chat']}</div>
                </div>
            </div>`;
            
    if (common.COMMON_GLOBAL['system_admin']==1)
        document.getElementById('menu_1_maintenance').style.display = 'inline-block';
    else
        document.getElementById('menu_1_maintenance').style.display = 'none';

    document.getElementById('menu_1_broadcast_button').addEventListener('click', () => { show_broadcast_dialogue('ALL'); }, false);
    document.getElementById('menu_1_checkbox_maintenance').addEventListener('click', () => { set_maintenance() }, false);
        
    document.getElementById('select_year_menu1').selectedIndex = 0;
    document.getElementById('select_month_menu1').selectedIndex = new Date().getMonth();
    document.getElementById('select_app_menu1').addEventListener('change', () => { show_charts();}, false);
    document.getElementById('select_year_menu1').addEventListener('change', () => { show_charts();}, false);
    document.getElementById('select_month_menu1').addEventListener('change', () => { show_charts();}, false);

    if (common.COMMON_GLOBAL['system_admin']==1)
        check_maintenance();
    else
        show_charts();
}
const show_user_agent = (user_agent) => {
    return null;
}
const get_apps = async () => {
    return new Promise((resolve, reject)=>{
        let json;
        let html=`<option value="">${common.ICONS['infinite']}</option>`;
        if (common.COMMON_GLOBAL['system_admin']==1){
            //system admin cant select app will show/use all
            resolve (html);
        }
        else{
            common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/app/admin?`, 'GET', 1, null, null, null, (err, result) =>{
                if (err)
                    resolve();
                else{
                    json = JSON.parse(result);
                    for (let i = 0; i < json.data.length; i++) {
                            html +=
                            `<option value='${json.data[i].id}'>${json.data[i].id} - ${json.data[i].app_name}</option>`;
                    }
                    resolve(html);
                }
            })
        }
    })
}

/*----------------------- */
/* BROADCAST              */
/*----------------------- */
const sendBroadcast = () => {
    let broadcast_type ='';
    let client_id;
    let app_id;
    let broadcast_message = document.getElementById('send_broadcast_message').value;

    if (broadcast_message==''){
        common.show_message('INFO', null, null, `${common.ICONS['message_text']}!`, common.COMMON_GLOBAL['app_id']);
        return null;
    }
    
    if (document.getElementById('client_id').innerHTML==''){
        app_id = document.getElementById('select_app_broadcast').options[document.getElementById('select_app_broadcast').selectedIndex].value;
        client_id = '';
        broadcast_type = document.getElementById('select_broadcast_type').options[document.getElementById('select_broadcast_type').selectedIndex].value;
    }
    else{
        client_id = document.getElementById('client_id').innerHTML;
        app_id = '';
        broadcast_type = 'CHAT';
    }
        
    let json_data =`{"app_id": ${app_id==''?null:app_id},
                     "client_id": ${client_id==''?null:client_id},
                     "client_id_current": ${common.COMMON_GLOBAL['service_broadcast_client_ID']},
                     "broadcast_type" :"${broadcast_type}", 
                     "broadcast_message":"${broadcast_message}"}`;
    let url='';
    let token_type;
    if (common.COMMON_GLOBAL['system_admin']==1){
        url = `${common.COMMON_GLOBAL['rest_resource_server']}/broadcast/message/SystemAdmin?`;
        token_type = 2;
    }
    else{
        url = `${common.COMMON_GLOBAL['rest_resource_server']}/broadcast/message/Admin?`;
        token_type = 1;
    }
        
    common.common_fetch(url, 'POST', token_type, json_data, null, null, (err, result) =>{
        if (err)
            null;
        else{
            common.show_message('INFO', null, null, `${common.ICONS['app_send']}!`, common.COMMON_GLOBAL['app_id']);
        }
    });
}    
const closeBroadcast = () => {
    document.getElementById('dialogue_send_broadcast').style.visibility='hidden'; 
    document.getElementById('client_id_label').style.display='inline-block';
    document.getElementById('client_id').style.display='inline-block';
    document.getElementById('select_app_broadcast').style.display='inline-block';
    document.getElementById('client_id').innerHTML='';
    document.getElementById('send_broadcast_message').value='';
}
const show_broadcast_dialogue = async (dialogue_type, client_id=null) => {
    document.getElementById('select_app_broadcast').innerHTML = await get_apps();
    switch (dialogue_type){
        case 'CHAT':{
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
const set_broadcast_type = () => {
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
const check_maintenance = async () => {
    if (admin_token_has_value()){
        let json;
        await common.common_fetch('/server/config/systemadmin/maintenance?', 'GET', 2, null, null, null, (err, result) =>{
            if (err)
                null;
            else{
                json = JSON.parse(result);
                if (json.value==1)
                    document.getElementById('menu_1_checkbox_maintenance').checked =true;
                else
                    document.getElementById('menu_1_checkbox_maintenance').checked =false;
            }
        })
}
}
const set_maintenance = () => {
    if (admin_token_has_value()){
        let check_value;
        if (document.getElementById('menu_1_checkbox_maintenance').checked ==true)
            check_value = 1;
        else
            check_value = 0;
        let json_data = `{
                            "value": ${check_value}
                         }`;
        common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_server']}/config/systemadmin/maintenance?`, 'PATCH', 2, json_data, null, null, (err, result) =>{
            null;
        })
    }
}
/*----------------------- */
/* USER STAT              */
/*----------------------- */

const count_users = async () => {
    const count_connected = async (identity_provider_id, count_logged_in, callBack) => {
        if (admin_token_has_value()){
            let json;
            await common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_server']}/broadcast/connection/Admin/count?identity_provider_id=${identity_provider_id}&count_logged_in=${count_logged_in}`,
                     'GET', 1, null, null, null, (err, result) =>{
                if (err)
                    callBack(result, null);
                else{
                    callBack(null, result);
                }
            });
        }
    }    
    if (admin_token_has_value()){
        let json;
        document.querySelector('#menu_2_content').innerHTML = common.APP_SPINNER;
        await common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/admin/count?`,
                           'GET', 1, null, null, null, (err, result) =>{
            if (err)
                document.querySelector('#menu_2_content').innerHTML = '';
            else{
                json = JSON.parse(result);
                let html='';
                for (let i=0;i<=json.data.length-1;i++){
                    html +=  `<div id='list_user_stat_row_${i}' class='list_user_stat_row'>
                                    <div class='list_user_stat_col'>
                                        <div>${common.get_null_or_value(json.data[i].identity_provider_id)}</div>
                                    </div>
                                    <div class='list_user_stat_col'>
                                        <div>${json.data[i].provider_name==null?common.ICONS['app_home']:json.data[i].provider_name}</div>
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
                                <div>${common.ICONS['app_logoff']}</div>
                            </div>
                            <div class='list_user_stat_col'>
                                <div></div>
                            </div>
                            <div class='list_user_stat_col'>
                                <div></div>
                            </div>
                        </div>`;
                document.querySelector('#menu_2_content').innerHTML =
                   `<div id='menu_2_content' class='main_content'>
                        <div id='menu_2_content_widget1' class='widget'>
                            <div id='list_user_stat_row_title' class='list_user_stat_row'>
                                <div id='list_user_stat_col_title1' class='list_user_stat_col'>${common.ICONS['provider_id']}</div>
                                <div id='list_user_stat_col_title2' class='list_user_stat_col'>${common.ICONS['provider']}</div>
                                <div id='list_user_stat_col_title3' class='list_user_stat_col'>${common.ICONS['app_sum']}</div>
                                <div id='list_user_stat_col_title4' class='list_user_stat_col'>${common.ICONS['app_user_connections']}</div>
                            </div>
                            <div id='list_user_stat'>${html}</div>
                        </div>
                    </div>`;
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
/* USERS                  */
/*----------------------- */
const show_users = () =>{
    document.querySelector('#menu_3_content').innerHTML = common.APP_SPINNER;
    document.querySelector('#menu_3_content').innerHTML = 
            `<div id='menu_3_content_widget1' class='widget'>
                <div id='list_user_account_title'>${common.ICONS['app_users']}</div>
                <div id='list_user_account_search'>
                    <input id='list_user_account_search_input' type='text' />
                    <div id='list_user_account_search_icon'>${common.ICONS['app_search']}</div>
                </div>
                <div id='list_user_account' class='common_list_scrollbar'></div>
            </div>
            <div id='menu_3_content_widget2' class='widget'>
                <div id='list_user_account_logon_title'>${common.ICONS['app_login']}</div>
                <div id='list_user_account_logon' class='common_list_scrollbar'></div>
                <div id='users_buttons' class="save_buttons">
                    <button id='users_save' class='common_dialogue_button button_save' >${common.ICONS['app_save']}</button>
                </div>
            </div>`;
    document.getElementById('list_user_account_search_input').addEventListener('keyup', () => { common.typewatch(search_users, 8, 'ASC', false); }, false);
    document.getElementById('list_user_account_search_icon').addEventListener('click', () => { document.getElementById('list_user_account_search_input').focus();document.getElementById('list_user_account_search_input').dispatchEvent(new KeyboardEvent('keyup')); }, false);
    document.getElementById('users_save').addEventListener('click', () => { button_save('users_save')}, false); 
    search_users();

}
const search_users = (sort=8, order_by='ASC', focus=true) => {
    let json;

    if (common.check_input(document.getElementById("list_user_account_search_input").value, 100, false) == false)
        return null;

    document.getElementById('list_user_account').innerHTML = common.APP_SPINNER;
    
    let search_user='*';
    //show all records if no search criteria
    if (document.getElementById('list_user_account_search_input').value!='')
        search_user = document.getElementById('list_user_account_search_input').value;
    common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/admin?search=${search_user}&sort=${sort}&order_by=${order_by}`,
                       'GET', 1, null, null, null, (err, result) =>{
        if (err)
            document.getElementById('list_user_account').innerHTML = '';
        else{
            json = JSON.parse(result);
            let html = `<div id='list_user_account_row_title' class='list_user_account_row'>
                            <div id='list_user_account_col_title1' class='list_user_account_col list_title'>
                                <div>${common.ICONS['user_avatar']}</div>
                            </div>
                            <div id='list_user_account_col_title2' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['provider_id']}</div>
                            </div>
                            <div id='list_user_account_col_title3' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['app_role']}</div>
                            </div>
                            <div id='list_user_account_col_title4' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['app_role']} ${common.ICONS['misc_image']}</div>
                            </div>
                            <div id='list_user_account_col_title5' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['app_inactive']} ${common.ICONS['app_active']}</div>
                            </div>
                            <div id='list_user_account_col_title6' class='list_user_account_col list_sort_click list_title'>
                                <div>LEVEL</div>
                            </div>
                            <div id='list_user_account_col_title7' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['app_private']}</div>
                            </div>
                            <div id='list_user_account_col_title8' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['user']} ${common.ICONS['username']}</div>
                            </div>
                            <div id='list_user_account_col_title9' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['user_bio']}</div>
                            </div>
                            <div id='list_user_account_col_title10' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['app_email']}</div>
                            </div>
                            <div id='list_user_account_col_title11' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['app_email']} ${common.ICONS['app_forgot']}</div>
                            </div>
                            <div id='list_user_account_col_title12' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['user_password']}</div>
                            </div>
                            <div id='list_user_account_col_title13' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['user_password']} ${common.ICONS['app_info']}</div>
                            </div>
                            <div id='list_user_account_col_title14' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['app_verification_code']}</div>
                            </div>
                            <div id='list_user_account_col_title15' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['provider_id']}</div>
                            </div>
                            <div id='list_user_account_col_title16' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['provider']}</div>
                            </div>
                            <div id='list_user_account_col_title17' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['provider_id']} ${common.ICONS['user']} ID</div>
                            </div>
                            <div id='list_user_account_col_title18' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['provider_id']} ${common.ICONS['user']} ${common.ICONS['username']} 1</div>
                            </div>
                            <div id='list_user_account_col_title19' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['provider_id']} ${common.ICONS['user']} ${common.ICONS['username']} 2</div>
                            </div>
                            <div id='list_user_account_col_title20' class='list_user_account_col list_title'>
                                <div>${common.ICONS['provider_id']} ${common.ICONS['user']} ${common.ICONS['user_avatar']}</div>
                            </div>
                            <div id='list_user_account_col_title21' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['provider_id']} ${common.ICONS['user']} ${common.ICONS['user_avatar']} URL</div>
                            </div>
                            <div id='list_user_account_col_title22' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['provider_id']} ${common.ICONS['user']} ${common.ICONS['app_email']}</div>
                            </div>
                            <div id='list_user_account_col_title23' class='list_user_account_col list_sort_click list_title'>
                                <div>${common.ICONS['user_account_created']}</div>
                            </div>
                            <div id='list_user_account_col_title24' class='list_apps_col list_sort_click list_title'>
                                <div>${common.ICONS['user_account_modified']}</div>
                            </div>
                        </div>`;
            let input_readonly = '';
            let lov_div = '';
            let lov_class = '';
            //superadmin can edit
            if (common.COMMON_GLOBAL['user_app_role_id']==0){
                lov_div = `<div class='common_lov_button common_list_lov_click'></div>`;
                lov_class = 'common_input_lov';
            }
            else
                input_readonly = `readonly='true'`;
            for (let i = 0; i < json.data.length; i++) {
                let list_user_account_current_user_row='';
                if (json.data[i].id==common.COMMON_GLOBAL['user_account_id'])
                    list_user_account_current_user_row = 'list_current_user_row';
                else
                    list_user_account_current_user_row ='';
                html += 
                `<div id='list_user_account_row_${i}' data-changed-record='0' class='list_user_account_row ${list_user_account_current_user_row}' >
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>
                            <img class='list_user_account_avatar' ${common.list_image_format_src(json.data[i].avatar)}/>
                        </div>
                    </div>
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>${json.data[i].id}</div>
                    </div>
                    <div class='list_user_account_col'>
                        <input ${input_readonly} type=text class='list_edit ${lov_class}' value='${common.get_null_or_value(json.data[i].app_role_id)}'/>
                        ${lov_div}
                    </div>
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>${json.data[i].app_role_icon}</div>
                    </div>
                    <div class='list_user_account_col'>
                        <input ${input_readonly} type=text class='list_edit' value='${common.get_null_or_value(json.data[i].active)}'/>
                    </div>
                    <div class='list_user_account_col'>
                        <input ${input_readonly} type=text class='list_edit' value='${common.get_null_or_value(json.data[i].user_level)}'/>
                    </div>
                    <div class='list_user_account_col'>
                        <input ${input_readonly} type='text' class='list_edit' value='${common.get_null_or_value(json.data[i].private)}'/>
                    </div>
                    <div class='list_user_account_col'>
                        <input ${input_readonly} type='text' class='list_edit' value='${common.get_null_or_value(json.data[i].username)}'/>
                    </div>
                    <div class='list_user_account_col'>
                        <input ${input_readonly} type='text' class='list_edit' value='${common.get_null_or_value(json.data[i].bio)}'/>
                    </div>
                    <div class='list_user_account_col'>
                        <input ${input_readonly} type='text' class='list_edit' value='${common.get_null_or_value(json.data[i].email)}'/>
                    </div>
                    <div class='list_user_account_col'>
                        <input ${input_readonly} type='text' class='list_edit' value='${common.get_null_or_value(json.data[i].email_unverified)}'/>
                    </div>
                    <div class='list_user_account_col'>
                        <input ${input_readonly} type='text' class='list_edit' value='${common.get_null_or_value(json.data[i].password)}'/>
                    </div>
                    <div class='list_user_account_col'>
                        <input ${input_readonly} type='text' class='list_edit' value='${common.get_null_or_value(json.data[i].password_reminder)}'/>
                    </div>
                    <div class='list_user_account_col'>
                        <input ${input_readonly} type='text' class='list_edit' value='${common.get_null_or_value(json.data[i].verification_code)}'/>
                    </div>
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].identity_provider)}</div>
                    </div>
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].provider_name)}</div>
                    </div>
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].provider_id)}</div>
                    </div>
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].provider_first_name)}</div>
                    </div>
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].provider_last_name)}</div>                        
                    </div>
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>
                            <img class='list_user_account_avatar' ${common.list_image_format_src(json.data[i].provider_image)}/>
                        </div>
                    </div>
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].provider_image_url)}</div>
                    </div>
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].provider_email)}</div>
                    </div>
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].date_created)}</div>
                    </div>
                    <div class='list_user_account_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].date_modified)}</div>
                    </div>
                </div>`;
            }
            document.getElementById('list_user_account').innerHTML = html;
            document.getElementById('list_user_account_col_title' + sort).classList.add(order_by);
        
            if (common.COMMON_GLOBAL['user_app_role_id']==0){
                //add lov icon for super admin
                document.querySelectorAll(`#list_user_account .common_lov_button`).forEach(e => e.innerHTML = common.ICONS['app_lov']);
            }
            set_list_eventlisteners('user_account', 'sort', true);
            list_events('list_user_account', 'list_user_account_row', ' .list_edit');
            if (focus==true){
                //set focus at start
                //set focus first column in first row
                //this will trigger to show detail records
                if (document.querySelectorAll('#list_user_account .list_edit')[0].getAttribute('readonly')==true){
                    document.querySelectorAll('#list_user_account .list_edit')[0].setAttribute('readonly', false);
                    document.querySelectorAll('#list_user_account .list_edit')[0].focus();
                    document.querySelectorAll('#list_user_account .list_edit')[0].setAttribute('readonly', true);
                }
                else
                    document.querySelectorAll('#list_user_account .list_edit')[0].focus();
                    
            }
            else{
                //trigger focus event on first row set focus back again to search field
                document.querySelectorAll('#list_user_account .list_edit')[0].focus();
                document.getElementById('list_user_account_search_input').focus();
            }   
        }
    })
}
const show_user_account_logon = async (user_account_id) => {
    let json;
    document.getElementById('list_user_account_logon').innerHTML = common.APP_SPINNER;

    common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account_logon/admin/${parseInt(user_account_id)}/''?`,
                 'GET', 1, null, null, null, (err, result) =>{
        if (err)
            document.getElementById('list_user_account_logon').innerHTML = '';
        else{
            json = JSON.parse(result);
            let html = `<div id='list_user_account_logon_row_title' class='list_user_account_logon_row'>
                            <div id='list_user_account_logon_col_title1' class='list_user_account_logon_col list_title'>
                                <div>USER ACCOUNT ID</div>
                            </div>
                            <div id='list_user_account_logon_col_title4' class='list_user_account_logon_col list_title'>
                                <div>DATE CREATED</div>
                            </div>
                            <div id='list_user_account_logon_col_title1' class='list_user_account_logon_col list_title'>
                                <div>APP ID</div>
                            </div>
                            <div id='list_user_account_logon_col_title1' class='list_user_account_logon_col list_title'>
                                <div>RESULT</div>
                            </div>
                            <div id='list_user_account_logon_col_title2' class='list_user_account_logon_col list_title'>
                                <div>IP</div>
                            </div>
                            <div id='list_user_account_logon_col_title4' class='list_user_account_logon_col list_title'>
                                <div>GPS LONG</div>
                            </div>
                            <div id='list_user_account_logon_col_title4' class='list_user_account_logon_col list_title'>
                                <div>GPS LAT</div>
                            </div>
                            <div id='list_user_account_logon_col_title3' class='list_user_account_logon_col list_title'>
                                <div>USER AGENT</div>
                            </div>
                            <div id='list_user_account_logon_col_title1' class='list_user_account_logon_col list_title'>
                                <div>ACCESS TOKEN</div>
                            </div>
                        </div>`;
            for (let i = 0; i < json.data.length; i++) {
                html += 
                `<div id='list_user_account_logon_row_${i}' data-changed-record='0' class='list_user_account_logon_row'>
                    <div class='list_user_account_logon_col'>
                        <div class='list_readonly'>${json.data[i].user_account_id}</div>
                    </div>
                    <div class='list_user_account_logon_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].date_created)}</div>
                    </div>
                    <div class='list_user_account_logon_col'>
                        <div class='list_readonly'>${json.data[i].app_id}</div>
                    </div>
                    <div class='list_user_account_logon_col'>
                        <div class='list_readonly'>${json.data[i].result}</div>
                    </div>
                    <div class='list_user_account_logon_col'>
                        <div class='list_readonly'>${json.data[i].client_ip}</div>
                    </div>
                    <div class='list_user_account_logon_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].client_longitude)}</div>
                    </div>
                    <div class='list_user_account_logon_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].client_latitude)}</div>
                    </div>
                    <div class='list_user_account_logon_col'>
                        <div class='list_readonly'>${json.data[i].client_user_agent}</div>
                    </div>
                    <div class='list_user_account_logon_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].access_token)}</div>
                    </div>
                </div>`;
            }
            document.getElementById('list_user_account_logon').innerHTML = html;
        }
    })
}
/*----------------------- */
/* APP ADMIN              */
/*----------------------- */
const show_apps = async () => {
    let json;
    document.querySelector('#menu_4_content').innerHTML = common.APP_SPINNER;

    await common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/app/admin?`,
                       'GET', 1, null, null, null, (err, result) =>{
        if (err)
            document.querySelector('#menu_4_content').innerHTML = '';
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
                            <div id='list_apps_col_title6' class='list_apps_col list_title'>
                                <div>CATEGORY ID</div>
                            </div>
                            <div id='list_apps_col_title7' class='list_apps_col list_title'>
                                <div>CATEGORY NAME</div>
                            </div>
                        </div>`;
            for (let i = 0; i < json.data.length; i++) {
                html += 
                `<div id='list_apps_row_${i}' data-changed-record='0' class='list_apps_row' >
                    <div class='list_apps_col'>
                        <div class='list_readonly'>${json.data[i].id}</div>
                    </div>
                    <div class='list_apps_col'>
                        <input type=text class='list_edit' value='${json.data[i].app_name}'/>
                    </div>
                    <div class='list_apps_col'>
                        <input type=text class='list_edit' value='${json.data[i].url}'/>
                    </div>
                    <div class='list_apps_col'>
                        <input type=text class='list_edit' value='${json.data[i].logo}'/>
                    </div>
                    <div class='list_apps_col'>
                        <input type='checkbox' class='list_edit' ${json.data[i].enabled==1?'checked':''} />
                    </div>
                    <div class='list_apps_col'>
                        <input type='text' class='list_edit common_input_lov' value='${common.get_null_or_value(json.data[i].app_category_id)}' />
                        <div class='common_lov_button common_list_lov_click'></div>
                    </div>
                    <div class='list_apps_col'>
                        <div class='list_readonly'>${common.get_null_or_value(json.data[i].app_category_text)} </div>
                    </div>
                </div>`;
            }
            document.querySelector('#menu_4_content').innerHTML = 
                   `<div id='menu_4_content_widget1' class='widget'>
                        <div id='list_apps_title'>${common.ICONS['app_apps']}</div>
                        <div id='list_apps' class='common_list_scrollbar'>${html}</div>
                    </div>
                    <div id='menu_4_content_widget2' class='widget'>
                        <div id='list_app_parameter_title'>${common.ICONS['app_apps'] + common.ICONS['app_settings']}</div>
                        <div id='list_app_parameter' class='common_list_scrollbar'></div>
                        <div id='apps_buttons' class="save_buttons">
                            <button id='apps_save' class='common_dialogue_button button_save' >${common.ICONS['app_save']}</button>
                        </div>
                    </div>`;
            document.getElementById('apps_save').addEventListener('click', () => { button_save('apps_save')}, false); 
            //add lov icon
            document.querySelectorAll(`#list_apps .common_lov_button`).forEach(e => e.innerHTML = common.ICONS['app_lov']);
            list_events('list_apps', 'list_apps_row', ' .list_edit');
            //disable enabled checkbox for app 0 common
            document.getElementById('list_apps_row_0').children[4].children[0].disabled = true;
            //set focus first column in first row
            //this will trigger to show detail records
            document.querySelectorAll('#list_apps .list_edit')[0].focus();
        }
    })
}
const show_app_parameter = (app_id) => {
    let json;
    document.getElementById('list_app_parameter').innerHTML = common.APP_SPINNER;

    common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/app_parameter/admin/all/${parseInt(app_id)}?`,
                 'GET', 1, null, null, null, (err, result) =>{
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
            for (let i = 0; i < json.data.length; i++) {
                html += 
                `<div id='list_app_parameter_row_${i}' data-changed-record='0' class='list_app_parameter_row'>
                    <div class='list_app_parameter_col'>
                        <div class='list_readonly'>${json.data[i].app_id}</div>
                    </div>
                    <div class='list_app_parameter_col'>
                        <input type=text class='list_edit common_input_lov' value='${json.data[i].parameter_type_id}'/>
                        <div class='common_lov_button common_list_lov_click'></div>
                    </div>
                    <div class='list_app_parameter_col'>
                        <div class='list_readonly'>${json.data[i].parameter_type_text}</div>
                    </div>
                    <div class='list_app_parameter_col'>
                        <div class='list_readonly'>${json.data[i].parameter_name}</div>
                    </div>
                    <div class='list_app_parameter_col'>
                        <input type=text class='list_edit' value='${common.get_null_or_value(json.data[i].parameter_value)}'/>
                    </div>
                    <div class='list_app_parameter_col'>
                        <input type=text class='list_edit' value='${common.get_null_or_value(json.data[i].parameter_comment)}'/>
                    </div>
                </div>`;
            }
            document.getElementById('list_app_parameter').innerHTML = html;
            //add lov icon
            document.querySelectorAll(`#list_app_parameter .common_lov_button`).forEach(e => e.innerHTML = common.ICONS['app_lov']);
            list_events('list_app_parameter', 'list_app_parameter_row', '.list_edit');
        }
    })
}
const button_save = async (item) => {
    if (item=='apps_save'){
        //save changes in list_apps
        let x = document.querySelectorAll('.list_apps_row');
        for (let i=0;i<x.length;i++){
            if (x[i].getAttribute('data-changed-record')=='1'){
                await update_record('app',
                                    x[i],
                                    item,
                                    {id: x[i].children[0].children[0].innerHTML,
                                     app_name: x[i].children[1].children[0].value,
                                     url: x[i].children[2].children[0].value,
                                     logo: x[i].children[3].children[0].value,
                                     enabled: x[i].children[4].children[0].checked});
            }
        };
        //save changes in list_app_parameter
        x = document.querySelectorAll('.list_app_parameter_row');
        for (let i=0;i<x.length;i++){
            if (x[i].getAttribute('data-changed-record')=='1'){
                await update_record('app_parameter',
                                    x[i],
                                    item,
                                    {app_id: x[i].children[0].children[0].innerHTML,
                                     parameter_type_id: x[i].children[1].children[0].value,
                                     parameter_name:  x[i].children[3].children[0].innerHTML,
                                     parameter_value: x[i].children[4].children[0].value,
                                     parameter_comment: x[i].children[5].children[0].value
                                    });
            }
        };
    }
    else 
        if (item == 'users_save'){
            //save changes in list_user_account
            let x = document.querySelectorAll('.list_user_account_row');
            for (let i=0;i<x.length;i++){
                if (x[i].getAttribute('data-changed-record')=='1'){
                    await update_record('user_account',
                                        x[i],
                                        item,
                                        {id: x[i].children[1].children[0].innerHTML,
                                         app_role_id: x[i].children[2].children[0].value,
                                         active: x[i].children[4].children[0].value,
                                         user_level: x[i].children[5].children[0].value,
                                         private: x[i].children[6].children[0].value,
                                         username: x[i].children[7].children[0].value,
                                         bio: x[i].children[8].children[0].value,
                                         email: x[i].children[9].children[0].value,
                                         email_unverified: x[i].children[10].children[0].value,
                                         password: x[i].children[11].children[0].value,
                                         password_reminder: x[i].children[12].children[0].value,
                                         verification_code: x[i].children[13].children[0].value
                                        });
                }
            };
        }
        else
            if (item == 'config_save'){
                let config_no;
                let json_data;
                const config_create_server_json = () => {
                    let config_json = [];
                    document.querySelectorAll('#list_config .list_config_group').forEach(e_group => 
                        {
                            let config_group='';
                            document.querySelectorAll(`#${e_group.id} .list_config_row`).forEach(e_row => 
                                    {
                                        config_group += `{"${e_row.children[0].children[0].innerHTML}": ${JSON.stringify(e_row.children[1].children[0].value)}, 
                                                          "COMMENT": ${JSON.stringify(e_row.children[2].children[0].innerHTML)}}`;
                                        if (e_group.lastChild != e_row)
                                            config_group += ',';
                                    }
                            )
                            config_json.push(JSON.stringify(JSON.parse(`[${config_group}]`), undefined, 2));
                        }
                    );
                    return `{   
                                "SERVER":${config_json[0]},
                                "SERVICE_AUTH":${config_json[1]},
                                "SERVICE_BROADCAST":${config_json[2]},
                                "SERVICE_DB":${config_json[3]},
                                "SERVICE_LOG":${config_json[4]},
                                "SERVICE_REPORT":${config_json[5]},
                                "SERVICE_GEOLOCATION":${config_json[6]}
                            }`;
                }
                //no fetched from end of item name list_config_nav_X
                config_no = document.querySelectorAll('#menu_6_content .list_nav .list_nav_selected_tab')[0].id.substring(16);
                if (config_no == 0){
                    //no action, just display info of config_init.json
                    null;
                }
                else{
                    if (config_no == 1)
                        json_data = `{"config_no":   ${config_no},
                                    "config_json": ${JSON.stringify(config_create_server_json())}}`;
                    else
                        json_data = `{"config_no":   ${config_no},
                                    "config_json": ${JSON.stringify(document.getElementById('list_config_edit').innerHTML)}}`;
                    json_data = JSON.stringify(JSON.parse(json_data), undefined, 2);
                    let old_button = document.getElementById(item).innerHTML;
                    document.getElementById(item).innerHTML = common.APP_SPINNER;
                    common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_server']}/config/systemadmin?`,
                        'PUT', 2, json_data, null, null,(err, result) =>{
                        document.getElementById(item).innerHTML = old_button;
                    })
                }
            }
    
}
const update_record = async (table, 
                             row_element,
                             button,
                             parameters) => {
    if (admin_token_has_value()){
        let rest_url;
        let json_data;
        let old_button = document.getElementById(button).innerHTML;
        document.getElementById(button).innerHTML = common.APP_SPINNER;
        switch (table){
            case 'user_account':{
                json_data = `{"app_role_id": "${parameters.app_role_id}",
                              "active":"${parameters.active}",
                              "user_level":"${parameters.user_level}",
                              "private":"${parameters.private}",
                              "username":"${parameters.username}",
                              "bio":"${parameters.bio}",
                              "email":"${parameters.email}",
                              "email_unverified":"${parameters.email_unverified}",
                              "password":"${parameters.password}",
                              "password_reminder":"${parameters.password_reminder}",
                              "verification_code":"${parameters.verification_code}"}`;
                rest_url = `/user_account/admin/${parameters.id}?`;
                break;
            }
            case 'app':{
                if (parameters.id==common.COMMON_GLOBAL['common_app_id']){
                    if (row_element.children[4].children[0].checked == false){
                        //app common.COMMON_GLOBAL['common_app_id'] should always be enabled
                        row_element.children[4].children[0].checked = true;
                        enabled=true;
                    }
                }
                json_data = `{"app_name": "${parameters.app_name}",
                              "url": "${parameters.url}",
                              "logo": "${parameters.logo}",
                              "enabled": "${parameters.enabled==true?1:0}"}`;
                rest_url = `/app/admin/${parameters.id}?`;
                break;
            }
            case 'app_parameter':{
                json_data = `{"app_id": ${parameters.app_id},
                              "parameter_name":"${parameters.parameter_name}",
                              "parameter_type_id":"${parameters.parameter_type_id}",
                              "parameter_value":"${parameters.parameter_value}",
                              "parameter_comment":"${parameters.parameter_comment}"}`;
                rest_url = `/app_parameter/admin?`;
                break;
            }
        }
        await common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}${rest_url}`,
                     'PUT', 1, json_data, null, null,(err, result) =>{
            document.getElementById(button).innerHTML = old_button;
            if (err)
                null;
            else{
                row_element.setAttribute('data-changed-record', '0');
            }
        })
    }
}
const list_events = (list_item, item_row, item_edit) => {

    //on change on all editable fields
    //mark record as changed if any editable field is changed
    
    //change event
    document.getElementById(list_item).addEventListener('change', (event) => {
        if (event.target.classList.contains('list_edit')){
            event.target.parentNode.parentNode.setAttribute('data-changed-record','1');
            const row_action = (err, result, item, event, nextindex) => {
                if (err){
                    event.stopPropagation();
                    event.preventDefault();
                    //set old value
                    item.value = event.target.defaultValue;
                    item.focus();
                    item.nextElementSibling.dispatchEvent(new Event('click'));
                }
                else{
                    let json = JSON.parse(result);
                    if (json.data.length == 1){
                        //set new value from 3 column JSON result
                        document.getElementById(event.target.parentNode.parentNode.id).children[nextindex].children[0].innerHTML = Object.values(json.data[0])[2];
                    }
                    else{
                        event.stopPropagation();
                        event.preventDefault();
                        //set old value
                        item.value = event.target.defaultValue;
                        item.focus();    
                        item.nextElementSibling.children[0].dispatchEvent(new Event('click', {"bubbles": true}));
                    }
                }
            }
            //app category LOV
            if (item_row == 'list_apps_row' && event.target.parentNode.parentNode.children[5].children[0] == event.target)
                if (event.target.value=='')
                    event.target.parentNode.parentNode.children[6].children[0].innerHTML ='';
                else{
                    common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/app_category/admin?id=${event.target.value}`,
                                'GET', 1, null, null, null, (err, result) =>{
                        row_action(err, result, event.target, event, 6, '');
                    });
                }
            //parameter type LOV
            if (item_row == 'list_app_parameter_row' && event.target.parentNode.parentNode.children[1].children[0] == event.target)
                if (event.target.value=='')
                    event.target.value = event.target.defaultValue;
                else{
                    common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/parameter_type/admin?id=${event.target.value}`,
                                'GET', 1, null, null, null, (err, result) =>{
                        row_action(err, result, event.target, event, 2);
                    });
                }
            //app role LOV
            if (item_row == 'list_user_account_row' && event.target.parentNode.parentNode.children[2].children[0] == event.target){
                let app_role_id_lookup='';
                let old_value =event.target.value;
                //if empty then lookup default
                if (event.target.value=='')
                    app_role_id_lookup=2;
                else
                    app_role_id_lookup=event.target.value;
                common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/app_role/admin?id=${app_role_id_lookup}`,
                            'GET', 1, null, null, null, (err, result) =>{
                    row_action(err, result, event.target, event, 3);
                    //if wrong value then field is empty again, fetch default value for empty app_role
                    if (old_value!='' && event.target.value=='')
                        event.target.dispatchEvent(new Event('change'));
                });
            }
        }
    })
    //keydown event
    document.getElementById(list_item).addEventListener('keydown', (event) => {
        if (event.target.classList.contains('list_edit')){
            if (event.code=='ArrowUp') {
                APP_GLOBAL['previous_row'] = event.target.parentNode.parentNode;
                event.preventDefault();
                let index = parseInt(event.target.parentNode.parentNode.id.substr(item_row.length+1));
                //focus on first list_edit item in the row
                if (index>0)
                    document.querySelectorAll(`#${item_row}_${index - 1} ${item_edit}`)[0].focus();
            }
            if (event.code=='ArrowDown') {
                APP_GLOBAL['previous_row'] = event.target.parentNode.parentNode;
                event.preventDefault();
                let index = parseInt(event.target.parentNode.parentNode.id.substr(item_row.length+1)) +1;
                //focus on first list_edit item in the row
                if (document.getElementById(`${item_row}_${index}`)!= null)
                    document.querySelectorAll(`#${item_row}_${index} ${item_edit}`)[0].focus();
                    
            }
        }
    });
    //focus event
    if (item_row=='list_apps_row'){
        //event on master to automatically show detail records
        document.querySelectorAll(`#${list_item} ${item_edit}`).forEach(e => 
            e.addEventListener('focus', (event) => {
                if (APP_GLOBAL['previous_row'] != event.target.parentNode.parentNode){
                    APP_GLOBAL['previous_row'] = event.target.parentNode.parentNode;
                    show_app_parameter(e.parentNode.parentNode.children[0].children[0].innerHTML);
                }
            }
        ));
    }
    if (item_row=='list_user_account_row'){
        //event on master to automatically show detail records
        document.querySelectorAll(`#${list_item} ${item_edit}`).forEach(e => 
            e.addEventListener('focus', (event) => {
                if (APP_GLOBAL['previous_row'] != event.target.parentNode.parentNode){
                    APP_GLOBAL['previous_row'] = event.target.parentNode.parentNode;
                    show_user_account_logon(e.parentNode.parentNode.children[1].children[0].innerHTML);
                }
            }
        ));
    }
    //click event
    if (list_item == 'list_apps')
        document.getElementById(list_item).addEventListener('click', (event) => {   
            if (event.target.parentNode.classList.contains('common_list_lov_click')){
                const function_event = (event_lov) => {
                    //setting values from LOV
                    event.target.parentNode.parentNode.parentNode.children[5].children[0].value = event_lov.currentTarget.children[0].children[0].innerHTML;
                    event.target.parentNode.parentNode.parentNode.children[5].children[0].focus();
                    event.target.parentNode.parentNode.parentNode.children[6].children[0].innerHTML = event_lov.currentTarget.children[1].children[0].innerHTML;
                    document.getElementById('common_lov_close').dispatchEvent(new Event('click'))
                };
                common.lov_show('APP_CATEGORY', function_event);
            }
                
        })
    if (list_item == 'list_app_parameter')
        document.getElementById(list_item).addEventListener('click', (event) => {   
            if (event.target.parentNode.classList.contains('common_list_lov_click')){
                const function_event = (event_lov) => {
                    //setting values from LOV
                    event.target.parentNode.parentNode.parentNode.children[1].children[0].value = event_lov.currentTarget.children[0].children[0].innerHTML;
                    event.target.parentNode.parentNode.parentNode.children[1].children[0].focus();
                    event.target.parentNode.parentNode.parentNode.children[2].children[0].innerHTML = event_lov.currentTarget.children[1].children[0].innerHTML;
                    document.getElementById('common_lov_close').dispatchEvent(new Event('click'))
                };
                common.lov_show('PARAMETER_TYPE', function_event);
            }
        })
    
    if (list_item == 'list_user_account')
        document.getElementById(list_item).addEventListener('click', (event) => {   
            if (event.target.parentNode.classList.contains('common_list_lov_click')){
                const function_event = (event_lov) => {
                    //setting values from LOV
                    event.target.parentNode.parentNode.parentNode.children[2].children[0].value = event_lov.currentTarget.children[0].children[0].innerHTML;
                    event.target.parentNode.parentNode.parentNode.children[2].children[0].focus();
                    event.target.parentNode.parentNode.parentNode.children[3].children[0].innerHTML = event_lov.currentTarget.children[1].children[0].innerHTML;
                    document.getElementById('common_lov_close').dispatchEvent(new Event('click'))
                };
                common.lov_show('APP_ROLE', function_event);
            }
        })    
}
/*----------------------- */
/* MONITOR                */
/*----------------------- */
const show_monitor = async (yearvalues) =>{
    document.querySelector('#menu_5_content').innerHTML = 
        `<div id='menu_5_content_widget1' class='widget'>
            <ul id='list_monitor_nav' class='list_nav'>
                <li id='list_monitor_nav_1'><button id='list_connected_title' class='list_button' >${common.ICONS['app_user_connections'] + ' ' + common.ICONS['app_log']}</button></li>
                <li id='list_monitor_nav_2'><button id='list_app_log_title' class='list_button' >${common.ICONS['app_apps'] + ' ' + common.ICONS['app_log']}</button></li>
                <li id='list_monitor_nav_3'><button id='list_server_log_title' class='list_button' >${common.ICONS['app_server'] + ' ' + common.ICONS['app_log']}</button></li>
                <li id='list_monitor_nav_4'><button id='list_pm2_log_title' class='list_button' >${common.ICONS['app_server'] + '2 ' + common.ICONS['app_log']}</button></li>
            </ul>
            <div id='list_connected_form'>
                <div id='menu5_row_sample_list_connected'>
                    <select id='select_app_menu5_list_connected'></select>
                    <select id='select_year_menu5_list_connected'></select>
                    <select id='select_month_menu5_list_connected'>${list_generate(12)}</select>
                </div>
                <div id='list_connected' class='common_list_scrollbar'></div>
            </div>
            <div id='list_app_log_form'>
                <div id='menu5_row_sample_app_log'>
                    <select id='select_app_menu5_app_log'></select>
                    <select id='select_year_menu5_app_log'></select>
                    <select id='select_month_menu5_app_log'>${list_generate(12)}</select>
                </div>
                <div id='list_app_log' class='common_list_scrollbar'></div>
                <div id='list_app_pagination'>
                    <div id='list_app_log_first' ></div>
                    <div id='list_app_log_previous' ></div>
                    <div id='list_app_log_next' ></div>
                    <div id='list_app_log_last' ></div>
                </div>
            </div>
            <div id='list_server_log_form'>
                <div id='menu5_row_sample1' >
                    <select id='select_logscope5'></select>
                    <select id='select_app_menu5'></select>
                </div>
                <div id='menu5_row_sample2'>
                    <select id='select_year_menu5'></select>
                    <select id='select_month_menu5'>${list_generate(12)}</select>
                    <select id='select_day_menu5'>${list_generate(31)}</select>
                    <button id='filesearch_menu5' class='common_dialogue_button' >${common.ICONS['app_search']}</button>
                </div>
                <div id='menu5_row_parameters'>
                    <div class='menu5_row_parameters_col'>
                        <div id='menu5_row_parameters_col1'>${common.ICONS['app_server'] + ' info'}</div>
                        <div id='menu5_row_parameters_col1_1'>${common.ICONS['app_checkbox_checked']}</div>
                        <div id='menu5_row_parameters_col1_0'>${common.ICONS['app_checkbox_empty']}</div>
                    </div>
                    <div class='menu5_row_parameters_col'>
                        <div id='menu5_row_parameters_col2'>${common.ICONS['app_server'] + ' verbose'}</div>
                        <div id='menu5_row_parameters_col2_1'>${common.ICONS['app_checkbox_checked']}</div>
                        <div id='menu5_row_parameters_col2_0'>${common.ICONS['app_checkbox_empty']}</div>
                    </div>
                    <div class='menu5_row_parameters_col'>
                        <div id='menu5_row_parameters_col3'>${common.ICONS['app_database']}</div>
                        <div id='menu5_row_parameters_col3_1'>${common.ICONS['app_checkbox_checked']}</div>
                        <div id='menu5_row_parameters_col3_0'>${common.ICONS['app_checkbox_empty']}</div>
                    </div>
                    <div class='menu5_row_parameters_col'>
                        <div id='menu5_row_parameters_col4'>${common.ICONS['app_route']}</div>
                        <div id='menu5_row_parameters_col4_1'>${common.ICONS['app_checkbox_checked']}</div>
                        <div id='menu5_row_parameters_col4_0'>${common.ICONS['app_checkbox_empty']}</div>
                    </div>
                    <div class='menu5_row_parameters_col'>
                        <div id='menu5_row_parameters_col5'>${common.ICONS['app_server'] + '2 ' + common.ICONS['app_log'] + ' JSON'}</div>
                        <div id='menu5_row_parameters_col5_1'>${common.ICONS['app_checkbox_checked']}</div>
                        <div id='menu5_row_parameters_col5_0'>${common.ICONS['app_checkbox_empty']}</div>
                    </div>
                </div>
                <div id='list_server_log' class='common_list_scrollbar'></div>
            </div>
            <div id='list_pm2_log_form'>
                <div id='list_pm2_log_path_info'>
                    <div id='list_pm2_log_path_title'>${common.ICONS['app_file_path']}</div>
                    <div id='list_pm2_log_path'></div>
                </div>
                <div id='list_pm2_log' >
                    <div id='list_pm2_log_title_out'>${common.ICONS['app_server'] + '2 ' + common.ICONS['app_log'] + ' Out'}</div>
                    <div id='list_pm2_log_out' class='common_list_scrollbar'></div>
                    <div id='list_pm2_log_title_err'>${common.ICONS['app_server'] + '2 ' + common.ICONS['app_log'] + ' Error'}</div>
                    <div id='list_pm2_log_err' class='common_list_scrollbar'></div>
                    <div id='list_pm2_log_title_process_event'>${common.ICONS['app_server'] + '2 ' + common.ICONS['app_log'] + ' Process event'}</div>
                    <div id='list_pm2_log_process_event' class='common_list_scrollbar'></div>
                </div>
            </div>
        </div>
        <div id='menu_5_content_widget2' class='widget'>
            <div id='mapid'></div>
            <select id='select_maptype' >
                <option value='OpenStreetMap_Mapnik' selected='selected'>OpenStreetMap_Mapnik</option>
                <option value='Esri.WorldImagery'>Esri.WorldImagery</option>
            </select>
        </div>`;
    
    if (common.COMMON_GLOBAL['system_admin']==1){
        //hide APP LOG in MONITOR
        document.getElementById('list_monitor_nav_2').style.display='none';
    }
    else{
        //hide PM2LOG in MONITOR
        document.getElementById('list_monitor_nav_3').style.display='none';
        //hide SERVER LOG in MONITOR
        document.getElementById('list_monitor_nav_4').style.display='none';
    }
    //server log
    document.getElementById('select_app_menu5').innerHTML = await get_apps();
    //app log
    document.getElementById('select_app_menu5_app_log').innerHTML = document.getElementById('select_app_menu5').innerHTML;
    //connected
    document.getElementById('select_app_menu5_list_connected').innerHTML = document.getElementById('select_app_menu5').innerHTML;

    document.querySelector('#list_monitor_nav').addEventListener('click', (event) => {
        nav_click(event.target.id==''?event.target.parentNode:event.target)
      }, true);

    document.getElementById('select_app_menu5_app_log').addEventListener('change', () => { nav_click(document.getElementById('list_app_log_title'))}, false);
    document.getElementById('select_year_menu5_app_log').addEventListener('change', () => { nav_click(document.getElementById('list_app_log_title'))}, false);
    document.getElementById('select_month_menu5_app_log').addEventListener('change', () => { nav_click(document.getElementById('list_app_log_title'))}, false);

    document.getElementById('list_app_log_first').addEventListener('click', (event) => { page_navigation(event.target)}, false);
    document.getElementById('list_app_log_previous').addEventListener('click', (event) => { page_navigation(event.target)}, false);
    document.getElementById('list_app_log_next').addEventListener('click', (event) => { page_navigation(event.target)}, false);
    document.getElementById('list_app_log_last').addEventListener('click', (event) => { page_navigation(event.target)}, false);

    document.getElementById('select_app_menu5_list_connected').addEventListener('change', () => { nav_click(document.getElementById('list_connected_title'))}, false);
    document.getElementById('select_year_menu5_list_connected').addEventListener('change', () => { nav_click(document.getElementById('list_connected_title'))}, false);
    document.getElementById('select_month_menu5_list_connected').addEventListener('change', () => { nav_click(document.getElementById('list_connected_title'))}, false);

    document.getElementById('select_logscope5').addEventListener('change', () => { nav_click(document.getElementById('list_server_log_title'))}, false);    
    document.getElementById('select_app_menu5').addEventListener('change', () => { nav_click(document.getElementById('list_server_log_title'))}, false);
    document.getElementById('select_year_menu5').addEventListener('change', () => { nav_click(document.getElementById('list_server_log_title'))}, false);
    document.getElementById('select_month_menu5').addEventListener('change', () => { nav_click(document.getElementById('list_server_log_title'))}, false);
    document.getElementById('select_day_menu5').addEventListener('change', () => { nav_click(document.getElementById('list_server_log_title'))}, false);

    document.getElementById('filesearch_menu5').addEventListener('click', () => { show_existing_logfiles();}, false);

    document.getElementById('select_maptype').addEventListener('change', () => { common.map_setstyle(document.getElementById('select_maptype').value).then(()=>{null;}) }, false);

    const init_monitor = () =>{
        let url;
        let token_type = '';
        common.map_init(APP_GLOBAL['module_leaflet_map_container'],
                        common.COMMON_GLOBAL['module_leaflet_style'],
                        common.COMMON_GLOBAL['client_longitude'],
                        common.COMMON_GLOBAL['client_latitude'],
                        APP_GLOBAL['module_leaflet_map_marker_div_gps'],
                        APP_GLOBAL['module_leaflet_map_zoom']).then(() => {
            common.map_setevent('dblclick', (e) => {
                let lng = e.latlng['lng'];
                let lat = e.latlng['lat'];
                //Update GPS position
                common.get_place_from_gps(lng, lat).then((gps_place) => {
                    common.map_update(lng,
                                        lat,
                                        '', //do not change zoom 
                                        gps_place,
                                        null,
                                        APP_GLOBAL['module_leaflet_map_marker_div_gps'],
                                        common.COMMON_GLOBAL['module_leaflet_jumpto']);
                })
            })
            common.map_update(common.COMMON_GLOBAL['client_longitude'],
                                common.COMMON_GLOBAL['client_latitude'],
                                APP_GLOBAL['module_leaflet_map_zoom'],
                                common.COMMON_GLOBAL['client_place'],
                                null,
                                APP_GLOBAL['module_leaflet_map_marker_div_gps'],
                                common.COMMON_GLOBAL['module_leaflet_jumpto']);
            
            if (common.COMMON_GLOBAL['system_admin']==1){
                url  = `${common.COMMON_GLOBAL['rest_resource_server']}/config/systemadmin?config_type_no=1&config_group=SERVICE_DB&parameter=LIMIT_LIST_SEARCH`;
                token_type = 2;
            }
            else{
                url  = `${common.COMMON_GLOBAL['rest_resource_server']}/config/admin?config_type_no=1&config_group=SERVICE_DB&parameter=LIMIT_LIST_SEARCH`;
                token_type = 1;
            }                                            
            common.common_fetch(url, 'GET', token_type, null, null, null, (err, result_limit) =>{
                if (err)
                    null;
                else{
                    APP_GLOBAL['limit'] = parseInt(JSON.parse(result_limit).data);
                    //connected
                    document.getElementById('select_year_menu5_list_connected').innerHTML = yearvalues;
                    document.getElementById('select_year_menu5_list_connected').selectedIndex = 0;
                    document.getElementById('select_month_menu5_list_connected').selectedIndex = new Date().getMonth();            
                    if (common.COMMON_GLOBAL['system_admin']==1){
                        //server log
                        document.getElementById('select_year_menu5').innerHTML = yearvalues;
                        document.getElementById('select_year_menu5').selectedIndex = 0;
                        document.getElementById('select_month_menu5').selectedIndex = new Date().getMonth();
                        document.getElementById('select_day_menu5').selectedIndex = new Date().getDate() -1;
                        get_server_log_parameters().then(() => {
                            common.map_resize();
                            nav_click(document.getElementById('list_connected_title'));
                        })
                    }
                    else{
                        APP_GLOBAL['page'] = 0;
                        //log
                        document.getElementById('select_year_menu5_app_log').innerHTML = yearvalues;
                        document.getElementById('select_year_menu5_app_log').selectedIndex = 0;
                        document.getElementById('select_month_menu5_app_log').selectedIndex = new Date().getMonth();
                        fix_pagination_buttons();
                        common.map_resize();
                        nav_click(document.getElementById('list_connected_title'));
                    }    
                }
                
            })
        })
    }
    //fetch geolocation once
    if (common.COMMON_GLOBAL['client_longitude'] && common.COMMON_GLOBAL['client_latitude'])
        init_monitor();
    else
        common.get_gps_from_ip().then(() =>{
            init_monitor();
        })
}
const fix_pagination_buttons = () => {
    //function triggered by change in user preference before innerHTML loaded html
    //function called again when choosing app log monitor check if exist first
    if (document.getElementById('list_app_log_first')){
        //fix rtl isse with images, items created after login
        if (document.getElementById('common_user_direction_select').value=='ltr'||
            document.getElementById('common_user_direction_select').value==''){
            document.getElementById('list_app_log_first').innerHTML = common.ICONS['app_first'];
            document.getElementById('list_app_log_previous').innerHTML = common.ICONS['app_previous'];
            document.getElementById('list_app_log_next').innerHTML = common.ICONS['app_next'];
            document.getElementById('list_app_log_last').innerHTML = common.ICONS['app_last'];
        }
        else{
            document.getElementById('list_app_log_first').innerHTML = common.ICONS['app_last'];
            document.getElementById('list_app_log_previous').innerHTML = common.ICONS['app_next'];
            document.getElementById('list_app_log_next').innerHTML = common.ICONS['app_previous'];
            document.getElementById('list_app_log_last').innerHTML = common.ICONS['app_first'];
        }
    }
}
const nav_click = (item) => {
    const reset_monitor = () => {
        document.getElementById('list_monitor_nav_1').classList='';
        document.getElementById('list_monitor_nav_2').classList='';
        document.getElementById('list_monitor_nav_3').classList='';
        document.getElementById('list_monitor_nav_4').classList='';
    }
    const reset_config = () => {
        document.getElementById('list_config_nav_1').classList='';
        document.getElementById('list_config_nav_2').classList='';
        document.getElementById('list_config_nav_3').classList='';
        document.getElementById('list_config_nav_4').classList='';
        document.getElementById('list_config_nav_0').classList='';
    }
    
    switch (item.id){
        //MONITOR
        case 'list_connected_title':{
            reset_monitor();
            document.getElementById('list_connected_form').style.display='flex';
            document.getElementById('list_app_log_form').style.display='none';
            document.getElementById('list_server_log_form').style.display='none';
            document.getElementById('list_pm2_log_form').style.display='none';
            document.getElementById('list_monitor_nav_1').classList= 'list_nav_selected_tab';
            show_connected();
            break;
        }
        case 'list_app_log_title':{
            reset_monitor();
            document.getElementById('list_connected_form').style.display='none';
            document.getElementById('list_app_log_form').style.display='flex';
            document.getElementById('list_server_log_form').style.display='none';
            document.getElementById('list_pm2_log_form').style.display='none';
            document.getElementById('list_monitor_nav_2').classList= 'list_nav_selected_tab';
            APP_GLOBAL['page'] = 0;
            show_app_log();
            break;
        }
        case 'list_server_log_title':{
            reset_monitor();
            document.getElementById('list_connected_form').style.display='none';
            document.getElementById('list_app_log_form').style.display='none';
            document.getElementById('list_server_log_form').style.display='block';
            document.getElementById('list_pm2_log_form').style.display='none';
            document.getElementById('list_monitor_nav_3').classList= 'list_nav_selected_tab';
            show_server_logs();
            break;
        }
        case 'list_pm2_log_title':{
            reset_monitor();
            document.getElementById('list_connected_form').style.display='none';
            document.getElementById('list_app_log_form').style.display='none';
            document.getElementById('list_server_log_form').style.display='none';
            document.getElementById('list_pm2_log_form').style.display='block';
            document.getElementById('list_monitor_nav_4').classList= 'list_nav_selected_tab';
            show_pm2_logs();
            break;
        }
        //SERVER CONFIG
        case 'list_config_server_title':{
            reset_config();
            document.getElementById('list_config_nav_1').classList= 'list_nav_selected_tab';
            show_config(1);
            break;
        }
        case 'list_config_blockip_title':{
            reset_config();
            document.getElementById('list_config_nav_2').classList= 'list_nav_selected_tab';
            show_config(2);
            break;
        }
        case 'list_config_useragent_title':{
            reset_config();
            document.getElementById('list_config_nav_3').classList= 'list_nav_selected_tab';
            show_config(3);
            break;
        }
        case 'list_config_policy_title':{
            reset_config();
            document.getElementById('list_config_nav_4').classList= 'list_nav_selected_tab';
            show_config(4);
            break;
        }
        case 'list_config_info_title':{
            reset_config();
            document.getElementById('list_config_nav_0').classList= 'list_nav_selected_tab';
            show_config(0);
            break;
        }
    }
}
const show_list = async (list_div, list_div_col_title, url_parameters, sort, order_by) => {
    if (admin_token_has_value()){
        let json;
        let token_type;
        let url;
        //set spinner
        switch (list_div){
            case 'list_connected':{
                if (common.COMMON_GLOBAL['system_admin']==1){
                    url = `${common.COMMON_GLOBAL['rest_resource_server']}/broadcast/connection/SystemAdmin?${url_parameters}`;
                    token_type = 2;
                }
                else{
                    url = `${common.COMMON_GLOBAL['rest_resource_server']}/broadcast/connection/Admin?${url_parameters}`;
                    token_type = 1;
                }
                document.getElementById(list_div).innerHTML = common.APP_SPINNER;
                break;
            }
            case 'list_app_log':{
                url = `${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/app_log/admin?${url_parameters}`;
                token_type = 1;
                document.getElementById(list_div).innerHTML = common.APP_SPINNER;
                break;
            }
            case 'list_server_log':{
                url = `${common.COMMON_GLOBAL['rest_resource_server']}/log/logs?${url_parameters}`;
                token_type = 2;
                document.getElementById(list_div).innerHTML = common.APP_SPINNER;
                break;
            }
            case 'list_pm2_log':{
                url = `${common.COMMON_GLOBAL['rest_resource_server']}/log/pm2logs?`;
                token_type = 2;
                document.getElementById(list_div + '_out').innerHTML = common.APP_SPINNER;
                document.getElementById(list_div + '_err').innerHTML = common.APP_SPINNER;
                document.getElementById(list_div + '_process_event').innerHTML = common.APP_SPINNER;
                //sort not implemented for pm2 with different content in one json file
                break;
            }
        }

        common.common_fetch(url, 'GET', token_type, null, null, null, (err, result) =>{
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
                                    <div id='list_connected_col_title1' class='list_connected_col list_sort_click list_title'>
                                        <div>ID</div>
                                    </div>
                                    <div id='list_connected_col_title2' class='list_connected_col list_sort_click list_title'>
                                        <div>CONNECTION DATE</div>
                                    </div>
                                    <div id='list_connected_col_title3' class='list_connected_col list_sort_click list_title'>
                                        <div>APP ID</div>
                                    </div>
                                    <div id='list_connected_col_title4' class='list_connected_col list_sort_click list_title'>
                                        <div>ROLE</div>
                                    </div>
                                    <div id='list_connected_col_title5' class='list_connected_col list_sort_click list_title'>
                                        <div>USER ID</div>
                                    </div>
                                    <div id='list_connected_col_title6' class='list_connected_col list_sort_click list_title'>
                                        <div>SYSTEM ADMIN</div>
                                    </div>
                                    <div id='list_connected_col_title7' class='list_connected_col list_sort_click list_title'>
                                        <div>IP</div>
                                    </div>
                                    <div id='list_connected_col_title8' class='list_connected_col list_sort_click list_title'>
                                        <div>GPS LAT</div>
                                    </div>
                                    <div id='list_connected_col_title9' class='list_connected_col list_sort_click list_title'>
                                        <div>GPS LONG</div>
                                    </div>
                                    <div id='list_connected_col_title10' class='list_connected_col list_sort_click list_title'>
                                        <div>USER AGENT</div>
                                    </div>
                                    <div id='list_connected_col_title11' class='list_connected_col list_title'>
                                        <div>BROADCAST</div>
                                    </div>
                                </div>`;
                        break;
                    }
                    case 'list_app_log':{
                        APP_GLOBAL['page_last'] = Math.floor(json.data[0].total_rows/APP_GLOBAL['limit']) * APP_GLOBAL['limit'];
                        html = `<div id='list_app_log_row_title' class='list_app_log_row'>
                                    <div id='list_app_log_col_title1' class='list_app_log_col list_sort_click list_title'>
                                        <div>ID</div>
                                    </div>
                                    <div id='list_app_log_col_title2' class='list_app_log_col list_sort_click list_title'>
                                        <div>DATE</div>
                                    </div>
                                    <div id='list_app_log_col_title3' class='list_app_log_col list_sort_click list_title'>
                                        <div>HOST</div>
                                    </div>
                                    <div id='list_app_log_col_title3' class='list_app_log_col list_sort_click list_title'>
                                        <div>APP ID</div>
                                    </div>
                                    <div id='list_app_log_col_title4' class='list_app_log_col list_sort_click list_title'>
                                        <div>MODULE</div>
                                    </div>
                                    <div id='list_app_log_col_title5' class='list_app_log_col list_sort_click list_title'>
                                        <div>MODULE TYPE</div>
                                    </div>
                                    <div id='list_app_log_col_title6' class='list_app_log_col list_sort_click list_title'>
                                        <div>MODULE REQUEST</div>
                                    </div>
                                    <div id='list_app_log_col_title7' class='list_app_log_col list_sort_click list_title'>
                                        <div>MODULE RESULT</div>
                                    </div>
                                    <div id='list_app_log_col_title8' class='list_app_log_col list_sort_click list_title'>
                                        <div>USER ID</div>
                                    </div>
                                    <div id='list_app_log_col_title9' class='list_app_log_col list_sort_click list_title'>
                                        <div>IP</div>
                                    </div>
                                    <div id='list_app_log_col_title10' class='list_app_log_col list_sort_click list_title'>
                                        <div>GPS LAT</div>
                                    </div>
                                    <div id='list_app_log_col_title11' class='list_app_log_col list_sort_click list_title'>
                                        <div>GPS LONG</div>
                                    </div>
                                    <div id='list_app_log_col_title12' class='list_app_log_col list_sort_click list_title'>
                                        <div>USER LANGUAGE</div>
                                    </div>
                                    <div id='list_app_log_col_title13' class='list_app_log_col list_sort_click list_title'>
                                        <div>USER TIMEZONE</div>
                                    </div>
                                    <div id='list_app_log_col_title14' class='list_app_log_col list_sort_click list_title'>
                                        <div>USER NUMBER_SYSTEM</div>
                                    </div>
                                    <div id='list_app_log_col_title15' class='list_app_log_col list_sort_click list_title'>
                                        <div>USER PLATFORM</div>
                                    </div>
                                    <div id='list_app_log_col_title16' class='list_app_log_col list_sort_click list_title'>
                                        <div>USER AGENT</div>
                                    </div>
                                    <div id='list_app_log_col_title17' class='list_app_log_col list_sort_click list_title'>
                                        <div>ACCEPT LANGUAGE</div>
                                    </div>
                                </div>`;
                        break;
                    }
                    case 'list_server_log':{
                        html =`<div id='list_server_log_row_title' class='list_server_log_row'>
                                    <div id='list_server_log_col_title1' class='list_server_log_col list_sort_click list_title'>
                                        <div>LOGDATE</div>
                                    </div>
                                    <div id='list_server_log_col_title3' class='list_server_log_col list_sort_click list_title'>
                                        <div>HOST</div>
                                    </div>
                                    <div id='list_server_log_col_title11' class='list_server_log_col list_sort_click list_title'>
                                        <div>APP ID</div>
                                    </div>
                                    <div id='list_server_log_col_title2' class='list_server_log_col list_sort_click list_title'>
                                        <div>IP</div>
                                    </div>
                                    <div id='list_server_log_col_title4' class='list_server_log_col list_sort_click list_title'>
                                        <div>PROTOCOL</div>
                                    </div>
                                    <div id='list_server_log_col_title5' class='list_server_log_col list_sort_click list_title'>
                                        <div>URL</div>
                                    </div>
                                    <div id='list_server_log_col_title6' class='list_server_log_col list_sort_click list_title'>
                                        <div>METHOD</div>
                                    </div>
                                    <div id='list_server_log_col_title7' class='list_server_log_col list_sort_click list_title'>
                                        <div>STATUSCODE</div>
                                    </div>
                                    <div id='list_server_log_col_title8' class='list_server_log_col list_sort_click list_title'>
                                        <div>USER AGENT</div>
                                    </div>
                                    <div id='list_server_log_col_title9' class='list_server_log_col list_sort_click list_title'>
                                        <div>ACCEPT LANGUAGE</div>
                                    </div>
                                    <div id='list_server_log_col_title10' class='list_server_log_col list_sort_click list_title'>
                                        <div>HTTP REFERER</div>
                                    </div>
                                    <div id='list_server_log_col_title12' class='list_server_log_col list_sort_click list_title'>
                                        <div>APP FILENAME</div>
                                    </div>
                                    <div id='list_server_log_col_title13' class='list_server_log_col list_sort_click list_title'>
                                        <div>APP FUNCTION NAME</div>
                                    </div>
                                    <div id='list_server_log_col_title14' class='list_server_log_col list_sort_click list_title'>
                                        <div>APP APP LINE</div>
                                    </div>
                                    <div id='list_server_log_col_title15' class='list_server_log_col list_sort_click list_title'>
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
                    for (let i = 0; i < json.data.length; i++) {
                        switch (list_div){
                            case 'list_connected':{    
                                let list_connected_current_user_row='';
                                if (json.data[i].id==common.COMMON_GLOBAL['service_broadcast_client_ID'])
                                    list_connected_current_user_row = 'list_current_user_row';
                                else
                                    list_connected_current_user_row ='';
                                let app_role_class;
                                let app_role_icon = json.data[i].app_role_icon;
                                if (json.data[i].system_admin==1){
                                    app_role_class = 'app_role_system_admin';
                                    app_role_icon = common.ICONS['app_system_admin'];
                                }
                                else
                                    switch (json.data[i].app_role_id){
                                        case 0:{
                                            app_role_class = 'app_role_superadmin';
                                            break;
                                        }
                                        case 1:{
                                            app_role_class = 'app_role_admin';
                                            break;
                                        }
                                        default:{
                                            app_role_class = 'app_role_user';
                                        }
                                    }
                                html += `<div class='list_connected_row ${list_connected_current_user_row}'>
                                            <div class='list_connected_col'>
                                                <div>${json.data[i].id}</div>
                                            </div>
                                            <div class='list_connected_col'>
                                                <div>${json.data[i].connection_date}</div>
                                            </div>
                                            <div class='list_connected_col'>
                                                <div>${json.data[i].app_id}</div>
                                            </div>
                                            <div class='list_connected_col ${app_role_class}'>
                                                <div>${app_role_icon}</div>
                                            </div>
                                            <div class='list_connected_col'>
                                                <div>${common.get_null_or_value(json.data[i].user_account_id)}</div>
                                            </div>
                                            <div class='list_connected_col'>
                                                <div>${json.data[i].system_admin}</div>
                                            </div>
                                            <div class='list_connected_col'>
                                                <div>${json.data[i].ip.replace('::ffff:','')}</div>
                                            </div>
                                            <div class='list_connected_col list_gps_click gps_click'>
                                                <div>${json.data[i].gps_latitude}</div>
                                            </div>
                                            <div class='list_connected_col list_gps_click gps_click'>
                                                <div>${json.data[i].gps_longitude}</div>
                                            </div>
                                            <div class='list_connected_col'>
                                                <div>${common.get_null_or_value(show_user_agent(json.data[i].user_agent))}</div>
                                            </div>
                                            <div class='list_connected_col list_chat_click chat_click'>
                                                <div>${common.ICONS['app_chat']}</div>
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
                                            <div class='list_app_log_col list_gps_click gps_click'>
                                                <div>${json.data[i].client_latitude}</div>
                                            </div>
                                            <div class='list_app_log_col list_gps_click gps_click'>
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
                                    <div class='list_server_log_col list_gps_click gps_click'>
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
                            set_list_eventlisteners('connected', 'sort',true);
                            //add events on some columns searching in all rows
                            set_list_eventlisteners('connected', 'gps');
                            set_list_eventlisteners('connected', 'chat');
                            break;
                        }
                        case 'list_app_log':{
                            document.getElementById(list_div).innerHTML = html;
                            document.getElementById(list_div_col_title + sort).classList.add(order_by);
                            //add events on some columns searching in all rows
                            set_list_eventlisteners('app_log', 'sort', true);
                            set_list_eventlisteners('app_log', 'gps');
                            break;
                        }
                        case 'list_server_log':{
                            document.getElementById(list_div).innerHTML = html;
                            document.getElementById(list_div_col_title + sort).classList.add(order_by);
                            //add events on some columns searching in all rows
                            set_list_eventlisteners('server_log', 'sort', true);
                            set_list_eventlisteners('server_log', 'gps');
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
const show_connected = async (sort=1, order_by='desc') => {
    let app_id = document.getElementById('select_app_menu5_list_connected').options[document.getElementById('select_app_menu5_list_connected').selectedIndex].value;
    let year = document.getElementById('select_year_menu5_list_connected').value;
    let month = document.getElementById('select_month_menu5_list_connected').value;
    show_list('list_connected', 
              'list_connected_col_title', 
              `select_app_id=${app_id}&year=${year}&month=${month}&sort=${sort}&order_by=${order_by}&limit=${APP_GLOBAL['limit']}`, 
              sort,
              order_by);
}    

const show_app_log = async (sort=1, order_by='desc', offset=0, limit=APP_GLOBAL['limit']) => {
    let app_id = document.getElementById('select_app_menu5_app_log').options[document.getElementById('select_app_menu5_app_log').selectedIndex].value;
    let year = document.getElementById('select_year_menu5_app_log').value;
    let month = document.getElementById('select_month_menu5_app_log').value;
    show_list('list_app_log', 
              'list_app_log_col_title', 
              `select_app_id=${app_id}&year=${year}&month=${month}&sort=${sort}&order_by=${order_by}&offset=${offset}&limit=${limit}`, 
              sort,
              order_by);
} 
const set_list_eventlisteners = (list_type, list_function, remove_events) => {
    let click_function_title = (event) => { 
                                    if (event.target.parentNode.classList.contains(`list_${list_function}_click`))
                                        list_sort_click(event.target.parentNode)
                                };
    let click_function_rowcolumn = (event) => { 
                                        if (event.target.parentNode.parentNode.classList.contains(`list_${list_function}_click`))
                                            list_item_click(event.target.parentNode.parentNode)
                                        else
                                            if (event.target.parentNode.classList.contains(`list_${list_function}_click`))
                                                list_item_click(event.target.parentNode)
                                    };
    
    let element = document.getElementById(`list_${list_type}`);
    if (remove_events==true){
        //remove all eventlisteners
        element.replaceWith(element.cloneNode(true));
        element = document.getElementById(`list_${list_type}`);
    }
    if (list_function=='sort')
        element.addEventListener("click", click_function_title);
    else
        element.addEventListener("click", click_function_rowcolumn);
}
const get_sort = (order_by=0) => {
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
const get_order = (item) => {
    let order_by = '';
    if (document.getElementById(item.id).classList.contains('asc'))
        order_by = 'desc';
    if (document.getElementById(item.id).classList.contains('desc'))
        order_by = 'asc';
    if (order_by=='')
        order_by = 'desc';
    return order_by;
}
const list_sort_click = (item) => {
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
        case 'list_user_account':{
            show_users(item.id.substr(item.id.length - 1), get_order(item));
            break;
        }
    }
}
const page_navigation = (item) => {
    
    let sort = get_sort();
    let order_by = get_sort(1);
    if (sort =='')
        sort = 8;
    switch (item.id){
        case 'list_app_log_first':{
            APP_GLOBAL['page'] = 0;
            show_app_log(sort, order_by, 0,APP_GLOBAL['limit']);
            break;
        }
        case 'list_app_log_previous':{
            APP_GLOBAL['page'] = APP_GLOBAL['page'] - APP_GLOBAL['limit'];
            if (APP_GLOBAL['page'] - APP_GLOBAL['limit'] < 0)
                APP_GLOBAL['page'] = 0;
            else
                APP_GLOBAL['page'] = APP_GLOBAL['page'] - APP_GLOBAL['limit'];
            show_app_log(sort, order_by, APP_GLOBAL['page'], APP_GLOBAL['limit']);
            break;
        }
        case 'list_app_log_next':{
            if (APP_GLOBAL['page'] + APP_GLOBAL['limit'] > APP_GLOBAL['page_last'])
                APP_GLOBAL['page'] = APP_GLOBAL['page_last'];
            else
                APP_GLOBAL['page'] = APP_GLOBAL['page'] + APP_GLOBAL['limit'];
            show_app_log(sort, order_by, APP_GLOBAL['page'], APP_GLOBAL['limit']);
            break;
        }
        case 'list_app_log_last':{
            APP_GLOBAL['page'] = APP_GLOBAL['page_last'];
            show_app_log(sort, order_by, APP_GLOBAL['page'], APP_GLOBAL['limit']);
            break;
        }
    }
}
const list_item_click = (item) => {
    let url;
    let tokentype;
    if (item.className.indexOf('gps_click')>0){
        if (common.COMMON_GLOBAL['system_admin']==1){
            tokentype = 2;
        }
        else
            tokentype = 1;
        if (item.parentNode.parentNode.id =='list_server_log'){
            //clicking on IP, get GPS, show on map
            let ip_filter='';
            //if localhost show default position
            if (item.children[0].innerHTML != '::1')
                ip_filter = `&ip=${item.children[0].innerHTML}`;
            if (common.COMMON_GLOBAL['system_admin']==1){                
                url = `${common.COMMON_GLOBAL['rest_resource_service']}/geolocation/ip/systemadmin?app_user_id=${ip_filter}`;
            }
            else
                url = `${common.COMMON_GLOBAL['rest_resource_service']}/geolocation/ip/admin?app_user_id=${ip_filter}`;
            common.common_fetch(url, 'GET', tokentype, null, null, null, (err, result) =>{
                    if (err)
                        null;
                    else{
                        let json = JSON.parse(result);
                        common.map_update(json.geoplugin_longitude,
                                   json.geoplugin_latitude,
                                   APP_GLOBAL['module_leaflet_map_zoom'],
                                   json.geoplugin_city + ', ' +
                                   json.geoplugin_regionName + ', ' +
                                   json.geoplugin_countryName,
                                   null,
                                   APP_GLOBAL['module_leaflet_map_marker_div_gps'],
                                   common.COMMON_GLOBAL['module_leaflet_jumpto']);
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
            if (common.COMMON_GLOBAL['system_admin']==1){
                url = `${common.COMMON_GLOBAL['rest_resource_service']}/geolocation/place/systemadmin?app_user_id=&latitude=${lat}&longitude=${long}`;
            }
            else
                url = `${common.COMMON_GLOBAL['rest_resource_service']}/geolocation/place/admin?app_user_id=&latitude=${lat}&longitude=${long}`;
            common.common_fetch(url, 'GET', tokentype, null, null, null, (err, result) =>{
                    if (err)
                        null;
                    else{
                        let json = JSON.parse(result);
                        common.map_update(long,
                                   lat,
                                   APP_GLOBAL['module_leaflet_map_zoom'],
                                   json.geoplugin_place + ', ' + 
                                   json.geoplugin_region + ', ' + 
                                   json.geoplugin_countryCode,
                                   null,
                                   APP_GLOBAL['module_leaflet_map_marker_div_gps'],
                                   common.COMMON_GLOBAL['module_leaflet_jumpto']);
                    }
            })
        }
    }
    else
        if (item.className.indexOf('chat_click')>0){
            show_broadcast_dialogue('CHAT', item.parentNode.children[0].children[0].innerHTML);
        }
    
}
const get_server_log_parameters = async () => {
    let json;
    await common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_server']}/log/parameters?`,
                       'GET', 2, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            json = JSON.parse(result);
            APP_GLOBAL['service_log_scope_server'] = json.data.SERVICE_LOG_SCOPE_SERVER;
            APP_GLOBAL['service_log_scope_service'] = json.data.SERVICE_LOG_SCOPE_SERVICE;
            APP_GLOBAL['service_log_scope_db'] = json.data.SERVICE_LOG_SCOPE_DB;
            APP_GLOBAL['service_log_scope_router'] = json.data.SERVICE_LOG_SCOPE_ROUTER;
            APP_GLOBAL['service_log_scope_controller'] = json.data.SERVICE_LOG_SCOPE_CONTROLLER;

            document.getElementById('menu5_row_parameters_col1_1').style.display = 'none';
            document.getElementById('menu5_row_parameters_col1_0').style.display = 'none';
            document.getElementById('menu5_row_parameters_col2_1').style.display = 'none';
            document.getElementById('menu5_row_parameters_col2_0').style.display = 'none';
            document.getElementById('menu5_row_parameters_col3_1').style.display = 'none';
            document.getElementById('menu5_row_parameters_col3_0').style.display = 'none';
            document.getElementById('menu5_row_parameters_col4_1').style.display = 'none';
            document.getElementById('menu5_row_parameters_col4_0').style.display = 'none';
            document.getElementById('menu5_row_parameters_col5_1').style.display = 'none';
            document.getElementById('menu5_row_parameters_col5_0').style.display = 'none';

            if (json.data.SERVICE_LOG_ENABLE_SERVER_INFO==1)
                document.getElementById('menu5_row_parameters_col1_1').style.display = 'inline-block';
            else
                document.getElementById('menu5_row_parameters_col1_0').style.display = 'inline-block';
            if (json.data.SERVICE_LOG_ENABLE_SERVER_VERBOSE==1)
                document.getElementById('menu5_row_parameters_col2_1').style.display = 'inline-block';
            else
                document.getElementById('menu5_row_parameters_col2_0').style.display = 'inline-block';
            if (json.data.SERVICE_LOG_ENABLE_DB==1)
                document.getElementById('menu5_row_parameters_col3_1').style.display = 'inline-block';
            else
                document.getElementById('menu5_row_parameters_col3_0').style.display = 'inline-block';
            if (json.data.SERVICE_LOG_ENABLE_ROUTER==1)
                document.getElementById('menu5_row_parameters_col4_1').style.display = 'inline-block';
            else
                document.getElementById('menu5_row_parameters_col4_0').style.display = 'inline-block';
            if (json.data.SERVICE_LOG_PM2_FILE && json.data.SERVICE_LOG_PM2_FILE!=null)
                document.getElementById('menu5_row_parameters_col5_1').style.display = 'inline-block';
            else
                document.getElementById('menu5_row_parameters_col5_0').style.display = 'inline-block';

            APP_GLOBAL['service_log_level_verbose'] = json.data.SERVICE_LOG_LEVEL_VERBOSE;
            APP_GLOBAL['service_log_level_error'] = json.data.SERVICE_LOG_LEVEL_ERROR;
            APP_GLOBAL['service_log_level_info'] = json.data.SERVICE_LOG_LEVEL_INFO;

            APP_GLOBAL['service_log_file_interval'] = json.data.SERVICE_LOG_FILE_INTERVAL;

            let html = '';
            html +=`<option value=0 log_scope='${APP_GLOBAL['service_log_scope_server']}'       log_level='${APP_GLOBAL['service_log_level_info']}'>${APP_GLOBAL['service_log_scope_server']} - ${APP_GLOBAL['service_log_level_info']}</option>`;
            html +=`<option value=1 log_scope='${APP_GLOBAL['service_log_scope_server']}'       log_level='${APP_GLOBAL['service_log_level_error']}'>${APP_GLOBAL['service_log_scope_server']} - ${APP_GLOBAL['service_log_level_error']}</option>`;
            html +=`<option value=2 log_scope='${APP_GLOBAL['service_log_scope_server']}'       log_level='${APP_GLOBAL['service_log_level_verbose']}'>${APP_GLOBAL['service_log_scope_server']} - ${APP_GLOBAL['service_log_level_verbose']}</option>`;
            html +=`<option value=3 log_scope='${APP_GLOBAL['service_log_scope_service']}'      log_level='${APP_GLOBAL['service_log_level_info']}'>${APP_GLOBAL['service_log_scope_service']} - ${APP_GLOBAL['service_log_level_info']}</option>`;
            html +=`<option value=4 log_scope='${APP_GLOBAL['service_log_scope_service']}'      log_level='${APP_GLOBAL['service_log_level_error']}'>${APP_GLOBAL['service_log_scope_service']} - ${APP_GLOBAL['service_log_level_error']}</option>`;
            html +=`<option value=5 log_scope='${APP_GLOBAL['service_log_scope_db']}'           log_level='${APP_GLOBAL['service_log_level_info']}'>${APP_GLOBAL['service_log_scope_db']} - ${APP_GLOBAL['service_log_level_info']}</option>`;
            html +=`<option value=6 log_scope='${APP_GLOBAL['service_log_scope_router']}'       log_level='${APP_GLOBAL['service_log_level_info']}'>${APP_GLOBAL['service_log_scope_router']} - ${APP_GLOBAL['service_log_level_info']}</option>`;
            html +=`<option value=7 log_scope='${APP_GLOBAL['service_log_scope_controller']}'   log_level='${APP_GLOBAL['service_log_level_info']}'>${APP_GLOBAL['service_log_scope_controller']} - ${APP_GLOBAL['service_log_level_info']}</option>`;
            html +=`<option value=8 log_scope='${APP_GLOBAL['service_log_scope_controller']}'   log_level='${APP_GLOBAL['service_log_level_error']}'>${APP_GLOBAL['service_log_scope_controller']} - ${APP_GLOBAL['service_log_level_error']}</option>`;
            
            document.getElementById('select_logscope5').innerHTML = html;

            if (APP_GLOBAL['service_log_file_interval']=='1M')
                document.getElementById('select_day_menu5').style.display = 'none';
            else
                document.getElementById('select_day_menu5').style.display = 'inline-block';
        }
    })
}
const show_server_logs = (sort=1, order_by='desc') => {
    let logscope = document.getElementById('select_logscope5')[document.getElementById('select_logscope5').selectedIndex].getAttribute('log_scope');
    let loglevel = document.getElementById('select_logscope5')[document.getElementById('select_logscope5').selectedIndex].getAttribute('log_level');
    let year = document.getElementById('select_year_menu5').value;
    let month= document.getElementById('select_month_menu5').value;
    let day  = document.getElementById('select_day_menu5').value;
    let app_id_filter='';
    if (logscope=='SERVER'){
        //no app filter for server, since this is a server log
        document.getElementById('select_app_menu5').style.display = 'none';
        app_id_filter = `select_app_id=&`;
    }
    else{
        //show app filter and use it
        document.getElementById('select_app_menu5').style.display = 'inline-block';
        app_id_filter = `select_app_id=${document.getElementById('select_app_menu5').options[document.getElementById('select_app_menu5').selectedIndex].value}&`;
    }
    let url_parameters;
    if (APP_GLOBAL['service_log_file_interval']=='1M')
        url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}`;
    else
        url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}&day=${day}`;
    show_list('list_server_log', 
                'list_server_log_col_title', 
                `${url_parameters}&sort=${sort}&order_by=${order_by}`,
                sort,
                order_by);
}
const show_existing_logfiles = () => {
    if (admin_token_has_value()){
        const function_event = (event) => {                    
                                //format: 'LOGSCOPE_LOGLEVEL_20220101.log'
                                //logscope and loglevel
                                let filename;
                                if (event.target.classList.contains('common_list_lov_row'))
                                    filename = event.target.children[1].children[0].innerHTML;
                                else
                                    filename = event.target.parentNode.parentNode.children[1].children[0].innerHTML;
                                let logscope = filename.substring(0,filename.indexOf('_'));
                                filename = filename.substring(filename.indexOf('_')+1);
                                let loglevel = filename.substring(0,filename.indexOf('_'));
                                filename = filename.substring(filename.indexOf('_')+1);
                                let year     = parseInt(filename.substring(0, 4));
                                let month    = parseInt(filename.substring(4, 6));
                                let day      = parseInt(filename.substring(6, 8));
                                const setlogscopelevel = (select, logscope, loglevel) =>{
                                    for (let i = 0; i < select.options.length; i++) {
                                        if (select[i].getAttribute('log_scope') == logscope &&
                                            select[i].getAttribute('log_level') == loglevel) {
                                            select.selectedIndex = i;
                                            return null;
                                        }
                                    }
                                }
                                setlogscopelevel(document.getElementById('select_logscope5'),
                                                logscope, 
                                                loglevel);
                                //year
                                document.getElementById('select_year_menu5').value = year;
                                //month
                                document.getElementById('select_month_menu5').value = month;
                                //day if applicable
                                if (APP_GLOBAL['service_log_file_interval']=='1D')
                                    document.getElementById('select_day_menu5').value = day;

                                document.getElementById('select_logscope5').dispatchEvent(new Event('change'));
                                common.lov_close();
                            };
        common.lov_show('SERVER_LOG_FILES', function_event);
    }
}
const show_pm2_logs = () => {
    let sort = '';
    let order_by = '';
    show_list('list_pm2_log', 
              'list_pm2_log_XXX_row_title', //list_pm2_log_out, list_pm2_log_err, list_pm2_log_process_event
              null,
              sort,
              order_by);
}
/*----------------------- */
/* SERVER CONFIG          */
/*----------------------- */
const show_server_config = () =>{
    document.querySelector('#menu_6_content').innerHTML = 
        `<div id='menu_6_content_widget1' class='widget'>
            <ul id='list_config_nav' class='list_nav'>
                <li id='list_config_nav_1'><button id='list_config_server_title' class='list_button' >${common.ICONS['app_server']}</button></li>
                <li id='list_config_nav_2'><button id='list_config_blockip_title' class='list_button' >${common.ICONS['app_internet'] + common.ICONS['app_shield'] + common.ICONS['regional_numbersystem']}</button></li>
                <li id='list_config_nav_3'><button id='list_config_useragent_title' class='list_button' >${common.ICONS['app_internet'] + common.ICONS['app_shield'] + common.ICONS['app_browser']}</button></li>
                <li id='list_config_nav_4'><button id='list_config_policy_title' class='list_button' >${common.ICONS['app_internet'] + common.ICONS['app_shield'] + common.ICONS['misc_book']}</button></li>
                <li id='list_config_nav_0'><button id='list_config_info_title' class='list_button' >${common.ICONS['app_info']}</button></li>
            </ul>
            <div id='list_config' class='common_list_scrollbar'></div>
            <pre id='list_config_edit'></pre>
            <div id='config_buttons' class="save_buttons">
                <button id='config_save' class='common_dialogue_button button_save' >${common.ICONS['app_save']}</button>
            </div>
        </div>`;
    document.querySelector('#config_save').addEventListener('click', () => { button_save('config_save')}, false); 
    document.querySelector('#list_config_nav').addEventListener('click', (event) => {
        nav_click(event.target.id==''?event.target.parentNode:event.target)
     }, true);

    nav_click(document.getElementById('list_config_server_title'));
}
const show_config = async (config_nav=1) => {
    let url;
    document.getElementById(`list_config`).innerHTML = common.APP_SPINNER;
    url  = `${common.COMMON_GLOBAL['rest_resource_server']}/config/systemadmin/saved?config_type_no=${config_nav}`;
    await common.common_fetch(url, 'GET', 2, null, null, null, (err, result) =>{
        if (err)
            document.getElementById(`list_config`).innerHTML = '';
        else{
            let json = JSON.parse(result);
            let i = 0;
            if (config_nav==0)
                document.getElementById('list_config_edit').contentEditable = false;
            else
                document.getElementById('list_config_edit').contentEditable = true;
            switch (config_nav){
                case 1:{
                    let html = `<div id='list_config_row_title' class='list_config_row'>
                            <div id='list_config_col_title1' class='list_config_col list_title'>
                                <div>PARAMETER NAME</div>
                            </div>
                            <div id='list_config_col_title2' class='list_config_col list_title'>
                                <div>PARAMETER VALUE</div>
                            </div>
                            <div id='list_config_col_title3' class='list_config_col list_title'>
                                <div>COMMENT</div>
                            </div>
                        </div>`;
                    //create div groups with parameters, each group with a title
                    //first 7 attributes in config json contains array of parameter records
                    //metadata is saved last in config
                    for (let i_group = 0; i_group <= 6;i_group++){
                        html += 
                        `<div id='list_config_row_${i_group}' class='list_config_row list_config_group' >
                            <div class='list_config_col list_config_group_title'>
                                <div class='list_readonly'>${Object.keys(json.data)[i_group]}</div>
                            </div>`;
                            for (let j = 0; j < json.data[Object.keys(json.data)[i_group]].length; j++) {
                                i++;
                                html += 
                                `<div id='list_config_row_${i}' class='list_config_row' >
                                    <div class='list_config_col'>
                                        <div class='list_readonly'>${Object.keys(json.data[Object.keys(json.data)[i_group]][j])[0]}</div>
                                    </div>
                                    <div class='list_config_col'>
                                        <input type=text class='list_edit' value='${Object.values(json.data[Object.keys(json.data)[i_group]][j])[0]}'/>
                                    </div>
                                    <div class='list_config_col'>
                                        <div class='list_readonly'>${Object.values(json.data[Object.keys(json.data)[i_group]][j])[1]}</div>
                                    </div>
                                </div>`;
                            }    
                        html += `</div>`;
                        
                    }
                    document.getElementById('list_config_edit').innerHTML = '';
                    document.getElementById('list_config_edit').style.display = 'none';
                    document.getElementById('list_config').style.display = 'flex';
                    document.getElementById('list_config').innerHTML = html;
                    
                    list_events('list_config', 'list_config_row', ' .list_edit');
                    //set focus first column in first row
                    document.querySelectorAll('#list_config .list_edit')[0].focus();
                    break;
                }
                default:{
                    document.getElementById('list_config').innerHTML = '';
                    document.getElementById('list_config').style.display = 'none';
                    document.getElementById('list_config_edit').style.display = 'flex';
                    document.getElementById('list_config_edit').innerHTML = JSON.stringify(json.data, undefined, 2);
                    break;
                }
            }
        }
    })
}
/*----------------------- */
/* INSTALLATION           */
/*----------------------- */
const show_installation = () =>{
    document.querySelector(`#menu_7_content`).innerHTML = common.APP_SPINNER;
    common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db/admin/install?`, 'GET', 2, null, null, null, (err, result) =>{
        if (err)
            document.querySelector(`#menu_7_content`).innerHTML = '';
        else{
            document.querySelector(`#menu_7_content`).innerHTML =
                `<div id='menu_7_content_widget1' class='widget'>
                    <div id='install_db'>
                        <div id='install_db_icon'>${common.ICONS['app_database']}</div>
                        <div id='install_db_button_row'>
                            <div id='install_db_button_install' class='common_dialogue_button'>${common.ICONS['app_add']}</div>
                            <div id='install_db_button_uninstall' class='common_dialogue_button'>${common.ICONS['app_delete']}</div>
                        </div>
                        <div id='install_db_input'>
                            <div id="install_db_country_language_translations_icon" >${common.ICONS['gps_country'] + common.ICONS['regional_locale']}</div>
                            <input id='install_db_country_language_translations' type='checkbox' class='common_switch_input' />
                            <label for='install_db_country_language_translations' class='common_switch_label'></label>
                        </div>
                    </div>
                </div>
                <div id='menu_7_content_widget2' class='widget'>
                    <div id='install_demo'>
                        <div id='install_demo_demo_users_icon'>${common.ICONS['app_users']}</div>
                        <div id='install_demo_button_row'>
                            <div id='install_demo_button_install' class='common_dialogue_button'>${common.ICONS['app_add']}</div>
                            <div id='install_demo_button_uninstall' class='common_dialogue_button'>${common.ICONS['app_delete']}</div>
                        </div>
                        <div id='install_demo_input'>
                            <div id="install_demo_password_icon" >${common.ICONS['user_password']}</div>
                            <input id='install_demo_password' type='password' />
                        </div>
                    </div>
                </div>`;
                document.querySelector('#install_db_button_row').addEventListener('click', (event) => {
                    const install_function = () =>{
                        document.getElementById('common_dialogue_message').style.visibility = 'hidden';
                        let old_html = document.querySelector(`#install_demo_button_install`).innerHTML;
                        document.querySelector(`#install_db_button_install`).innerHTML = common.APP_SPINNER;
                        let url = `${common.COMMON_GLOBAL['rest_resource_service']}/db/admin/install?optional=${common.checkbox_value(document.querySelector('#install_db_country_language_translations'))}`;
                        common.common_fetch(url, 'POST', 2, null, null, null, (err, result) =>{
                            document.querySelector(`#install_db_button_install`).innerHTML = old_html;
                            if (err == null){
                                document.querySelector(`#install_db_icon`).classList.add('installed');
                                let result_obj = JSON.parse(result);
                                common.show_message('INFO', null, null, common.show_message_info_list(result_obj.info), common.COMMON_GLOBAL['common_app_id']);
                            }
                        })
                    }
                    const uninstall_function = () =>{
                        document.getElementById('common_dialogue_message').style.visibility = 'hidden';
                        let old_html = document.querySelector(`#install_demo_button_uninstall`).innerHTML;
                        document.querySelector(`#install_db_button_uninstall`).innerHTML = common.APP_SPINNER;
                        common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db/admin/install?`, 'DELETE', 2, null, null, null, (err, result) =>{
                            document.querySelector(`#install_db_button_uninstall`).innerHTML = old_html;
                            if (err == null){
                                document.querySelector(`#install_db_icon`).classList.remove('installed');
                                let result_obj = JSON.parse(result);
                                common.show_message('INFO', null, null, common.show_message_info_list(result_obj.info), common.COMMON_GLOBAL['common_app_id']);
                            }
                        })
                    }
                    switch(event.target.parentNode.id){
                        case 'install_db_button_install':{
                            common.show_message('CONFIRM',null,install_function, null, common.COMMON_GLOBAL['app_id']);  
                            break;
                        }
                        case 'install_db_button_uninstall':{
                            common.show_message('CONFIRM',null,uninstall_function, null, common.COMMON_GLOBAL['app_id']);  
                            break;
                        }
                    }
                }, false);
            document.querySelector('#install_demo_button_row').addEventListener('click', (event) => { 
                switch(event.target.parentNode.id){
                    case 'install_demo_button_install':{
                        if (document.getElementById("install_demo_password").value == '') {
                            common.show_message('INFO', null, null, common.ICONS['user_password'] + ' ' + common.ICONS['message_text'], common.COMMON_GLOBAL['common_app_id']);
                            return callBack('ERROR', null);
                        }
                        else{
                            let json_data = `{"demo_password": "${document.querySelector('#install_demo_password').value}"}`;
                            let old_html = document.querySelector(`#install_demo_button_install`).innerHTML;
                            document.querySelector(`#install_demo_button_install`).innerHTML = common.APP_SPINNER;
                            common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db/admin/demo?`, 'POST', 2, json_data, null, null, (err, result) =>{
                                document.querySelector(`#install_demo_button_install`).innerHTML = old_html;
                                if (err == null){
                                    let result_obj = JSON.parse(result);
                                    common.show_message('INFO', null, null, common.show_message_info_list(result_obj.info), common.COMMON_GLOBAL['common_app_id']);
                                }
                            })
                        }
                        break;
                    }
                    case 'install_demo_button_uninstall':{
                        let old_html = document.querySelector(`#install_demo_button_uninstall`).innerHTML;
                        document.querySelector(`#install_demo_button_uninstall`).innerHTML = common.APP_SPINNER;
                        common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db/admin/demo?`, 'DELETE', 2, null, null, null, (err, result) =>{
                            document.querySelector(`#install_demo_button_uninstall`).innerHTML = old_html;
                            if (err == null){
                                let result_obj = JSON.parse(result);
                                common.show_message('INFO', null, null, common.show_message_info_list(result_obj.info), common.COMMON_GLOBAL['common_app_id']);
                            }
                        })
                        break;
                    }
                }
            }, false);
        }
        document.querySelector(`#install_db_icon`).classList.remove('installed');
        if (err==null && JSON.parse(result).installed == 1)
            document.querySelector(`#install_db_icon`).classList.add('installed');
    })
}
/*----------------------- */
/* DB INFO                */
/*----------------------- */
const show_db_info = async () => {
    if (admin_token_has_value()){
        let json;
        let size = '(Mb)';
        let roundOff = (num) => {
            const x = Math.pow(10,2);
            return Math.round(num * x) / x;
          }

        document.querySelector('#menu_8_content').innerHTML = common.APP_SPINNER;
        await common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db/admin/DBInfo?`,
                           'GET', 2, null, common.COMMON_GLOBAL['common_app_id'], null, (err, result) =>{
            if (err)
                document.querySelector('#menu_8_content').innerHTML = '';
            else{
                json = JSON.parse(result);
                document.querySelector('#menu_8_content').innerHTML = 
                    `<div id='menu_8_content_widget1' class='widget'>
                        <div id='menu_8_db_info1'>
                            <div id='menu_8_db_info_database_title'>${common.ICONS['app_database'] + common.ICONS['regional_numbersystem']}</div><div id='menu_8_db_info_database_data'>${json.data.database_use}</div>
                            <div id='menu_8_db_info_name_title'>${common.ICONS['app_database']}</div><div id='menu_8_db_info_name_data'>${json.data.database_name}</div>
                            <div id='menu_8_db_info_version_title'>${common.ICONS['app_database'] + common.ICONS['regional_numbersystem'] + common.ICONS['app_info']}</div><div id='menu_8_db_info_version_data'>${json.data.version}</div>
                            <div id='menu_8_db_info_database_schema_title'>${common.ICONS['app_database'] + common.ICONS['app_database_schema']}</div><div id='menu_8_db_info_database_schema_data'>${json.data.database_schema}</div>
                            <div id='menu_8_db_info_host_title'>${common.ICONS['app_server']}</div><div id='menu_8_db_info_host_data'>${json.data.hostname}</div>
                            <div id='menu_8_db_info_connections_title'>${common.ICONS['app_user_connections']}</div><div id='menu_8_db_info_connections_data'>${json.data.connections}</div>
                            <div id='menu_8_db_info_started_title'>${common.ICONS['app_database_started']}</div><div id='menu_8_db_info_started_data'>${json.data.started}</div>
                        </div>
                    </div>
                    <div id='menu_8_content_widget2' class='widget'>
                        <div>
                            <div id='menu_8_db_info_space_title'>${common.ICONS['app_database'] + common.ICONS['app_database_calc']}</div>
                        </div>
                        <div id='menu_8_db_info_space_detail' class='common_list_scrollbar'></div>
                    </div>`;
                    document.getElementById('menu_8_db_info_space_detail').innerHTML = common.APP_SPINNER;
                    common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db/admin/DBInfoSpace?`, 'GET', 2, null, common.COMMON_GLOBAL['common_app_id'], null, (err, result) =>{
                        if (err)
                            document.getElementById('menu_8_db_info_space_detail').innerHTML = '';
                        else{
                            json = JSON.parse(result);
                            let html = `<div id='menu_8_db_info_space_detail_row_title' class='menu_8_db_info_space_detail_row'>
                                            <div id='menu_8_db_info_space_detail_col_title1' class='menu_8_db_info_space_detail_col list_title'>
                                                <div>TABLE NAME</div>
                                            </div>
                                            <div id='menu_8_db_info_space_detail_col_title2' class='menu_8_db_info_space_detail_col list_title'>
                                                <div>SIZE ${size}</div>
                                            </div>
                                            <div id='menu_8_db_info_space_detail_col_title3' class='menu_8_db_info_space_detail_col list_title'>
                                                <div>DATA USED ${size}</div>
                                            </div>
                                            <div id='menu_8_db_info_space_detail_col_title4' class='menu_8_db_info_space_detail_col list_title'>
                                                <div>DATA FREE ${size}</div>
                                            </div>
                                            <div id='menu_8_db_info_space_detail_col_title5' class='menu_8_db_info_space_detail_col list_title'>
                                                <div>% USED</div>
                                            </div>
                                        </div>`;
                            for (let i = 0; i < json.data.length; i++) {
                                html += 
                                `<div id='menu_8_db_info_space_detail_row_${i}' class='menu_8_db_info_space_detail_row' >
                                    <div class='menu_8_db_info_space_detail_col'>
                                        <div>${json.data[i].table_name}</div>
                                    </div>
                                    <div class='menu_8_db_info_space_detail_col'>
                                        <div>${roundOff(json.data[i].total_size)}</div>
                                    </div>
                                    <div class='menu_8_db_info_space_detail_col'>
                                        <div>${roundOff(json.data[i].data_used)}</div>
                                    </div>
                                    <div class='menu_8_db_info_space_detail_col'>
                                        <div>${roundOff(json.data[i].data_free)}</div>
                                    </div>
                                    <div class='menu_8_db_info_space_detail_col'>
                                        <div>${roundOff(json.data[i].pct_used)}</div>
                                    </div>
                                </div>`;
                            }
                            document.getElementById('menu_8_db_info_space_detail').innerHTML = html;
                            common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db/admin/DBInfoSpaceSum?`, 'GET', 2, null, common.COMMON_GLOBAL['common_app_id'], null, (err, result) =>{
                                if (err)
                                    null;
                                else{
                                    json = JSON.parse(result);
                                    document.getElementById('menu_8_db_info_space_detail').innerHTML += 
                                        `<div id='menu_8_db_info_space_detail_row_total' class='menu_8_db_info_space_detail_row' >
                                            <div class='menu_8_db_info_space_detail_col'>
                                                <div>${common.ICONS['app_sum']}</div>
                                            </div>
                                            <div class='menu_8_db_info_space_detail_col'>
                                                <div>${roundOff(json.data.total_size)}</div>
                                            </div>
                                            <div class='menu_8_db_info_space_detail_col'>
                                                <div>${roundOff(json.data.data_used)}</div>
                                            </div>
                                            <div class='menu_8_db_info_space_detail_col'>
                                                <div>${roundOff(json.data.data_free)}</div>
                                            </div>
                                            <div class='menu_8_db_info_space_detail_col'>
                                                <div>${roundOff(json.data.pct_used)}</div>
                                            </div>
                                        </div>`;
                                }
                            })
                        }
                    })
            }
        })
    }
}
/*----------------------- */
/* SERVER                 */
/*----------------------- */
const show_server_info = async () => {
    if (admin_token_has_value()){
        let json;
        let size = '(Mb)';
        let roundOff = (num) => {
            const x = Math.pow(10,2);
            return Math.round(num * x) / x;
          }
        await common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_server']}/info?`, 'GET', 2, null, common.COMMON_GLOBAL['common_app_id'], null, (err, result) =>{
            if (err)
                null;
            else{         
                const seconds_to_time = (seconds) => {
                    let ut_sec = seconds;
                    let ut_min = ut_sec/60;
                    let ut_hour = ut_min/60;
                    
                    ut_sec = Math.floor(ut_sec);
                    ut_min = Math.floor(ut_min);
                    ut_hour = Math.floor(ut_hour);
                    
                    ut_hour = ut_hour%60;
                    ut_min = ut_min%60;
                    ut_sec = ut_sec%60;
                    return `${ut_hour} Hour(s) ${ut_min} minute(s) ${ut_sec} second(s)`;
                }
                json = JSON.parse(result);
                document.querySelector('#menu_10_content').innerHTML = 
                    `<div id='menu_10_content_widget1' class='widget'>
                        <div id='menu_10_os_title'>${common.ICONS['app_server']}</div>
                        <div id='menu_10_os_info'>
                            <div id='menu_10_os_info_hostname_title'>${'HOSTNAME'}</div><div id='menu_10_os_info_hostname_data'>${json.os.hostname}</div>
                            <div id='menu_10_os_info_cpus_title'>${'CPUS'}</div><div id='menu_10_os_info_cpus_data'>${json.os.cpus.length}</div>
                            <div id='menu_10_os_info_arch_title'>${'ARCH'}</div><div id='menu_10_os_info_arch_data'>${json.os.arch}</div>
                            <div id='menu_10_os_info_freemem_title'>${'FREEMEM'}</div><div id='menu_10_os_info_freemem_data'>${json.os.freemem}</div>
                            <div id='menu_10_os_info_totalmem_title'>${'TOTALMEM'}</div><div id='menu_10_os_info_totalmem_data'>${json.os.totalmem}</div>
                            <div id='menu_10_os_info_platform_title'>${'PLATFORM'}</div><div id='menu_10_os_info_platform_data'>${json.os.platform}</div>
                            <div id='menu_10_os_info_type_title'>${'TYPE'}</div><div id='menu_10_os_info_type_data'>${json.os.type}</div>
                            <div id='menu_10_os_info_release_title'>${'RELEASE'}</div><div id='menu_10_os_info_release_data'>${json.os.release}</div>
                            <div id='menu_10_os_info_version_title'>${'VERSION'}</div><div id='menu_10_os_info_version_data'>${json.os.version}</div>
                            <div id='menu_10_os_info_uptime_title'>${'UPTIME'}</div><div id='menu_10_os_info_uptime_data'>${seconds_to_time(json.os.uptime)}</div>
                            <div id='menu_10_os_info_homedir_title'>${'HOMEDIR'}</div><div id='menu_10_os_info_homedir_data'>${json.os.homedir}</div>
                            <div id='menu_10_os_info_tmpdir_title'>${'TMPDIR'}</div><div id='menu_10_os_info_tmpdir_data'>${json.os.tmpdir}</div>
                            <div id='menu_10_os_info_userinfo_username_title'>${'USERNAME'}</div><div id='menu_10_os_info_userinfo_username_data'>${json.os.userinfo['username']}</div>
                            <div id='menu_10_os_info_userinfo_homedir_title'>${'USER HOMEDIR'}</div><div id='menu_10_os_info_userinfo_homedir_data'>${json.os.userinfo['homedir']}</div>
                        </div>
                    </div>
                    <div id='menu_10_content_widget2' class='widget'>
                        <div id='menu_10_process_title'>${common.ICONS['app_server'] + ' ' + common.ICONS['app_apps']}</div>
                        <div id='menu_10_process_info'>
                            <div id='menu_10_process_info_memoryusage_rss_title'>${'MEMORY RSS'}</div><div id='menu_10_process_info_memoryusage_rss_data'>${json.process.memoryusage_rss}</div>
                            <div id='menu_10_process_info_memoryusage_heaptotal_title'>${'MEMORY HEAPTOTAL'}</div><div id='menu_10_process_info_memoryusage_heaptotal_data'>${json.process.memoryusage_heaptotal}</div>
                            <div id='menu_10_process_info_memoryusage_heapused_title'>${'MEMORY HEAPUSED'}</div><div id='menu_10_process_info_memoryusage_heapused_data'>${json.process.memoryusage_heapused}</div>
                            <div id='menu_10_process_info_memoryusage_external_title'>${'MEMORY EXTERNAL'}</div><div id='menu_10_process_info_memoryusage_external_data'>${json.process.memoryusage_external}</div>
                            <div id='menu_10_process_info_memoryusage_arraybuffers_title'>${'MEMORY ARRAYBUFFERS'}</div><div id='menu_10_process_info_memoryusage_arraybuffers_data'>${json.process.memoryusage_arraybuffers}</div>
                            <div id='menu_10_process_info_uptime_title'>${'UPTIME'}</div><div id='menu_10_process_info_uptime_data'>${seconds_to_time(json.process.uptime)}</div>
                            <div id='menu_10_process_info_version_title'>${'NODEJS VERSION'}</div><div id='menu_10_process_info_version_data'>${json.process.version}</div>
                            <div id='menu_10_process_info_path_title'>${'PATH'}</div><div id='menu_10_process_info_path_data'>${json.process.path}</div>
                            <div id='menu_10_process_info_start_arg_0_title'>${'START ARG 0'}</div><div id='menu_10_process_info_start_arg_0_data'>${json.process.start_arg_0}</div>
                            <div id='menu_10_process_info_start_arg_1_title'>${'START ARG 1'}</div><div id='menu_10_process_info_start_arg_1_data'>${json.process.start_arg_1}</div>
                        </div>
                    </div>`;
            }
        })
    }
}
/*----------------------- */
/* INIT                   */
/*----------------------- */
const admin_token_has_value = () => {
    if (common.COMMON_GLOBAL['rest_at']=='' && common.COMMON_GLOBAL['rest_admin_at'] =='')
        return false;
    else
        return true;
}

const init = () => {

    //SET GLOBALS
    APP_GLOBAL['page'] = 0;
    APP_GLOBAL['page_last'] =0;
    APP_GLOBAL['previous_row']= '';

    APP_GLOBAL['module_leaflet_map_container']      ='mapid';
    APP_GLOBAL['module_leaflet_map_zoom']           = 14;
    APP_GLOBAL['module_leaflet_map_marker_div_gps'] = 'map_marker_gps';

    APP_GLOBAL['service_log_scope_server']= '';
    APP_GLOBAL['service_log_scope_service']= '';
    APP_GLOBAL['service_log_scope_db']= '';
    APP_GLOBAL['service_log_scope_router']= '';
    APP_GLOBAL['service_log_scope_controller']= '';
    APP_GLOBAL['service_log_level_verbose']= '';
    APP_GLOBAL['service_log_level_error']= '';
    APP_GLOBAL['service_log_level_info']= '';                
    APP_GLOBAL['service_log_destination']= '';
    APP_GLOBAL['service_log_url_destination']= '';
    APP_GLOBAL['service_log_url_destination_username']= '';
    APP_GLOBAL['service_log_url_destination_password']= '';
    APP_GLOBAL['service_log_file_interval']= '';
    APP_GLOBAL['service_log_file_path_server']= '';
    APP_GLOBAL['service_log_date_format']= '';

    if (common.COMMON_GLOBAL['system_admin']==1){
        common.COMMON_GLOBAL['module_leaflet_style']			    ='OpenStreetMap_Mapnik';
        common.COMMON_GLOBAL['module_leaflet_jumpto']		        ='0';
        common.COMMON_GLOBAL['module_leaflet_popup_offset']		    ='-25';
        document.getElementById('common_confirm_question').innerHTML = common.ICONS['app_question'];
    }
    //session variables
    common.COMMON_GLOBAL['client_latitude'] = '';
    common.COMMON_GLOBAL['client_longitude'] = '';
    common.COMMON_GLOBAL['client_place'] = '';

    //hide all first (display none in css using eval not working)
    for (let i=1;i<=10;i++){
        document.getElementById(`menu_${i}`).style.display='none';
    }
    if (common.COMMON_GLOBAL['system_admin']==1){
        //show DASHBOARD
        document.getElementById('menu_1').style.display='block';
        document.getElementById('select_broadcast_type').innerHTML = 
            `<option value='INFO' selected='selected'>${common.ICONS['app_alert']}</option>
                <option value='MAINTENANCE' selected='selected'>${common.ICONS['app_maintenance']}</option>`;                 
        
        //show MONITOR (only SERVER LOG and PM2LOG)
        document.getElementById('menu_5').style.display='block';
        //show PARAMETER
        document.getElementById('menu_6').style.display='block';
        //show INSTALLATION
        document.getElementById('menu_7').style.display='block';
        //show DATABASE
        document.getElementById('menu_8').style.display='block';
        //show BACKUP/RESTORE
        document.getElementById('menu_9').style.display='block';
        //show SERVER
        document.getElementById('menu_10').style.display='block';
        //start with DASHBOARD
        show_menu(1);
    }
    else{
        //show DASHBOARD
        document.getElementById('menu_1').style.display='block';
        document.getElementById('select_broadcast_type').innerHTML = 
            `<option value='INFO' selected='selected'>${common.ICONS['app_alert']}</option>`;
        //show USER STAT
        document.getElementById('menu_2').style.display='block';
        //show USERS
        document.getElementById('menu_3').style.display='block';
        //show APP ADMIN
        document.getElementById('menu_4').style.display='block';
        //show MONITOR
        document.getElementById('menu_5').style.display='block';
        //start with DASHBOARD
        show_menu(1);
        common.common_translate_ui(common.COMMON_GLOBAL['user_locale'], 'APP', (err, result)=>{
            null
        });
    }
}
export {delete_globals,fix_pagination_buttons, set_broadcast_type, sendBroadcast, closeBroadcast, show_menu, init}