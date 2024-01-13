const common = await import('common');
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
    INIT
*/
/*----------------------- */
/* GLOBALS                */
/*----------------------- */
const APP_GLOBAL = {
    page:'',
    page_last:'',
    limit:'',
    previous_row:'',
    module_leaflet_map_container:'',
    service_log_scope_request:'',
    service_log_scope_server:'',
    service_log_scope_app:'',
    service_log_scope_service:'',
    service_log_scope_db:'',
    service_log_level_verbose:'',
    service_log_level_error:'',
    service_log_level_info:'',
    service_log_file_interval:''
};
Object.seal(APP_GLOBAL);
const delete_globals = () => {
    APP_GLOBAL.page = null;
    APP_GLOBAL.page_last = null;
    APP_GLOBAL.limit = null;
    APP_GLOBAL.previous_row = null;
    APP_GLOBAL.module_leaflet_map_container = null;
    APP_GLOBAL.service_log_scope_request = null;
    APP_GLOBAL.service_log_scope_server = null;
    APP_GLOBAL.service_log_scope_app = null;
    APP_GLOBAL.service_log_scope_service = null;
    APP_GLOBAL.service_log_scope_db = null;
    APP_GLOBAL.service_log_level_verbose = null;
    APP_GLOBAL.service_log_level_error = null;
    APP_GLOBAL.service_log_level_info = null;
    APP_GLOBAL.service_log_file_interval = null;
};

/*----------------------- */
/* MISC                   */
/*----------------------- */
const roundOff = (num) => {
    const x = Math.pow(10,2);
    return Math.round(num * x) / x;
  };
const list_generate = (amount)=>{
    let html = '';
    for (let i=1; i<=amount;i++){
        html += `<option value='${i}'>${i}</option>`;
    }
    return html;
};
const show_menu = (menu) => {
    document.querySelector('#menu_1_content').style.display='none';
    document.querySelector('#menu_1').classList.remove('menuitem_selected');
    document.querySelector('#menu_2_content').style.display='none';
    document.querySelector('#menu_2').classList.remove('menuitem_selected');
    document.querySelector('#menu_3_content').style.display='none';
    document.querySelector('#menu_3').classList.remove('menuitem_selected');
    document.querySelector('#menu_4_content').style.display='none';
    document.querySelector('#menu_4').classList.remove('menuitem_selected');
    document.querySelector('#menu_5_content').style.display='none';
    document.querySelector('#menu_5').classList.remove('menuitem_selected');
    document.querySelector('#menu_6_content').style.display='none';
    document.querySelector('#menu_6').classList.remove('menuitem_selected');
    document.querySelector('#menu_7_content').style.display='none';
    document.querySelector('#menu_7').classList.remove('menuitem_selected');
    document.querySelector('#menu_8_content').style.display='none';
    document.querySelector('#menu_8').classList.remove('menuitem_selected');
    document.querySelector('#menu_9_content').style.display='none';
    document.querySelector('#menu_9').classList.remove('menuitem_selected');
    document.querySelector('#menu_10_content').style.display='none';
    document.querySelector('#menu_10').classList.remove('menuitem_selected');
    document.querySelector(`#menu_${menu}_content`).style.display='block';
    document.querySelector(`#menu_${menu}`).classList.add('menuitem_selected');
    const current_year = new Date().getFullYear();
    const yearvalues =   `<option value="${current_year}">${current_year}</option>
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
};

const show_charts = async () => {
    if (admin_token_has_value()){
        //chart 1 shows for all apps, app id used for chart 2
        const app_id = document.querySelector('#select_app_menu1').value; 
        const year = document.querySelector('#select_year_menu1').value;
        const month = document.querySelector('#select_month_menu1').value;
        const select_system_admin_stat = common.COMMON_GLOBAL.system_admin!=''?
                                            document.querySelector('#select_system_admin_stat'):null;
        const system_admin_statGroup = common.COMMON_GLOBAL.system_admin!=''?
                                            select_system_admin_stat.options[select_system_admin_stat.selectedIndex].parentNode.label:null;
        const system_admin_statValues = common.COMMON_GLOBAL.system_admin!=''?
                                            { value: document.querySelector('#select_system_admin_stat').value,
                                                unique:select_system_admin_stat.options[select_system_admin_stat.selectedIndex].getAttribute('unique'),
                                                statGroup:select_system_admin_stat.options[select_system_admin_stat.selectedIndex].getAttribute('statGroup')
                                            }:null;
        document.querySelector('#box1_chart').innerHTML = common.APP_SPINNER;
        document.querySelector('#box1_legend').innerHTML = common.APP_SPINNER;
        document.querySelector('#box2_chart').innerHTML = common.APP_SPINNER;
        document.querySelector('#box2_legend').innerHTML = common.APP_SPINNER;
        let service;
        let url;
        let authorization_type;
        if (common.COMMON_GLOBAL.system_admin!=''){
            service = 'LOG';
            if (system_admin_statGroup=='REQUEST'){
                url = `/log/logs_stat?select_app_id=${app_id}&statGroup=${system_admin_statValues.statGroup}&statValue=&unique=${system_admin_statValues.unique}&year=${year}&month=${month}`;
            }
            else
                url = `/log/logs_stat?select_app_id=${app_id}&statGroup=&statValue=${system_admin_statValues.value}&unique=&year=${year}&month=${month}`;
            authorization_type = 'SYSTEMADMIN';
        }
        else{
            service = 'DB_API';
            url = `/app_log/admin/stat/uniquevisitor?select_app_id=${app_id}&year=${year}&month=${month}`;
            authorization_type = 'APP_ACCESS';
        }
        //return result for both charts
        common.FFB(service, url, 'GET', authorization_type, null)
        .then((result)=>{
            let html = '';
            const charts = JSON.parse(result);
            //chart 1=Piechart, 2= Barchart
            //CHART 1
            const SearchAndGetText = (item, search) => {
                for (let i=1;i<item.options.length;i++){
                    if (item.options[i].value == search)
                        return item.options[i].text;
                }
                return null;
            };
            let sum_amount =0;
            const chart_1 = charts.filter((row)=> row.chart==1);
            for (const stat of chart_1) {
                sum_amount += +stat.amount;
            }
            let chart_colors = '';
            let degree_start = 0;
            let degree_stop = 0;

            let chart_color;
            chart_1.forEach((stat, i)=>{
                //calculate colors and degree
                degree_stop = degree_start + +stat.amount/sum_amount*360;
                chart_color = `rgb(${i/chart_1.length*200},${i/chart_1.length*200},255) ${degree_start}deg ${degree_stop}deg`;
                if (i < chart_1.length - 1)
                    chart_colors += chart_color + ',';
                else
                    chart_colors += chart_color;
                //add to legend below chart
                let legend_text_chart1;
                if (common.COMMON_GLOBAL.system_admin!='')
                    if (system_admin_statGroup=='REQUEST')
                        legend_text_chart1 = stat.statValue;
                    else
                        legend_text_chart1 = SearchAndGetText(document.querySelector('#select_system_admin_stat'), stat.statValue);
                else
                    legend_text_chart1 = SearchAndGetText(document.querySelector('#select_app_menu1'), stat.app_id);
                html += `<div id='box1_legend_row' class='box_legend_row'>
                            <div id='box1_legend_col1' class='box_legend_col' style='background-color:rgb(${i/chart_1.length*200},${i/chart_1.length*200},255)'></div>
                            <div id='box1_legend_col2' class='box_legend_col'>${legend_text_chart1}</div>
                        </div>`;
                degree_start = degree_start + stat.amount/sum_amount*360;
            });
            //display pie chart
            document.querySelector('#box1_chart').innerHTML = '<div id=\'box1_pie\'></div>';
            document.querySelector('#box1_pie').style.backgroundImage = `conic-gradient(${chart_colors})`;
            //show legend below chart
            document.querySelector('#box1_legend').innerHTML = html;

            //CHART 2
            html = '';
            let max_amount =0;
            const chart_2 = charts.filter((row)=> row.chart==2);
            for (const stat of chart_2) {
                if (+stat.amount>max_amount)
                    max_amount = +stat.amount;
            }
            //set bar data
            let bar_color;
            if (app_id == '')
                bar_color = 'rgb(81, 171, 255)';
            else
                bar_color = 'rgb(197 227 255)';

            for (const stat of chart_2) {
                html += `<div class='box2_barcol box2_barcol_display' style='width:${100/chart_2.length}%'>
                            <div class='box2_barcol_color' style='background-color:${bar_color};height:${+stat.amount/max_amount*100}%'></div>
                            <div class='box2_barcol_legendX'>${stat.day}</div>
                        </div>`;
            }
            //create bar chart
            document.querySelector('#box2_chart').innerHTML = `<div id='box2_bar_legendY'>
                                                                    <div id='box2_bar_legend_max'>${max_amount}</div>
                                                                    <div id='box2_bar_legend_medium'>${max_amount/2}</div>
                                                                    <div id='box2_bar_legend_min'>0</div>
                                                            </div>
                                                            <div id='box2_bar_data'>${html}</div>`;
            //legend below chart
            let legend_text_chart2;
            if (common.COMMON_GLOBAL.system_admin!=''){
                //as system admin you can filter http codes and application
                legend_text_chart2 = document.querySelector('#select_system_admin_stat').options[document.querySelector('#select_system_admin_stat').selectedIndex].text;
                const legend_text_chart2_apps = document.querySelector('#select_app_menu1').options[document.querySelector('#select_app_menu1').selectedIndex].text;
                document.querySelector('#box2_legend').innerHTML = `<div id='box2_legend_row' class='box_legend_row'>
                                                                    <div id='box2_legend_col1' class='box_legend_col' style='background-color:${bar_color}'></div>
                                                                    <div id='box2_legend_col2' class='box_legend_col'>${legend_text_chart2}</div>
                                                                    <div id='box2_legend_col3' class='box_legend_col' style='background-color:${bar_color}'></div>
                                                                    <div id='box2_legend_col4' class='box_legend_col'>${legend_text_chart2_apps}</div>
                                                                </div>` ;
            }
                
            else{
                // as admin you can filter application
                legend_text_chart2 = document.querySelector('#select_app_menu1').options[document.querySelector('#select_app_menu1').selectedIndex].text;
                document.querySelector('#box2_legend').innerHTML = `<div id='box2_legend_row' class='box_legend_row'>
                                                                    <div id='box2_legend_col1' class='box_legend_col' style='background-color:${bar_color}'></div>
                                                                    <div id='box2_legend_col2' class='box_legend_col'>${legend_text_chart2}</div>
                                                                </div>` ;
            }
        })
        .catch(()=>{
            document.querySelector('#box1_chart').innerHTML = '';
            document.querySelector('#box1_legend').innerHTML = '';
            document.querySelector('#box2_chart').innerHTML = '';
            document.querySelector('#box2_legend').innerHTML = '';
        }); 
    }
};
const show_start = async (yearvalues) =>{
    
    document.querySelector('#menu_1_content').innerHTML = common.APP_SPINNER;
    const get_system_admin_stat = async () =>{
        return new Promise((resolve)=>{
            common.FFB('LOG', '/log/statuscode?', 'GET', 'SYSTEMADMIN', null)
            .then(result=>{
                let html = `<optgroup label='REQUEST'>
                                <option value="ip_total" unique=0 statGroup="ip">IP TOTAL</option>
                                <option value="ip_unique" unique=1 statGroup="ip">IP UNIQUE</option>
                                <option value="url_total" unique=0 statGroup="url">URL TOTAL</option>
                                <option value="url_unique" unique=1 statGroup="url">URL UNIQUE</option>
                                <option value="accept-language_total" unique=0 statGroup="accept-language">ACCEPT-LANGUAGE TOTAL</option>
                                <option value="accept-language_unique" unique=1 statGroup="accept-language">ACCEPT-LANGUAGE UNIQUE</option>
                                <option value="user-agent_total" unique=0 statGroup="user-agent">USER-AGENT TOTAL</option>
                                <option value="user-agent_unique" unique=1 statGroup="user-agent">USER-AGENT UNIQUE</option>
                            </optgroup>
                            <optgroup label='RESPONSE HTTP Codes'>
                                <option value="" unique=0 statGroup="">${common.ICONS.infinite}</option>
                            </optgroup>`;
                const result_obj = JSON.parse(result);
                for (const status_code of Object.entries(result_obj.status_codes)){
                    html += `<option value='${status_code[0]}' statGroup="">${status_code[0]} - ${status_code[1]}</option>`;
                }
                resolve(html);
            })
            .catch(()=>resolve(null)); 
        });
    };
    let box_title1, box_title2;
    if (common.COMMON_GLOBAL.system_admin!=''){
        box_title1 = `${common.ICONS.app_internet} ${common.ICONS.app_server} ${common.ICONS.app_chart}`;
        box_title2 = `${common.ICONS.app_internet} ${common.ICONS.app_server} ${common.ICONS.regional_numbersystem}`;
    }
    else{
        box_title1 = `${common.ICONS.app_users} ${common.ICONS.app_apps} ${common.ICONS.app_chart}`;
        box_title2 = `${common.ICONS.app_users} ${common.ICONS.app_apps} ${common.ICONS.regional_numbersystem}`;
    }

    document.querySelector('#menu_1_content').innerHTML = 
            `<div id='menu_1_content_widget1' class='widget'>
                <div id='menu_1_row_sample'>
                    <select id='select_system_admin_stat'>${common.COMMON_GLOBAL.system_admin!=''?await get_system_admin_stat():null}</select>
                    <select id='select_app_menu1'>${await get_apps()}</select>
                    <select id='select_year_menu1'>${yearvalues}</select>
                    <select id='select_month_menu1'>${list_generate(12)}</select>
                </div>
                <div id='graphBox'>
                    <div id='box1'>
                        <div id='box1_title' class='box_title'>${box_title1}</div>
                        <div id='box1_chart' class='box_chart'></div>
                        <div id='box1_legend' class='box_legend'></div>
                    </div>
                    <div id='box2'>
                        <div id='box2_title' class='box_title'>${box_title2}</div>
                        <div id='box2_chart' class='box_chart'></div>
                        <div id='box2_legend' class='box_legend'></div>
                    </div>
                </div>
            </div>
            <div id='menu_1_content_widget2' class='widget'>
                <div id='menu_1_maintenance'>
                    <div id='menu_1_maintenance_title'>${common.ICONS.app_maintenance}</div>
                    <div id='menu_1_maintenance_checkbox'>
                        <div id='menu_1_checkbox_maintenance' class='common_switch'></div>
                    </div>
                </div>
                <div id='menu_1_broadcast'>
                    <div id='menu_1_broadcast_title'>${common.ICONS.app_broadcast}</div>
                    <div id='menu_1_broadcast_button' class='chat_click'>${common.ICONS.app_chat}</div>
                </div>
            </div>`;
            
    if (common.COMMON_GLOBAL.system_admin!=''){
        document.querySelector('#menu_1_maintenance').style.display = 'inline-block';
        document.querySelector('#select_system_admin_stat').style.display = 'inline-block';
    }
    else{
        document.querySelector('#menu_1_maintenance').style.display = 'none';
        document.querySelector('#select_system_admin_stat').style.display = 'none';
    }
    
        
    document.querySelector('#select_year_menu1').selectedIndex = 0;
    document.querySelector('#select_month_menu1').selectedIndex = new Date().getMonth();

    if (common.COMMON_GLOBAL.system_admin!='')
        check_maintenance();
    show_charts();
};
const show_user_agent = (user_agent) => {
    return user_agent;
};
const get_apps = async () => {
    return new Promise((resolve)=>{
        let html = `<option value="">${common.ICONS.infinite}</option>`;
        let url;
        let authorization_type;
        let service;
        if (common.COMMON_GLOBAL.system_admin!=''){
            service = 'SERVER';
            url = '/config/systemadmin/apps?';
            authorization_type = 'SYSTEMADMIN';
        }
        else{
            service = 'APP';
            url = '/apps/admin?';
            authorization_type = 'APP_ACCESS';
        }
        common.FFB(service, url, 'GET', authorization_type, null)
        .then(result=>{
            const apps = JSON.parse(result);
            if (common.COMMON_GLOBAL.system_admin!='')
                for (const app of apps) {
                    html += `<option value='${app.APP_ID}'>${app.APP_ID} - ${' '}</option>`;
                }
            else
                for (const app of apps) {
                    html += `<option value='${app.ID}'>${app.ID} - ${app.NAME}</option>`;
                }
            resolve(html);
        })
        .catch(()=>resolve(null));
    });
};

/*----------------------- */
/* BROADCAST              */
/*----------------------- */
const sendBroadcast = () => {
    let broadcast_type ='';
    let client_id;
    let app_id;
    const broadcast_message = document.querySelector('#send_broadcast_message').innerHTML;

    if (broadcast_message==''){
        common.show_message('INFO', null, null, `${common.ICONS.message_text}!`, common.COMMON_GLOBAL.app_id);
        return null;
    }
    
    if (document.querySelector('#client_id').innerHTML==''){
        app_id = document.querySelector('#select_app_broadcast').options[document.querySelector('#select_app_broadcast').selectedIndex].value;
        client_id = '';
        broadcast_type = document.querySelector('#select_broadcast_type').options[document.querySelector('#select_broadcast_type').selectedIndex].value;
    }
    else{
        client_id = document.querySelector('#client_id').innerHTML;
        app_id = '';
        broadcast_type = 'CHAT';
    }
        
    const json_data ={  app_id:             app_id==''?null:app_id,
                        client_id:          client_id==''?null:client_id,
                        client_id_current:  common.COMMON_GLOBAL.service_socket_client_ID,
                        broadcast_type:     broadcast_type, 
                        broadcast_message:  broadcast_message};
    let path='';
    let token_type;
    if (common.COMMON_GLOBAL.system_admin!=''){
        path = '/socket/message/SystemAdmin?';
        token_type = 'SYSTEMADMIN';
    }
    else{
        path = '/socket/message/Admin?';
        token_type = 'APP_ACCESS';
    }
    common.FFB('SOCKET', path, 'POST', token_type, json_data)
    .then(result=>{
        if (Number(JSON.parse(result).sent) > 0)
            common.show_message('INFO', null, null, `${common.ICONS.message_success} (${Number(JSON.parse(result).sent)})`, common.COMMON_GLOBAL.app_id);
        else
            common.show_message('INFO', null, null, `${common.ICONS.message_fail}`, common.COMMON_GLOBAL.app_id);
    });
};    
const closeBroadcast = () => {
    document.querySelector('#dialogue_send_broadcast').style.visibility='hidden'; 
    document.querySelector('#client_id_label').style.display='inline-block';
    document.querySelector('#client_id').style.display='inline-block';
    document.querySelector('#select_app_broadcast').style.display='inline-block';
    document.querySelector('#client_id').innerHTML='';
    document.querySelector('#send_broadcast_message').innerHTML='';
};
const show_broadcast_dialogue = async (dialogue_type, client_id=null) => {
    document.querySelector('#select_app_broadcast').innerHTML = await get_apps();
    switch (dialogue_type){
        case 'CHAT':{
            //hide and set INFO, should not be able to send MAINTENANCE message here
            document.querySelector('#select_broadcast_type').style.display='none';
            document.querySelector('#select_broadcast_type').selectedIndex = 0;
            //hide app selection
            document.querySelector('#select_app_broadcast').style.display='none';
            //show client id
            document.querySelector('#client_id_label').style.display = 'inline-block';
            document.querySelector('#client_id').style.display = 'inline-block';
            document.querySelector('#client_id').innerHTML = client_id;
            break;
        }
        case 'APP':{
            //hide and set INFO, should not be able to send MAINTENANCE message here
            document.querySelector('#select_broadcast_type').style.display='none';
            document.querySelector('#select_broadcast_type').selectedIndex = 0;
            //show app selection
            document.querySelector('#select_app_broadcast').style.display='block';
            //hide client id
            document.querySelector('#client_id_label').style.display = 'none';
            document.querySelector('#client_id').style.display = 'none';
            document.querySelector('#client_id').innerHTML = '';
            break;
        }
        case 'ALL':{
            //show broadcast type and INFO
            document.querySelector('#select_broadcast_type').style.display='inline-block';
            document.querySelector('#select_broadcast_type').selectedIndex = 0;
            //show app selection
            document.querySelector('#select_app_broadcast').style.display='block';
            //hide client id
            document.querySelector('#client_id_label').style.display = 'none';
            document.querySelector('#client_id').style.display = 'none';
            document.querySelector('#client_id').innerHTML = '';
            break;
        }
    }
    document.querySelector('#dialogue_send_broadcast').style.visibility='visible';
};
const set_broadcast_type = () => {
    switch (document.querySelector('#select_broadcast_type').value){
        case 'ALERT':{
            //show app selection
            document.querySelector('#select_app_broadcast').style.display='block';
            //hide client id
            document.querySelector('#client_id_label').style.display = 'none';
            document.querySelector('#client_id').style.display = 'none';
            document.querySelector('#client_id').innerHTML = '';
            break;
        }
        case 'MAINTENANCE':{
            //hide app selection
            document.querySelector('#select_app_broadcast').style.display='none';
            //hide client id
            document.querySelector('#client_id_label').style.display = 'none';
            document.querySelector('#client_id').style.display = 'none';
            document.querySelector('#client_id').innerHTML = '';
            break;
        }
    }
};
const check_maintenance = async () => {
    if (admin_token_has_value()){
        await common.FFB('SERVER', '/config/systemadmin/maintenance?', 'GET', 'SYSTEMADMIN', null)
        .then(result=>{
            if (JSON.parse(result).value==1)
                document.querySelector('#menu_1_checkbox_maintenance').classList.add('checked');
            else
                document.querySelector('#menu_1_checkbox_maintenance').classList.remove('checked');
        });
    }
};
const set_maintenance = () => {
    if (admin_token_has_value()){
        let check_value;
        if (document.querySelector('#menu_1_checkbox_maintenance').classList.contains('checked'))
            check_value = 0;
        else
            check_value = 1;
        const json_data = {value: check_value};
        common.FFB('SERVER', '/config/systemadmin/maintenance?', 'PATCH', 'SYSTEMADMIN', json_data);
    }
};
/*----------------------- */
/* USER STAT              */
/*----------------------- */

const count_users = async () => {
    const count_connected = async () => {
        const get_count = async (identity_provider_id, count_logged_in) => {
            return await common.FFB('SOCKET', `/socket/connection/Admin/count?identity_provider_id=${identity_provider_id}&count_logged_in=${count_logged_in}`, 'GET', 'APP_ACCESS', null)
            .then(result=>JSON.parse(result))
            .catch(err=>{throw err;});
        };
        for (const row of document.querySelectorAll('.list_user_stat_row')){
            if (row.id !='list_user_stat_row_title'){
                if (row.id=='list_user_stat_row_not_connected')
                await get_count(row.children[0].children[0].innerHTML,0)
                    .then(result=>row.children[3].children[0].innerHTML = result.count_connected);
                else
                await get_count(row.children[0].children[0].innerHTML,1)
                    .then(result=>row.children[3].children[0].innerHTML = result.count_connected);
            }
        }
    };    
    if (admin_token_has_value()){
        document.querySelector('#menu_2_content').innerHTML = common.APP_SPINNER;
        await common.FFB('DB_API', '/user_account/admin/count?', 'GET', 'APP_ACCESS', null)
        .then(result=>{
            let html='';
            let i=0;
            for (const user of JSON.parse(result)){
                html +=  `<div id='list_user_stat_row_${i}' class='list_user_stat_row'>
                                <div class='list_user_stat_col'>
                                    <div>${common.get_null_or_value(user.identity_provider_id)}</div>
                                </div>
                                <div class='list_user_stat_col'>
                                    <div>${user.provider_name==null?common.ICONS.app_home:user.provider_name}</div>
                                </div>
                                <div class='list_user_stat_col'>
                                    <div>${user.count_users}</div>
                                </div>
                                <div class='list_user_stat_col'>
                                    <div></div>
                                </div>
                          </div>`;
                i++;
            }
            //count not logged in
            html += `<div id='list_user_stat_row_not_connected' class='list_user_stat_row'>
                        <div class='list_user_stat_col'>
                            <div></div>
                        </div>
                        <div class='list_user_stat_col'>
                            <div>${common.ICONS.app_logoff}</div>
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
                            <div id='list_user_stat_col_title1' class='list_user_stat_col'>${common.ICONS.provider_id}</div>
                            <div id='list_user_stat_col_title2' class='list_user_stat_col'>${common.ICONS.provider}</div>
                            <div id='list_user_stat_col_title3' class='list_user_stat_col'>${common.ICONS.app_sum}</div>
                            <div id='list_user_stat_col_title4' class='list_user_stat_col'>${common.ICONS.app_user_connections}</div>
                        </div>
                        <div id='list_user_stat'>${html}</div>
                    </div>
                </div>`;
            //count logged in
            count_connected();
        })
        .catch(()=>document.querySelector('#menu_2_content').innerHTML = '');
    }
};
/*----------------------- */
/* USERS                  */
/*----------------------- */
const show_users = () =>{
    document.querySelector('#menu_3_content').innerHTML = common.APP_SPINNER;
    document.querySelector('#menu_3_content').innerHTML = 
            `<div id='menu_3_content_widget1' class='widget'>
                <div id='list_user_account_title'>${common.ICONS.app_users}</div>
                <div class='list_search'>
                    <div id='list_user_account_search_input' contenteditable=true class='common_input list_search_input' /></div>
                    <div id='list_user_search_icon' 'class='list_search_icon'>${common.ICONS.app_search}</div>
                </div>
                <div id='list_user_account' class='common_list_scrollbar'></div>
            </div>
            <div id='menu_3_content_widget2' class='widget'>
                <div id='list_user_account_logon_title'>${common.ICONS.app_login}</div>
                <div id='list_user_account_logon' class='common_list_scrollbar'></div>
                <div id='users_buttons' class="save_buttons">
                    <div id='users_save' class='common_dialogue_button button_save' >${common.ICONS.app_save}</div>
                </div>
            </div>`;
    search_users();

};
const search_users = (sort='username', order_by='asc', focus=true) => {

    if (common.check_input(document.querySelector('#list_user_account_search_input').innerText, 100, false) == false)
        return null;

    document.querySelector('#list_user_account').innerHTML = common.APP_SPINNER;
    
    let search_user='*';
    //show all records if no search criteria
    if (document.querySelector('#list_user_account_search_input').innerText!='')
        search_user = encodeURI(document.querySelector('#list_user_account_search_input').innerText);
    common.FFB('DB_API', `/user_account/admin?search=${search_user}&sort=${sort}&order_by=${order_by}`, 'GET', 'APP_ACCESS', null)
    .then(result=>{
        let html = `<div class='list_user_account_row'>
                        <div data-column='avatar' class='list_user_account_col list_title'>
                            ${common.ICONS.user_avatar}
                        </div>
                        <div data-column='id' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.provider_id}
                        </div>
                        <div data-column='app_role_id' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.app_role}
                        </div>
                        <div data-column='app_role_icon' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.app_role} ${common.ICONS.misc_image}
                        </div>
                        <div data-column='active' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.app_inactive} ${common.ICONS.app_active}
                        </div>
                        <div data-column='user_level' class='list_user_account_col list_sort_click list_title'>
                            <div>LEVEL</div>
                        </div>
                        <div data-column='private' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.app_private}
                        </div>
                        <div data-column='username' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.user} ${common.ICONS.username}
                        </div>
                        <div data-column='bio' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.user_bio}
                        </div>
                        <div data-column='email' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.app_email}
                        </div>
                        <div data-column='emal_unverified' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.app_email} ${common.ICONS.app_forgot}
                        </div>
                        <div data-column='password' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.user_password}
                        </div>
                        <div data-column='password_reminder' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.user_password} ${common.ICONS.app_info}
                        </div>
                        <div data-column='verification_code' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.app_verification_code}
                        </div>
                        <div data-column='identity_provider_id' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.provider_id}
                        </div>
                        <div data-column='provider_name' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.provider}
                        </div>
                        <div data-column='provider_id' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.provider_id} ${common.ICONS.user} ID
                        </div>
                        <div data-column='provider_first_name' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.provider_id} ${common.ICONS.user} ${common.ICONS.username} 1
                        </div>
                        <div data-column='provider_last_name' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.provider_id} ${common.ICONS.user} ${common.ICONS.username} 2
                        </div>
                        <div data-column='provider_image' class='list_user_account_col list_title'>
                            ${common.ICONS.provider_id} ${common.ICONS.user} ${common.ICONS.user_avatar}
                        </div>
                        <div data-column='provider_image_url' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.provider_id} ${common.ICONS.user} ${common.ICONS.user_avatar} URL
                        </div>
                        <div data-column='provider_email' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.provider_id} ${common.ICONS.user} ${common.ICONS.app_email}
                        </div>
                        <div data-column='date_created' class='list_user_account_col list_sort_click list_title'>
                            ${common.ICONS.user_account_created}
                        </div>
                        <div data-column='date_modified' class='list_apps_col list_sort_click list_title'>
                            ${common.ICONS.user_account_modified}
                        </div>
                    </div>`;
        let input_contentEditable = '';
        let lov_div = '';
        let lov_class = '';
        //superadmin can edit
        if (common.COMMON_GLOBAL.user_app_role_id==0){
            lov_div = '<div class=\'common_lov_button common_list_lov_click\'></div>';
            lov_class = 'common_input_lov';
            input_contentEditable = 'contenteditable=true';
        }
        else
            input_contentEditable = 'contentEditable=false';
        for (const user of JSON.parse(result)) {
            let list_user_account_current_user_row='';
            if (user.id==common.COMMON_GLOBAL.user_account_id)
                list_user_account_current_user_row = 'list_current_user_row';
            else
                list_user_account_current_user_row ='';
            html += 
            `<div data-changed-record='0' data-user_account_id='${user.id}' class='list_user_account_row ${list_user_account_current_user_row} common_row' >
                <div class='list_user_account_col'>
                    <div class='list_readonly'>
                        <img class='list_user_account_avatar' ${common.list_image_format_src(user.avatar)}/>
                    </div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${user.id}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit ${lov_class}' defaultValue='${common.get_null_or_value(user.app_role_id)}'/>${common.get_null_or_value(user.app_role_id)}</div>
                    ${lov_div}
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly common_lov_value'>${user.app_role_icon}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${common.get_null_or_value(user.active)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${common.get_null_or_value(user.level)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${common.get_null_or_value(user.private)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${common.get_null_or_value(user.username)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${common.get_null_or_value(user.bio)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${common.get_null_or_value(user.email)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${common.get_null_or_value(user.email_unverified)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit common_input_password' placeholder='******'/></div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${common.get_null_or_value(user.password_reminder)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${common.get_null_or_value(user.verification_code)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user.identity_provider)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user.provider_name)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user.provider_id)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user.provider_first_name)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user.provider_last_name)}</div>                        
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>
                        <img class='list_user_account_avatar' ${common.list_image_format_src(user.provider_image)}/>
                    </div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user.provider_image_url)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user.provider_email)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user.date_created)}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user.date_modified)}</div>
                </div>
            </div>`;
        }
        document.querySelector('#list_user_account').innerHTML = html;
        document.querySelector(`#list_user_account .list_title[data-column='${sort}']`).classList.add(order_by);
    
        if (common.COMMON_GLOBAL.user_app_role_id==0){
            //add lov icon for super admin
            document.querySelectorAll('#list_user_account .common_lov_button').forEach(e => e.innerHTML = common.ICONS.app_lov);
        }
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
            document.querySelector('#list_user_account_search_input').focus();
        }   
    })
    .catch(()=>document.querySelector('#list_user_account').innerHTML = '');
};
const show_user_account_logon = async (user_account_id) => {
    document.querySelector('#list_user_account_logon').innerHTML = common.APP_SPINNER;
    common.FFB('DB_API', `/user_account_logon/admin?data_user_account_id=${parseInt(user_account_id)}&data_app_id=''`, 'GET', 'APP_ACCESS', null)
    .then(result=>{
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
        let i=0;
        for (const user_account_logon of JSON.parse(result)) {
            html += 
            `<div id='list_user_account_logon_row_${i}' data-changed-record='0' class='list_user_account_logon_row'>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${user_account_logon.user_account_id}</div>
                </div>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user_account_logon.date_created)}</div>
                </div>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${user_account_logon.app_id}</div>
                </div>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${user_account_logon.result}</div>
                </div>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${user_account_logon.client_ip}</div>
                </div>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user_account_logon.client_longitude)}</div>
                </div>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user_account_logon.client_latitude)}</div>
                </div>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${user_account_logon.client_user_agent}</div>
                </div>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${common.get_null_or_value(user_account_logon.access_token)}</div>
                </div>
            </div>`;
            i++;
        }
        document.querySelector('#list_user_account_logon').innerHTML = html;
    })
    .catch(()=>document.querySelector('#list_user_account_logon').innerHTML = '');
};
/*----------------------- */
/* APP ADMIN              */
/*----------------------- */
const show_apps = async () => {
    document.querySelector('#menu_4_content').innerHTML = common.APP_SPINNER;
    await common.FFB('APP', '/apps/admin?', 'GET', 'APP_ACCESS', null)
    .then(result=>{
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
                            <div>STATUS</div>
                        </div>
                        <div id='list_apps_col_title6' class='list_apps_col list_title'>
                            <div>CATEGORY ID</div>
                        </div>
                        <div id='list_apps_col_title7' class='list_apps_col list_title'>
                            <div>CATEGORY NAME</div>
                        </div>
                    </div>`;
        for (const app of JSON.parse(result)) {
            html += 
            `<div data-changed-record='0' data-app_id = '${app.ID}' class='list_apps_row common_row' >
                <div class='list_apps_col'>
                    <div class='list_readonly'>${app.ID}</div>
                </div>
                <div class='list_apps_col'>
                    <div contentEditable=false class='common_input list_readonly'/>${app.NAME}</div>
                </div>
                <div class='list_apps_col'>
                    <div contentEditable=false class='common_input list_readonly'/>${app.PROTOCOL}${app.SUBDOMAIN}.${app.HOST}:${app.PORT}</div>
                </div>
                <div class='list_apps_col'>
                    <div contentEditable=false class='common_input list_readonly'/>${app.LOGO}</div>
                </div>
                <div class='list_apps_col'>
                    <div class='list_readonly' class='list_readonly'>${app.STATUS}</div>
                </div>
                <div class='list_apps_col'>
                    <div contenteditable=true class='common_input list_edit common_input_lov' defaultValue='${common.get_null_or_value(app.APP_CATEGORY_ID)}'/>${common.get_null_or_value(app.APP_CATEGORY_ID)}</div>
                    <div class='common_lov_button common_list_lov_click'></div>
                </div>
                <div class='list_apps_col'>
                    <div class='list_readonly common_lov_value'>${common.get_null_or_value(app.APP_CATEGORY_TEXT)} </div>
                </div>
            </div>`;
        }
        document.querySelector('#menu_4_content').innerHTML = 
               `<div id='menu_4_content_widget1' class='widget'>
                    <div id='list_apps_title'>${common.ICONS.app_apps}</div>
                    <div id='list_apps' class='common_list_scrollbar'>${html}</div>
                </div>
                <div id='menu_4_content_widget2' class='widget'>
                    <div id='list_app_parameter_title'>${common.ICONS.app_apps + common.ICONS.app_settings}</div>
                    <div id='list_app_parameter' class='common_list_scrollbar'></div>
                    <div id='apps_buttons' class="save_buttons">
                        <div id='apps_save' class='common_dialogue_button button_save' >${common.ICONS.app_save}</div>
                    </div>
                </div>`;
        
        //add lov icon
        document.querySelectorAll('#list_apps .common_lov_button').forEach(e => e.innerHTML = common.ICONS.app_lov);
        //set focus first column in first row
        //this will trigger to show detail records
        document.querySelectorAll('#list_apps .list_edit')[0].focus();
    })
    .catch(()=>document.querySelector('#menu_4_content').innerHTML = '');
};
const show_app_parameter = (app_id) => {
    document.querySelector('#list_app_parameter').innerHTML = common.APP_SPINNER;
    common.FFB('DB_API', `/app_parameter/admin/all?data_app_id=${parseInt(app_id)}`, 'GET', 'APP_ACCESS', null)
    .then(result=>{
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
        for (const app_parameter of JSON.parse(result)) {
            html += 
            `<div data-changed-record='0' class='list_app_parameter_row common_row'>
                <div class='list_app_parameter_col'>
                    <div class='list_readonly'>${app_parameter.app_id}</div>
                </div>
                <div class='list_app_parameter_col'>
                    <div contenteditable=true class='common_input list_edit common_input_lov' defaultValue='${app_parameter.parameter_type_id}'/>${app_parameter.parameter_type_id}</div>
                    <div class='common_lov_button common_list_lov_click'></div>
                </div>
                <div class='list_app_parameter_col'>
                    <div class='list_readonly common_lov_value'>${app_parameter.parameter_type_text}</div>
                </div>
                <div class='list_app_parameter_col'>
                    <div class='list_readonly'>${app_parameter.parameter_name}</div>
                </div>
                <div class='list_app_parameter_col'>
                    <div contenteditable=true class='common_input list_edit'/>${common.get_null_or_value(app_parameter.parameter_value)}</div>
                </div>
                <div class='list_app_parameter_col'>
                    <div contenteditable=true class='common_input list_edit'/>${common.get_null_or_value(app_parameter.parameter_comment)}</div>
                </div>
            </div>`;
        }
        document.querySelector('#list_app_parameter').innerHTML = html;
        //add lov icon
        document.querySelectorAll('#list_app_parameter .common_lov_button').forEach(e => e.innerHTML = common.ICONS.app_lov);
    })
    .catch(()=>document.querySelector('#list_app_parameter').innerHTML = '');
};
const button_save = async (item) => {
    if (item=='apps_save'){
        //save changes in list_apps
        let x = document.querySelectorAll('.list_apps_row');
        for (const record of x){
            if (record.getAttribute('data-changed-record')=='1'){
                await update_record('app',
                                    record,
                                    item,
                                    {id: record.children[0].children[0].innerHTML,
                                     app_category_id: record.children[5].children[0].innerHTML});
            }
        }
        //save changes in list_app_parameter
        x = document.querySelectorAll('.list_app_parameter_row');
        for (const record of x){
            if (record.getAttribute('data-changed-record')=='1'){
                await update_record('app_parameter',
                                    record,
                                    item,
                                    {app_id: record.children[0].children[0].innerHTML,
                                     parameter_type_id: record.children[1].children[0].innerHTML,
                                     parameter_name:  record.children[3].children[0].innerHTML,
                                     parameter_value: record.children[4].children[0].innerHTML,
                                     parameter_comment: record.children[5].children[0].innerHTML
                                    });
            }
        }
    }
    else 
        if (item == 'users_save'){
            //save changes in list_user_account
            const x = document.querySelectorAll('.list_user_account_row');
            for (const record of x){
                if (record.getAttribute('data-changed-record')=='1'){
                    await update_record('user_account',
                                        record,
                                        item,
                                        {id: record.children[1].children[0].innerHTML,
                                         app_role_id: record.children[2].children[0].innerHTML,
                                         active: record.children[4].children[0].innerHTML,
                                         user_level: record.children[5].children[0].innerHTML,
                                         private: record.children[6].children[0].innerHTML,
                                         username: record.children[7].children[0].innerHTML,
                                         bio: record.children[8].children[0].innerHTML,
                                         email: record.children[9].children[0].innerHTML,
                                         email_unverified: record.children[10].children[0].innerHTML,
                                         password: record.children[11].children[0].innerHTML,
                                         password_reminder: record.children[12].children[0].innerHTML,
                                         verification_code: record.children[13].children[0].innerHTML
                                        });
                }
            }
        }
        else
            if (item == 'config_save'){
                const config_create_server_json = () => {
                    const config_json = [];
                    document.querySelectorAll('#list_config .list_config_group').forEach(e_group => 
                        {
                            let config_group='';
                            document.querySelectorAll(`#${e_group.id} .list_config_row`).forEach(e_row => 
                                    {
                                        config_group += `{"${e_row.children[0].children[0].innerHTML}": ${JSON.stringify(e_row.children[1].children[0].innerHTML)}, 
                                                          "COMMENT": ${JSON.stringify(e_row.children[2].children[0].innerHTML)}}`;
                                        if (e_group.lastChild != e_row)
                                            config_group += ',';
                                    }
                            );
                            config_json.push(JSON.parse(`[${config_group}]`));
                        }
                    );
                    return {   
                                SERVER:             config_json[0],
                                SERVICE_IAM:        config_json[1],
                                SERVICE_SOCKET:     config_json[2],
                                SERVICE_DB:         config_json[3],
                                SERVICE_LOG:        config_json[4]
                            };
                };
                //the filename is fetched from end of item name list_config_nav_X that is a li element
                const file = document.querySelectorAll('#menu_6_content .list_nav .list_nav_selected_tab')[0].id.substring(16).toUpperCase();
                const json_data = { config_json:    [
                                                    ['CONFIG',                  file=='CONFIG'?config_create_server_json():null],
                                                    ['APPS',                    file=='APPS'?JSON.parse(document.querySelector('#list_config_edit').innerHTML):null],
                                                    ['IAM_BLOCKIP',             file=='IAM_BLOCKIP'?JSON.parse(document.querySelector('#list_config_edit').innerHTML):null],
                                                    ['IAM_POLICY',              file=='IAM_POLICY'?JSON.parse(document.querySelector('#list_config_edit').innerHTML):null],
                                                    ['IAM_USERAGENT',           file=='IAM_USERAGENT'?JSON.parse(document.querySelector('#list_config_edit').innerHTML):null],
                                                    ['IAM_USER',                file=='IAM_USER'?JSON.parse(document.querySelector('#list_config_edit').innerHTML):null],
                                                    ['MICROSERVICE_CONFIG',     file=='MICROSERVICE_CONFIG'?JSON.parse(document.querySelector('#list_config_edit').innerHTML):null],
                                                    ['MICROSERVICE_SERVICES',   file=='MICROSERVICE_SERVICES'?JSON.parse(document.querySelector('#list_config_edit').innerHTML):null]
                                                    ]};
                const old_button = document.querySelector('#' + item).innerHTML;
                document.querySelector('#' + item).innerHTML = common.APP_SPINNER;
                common.FFB('SERVER', '/config/systemadmin?', 'PUT', 'SYSTEMADMIN', json_data)
                .finally(()=>document.querySelector('#' + item).innerHTML = old_button);
            }    
};
const update_record = async (table, 
                             row_element,
                             button,
                             parameters) => {
    if (admin_token_has_value()){
        let path;
        let json_data;
        let token_type;
        const old_button = document.querySelector('#' + button).innerHTML;
        document.querySelector('#' + button).innerHTML = common.APP_SPINNER;
        switch (table){
            case 'user_account':{
                json_data = {   app_role_id:        parameters.app_role_id,
                                active:             parameters.active,
                                user_level:         parameters.user_level,
                                private:            parameters.private,
                                username:           parameters.username,
                                bio:                parameters.bio,
                                email:              parameters.email,
                                email_unverified:   parameters.email_unverified,
                                password_new:       parameters.password,
                                password_reminder:  parameters.password_reminder,
                                verification_code:  parameters.verification_code};
                path = `/user_account/admin?PUT_ID=${parameters.id}`;
                token_type = 'SUPERADMIN';
                break;
            }
            case 'app':{
                json_data = {   
                                app_category_id:parameters.app_category_id
                            };
                path = `/apps/admin?PUT_ID=${parameters.id}`;
                token_type = 'APP_ACCESS';
                break;
            }
            case 'app_parameter':{
                json_data = {   app_id:             parameters.app_id,
                                parameter_name:     parameters.parameter_name,
                                parameter_type_id:  parameters.parameter_type_id,
                                parameter_value:    parameters.parameter_value,
                                parameter_comment:  parameters.parameter_comment};
                path = '/app_parameter/admin?';
                token_type = 'APP_ACCESS';
                break;
            }
        }
        await common.FFB('DB_API', path, 'PUT', token_type, json_data)
        .then(()=>row_element.setAttribute('data-changed-record', '0'))
        .finally(()=>document.querySelector('#' + button).innerHTML = old_button);
    }
};

/*----------------------- */
/* MONITOR                */
/*----------------------- */
const show_monitor = async (yearvalues) =>{
    document.querySelector('#menu_5_content').innerHTML = 
        `<div id='menu_5_content_widget1' class='widget'>
            <div id='list_monitor_nav' class='list_nav'>
                <div id='list_monitor_nav_1' class='list_nav_list'><div id='list_connected_title' class='list_button' >${common.ICONS.app_user_connections + ' ' + common.ICONS.app_log}</div></div>
                <div id='list_monitor_nav_2' class='list_nav_list'><div id='list_app_log_title' class='list_button' >${common.ICONS.app_apps + ' ' + common.ICONS.app_log}</div></div>
                <div id='list_monitor_nav_3' class='list_nav_list'><div id='list_server_log_title' class='list_button' >${common.ICONS.app_server + ' ' + common.ICONS.app_log}</div></div>
            </div>
            <div id='list_connected_form'>
                <div class='list_row_sample'>
                    <select id='select_app_menu5_list_connected'></select>
                    <select id='select_year_menu5_list_connected'></select>
                    <select id='select_month_menu5_list_connected'>${list_generate(12)}</select>
                </div>
                <div id='list_connected' class='common_list_scrollbar'></div>
            </div>
            <div id='list_app_log_form'>
                <div class='list_row_sample'>
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
                <div class='list_row_sample'>
                    <select id='select_logscope5'></select>
                    <select id='select_app_menu5'></select>
                    <select id='select_year_menu5'></select>
                    <select id='select_month_menu5'>${list_generate(12)}</select>
                    <select id='select_day_menu5'>${list_generate(31)}</select>
                    <div id='filesearch_menu5' class='common_dialogue_button' >${common.ICONS.app_search}</div>
                </div>
                <div id='menu5_row_parameters'>
                    <div class='menu5_row_parameters_col'>
                        <div id='menu5_row_parameters_col1'>${common.ICONS.app_server + ' REQUEST'}</div>
                        <div id='menu5_row_parameters_col1_1'>${common.ICONS.app_checkbox_checked}</div>
                        <div id='menu5_row_parameters_col1_0'>${common.ICONS.app_checkbox_empty}</div>
                    </div>
                    <div class='menu5_row_parameters_col'>
                        <div id='menu5_row_parameters_col2'>${common.ICONS.app_server + ' SERVICE'}</div>
                        <div id='menu5_row_parameters_col2_1'>${common.ICONS.app_checkbox_checked}</div>
                        <div id='menu5_row_parameters_col2_0'>${common.ICONS.app_checkbox_empty}</div>
                    </div>
                    <div class='menu5_row_parameters_col'>
                        <div id='menu5_row_parameters_col3'>${common.ICONS.app_database}</div>
                        <div id='menu5_row_parameters_col3_1'>${common.ICONS.app_checkbox_checked}</div>
                        <div id='menu5_row_parameters_col3_0'>${common.ICONS.app_checkbox_empty}</div>
                    </div>
                </div>
                <div class='list_search'>
                    <div id='list_server_log_search_input' contenteditable=true class='common_input list_search_input'/></div>
                    <div id='list_server_log_search_icon' class='list_search_icon'>${common.ICONS.app_search}</div>
                </div>
                <div id='list_server_log' class='common_list_scrollbar'></div>
            </div>
        </div>
        <div id='menu_5_content_widget2' class='widget'>
            <div id='mapid'></div>
        </div>`;
    
    if (common.COMMON_GLOBAL.system_admin!=''){
        //hide APP LOG in MONITOR
        document.querySelector('#list_monitor_nav_2').style.display='none';
    }
    else{
        //hide SERVER LOG in MONITOR
        document.querySelector('#list_monitor_nav_3').style.display='none';
    }
    //server log
    document.querySelector('#select_app_menu5').innerHTML = await get_apps();
    //app log
    document.querySelector('#select_app_menu5_app_log').innerHTML = document.querySelector('#select_app_menu5').innerHTML;
    //connected
    document.querySelector('#select_app_menu5_list_connected').innerHTML = document.querySelector('#select_app_menu5').innerHTML;

    const init_monitor = () =>{

        let path;
        let token_type = '';
        const show_map = () =>{
            //show map only for this condition
            if (common.COMMON_GLOBAL.system_admin_only != 1)
                common.map_init(APP_GLOBAL.module_leaflet_map_container,
                                common.COMMON_GLOBAL.module_leaflet_style,
                                common.COMMON_GLOBAL.client_longitude,
                                common.COMMON_GLOBAL.client_latitude,
                                true,
                                null).then(() => {
                    common.map_update(  common.COMMON_GLOBAL.client_longitude,
                                        common.COMMON_GLOBAL.client_latitude,
                                        common.COMMON_GLOBAL.module_leaflet_zoom,
                                        common.COMMON_GLOBAL.client_place,
                                        null,
                                        common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                        common.COMMON_GLOBAL.module_leaflet_jumpto);
                    common.map_resize();
                });

        };
        
        if (common.COMMON_GLOBAL.system_admin!=''){
            path  = '/config/systemadmin?config_group=SERVICE_DB&parameter=LIMIT_LIST_SEARCH';
            token_type = 'SYSTEMADMIN';
        }
        else{
            path  = '/config/admin?config_group=SERVICE_DB&parameter=LIMIT_LIST_SEARCH';
            token_type = 'APP_ACCESS';
        }      
        common.FFB('SERVER', path, 'GET', token_type, null)
        .then(result_limit=>{
            APP_GLOBAL.limit = parseInt(JSON.parse(result_limit).data);
            //connected
            document.querySelector('#select_year_menu5_list_connected').innerHTML = yearvalues;
            document.querySelector('#select_year_menu5_list_connected').selectedIndex = 0;
            document.querySelector('#select_month_menu5_list_connected').selectedIndex = new Date().getMonth();            
            if (common.COMMON_GLOBAL.system_admin!=''){
                //server log
                document.querySelector('#select_year_menu5').innerHTML = yearvalues;
                document.querySelector('#select_year_menu5').selectedIndex = 0;
                document.querySelector('#select_month_menu5').selectedIndex = new Date().getMonth();
                document.querySelector('#select_day_menu5').selectedIndex = new Date().getDate() -1;
                get_server_log_parameters().then(() => {
                    show_map();
                    nav_click(document.querySelector('#list_connected_title').id);
                });
            }
            else{
                APP_GLOBAL.page = 0;
                //log
                document.querySelector('#select_year_menu5_app_log').innerHTML = yearvalues;
                document.querySelector('#select_year_menu5_app_log').selectedIndex = 0;
                document.querySelector('#select_month_menu5_app_log').selectedIndex = new Date().getMonth();
                fix_pagination_buttons();
                show_map();
                nav_click(document.querySelector('#list_connected_title').id);
            }    
        });
    };
    //fetch geolocation once
    if (common.COMMON_GLOBAL.client_longitude && common.COMMON_GLOBAL.client_latitude)
        init_monitor();
    else
        common.get_gps_from_ip().then(() =>{
            init_monitor();
        });
};
const fix_pagination_buttons = () => {
    //function triggered by change in user preference before innerHTML loaded html
    //function called again when choosing app log monitor check if exist first
    if (document.querySelector('#list_app_log_first')){
        //fix rtl isse with images, items created after login
        if (document.querySelector('#common_user_direction_select').value=='ltr'||
            document.querySelector('#common_user_direction_select').value==''){
            document.querySelector('#list_app_log_first').innerHTML = common.ICONS.app_first;
            document.querySelector('#list_app_log_previous').innerHTML = common.ICONS.app_previous;
            document.querySelector('#list_app_log_next').innerHTML = common.ICONS.app_next;
            document.querySelector('#list_app_log_last').innerHTML = common.ICONS.app_last;
        }
        else{
            document.querySelector('#list_app_log_first').innerHTML = common.ICONS.app_last;
            document.querySelector('#list_app_log_previous').innerHTML = common.ICONS.app_next;
            document.querySelector('#list_app_log_next').innerHTML = common.ICONS.app_previous;
            document.querySelector('#list_app_log_last').innerHTML = common.ICONS.app_first;
        }
    }
};
const nav_click = (item_id) => {
    const reset_monitor = () => {
        document.querySelector('#list_monitor_nav_1').classList.remove('list_nav_selected_tab');
        document.querySelector('#list_monitor_nav_2').classList.remove('list_nav_selected_tab');
        document.querySelector('#list_monitor_nav_3').classList.remove('list_nav_selected_tab');
    };
    const reset_config = () => {
        document.querySelector('#list_config_nav_config').classList.remove('list_nav_selected_tab');
        document.querySelector('#list_config_nav_iam_blockip').classList.remove('list_nav_selected_tab');
        document.querySelector('#list_config_nav_iam_useragent').classList.remove('list_nav_selected_tab');
        document.querySelector('#list_config_nav_iam_policy').classList.remove('list_nav_selected_tab');
    };
    
    switch (item_id){
        //MONITOR
        case 'list_connected_title':{
            reset_monitor();
            document.querySelector('#list_connected_form').style.display='flex';
            document.querySelector('#list_app_log_form').style.display='none';
            document.querySelector('#list_server_log_form').style.display='none';
            document.querySelector('#list_monitor_nav_1').classList.add('list_nav_selected_tab');
            show_connected();
            break;
        }
        case 'list_app_log_title':{
            reset_monitor();
            document.querySelector('#list_connected_form').style.display='none';
            document.querySelector('#list_app_log_form').style.display='flex';
            document.querySelector('#list_server_log_form').style.display='none';
            document.querySelector('#list_monitor_nav_2').classList.add('list_nav_selected_tab');
            APP_GLOBAL.page = 0;
            show_app_log();
            break;
        }
        case 'list_server_log_title':{
            reset_monitor();
            document.querySelector('#list_connected_form').style.display='none';
            document.querySelector('#list_app_log_form').style.display='none';
            document.querySelector('#list_server_log_form').style.display='block';
            document.querySelector('#list_monitor_nav_3').classList.add('list_nav_selected_tab');
            show_server_logs('logdate', 'desc', document.querySelector('#list_server_log_search_input').innerText);
            break;
        }
        //SERVER CONFIG
        case 'list_config_server_title':{
            reset_config();
            document.querySelector('#list_config_nav_config').classList.add('list_nav_selected_tab');
            show_config('CONFIG');
            break;
        }
        case 'list_config_blockip_title':{
            reset_config();
            document.querySelector('#list_config_nav_iam_blockip').classList.add('list_nav_selected_tab');
            show_config('IAM_BLOCKIP');
            break;
        }
        case 'list_config_useragent_title':{
            reset_config();
            document.querySelector('#list_config_nav_iam_useragent').classList.add('list_nav_selected_tab');
            show_config('IAM_USERAGENT');
            break;
        }
        case 'list_config_policy_title':{
            reset_config();
            document.querySelector('#list_config_nav_iam_policy').classList.add('list_nav_selected_tab');
            show_config('IAM_POLICY');
            break;
        }
    }
};
const show_list = async (list_div, url_parameters, sort, order_by) => {
    if (admin_token_has_value()){
        let logscope;
        let logs;
        let token_type;
        let path;
        let service;
        //set spinner
        switch (list_div){
            case 'list_connected':{
                if (common.COMMON_GLOBAL.system_admin!=''){
                    path = `/socket/connection/SystemAdmin?${url_parameters}`;
                    service = 'SOCKET';
                    token_type = 'SYSTEMADMIN';
                }
                else{
                    path = `/socket/connection/Admin?${url_parameters}`;
                    service = 'SOCKET';
                    token_type = 'APP_ACCESS';
                }
                document.querySelector('#' + list_div).innerHTML = common.APP_SPINNER;
                break;
            }
            case 'list_app_log':{
                path = `/app_log/admin?${url_parameters}`;
                service = 'DB_API';
                token_type = 'APP_ACCESS';
                document.querySelector('#' + list_div).innerHTML = common.APP_SPINNER;
                break;
            }
            case 'list_server_log':{
                logscope = document.querySelector('#select_logscope5')[document.querySelector('#select_logscope5').selectedIndex].getAttribute('log_scope');
                path = `/log/logs?${url_parameters}`;
                service = 'LOG';
                token_type = 'SYSTEMADMIN';
                document.querySelector('#' + list_div).innerHTML = common.APP_SPINNER;
                break;
            }
        }
        common.FFB(service, path, 'GET', token_type, null)
        .then(result=>{
            logs = JSON.parse(result);
            let html = '';
            switch (list_div){
                /*
                use this grouping to decide column orders
                [log colums][server columns][user columns][detail columms][app columns(broadcast, edit etc)]
                */
                case 'list_connected':{
                    html = `<div class='list_connected_row'>
                                <div data-column='id' class='list_connected_col list_sort_click list_title'>
                                    ID
                                </div>
                                <div data-column='connection_date' class='list_connected_col list_sort_click list_title'>
                                    CONNECTION DATE
                                </div>
                                <div data-column='app_id' class='list_connected_col list_sort_click list_title'>
                                    APP ID
                                </div>
                                <div data-column='app_role_icon' class='list_connected_col list_sort_click list_title'>
                                    ROLE
                                </div>
                                <div data-column='user_account_id' class='list_connected_col list_sort_click list_title'>
                                    USER ID
                                </div>
                                <div data-column='system_admin' class='list_connected_col list_sort_click list_title'>
                                    SYSTEM ADMIN
                                </div>
                                <div data-column='ip' class='list_connected_col list_sort_click list_title'>
                                    IP
                                </div>
                                <div data-column='gps_latitude' class='list_connected_col list_sort_click list_title'>
                                    GPS LAT
                                </div>
                                <div data-column='gps_longitude' class='list_connected_col list_sort_click list_title'>
                                    GPS LONG
                                </div>
                                <div data-column='user_agent' class='list_connected_col list_sort_click list_title'>
                                    USER AGENT
                                </div>
                                <div data-column='broadcast' class='list_connected_col list_title'>
                                    BROADCAST
                                </div>
                            </div>`;
                    break;
                }
                case 'list_app_log':{
                    APP_GLOBAL.page_last = Math.floor(logs[0].total_rows/APP_GLOBAL.limit) * APP_GLOBAL.limit;
                    html = `<div class='list_app_log_row'>
                                <div data-column='id' class='list_app_log_col list_sort_click list_title'>
                                    ID
                                </div>
                                <div data-column='date_created' class='list_app_log_col list_sort_click list_title'>
                                    DATE
                                </div>
                                <div data-column='server_http_host' class='list_app_log_col list_sort_click list_title'>
                                    HOST
                                </div>
                                <div  data-column='app_id' class='list_app_log_col list_sort_click list_title'>
                                    APP ID
                                </div>
                                <div data-column='app_module' class='list_app_log_col list_sort_click list_title'>
                                    MODULE
                                </div>
                                <div data-column='app_module_type' class='list_app_log_col list_sort_click list_title'>
                                    MODULE TYPE
                                </div>
                                <div data-column='app_module_request' class='list_app_log_col list_sort_click list_title'>
                                    MODULE REQUEST
                                </div>
                                <div data-column='app_module_request' class='list_app_log_col list_sort_click list_title'>
                                    MODULE RESULT
                                </div>
                                <div data-column='app_user_id' class='list_app_log_col list_sort_click list_title'>
                                    USER ID
                                </div>
                                <div data-column='server_remote_addr' class='list_app_log_col list_sort_click list_title'>
                                    IP
                                </div>
                                <div data-column='client_latitude' class='list_app_log_col list_sort_click list_title'>
                                    GPS LAT
                                </div>
                                <div data-column='client_longitude' class='list_app_log_col list_sort_click list_title'>
                                    GPS LONG
                                </div>
                                <div data-column='user_language' class='list_app_log_col list_sort_click list_title'>
                                    USER LANGUAGE
                                </div>
                                <div data-column='user_timezone' class='list_app_log_col list_sort_click list_title'>
                                    USER TIMEZONE
                                </div>
                                <div data-column='user_number_system' class='list_app_log_col list_sort_click list_title'>
                                    USER NUMBER_SYSTEM
                                </div>
                                <div data-column='user_platform' class='list_app_log_col list_sort_click list_title'>
                                    USER PLATFORM
                                </div>
                                <div data-column='server_user_agent' class='list_app_log_col list_sort_click list_title'>
                                    USER AGENT
                                </div>
                                <div data-column='http_accept_language' class='list_app_log_col list_sort_click list_title'>
                                    ACCEPT LANGUAGE
                                </div>
                            </div>`;
                    break;
                }
                case 'list_server_log':{
                    switch (logscope){
                        case 'REQUEST':{
                            html =`<div class='list_server_log_row'>
                                <div data-column='logdate' class='list_request_log_col list_sort_click list_title'>
                                    LOGDATE
                                </div>
                                <div data-column='host' class='list_request_log_col list_sort_click list_title'>
                                    HOST
                                </div>
                                <div data-column='ip' class='list_request_log_col list_sort_click list_title'>
                                    IP
                                </div>
                                <div data-column='requestid' class='list_request_log_col list_sort_click list_title'>
                                    REQUEST_ID
                                </div>
                                <div data-column='correlationid' class='list_request_log_col list_sort_click list_title'>
                                    CORRELATION_ID
                                </div>
                                <div data-column='url' class='list_request_log_col list_sort_click list_title'>
                                    URL
                                </div>
                                <div data-column='http_info' class='list_request_log_col list_sort_click list_title'>
                                    HTTP INFO
                                </div>
                                <div data-column='method' class='list_request_log_col list_sort_click list_title'>
                                    METHOD
                                </div>
                                <div data-column='statuscode' class='list_request_log_col list_sort_click list_title'>
                                    STATUSCODE
                                </div>
                                <div data-column='statusmessage' class='list_request_log_col list_sort_click list_title'>
                                    STATUSMESSAGE
                                </div>
                                <div data-column='user-agent' class='list_request_log_col list_sort_click list_title'>
                                    USER AGENT
                                </div>
                                <div data-column='accept-language' class='list_request_log_col list_sort_click list_title'>
                                    ACCEPT LANGUAGE
                                </div>
                                <div data-column='referer' class='list_request_log_col list_sort_click list_title'>
                                    REFERER
                                </div>
                                <div data-column='size_received' class='list_request_log_col list_sort_click list_title'>
                                    SIZE_RECEIVED
                                </div>
                                <div data-column='size_sent' class='list_request_log_col list_sort_click list_title'>
                                    SIZE_SENT
                                </div>
                                <div data-column='responsetime' class='list_request_log_col list_sort_click list_title'>
                                    RESPONSE_TIME
                                </div>
                                <div data-column='logtext' class='list_request_log_col list_sort_click list_title'>
                                    LOG TEXT
                                </div>
                            </div>`;
                            break;
                        }
                        case 'SERVER':{
                            html = `<div class='list_server_log_row'>
                                        <div data-column='logdate' class='list_server_log_col list_sort_click list_title'>
                                            LOGDATE
                                        </div>
                                        <div data-column='logtext' class='list_server_log_col list_sort_click list_title'>
                                            LOGTEXT
                                        </div>
                                    </div>`;
                            break;
                        }
                        case 'APP':{
                            html = `<div class='list_server_log_row'>
                                        <div data-column='logdate' class='list_server_app_log_col list_sort_click list_title'>
                                            LOGDATE
                                        </div>
                                        <div data-column='app_id' class='list_server_app_log_col list_sort_click list_title'>
                                            APP ID
                                        </div>
                                        <div data-column='filename' class='list_server_app_log_col list_sort_click list_title'>
                                            FILENAME
                                        </div>
                                        <div data-column='function' class='list_server_app_log_col list_sort_click list_title'>
                                            FUNCTION
                                        </div>
                                        <div data-column='line' class='list_server_app_log_col list_sort_click list_title'>
                                            LINE
                                        </div>
                                        <div data-column='logtext' class='list_server_app_log_col list_sort_click list_title'>
                                            LOG TEXT
                                        </div>
                                    </div>`;
                            break;
                        }
                        case 'SERVICE':{
                            html = `<div class='list_server_log_row'>
                                        <div data-column='logdate' class='list_service_log_col list_sort_click list_title'>
                                            LOGDATE
                                        </div>
                                        <div data-column='app_id' class='list_service_log_col list_sort_click list_title'>
                                            APP ID
                                        </div>
                                        <div data-column='service' class='list_service_log_col list_sort_click list_title'>
                                            SERVICE
                                        </div>
                                        <div data-column='parameters' class='list_service_log_col list_sort_click list_title'>
                                            PARAMETERS
                                        </div>
                                        <div data-column='logtext' class='list_service_log_col list_sort_click list_title'>
                                            LOG TEXT
                                        </div>
                                    </div>`;
                            break;
                        }
                        case 'DB':{
                            html = `<div class='list_server_log_row'>
                                        <div data-column='logdate' class='list_db_log_col list_sort_click list_title'>
                                            LOGDATE
                                        </div>
                                        <div data-column='app_id' class='list_db_log_col list_sort_click list_title'>
                                            APP ID
                                        </div>
                                        <div data-column='db' class='list_db_log_col list_sort_click list_title'>
                                            DB
                                        </div>
                                        <div data-column='sql' class='list_db_log_col list_sort_click list_title'>
                                            SQL
                                        </div>
                                        <div data-column='parameters' class='list_db_log_col list_sort_click list_title'>
                                            PARAMETERS
                                        </div>
                                        <div data-column='logtext' class='list_db_log_col list_sort_click list_title'>
                                            LOG TEXT
                                        </div>
                                    </div>`;
                            break;
                        }
                    }
                    break;
                }
            }
            if (logs.length >0){
                for (const log of logs) {
                    switch (list_div){
                        case 'list_connected':{    
                            let list_connected_current_user_row='';
                            if (log.id==common.COMMON_GLOBAL.service_socket_client_ID)
                                list_connected_current_user_row = 'list_current_user_row';
                            else
                                list_connected_current_user_row ='';
                            let app_role_class;
                            let app_role_icon = log.app_role_icon;
                            if (log.system_admin!=''){
                                app_role_class = 'app_role_system_admin';
                                app_role_icon = common.ICONS.app_system_admin;
                            }
                            else
                                switch (log.app_role_id){
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
                                            ${log.id}
                                        </div>
                                        <div class='list_connected_col'>
                                            ${log.connection_date}
                                        </div>
                                        <div class='list_connected_col'>
                                            ${log.app_id}
                                        </div>
                                        <div class='list_connected_col ${app_role_class}'>
                                            ${app_role_icon}
                                        </div>
                                        <div class='list_connected_col'>
                                            ${common.get_null_or_value(log.user_account_id)}
                                        </div>
                                        <div class='list_connected_col'>
                                            ${log.system_admin}
                                        </div>
                                        <div class='list_connected_col'>
                                            ${log.ip.replace('::ffff:','')}
                                        </div>
                                        <div class='list_connected_col gps_click' 
                                            data-latitude='${common.get_null_or_value(log.gps_latitude)}'
                                            data-longitude='${common.get_null_or_value(log.gps_longitude)}'>
                                            ${common.get_null_or_value(log.gps_latitude)}
                                        </div>
                                        <div class='list_connected_col gps_click'
                                            data-latitude='${common.get_null_or_value(log.gps_latitude)}'
                                            data-longitude='${common.get_null_or_value(log.gps_longitude)}'>
                                            ${common.get_null_or_value(log.gps_longitude)}
                                        </div>
                                        <div class='list_connected_col common_wide_list_column'>
                                            ${common.get_null_or_value(show_user_agent(log.user_agent))}
                                        </div>
                                        <div class='list_connected_col chat_click' data-id='${log.id}'>
                                            ${common.ICONS.app_chat}
                                        </div>
                                    </div>`;
                            break;
                        }
                        case 'list_app_log':{
                            html += `<div class='list_app_log_row'>
                                        <div class='list_app_log_col'>
                                            ${log.id}
                                        </div>
                                        <div class='list_app_log_col'>
                                            ${log.date_created}
                                        </div>
                                        <div class='list_app_log_col common_wide_list_column'>
                                            ${log.server_http_host}
                                        </div>
                                        <div class='list_app_log_col'>
                                            ${log.app_id}
                                        </div>
                                        <div class='list_app_log_col'>
                                            ${log.app_module}
                                        </div>
                                        <div class='list_app_log_col'>
                                            ${log.app_module_type}
                                        </div>
                                        <div class='list_app_log_col common_wide_list_column'>
                                            ${log.app_module_request}
                                        </div>
                                        <div class='list_app_log_col common_wide_list_column'>
                                            ${log.app_module_result}
                                        </div>
                                        <div class='list_app_log_col'>
                                            ${log.app_user_id}
                                        </div>
                                        <div class='list_app_log_col'>
                                            ${log.server_remote_addr.replace('::ffff:','')}
                                        </div>
                                        <div class='list_app_log_col gps_click'
                                            data-latitude='${common.get_null_or_value(log.client_latitude)}'
                                            data-longitude='${common.get_null_or_value(log.client_longitude)}'>
                                            ${common.get_null_or_value(log.client_latitude)}
                                        </div>
                                        <div class='list_app_log_col gps_click'
                                            data-latitude='${common.get_null_or_value(log.client_latitude)}'
                                            data-longitude='${common.get_null_or_value(log.client_longitude)}'>>
                                            ${common.get_null_or_value(log.client_longitude)}
                                        </div>
                                        <div class='list_app_log_col common_wide_list_column'>
                                            ${log.user_language}
                                        </div>
                                        <div class='list_app_log_col common_wide_list_column'>
                                            ${log.user_timezone}
                                        </div>
                                        <div class='list_app_log_col common_wide_list_column'>
                                            ${log.user_number_system}
                                        </div>
                                        <div class='list_app_log_col common_wide_list_column'>
                                            ${log.user_platform}
                                        </div>
                                        <div class='list_app_log_col common_wide_list_column'>
                                            ${log.server_user_agent}
                                        </div>
                                        <div class='list_app_log_col common_wide_list_column'>
                                            ${log.server_http_accept_language}
                                        </div>
                                    </div>`;
                            break;
                        }
                        case 'list_server_log':{
                            //test if JSON in logtext
                            if (typeof log.logtext === 'object')
                                log.logtext = JSON.stringify(log.logtext);
                            switch (logscope){
                                case 'REQUEST':{
                                    html += 
                                            `<div class='list_server_log_row'>
                                                <div class='list_request_log_col'>
                                                    ${log.logdate}
                                                </div>
                                                <div class='list_request_log_col common_wide_list_column'>
                                                    ${log.host}
                                                </div>
                                                <div class='list_request_log_col gps_click' data-ip='${log.ip==''?'':log.ip.replace('::ffff:','')}'>
                                                    ${log.ip==''?'':log.ip.replace('::ffff:','')}
                                                </div>
                                                <div class='list_request_log_col'>
                                                    ${log.requestid}
                                                </div>
                                                <div class='list_request_log_col'>
                                                    ${log.correlationid}
                                                </div>
                                                <div class='list_request_log_col common_wide_list_column'>
                                                    ${log.url}
                                                </div>
                                                <div class='list_request_log_col'>
                                                    ${log.http_info}
                                                </div>
                                                <div class='list_request_log_col'>
                                                    ${log.method}
                                                </div>
                                                <div class='list_request_log_col'>
                                                    ${log.statusCode}
                                                </div>
                                                <div class='list_request_log_col common_wide_list_column'>
                                                    ${log.statusMessage}
                                                </div>
                                                <div class='list_request_log_col common_wide_list_column'>
                                                    ${log['user-agent']}
                                                </div>
                                                <div class='list_request_log_col common_wide_list_column'>
                                                    ${log['accept-language']}
                                                </div>
                                                <div class='list_request_log_col common_wide_list_column'>
                                                    ${log.referer}
                                                </div>
                                                <div class='list_request_log_col'>
                                                    ${log.size_received}
                                                </div>
                                                <div class='list_request_log_col'>
                                                    ${log.size_sent}
                                                </div>
                                                <div class='list_request_log_col'>
                                                    ${roundOff(log.responsetime)}
                                                </div>
                                                <div class='list_request_log_col common_wide_list_column'>
                                                    ${log.logtext}
                                                </div>
                                            </div>`;
                                    break;
                                }
                                case 'SERVER':{
                                    html += 
                                            `<div class='list_server_log_row'>
                                                <div class='list_server_log_col'>
                                                    ${log.logdate}
                                                </div>
                                                <div class='list_server_log_col'>
                                                    ${log.logtext}
                                                </div>
                                            </div>`;
                                    break;
                                }
                                case 'APP':{
                                    html += 
                                            `<div class='list_server_log_row'>
                                                <div class='list_server_app_log_col'>
                                                    ${log.logdate}
                                                </div>
                                                <div class='list_server_app_log_col'>
                                                    ${log.app_id}
                                                </div>
                                                <div class='list_server_app_log_col common_wide_list_column'>
                                                    ${log.app_filename}
                                                </div>
                                                <div class='list_server_app_log_col common_wide_list_column'>
                                                    ${log.app_function_name}
                                                </div>
                                                <div class='list_server_app_log_col'>
                                                    ${log.app_app_line}
                                                </div>
                                                <div class='list_server_app_log_col common_wide_list_column'>
                                                    ${log.logtext}
                                                </div>
                                            </div>`;
                                    break;
                                }
                                case 'SERVICE':{
                                    html += 
                                            `<div class='list_server_log_row'>
                                                <div class='list_service_log_col'>
                                                    ${log.logdate}
                                                </div>
                                                <div class='list_service_log_col'>
                                                    ${log.app_id}
                                                </div>
                                                <div class='list_service_log_col'>
                                                    ${log.service}
                                                </div>
                                                <div class='list_service_log_col common_wide_list_column'>
                                                    ${log.parameters}
                                                </div>
                                                <div class='list_service_log_col common_wide_list_column'>
                                                    ${log.logtext}
                                                </div>
                                            </div>`;
                                    break;
                                }
                                case 'DB':{
                                    html += 
                                            `<div class='list_server_log_row'>
                                                <div class='list_db_log_col'>
                                                    ${log.logdate}
                                                </div>
                                                <div class='list_db_log_col'>
                                                    ${log.app_id}
                                                </div>
                                                <div class='list_db_log_col'>
                                                    ${log.db}
                                                </div>
                                                <div class='list_db_log_col common_wide_list_column'>
                                                    ${log.sql}
                                                </div>
                                                <div class='list_db_log_col common_wide_list_column'>
                                                    ${log.parameters}
                                                </div>
                                                <div class='list_db_log_col common_wide_list_column'>
                                                    ${log.logtext}
                                                </div>
                                            </div>`;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                document.querySelector('#' + list_div).innerHTML = html;
                document.querySelector(`#${list_div} .list_title[data-column='${sort}']`).classList.add(order_by);
            }  
        })
        .catch(()=>document.querySelector('#' + list_div).innerHTML = '');   
    }
};
const show_connected = async (sort='connection_date', order_by='desc') => {
    const app_id = document.querySelector('#select_app_menu5_list_connected').options[document.querySelector('#select_app_menu5_list_connected').selectedIndex].value;
    const year = document.querySelector('#select_year_menu5_list_connected').value;
    const month = document.querySelector('#select_month_menu5_list_connected').value;
    show_list('list_connected', 
              `select_app_id=${app_id}&year=${year}&month=${month}&sort=${sort}&order_by=${order_by}&limit=${APP_GLOBAL.limit}`, 
              sort,
              order_by);
};    

const show_app_log = async (sort='id', order_by='desc', offset=0, limit=APP_GLOBAL.limit) => {
    const app_id = document.querySelector('#select_app_menu5_app_log').options[document.querySelector('#select_app_menu5_app_log').selectedIndex].value;
    const year = document.querySelector('#select_year_menu5_app_log').value;
    const month = document.querySelector('#select_month_menu5_app_log').value;
    show_list('list_app_log', 
              `select_app_id=${app_id}&year=${year}&month=${month}&sort=${sort}&order_by=${order_by}&offset=${offset}&limit=${limit}`, 
              sort,
              order_by);
}; 
const get_sort = (order_by=0) => {
    const sort = '';
    for (const col_title of document.querySelectorAll('#list_app_log_row_title > div')){
        if (col_title.classList.contains('asc'))
            if (order_by==0)
                return col_title.id.substring(col_title.id.indexOf('col_title_')+'col_title_'.length);
            else
                return 'asc';
        if (col_title.classList.contains('desc'))
            if (order_by==0)
                return col_title.id.substring(col_title.id.indexOf('col_title_')+'col_title_'.length);
            else
                return 'desc';
    }
    return sort;
};
  
const list_sort_click = (list, sortcolumn, order_by) => {
    switch (list){
        case 'list_app_log':{
            show_app_log(sortcolumn, order_by);    
            break;
        }
        case 'list_connected':{
            show_connected(sortcolumn, order_by);
            break;
        }
        case 'list_server_log':{
            show_server_logs(sortcolumn, order_by, document.querySelector('#list_server_log_search_input').innerText);
            break;
        }
        case 'list_user_account':{
            search_users(sortcolumn, order_by);
            break;
        }
    }
};
const page_navigation = (item) => {
    
    let sort = get_sort();
    const order_by = get_sort(1);
    if (sort =='')
        sort = 'id';
    switch (item){
        case 'list_app_log_first':{
            APP_GLOBAL.page = 0;
            show_app_log(sort, order_by, 0,APP_GLOBAL.limit);
            break;
        }
        case 'list_app_log_previous':{
            APP_GLOBAL.page = APP_GLOBAL.page - APP_GLOBAL.limit;
            if (APP_GLOBAL.page - APP_GLOBAL.limit < 0)
                APP_GLOBAL.page = 0;
            else
                APP_GLOBAL.page = APP_GLOBAL.page - APP_GLOBAL.limit;
            show_app_log(sort, order_by, APP_GLOBAL.page, APP_GLOBAL.limit);
            break;
        }
        case 'list_app_log_next':{
            if (APP_GLOBAL.page + APP_GLOBAL.limit > APP_GLOBAL.page_last)
                APP_GLOBAL.page = APP_GLOBAL.page_last;
            else
                APP_GLOBAL.page = APP_GLOBAL.page + APP_GLOBAL.limit;
            show_app_log(sort, order_by, APP_GLOBAL.page, APP_GLOBAL.limit);
            break;
        }
        case 'list_app_log_last':{
            APP_GLOBAL.page = APP_GLOBAL.page_last;
            show_app_log(sort, order_by, APP_GLOBAL.page, APP_GLOBAL.limit);
            break;
        }
    }
};
const list_item_click = (item_type, data) => {
    let path;
    let tokentype;
    //check if gps_click and if not system admin only when map is not loaded
    if (item_type=='GPS' && common.COMMON_GLOBAL.system_admin_only != 1){
        if (data['ip']){
            //clicking on IP, get GPS, show on map
            let ip_filter='';
            //if localhost show default position
            if (data['ip'] != '::1')
                ip_filter = `ip=${data['ip']}`;
            path = `/ip?${ip_filter}`;
            if (common.COMMON_GLOBAL.system_admin!='')
                tokentype = 'SYSTEMADMIN';
            else
                tokentype = 'APP_ACCESS';
            common.FFB('GEOLOCATION', path, 'GET', tokentype, null)
            .then(result=>{
                const geodata = geodata.parse(result);
                common.map_update(  geodata.geoplugin_longitude,
                                    geodata.geoplugin_latitude,
                                    common.COMMON_GLOBAL.module_leaflet_zoom,
                                    geodata.geoplugin_city + ', ' +
                                    geodata.geoplugin_regionName + ', ' +
                                    geodata.geoplugin_countryName,
                                    null,
                                    common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                    common.COMMON_GLOBAL.module_leaflet_jumpto);
            });
        }
        else{
            //clicking on GPS, show on map
            path = `/place?latitude=${data['latitude']}&longitude=${data['longitude']}`;
            if (common.COMMON_GLOBAL.system_admin!='')
                tokentype = 'SYSTEMADMIN';
            else
                tokentype = 'APP_ACCESS';
            common.FFB('GEOLOCATION', path, 'GET', tokentype, null)
            .then(result=>{
                const geodata = geodata.parse(result);
                common.map_update(  data['longitude'],
                                    data['iatitude'],
                                    common.COMMON_GLOBAL.module_leaflet_zoom,
                                    geodata.geoplugin_place + ', ' + 
                                    geodata.geoplugin_region + ', ' + 
                                    geodata.geoplugin_countryCode,
                                    null,
                                    common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                    common.COMMON_GLOBAL.module_leaflet_jumpto);
            });
        }
    }
    else
        if (item_type=='CHAT'){
            show_broadcast_dialogue('CHAT', data['id']);
        }
    
};
const get_server_log_parameters = async () => {
    let log_parameter;
    await common.FFB('LOG', '/log/parameters?', 'GET', 'SYSTEMADMIN', null)
    .then(result=>{
        log_parameter = JSON.parse(result);
        APP_GLOBAL.service_log_scope_request = log_parameter.SERVICE_LOG_SCOPE_REQUEST;
        APP_GLOBAL.service_log_scope_server = log_parameter.SERVICE_LOG_SCOPE_SERVER;
        APP_GLOBAL.service_log_scope_app = log_parameter.SERVICE_LOG_SCOPE_APP;
        APP_GLOBAL.service_log_scope_service = log_parameter.SERVICE_LOG_SCOPE_SERVICE;
        APP_GLOBAL.service_log_scope_db = log_parameter.SERVICE_LOG_SCOPE_DB;
        
        document.querySelector('#menu5_row_parameters_col1_1').style.display = 'none';
        document.querySelector('#menu5_row_parameters_col1_0').style.display = 'none';
        document.querySelector('#menu5_row_parameters_col2_1').style.display = 'none';
        document.querySelector('#menu5_row_parameters_col2_0').style.display = 'none';
        document.querySelector('#menu5_row_parameters_col3_1').style.display = 'none';
        document.querySelector('#menu5_row_parameters_col3_0').style.display = 'none';

        if (log_parameter.SERVICE_LOG_REQUEST_LEVEL==1 ||log_parameter.SERVICE_LOG_REQUEST_LEVEL==2)
            document.querySelector('#menu5_row_parameters_col1_1').style.display = 'inline-block';
        else
            document.querySelector('#menu5_row_parameters_col1_0').style.display = 'inline-block';
        if (log_parameter.SERVICE_LOG_SERVICE_LEVEL==1 || log_parameter.SERVICE_LOG_SERVICE_LEVEL==2)
            document.querySelector('#menu5_row_parameters_col2_1').style.display = 'inline-block';
        else
            document.querySelector('#menu5_row_parameters_col2_0').style.display = 'inline-block';
        if (log_parameter.SERVICE_LOG_DB_LEVEL==1 || log_parameter.SERVICE_LOG_DB_LEVEL==2)
            document.querySelector('#menu5_row_parameters_col3_1').style.display = 'inline-block';
        else
            document.querySelector('#menu5_row_parameters_col3_0').style.display = 'inline-block';

        APP_GLOBAL.service_log_level_verbose = log_parameter.SERVICE_LOG_LEVEL_VERBOSE;
        APP_GLOBAL.service_log_level_error = log_parameter.SERVICE_LOG_LEVEL_ERROR;
        APP_GLOBAL.service_log_level_info = log_parameter.SERVICE_LOG_LEVEL_INFO;

        APP_GLOBAL.service_log_file_interval = log_parameter.SERVICE_LOG_FILE_INTERVAL;

        let html = '';
        html +=`<option value=0 log_scope='${APP_GLOBAL.service_log_scope_request}'  log_level='${APP_GLOBAL.service_log_level_info}'>${APP_GLOBAL.service_log_scope_request} - ${APP_GLOBAL.service_log_level_info}</option>`;
        html +=`<option value=1 log_scope='${APP_GLOBAL.service_log_scope_request}'  log_level='${APP_GLOBAL.service_log_level_error}'>${APP_GLOBAL.service_log_scope_request} - ${APP_GLOBAL.service_log_level_error}</option>`;
        html +=`<option value=2 log_scope='${APP_GLOBAL.service_log_scope_request}'  log_level='${APP_GLOBAL.service_log_level_verbose}'>${APP_GLOBAL.service_log_scope_request} - ${APP_GLOBAL.service_log_level_verbose}</option>`;
        html +=`<option value=3 log_scope='${APP_GLOBAL.service_log_scope_server}'   log_level='${APP_GLOBAL.service_log_level_info}'>${APP_GLOBAL.service_log_scope_server} - ${APP_GLOBAL.service_log_level_info}</option>`;
        html +=`<option value=4 log_scope='${APP_GLOBAL.service_log_scope_server}'   log_level='${APP_GLOBAL.service_log_level_error}'>${APP_GLOBAL.service_log_scope_server} - ${APP_GLOBAL.service_log_level_error}</option>`;
        html +=`<option value=5 log_scope='${APP_GLOBAL.service_log_scope_app}'      log_level='${APP_GLOBAL.service_log_level_info}'>${APP_GLOBAL.service_log_scope_app} - ${APP_GLOBAL.service_log_level_info}</option>`;
        html +=`<option value=6 log_scope='${APP_GLOBAL.service_log_scope_app}'      log_level='${APP_GLOBAL.service_log_level_error}'>${APP_GLOBAL.service_log_scope_app} - ${APP_GLOBAL.service_log_level_error}</option>`;
        html +=`<option value=7 log_scope='${APP_GLOBAL.service_log_scope_service}'  log_level='${APP_GLOBAL.service_log_level_info}'>${APP_GLOBAL.service_log_scope_service} - ${APP_GLOBAL.service_log_level_info}</option>`;
        html +=`<option value=8 log_scope='${APP_GLOBAL.service_log_scope_service}'  log_level='${APP_GLOBAL.service_log_level_error}'>${APP_GLOBAL.service_log_scope_service} - ${APP_GLOBAL.service_log_level_error}</option>`;
        html +=`<option value=9 log_scope='${APP_GLOBAL.service_log_scope_db}'       log_level='${APP_GLOBAL.service_log_level_info}'>${APP_GLOBAL.service_log_scope_db} - ${APP_GLOBAL.service_log_level_info}</option>`;
        html +=`<option value=10 log_scope='${APP_GLOBAL.service_log_scope_db}'      log_level='${APP_GLOBAL.service_log_level_error}'>${APP_GLOBAL.service_log_scope_db} - ${APP_GLOBAL.service_log_level_error}</option>`;

        
        document.querySelector('#select_logscope5').innerHTML = html;

        if (APP_GLOBAL.service_log_file_interval=='1M')
            document.querySelector('#select_day_menu5').style.display = 'none';
        else
            document.querySelector('#select_day_menu5').style.display = 'inline-block';
    });
};
const show_server_logs = (sort='logdate', order_by='desc', search=null) => {
    if (search != null){
        if (common.check_input(document.querySelector('#list_server_log_search_input').innerText, 100, false) == false)
            return null;
    }
    const logscope = document.querySelector('#select_logscope5')[document.querySelector('#select_logscope5').selectedIndex].getAttribute('log_scope');
    const loglevel = document.querySelector('#select_logscope5')[document.querySelector('#select_logscope5').selectedIndex].getAttribute('log_level');
    const year = document.querySelector('#select_year_menu5').value;
    const month= document.querySelector('#select_month_menu5').value;
    const day  = document.querySelector('#select_day_menu5').value;
    let app_id_filter='';
    if (logscope=='APP' || logscope=='SERVICE' || logscope=='DB'){
        //show app filter and use it
        document.querySelector('#select_app_menu5').style.display = 'inline-block';
        app_id_filter = `select_app_id=${document.querySelector('#select_app_menu5').options[document.querySelector('#select_app_menu5').selectedIndex].value}&`;
    }
    else{
        //no app filter for request
        document.querySelector('#select_app_menu5').style.display = 'none';
        app_id_filter = 'select_app_id=&';
    }
    let url_parameters;
    search=encodeURI(search);
    if (APP_GLOBAL.service_log_file_interval=='1M')
        url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}&search=${search}`;
    else
        url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}&day=${day}&search=${search}`;
    show_list('list_server_log', 
              `${url_parameters}&sort=${sort}&order_by=${order_by}`,
              sort,
              order_by);
};
const show_existing_logfiles = () => {
    if (admin_token_has_value()){
        const function_event = (event) => {                    
                                //format: 'LOGSCOPE_LOGLEVEL_20220101.log'
                                //logscope and loglevel
                                let filename;
                                filename = common.element_row(event.target).getAttribute('data-value');
                                const logscope = filename.substring(0,filename.indexOf('_'));
                                filename = filename.substring(filename.indexOf('_')+1);
                                const loglevel = filename.substring(0,filename.indexOf('_'));
                                filename = filename.substring(filename.indexOf('_')+1);
                                const year     = parseInt(filename.substring(0, 4));
                                const month    = parseInt(filename.substring(4, 6));
                                const day      = parseInt(filename.substring(6, 8));
                                const setlogscopelevel = (select, logscope, loglevel) =>{
                                    for (let i = 0; i < select.options.length; i++) {
                                        if (select[i].getAttribute('log_scope') == logscope &&
                                            select[i].getAttribute('log_level') == loglevel) {
                                            select.selectedIndex = i;
                                            return null;
                                        }
                                    }
                                };
                                setlogscopelevel(document.querySelector('#select_logscope5'),
                                                logscope, 
                                                loglevel);
                                //year
                                document.querySelector('#select_year_menu5').value = year;
                                //month
                                document.querySelector('#select_month_menu5').value = month;
                                //day if applicable
                                if (APP_GLOBAL.service_log_file_interval=='1D')
                                    document.querySelector('#select_day_menu5').value = day;

                                nav_click(document.querySelector('#list_server_log_title').id);
                                common.lov_close();
                            };
        common.lov_show('SERVER_LOG_FILES', function_event);
    }
};
/*----------------------- */
/* SERVER CONFIG          */
/*----------------------- */
const show_server_config = () =>{
    document.querySelector('#menu_6_content').innerHTML = 
        `<div id='menu_6_content_widget1' class='widget'>
            <div id='list_config_nav' class='list_nav'>
                <div id='list_config_nav_config'        class='list_nav_list'><div id='list_config_server_title' class='list_button' >${common.ICONS.app_server}</div></div>
                <div id='list_config_nav_iam_blockip'   class='list_nav_list'><div id='list_config_blockip_title' class='list_button' >${common.ICONS.app_internet + common.ICONS.app_shield + common.ICONS.regional_numbersystem}</div></div>
                <div id='list_config_nav_iam_useragent' class='list_nav_list'><div id='list_config_useragent_title' class='list_button' >${common.ICONS.app_internet + common.ICONS.app_shield + common.ICONS.app_browser}</div></div>
                <div id='list_config_nav_iam_policy'    class='list_nav_list'><div id='list_config_policy_title' class='list_button' >${common.ICONS.app_internet + common.ICONS.app_shield + common.ICONS.misc_book}</div></div>
            </div>
            <div id='list_config' class='common_list_scrollbar'></div>
            <div id='list_config_edit'></div>
            <div id='config_buttons' class="save_buttons">
                <div id='config_save' class='common_dialogue_button button_save' >${common.ICONS.app_save}</div>
            </div>
        </div>`;
    

    nav_click(document.querySelector('#list_config_server_title').id);
};
const show_config = async (file) => {
    document.querySelector('#list_config').innerHTML = common.APP_SPINNER;
    await common.FFB('SERVER', `/config/systemadmin/saved?file=${file}`, 'GET', 'SYSTEMADMIN', null)
    .then(result=>{
        const config = JSON.parse(result);
        let i = 0;
        document.querySelector('#list_config_edit').contentEditable = true;
        switch (file){
            case 'CONFIG':{
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
                //first 5 attributes in config json contains array of parameter records
                //metadata is saved last in config
                for (let i_group = 0; i_group <= 4;i_group++){
                    html += 
                    `<div id='list_config_row_${i_group}' class='list_config_row list_config_group' >
                        <div class='list_config_col list_config_group_title'>
                            <div class='list_readonly'>${Object.keys(config)[i_group]}</div>
                        </div>`;
                        for (let j = 0; j < config[Object.keys(config)[i_group]].length; j++) {
                            i++;
                            html += 
                            `<div id='list_config_row_${i}' class='list_config_row' >
                                <div class='list_config_col'>
                                    <div class='list_readonly'>${Object.keys(config[Object.keys(config)[i_group]][j])[0]}</div>
                                </div>
                                <div class='list_config_col'>
                                    <div contenteditable=true class='common_input list_edit'/>${Object.values(config[Object.keys(config)[i_group]][j])[0]}</div>
                                </div>
                                <div class='list_config_col'>
                                    <div class='list_readonly'>${Object.values(config[Object.keys(config)[i_group]][j])[1]}</div>
                                </div>
                            </div>`;
                        }    
                    html += '</div>';
                    
                }
                document.querySelector('#list_config_edit').innerHTML = '';
                document.querySelector('#list_config_edit').style.display = 'none';
                document.querySelector('#list_config').style.display = 'flex';
                document.querySelector('#list_config').innerHTML = html;
                
                //set focus first column in first row
                document.querySelectorAll('#list_config .list_edit')[0].focus();
                break;
            }
            default:{
                document.querySelector('#list_config').innerHTML = '';
                document.querySelector('#list_config').style.display = 'none';
                document.querySelector('#list_config_edit').style.display = 'flex';
                document.querySelector('#list_config_edit').innerHTML = JSON.stringify(config, undefined, 2);
                break;
            }
        }
    })
    .catch(()=>document.querySelector('#list_config').innerHTML = '');
};
/*----------------------- */
/* INSTALLATION           */
/*----------------------- */
const db_install = () =>{
    document.querySelector('#common_dialogue_message').style.visibility = 'hidden';
    const old_html = document.querySelector('#install_db_button_install').innerHTML;
    document.querySelector('#install_db_button_install').innerHTML = common.APP_SPINNER;
    const path = `/systemadmin/install?client_id=${common.COMMON_GLOBAL.service_socket_client_ID}&optional=${Number(document.querySelector('#install_db_country_language_translations').classList.contains('checked'))}`;
    common.FFB('DB_API', path, 'POST', 'SYSTEMADMIN', null)
    .then(result=>{
        document.querySelector('#install_db_icon').classList.add('installed');
        common.show_message('LOG', null, null, common.show_message_info_list(JSON.parse(result).info), common.COMMON_GLOBAL.common_app_id);
    })
    .finally(()=>document.querySelector('#install_db_button_install').innerHTML = old_html);
};
const db_uninstall = () =>{
    document.querySelector('#common_dialogue_message').style.visibility = 'hidden';
    const old_html = document.querySelector('#install_db_button_uninstall').innerHTML;
    document.querySelector('#install_db_button_uninstall').innerHTML = common.APP_SPINNER;
    common.FFB('DB_API', `/systemadmin/install?client_id=${common.COMMON_GLOBAL.service_socket_client_ID}`, 'DELETE', 'SYSTEMADMIN', null)
    .then(result=>{
        document.querySelector('#install_db_icon').classList.remove('installed');
        common.show_message('LOG', null, null, common.show_message_info_list(JSON.parse(result).info), common.COMMON_GLOBAL.common_app_id);
    })
    .finally(()=>document.querySelector('#install_db_button_install').innerHTML = old_html);
};
const demo_install = () =>{
    if (document.querySelector('#install_demo_password').innerHTML == '') {
        common.show_message('INFO', null, null, common.ICONS.user_password + ' ' + common.ICONS.message_text, common.COMMON_GLOBAL.common_app_id);
    }
    else{
        const json_data = {demo_password: document.querySelector('#install_demo_password').innerHTML};
        const old_html = document.querySelector('#install_demo_button_install').innerHTML;
        document.querySelector('#install_demo_button_install').innerHTML = common.APP_SPINNER;
        common.FFB('DB_API', `/admin/demo?client_id=${common.COMMON_GLOBAL.service_socket_client_ID}`, 'POST', 'APP_ACCESS', json_data)
        .then(result=>{
            common.show_message('LOG', null, null, common.show_message_info_list(JSON.parse(result).info), common.COMMON_GLOBAL.common_app_id);
        })
        .finally(()=>document.querySelector('#install_demo_button_install').innerHTML = old_html);
    }

};
const demo_uninstall = () =>{
    const old_html = document.querySelector('#install_demo_button_uninstall').innerHTML;
    document.querySelector('#install_demo_button_uninstall').innerHTML = common.APP_SPINNER;
    common.FFB('DB_API', `/admin/demo?client_id=${common.COMMON_GLOBAL.service_socket_client_ID}`, 'DELETE', 'APP_ACCESS', null)
    .then(result=>{
        common.show_message('LOG', null, null, common.show_message_info_list(JSON.parse(result).info), common.COMMON_GLOBAL.common_app_id);
    })
    .finally(()=>document.querySelector('#install_demo_button_install').innerHTML = old_html);
};
const show_installation = () =>{
    document.querySelector('#menu_7_content').innerHTML = common.APP_SPINNER;    
    if (common.COMMON_GLOBAL.system_admin!=''){
        common.FFB('DB_API', '/systemadmin/install?', 'GET', 'SYSTEMADMIN', null)
        .then(result=>{
            document.querySelector('#menu_7_content').innerHTML =
            `<div id='menu_7_content_widget1' class='widget'>
                <div id='install_db'>
                    <div id='install_db_icon'>${common.ICONS.app_database}</div>
                    <div id='install_db_button_row'>
                        <div id='install_db_button_install' class='common_dialogue_button'>${common.ICONS.app_add}</div>
                        <div id='install_db_button_uninstall' class='common_dialogue_button'>${common.ICONS.app_delete}</div>
                    </div>
                    <div id='install_db_input'>
                        <div id="install_db_country_language_translations_icon" >${common.ICONS.gps_country + common.ICONS.regional_locale}</div>
                        <div id='install_db_country_language_translations' class='common_switch'></div>
                    </div>
                </div>
            </div>`;
            document.querySelector('#install_db_icon').classList.remove('installed');
            if (JSON.parse(result)[0].installed == 1)
                document.querySelector('#install_db_icon').classList.add('installed');
            })
        .catch(()=>document.querySelector('#menu_7_content').innerHTML = '');
    }
    else{
        document.querySelector('#menu_7_content').innerHTML =
            `<div id='menu_7_content_widget2' class='widget'>
                <div id='install_demo'>
                    <div id='install_demo_demo_users_icon'>${common.ICONS.app_users}</div>
                    <div id='install_demo_button_row'>
                        <div id='install_demo_button_install' class='common_dialogue_button'>${common.ICONS.app_add}</div>
                        <div id='install_demo_button_uninstall' class='common_dialogue_button'>${common.ICONS.app_delete}</div>
                    </div>
                    <div id='install_demo_input'>
                        <div id="install_demo_password_icon" >${common.ICONS.user_password}</div>
                        <div class='common_password_container common_input'>
                                <div id='install_demo_password' contenteditable=true class='common_input common_password'></div>
                                <div id='install_demo_password_mask' class='common_input common_password_mask'/></div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
};
/*----------------------- */
/* DB INFO                */
/*----------------------- */
const show_db_info = async () => {
    if (admin_token_has_value()){
        const size = '(Mb)';

        document.querySelector('#menu_8_content').innerHTML = common.APP_SPINNER;
        await common.FFB('DB_API', '/systemadmin/DBInfo?', 'GET', 'SYSTEMADMIN', null)
        .then(result=>{
            const database = JSON.parse(result)[0];
            document.querySelector('#menu_8_content').innerHTML = 
                `<div id='menu_8_content_widget1' class='widget'>
                    <div id='menu_8_db_info1'>
                        <div id='menu_8_db_info_database_title'>${common.ICONS.app_database + common.ICONS.regional_numbersystem}</div><div id='menu_8_db_info_database_data'>${database.database_use}</div>
                        <div id='menu_8_db_info_name_title'>${common.ICONS.app_database}</div><div id='menu_8_db_info_name_data'>${database.database_name}</div>
                        <div id='menu_8_db_info_version_title'>${common.ICONS.app_database + common.ICONS.regional_numbersystem + common.ICONS.app_info}</div><div id='menu_8_db_info_version_data'>${database.version}</div>
                        <div id='menu_8_db_info_database_schema_title'>${common.ICONS.app_database + common.ICONS.app_database_schema}</div><div id='menu_8_db_info_database_schema_data'>${database.database_schema}</div>
                        <div id='menu_8_db_info_host_title'>${common.ICONS.app_server}</div><div id='menu_8_db_info_host_data'>${database.hostname}</div>
                        <div id='menu_8_db_info_connections_title'>${common.ICONS.app_user_connections}</div><div id='menu_8_db_info_connections_data'>${database.connections}</div>
                        <div id='menu_8_db_info_started_title'>${common.ICONS.app_database_started}</div><div id='menu_8_db_info_started_data'>${database.started}</div>
                    </div>
                </div>
                <div id='menu_8_content_widget2' class='widget'>
                    <div>
                        <div id='menu_8_db_info_space_title'>${common.ICONS.app_database + common.ICONS.app_database_calc}</div>
                    </div>
                    <div id='menu_8_db_info_space_detail' class='common_list_scrollbar'></div>
                </div>`;
                document.querySelector('#menu_8_db_info_space_detail').innerHTML = common.APP_SPINNER;
                common.FFB('DB_API', '/systemadmin/DBInfoSpace?', 'GET', 'SYSTEMADMIN', null)
                .then(result=>{
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
                    let i=0;
                    for (const databaseInfoSpaceTable of JSON.parse(result)) {
                        html += 
                        `<div id='menu_8_db_info_space_detail_row_${i}' class='menu_8_db_info_space_detail_row' >
                            <div class='menu_8_db_info_space_detail_col'>
                                <div>${databaseInfoSpaceTable.table_name}</div>
                            </div>
                            <div class='menu_8_db_info_space_detail_col'>
                                <div>${roundOff(databaseInfoSpaceTable.total_size)}</div>
                            </div>
                            <div class='menu_8_db_info_space_detail_col'>
                                <div>${roundOff(databaseInfoSpaceTable.data_used)}</div>
                            </div>
                            <div class='menu_8_db_info_space_detail_col'>
                                <div>${roundOff(databaseInfoSpaceTable.data_free)}</div>
                            </div>
                            <div class='menu_8_db_info_space_detail_col'>
                                <div>${roundOff(databaseInfoSpaceTable.pct_used)}</div>
                            </div>
                        </div>`;
                        i=0;
                    }
                    document.querySelector('#menu_8_db_info_space_detail').innerHTML = html;
                    common.FFB('DB_API', '/systemadmin/DBInfoSpaceSum?', 'GET', 'SYSTEMADMIN', null)
                    .then(result=>{
                        const databaseInfoSpaceSum = JSON.parse(result)[0];
                        document.querySelector('#menu_8_db_info_space_detail').innerHTML += 
                            `<div id='menu_8_db_info_space_detail_row_total' class='menu_8_db_info_space_detail_row' >
                                <div class='menu_8_db_info_space_detail_col'>
                                    <div>${common.ICONS.app_sum}</div>
                                </div>
                                <div class='menu_8_db_info_space_detail_col'>
                                    <div>${roundOff(databaseInfoSpaceSum.total_size)}</div>
                                </div>
                                <div class='menu_8_db_info_space_detail_col'>
                                    <div>${roundOff(databaseInfoSpaceSum.data_used)}</div>
                                </div>
                                <div class='menu_8_db_info_space_detail_col'>
                                    <div>${roundOff(databaseInfoSpaceSum.data_free)}</div>
                                </div>
                                <div class='menu_8_db_info_space_detail_col'>
                                    <div>${roundOff(databaseInfoSpaceSum.pct_used)}</div>
                                </div>
                            </div>`;
                    });
                })
                .catch(()=>document.querySelector('#menu_8_db_info_space_detail').innerHTML = '');
        })
        .catch(()=>document.querySelector('#menu_8_content').innerHTML = '');
    }
};
/*----------------------- */
/* SERVER                 */
/*----------------------- */
const show_server_info = async () => {
    if (admin_token_has_value()){
        await common.FFB('SERVER', '/info?', 'GET', 'SYSTEMADMIN', null)
        .then(result=>{
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
            };
            const server_info = JSON.parse(result);
            document.querySelector('#menu_10_content').innerHTML = 
                `<div id='menu_10_content_widget1' class='widget'>
                    <div id='menu_10_os_title'>${common.ICONS.app_server}</div>
                    <div id='menu_10_os_info'>
                        <div id='menu_10_os_info_hostname_title'>${'HOSTNAME'}</div><div id='menu_10_os_info_hostname_data'>${server_info.os.hostname}</div>
                        <div id='menu_10_os_info_cpus_title'>${'CPUS'}</div><div id='menu_10_os_info_cpus_data'>${server_info.os.cpus.length}</div>
                        <div id='menu_10_os_info_arch_title'>${'ARCH'}</div><div id='menu_10_os_info_arch_data'>${server_info.os.arch}</div>
                        <div id='menu_10_os_info_freemem_title'>${'FREEMEM'}</div><div id='menu_10_os_info_freemem_data'>${server_info.os.freemem}</div>
                        <div id='menu_10_os_info_totalmem_title'>${'TOTALMEM'}</div><div id='menu_10_os_info_totalmem_data'>${server_info.os.totalmem}</div>
                        <div id='menu_10_os_info_platform_title'>${'PLATFORM'}</div><div id='menu_10_os_info_platform_data'>${server_info.os.platform}</div>
                        <div id='menu_10_os_info_type_title'>${'TYPE'}</div><div id='menu_10_os_info_type_data'>${server_info.os.type}</div>
                        <div id='menu_10_os_info_release_title'>${'RELEASE'}</div><div id='menu_10_os_info_release_data'>${server_info.os.release}</div>
                        <div id='menu_10_os_info_version_title'>${'VERSION'}</div><div id='menu_10_os_info_version_data'>${server_info.os.version}</div>
                        <div id='menu_10_os_info_uptime_title'>${'UPTIME'}</div><div id='menu_10_os_info_uptime_data'>${seconds_to_time(server_info.os.uptime)}</div>
                        <div id='menu_10_os_info_homedir_title'>${'HOMEDIR'}</div><div id='menu_10_os_info_homedir_data'>${server_info.os.homedir}</div>
                        <div id='menu_10_os_info_tmpdir_title'>${'TMPDIR'}</div><div id='menu_10_os_info_tmpdir_data'>${server_info.os.tmpdir}</div>
                        <div id='menu_10_os_info_userinfo_username_title'>${'USERNAME'}</div><div id='menu_10_os_info_userinfo_username_data'>${server_info.os.userinfo.username}</div>
                        <div id='menu_10_os_info_userinfo_homedir_title'>${'USER HOMEDIR'}</div><div id='menu_10_os_info_userinfo_homedir_data'>${server_info.os.userinfo.homedir}</div>
                    </div>
                </div>
                <div id='menu_10_content_widget2' class='widget'>
                    <div id='menu_10_process_title'>${common.ICONS.app_server + ' ' + common.ICONS.app_apps}</div>
                    <div id='menu_10_process_info'>
                        <div id='menu_10_process_info_memoryusage_rss_title'>${'MEMORY RSS'}</div><div id='menu_10_process_info_memoryusage_rss_data'>${server_info.process.memoryusage_rss}</div>
                        <div id='menu_10_process_info_memoryusage_heaptotal_title'>${'MEMORY HEAPTOTAL'}</div><div id='menu_10_process_info_memoryusage_heaptotal_data'>${server_info.process.memoryusage_heaptotal}</div>
                        <div id='menu_10_process_info_memoryusage_heapused_title'>${'MEMORY HEAPUSED'}</div><div id='menu_10_process_info_memoryusage_heapused_data'>${server_info.process.memoryusage_heapused}</div>
                        <div id='menu_10_process_info_memoryusage_external_title'>${'MEMORY EXTERNAL'}</div><div id='menu_10_process_info_memoryusage_external_data'>${server_info.process.memoryusage_external}</div>
                        <div id='menu_10_process_info_memoryusage_arraybuffers_title'>${'MEMORY ARRAYBUFFERS'}</div><div id='menu_10_process_info_memoryusage_arraybuffers_data'>${server_info.process.memoryusage_arraybuffers}</div>
                        <div id='menu_10_process_info_uptime_title'>${'UPTIME'}</div><div id='menu_10_process_info_uptime_data'>${seconds_to_time(server_info.process.uptime)}</div>
                        <div id='menu_10_process_info_version_title'>${'NODEJS VERSION'}</div><div id='menu_10_process_info_version_data'>${server_info.process.version}</div>
                        <div id='menu_10_process_info_path_title'>${'PATH'}</div><div id='menu_10_process_info_path_data'>${server_info.process.path}</div>
                        <div id='menu_10_process_info_start_arg_0_title'>${'START ARG 0'}</div><div id='menu_10_process_info_start_arg_0_data'>${server_info.process.start_arg_0}</div>
                        <div id='menu_10_process_info_start_arg_1_title'>${'START ARG 1'}</div><div id='menu_10_process_info_start_arg_1_data'>${server_info.process.start_arg_1}</div>
                    </div>
                </div>`;
        });
    }
};
/*----------------------- */
/* INIT                   */
/*----------------------- */
const admin_token_has_value = () => {
    if (common.COMMON_GLOBAL.rest_at=='' && common.COMMON_GLOBAL.rest_admin_at =='')
        return false;
    else
        return true;
};

const app_events = (event_type, event)=> {
    const event_target_id = common.element_id(event.target);
    switch (event_type){
        case 'click':{
            switch (event_target_id){
                case 'menu_1_broadcast_button':{
                    show_broadcast_dialogue('ALL');
                    break;
                }
                case 'menu_1_checkbox_maintenance':{
                    set_maintenance();
                    break;
                }
                case 'list_user_search_icon':{
                    document.querySelector('#list_user_account_search_input').focus();
                    document.querySelector('#list_user_account_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                    break;
                }
                case 'users_save':{
                    button_save('users_save');
                    break;
                }
                case 'apps_save':{
                    button_save('apps_save');
                    break;
                }
                case 'list_server_log_search_icon':{
                    document.querySelector('#list_server_log_search_input').focus();
                    document.querySelector('#list_server_log_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                    break;
                }
                case 'list_connected_title':
                case 'list_app_log_title':
                case 'list_server_log_title':{
                    nav_click(event_target_id);    
                    break;
                }
                case 'list_app_log_first':
                case 'list_app_log_previous':
                case 'list_app_log_next':
                case 'list_app_log_last':{
                    page_navigation(event_target_id);
                    break;
                }
                case 'filesearch_menu5':{
                    show_existing_logfiles();
                    break;
                }
                case 'config_save':{
                    button_save('config_save');
                    break;
                }
                case 'list_config_server_title' :
                case 'list_config_blockip_title':
                case 'list_config_useragent_title':
                case 'list_config_policy_title':{
                    nav_click(event_target_id);
                    break;
                }
                case 'install_db_button_install':{
                    common.show_message('CONFIRM',null,db_install, null, common.COMMON_GLOBAL.app_id);
                    break;
                }
                case 'install_db_button_uninstall':{
                    common.show_message('CONFIRM',null,db_uninstall, null, common.COMMON_GLOBAL.app_id);
                    break;
                }
                case 'install_demo_button_install':{
                    demo_install();
                    break;
                }
                case 'install_demo_button_uninstall':{
                    demo_uninstall();
                    break;
                }
                //users with icons
                case event.target.parentNode.classList.contains('list_title')?event_target_id:'':{
                    if (event.target.parentNode.classList.contains('list_sort_click'))
                        list_sort_click(common.element_id(event.target.parentNode.parentNode), 
                                        event.target.parentNode.getAttribute('data-column'),
                                        event.target.parentNode.classList.contains('desc')?'asc':'desc'
                                        );
                    break;
                }
                //monitor logs no icons
                case event.target.classList.contains('list_title')?event_target_id:'':{
                    if (event.target.classList.contains('list_sort_click'))
                        list_sort_click(common.element_id(event.target.parentNode), 
                                        event.target.getAttribute('data-column'),
                                        event.target.classList.contains('desc')?'asc':'desc'
                                        );
                    break;
                }
                case event.target.classList.contains('gps_click')?event_target_id:'':{
                    list_item_click('GPS',
                                    {
                                        latitude:   event.target.getAttribute('data-latitude'),
                                        longitude:  event.target.getAttribute('data-longitude'),
                                        ip:         event.target.getAttribute('data-ip')
                                    });
                    break;
                }
                case event.target.classList.contains('chat_click')?event_target_id:'':{
                    list_item_click('CHAT', {client_id: event.target.getAttribute('data-id')});
                    break;
                }
                case event.target.parentNode.classList.contains('chat_click')?event_target_id:'':{
                    list_item_click('CHAT', {client_id: event.target.parentNode.getAttribute('data-id')});
                    break;
                }
                case 'list_apps':
                case 'list_app_parameter':
                case 'list_user_account':{
                    const lov_event = (event_lov) => {
                        //setting values from LOV
                        common.element_row(event.target).querySelector('.common_input_lov').innerHTML = common.element_row(event_lov.target).getAttribute('data-id');
                        common.element_row(event.target).querySelector('.common_input_lov').focus();
                        common.element_row(event.target).querySelector('.common_lov_value').innerHTML = common.element_row(event_lov.target).getAttribute('data-value');
                        document.querySelector('#common_lov_close').dispatchEvent(new Event('click'));
                    };
                    if (event.target.parentNode.classList.contains('common_list_lov_click')){
                        switch (event_target_id){
                            case 'list_apps':{
                                common.lov_show('APP_CATEGORY', lov_event);
                                break;
                            }
                            case 'list_app_parameter':{
                                common.lov_show('PARAMETER_TYPE', lov_event);
                                break;
                            }
                            case 'list_user_account':{
                                common.lov_show('APP_ROLE', lov_event);
                                break;
                            }
                        }
                    }
                    break;
                }        
                case 'common_lov_list':{
                    document.querySelector('#common_lov_list')['data-function'](event);
                    break;
                }
            }
            break;
        }
        case 'change':{
            switch (event_target_id){
                case 'select_system_admin_stat':
                case 'select_app_menu1':
                case 'select_year_menu1':
                case 'select_month_menu1':{
                    show_charts();
                    break;
                }

                case 'select_app_menu5_app_log':
                case 'select_year_menu5_app_log':
                case 'select_month_menu5_app_log':{
                    nav_click(document.querySelector('#list_app_log_title').id);
                    break;
                }
                case 'select_app_menu5_list_connected':
                case 'select_year_menu5_list_connected':
                case 'select_month_menu5_list_connected':{
                    nav_click(document.querySelector('#list_connected_title').id);
                    break;
                }
                case 'select_logscope5':
                case 'select_app_menu5':
                case 'select_year_menu5':
                case 'select_month_menu5':
                case 'select_day_menu5':{
                    nav_click(document.querySelector('#list_server_log_title').id);
                    break;
                }
            }            
            break;
        }
        case 'focus':{
            switch (event_target_id){
                case 'list_apps':{
                    //event on master to automatically show detail records
                    if (APP_GLOBAL.previous_row != common.element_row(event.target)){
                        APP_GLOBAL.previous_row = common.element_row(event.target);
                        show_app_parameter(common.element_row(event.target).getAttribute('data-app_id'));
                    }
                    break;
                }
                case 'list_user_account':{
                    //event on master to automatically show detail records
                    if (APP_GLOBAL.previous_row != common.element_row(event.target)){
                        APP_GLOBAL.previous_row = common.element_row(event.target);
                        show_user_account_logon(common.element_row(event.target).getAttribute('data-user_account_id'));
                    }
                    break;
                }   
            }
            break;
        }
        case 'input':{
            if (event.target.classList.contains('list_edit')){
                common.element_row(event.target).setAttribute('data-changed-record','1');
                const lov_action = (err, result, event) => {
                    if (err){
                        event.stopPropagation();
                        event.preventDefault();
                        //set old value
                        event.target.innerHTML = event.target.getAttribute('defaultValue');
                        event.target.focus();
                        event.target.nextElementSibling.dispatchEvent(new Event('click'));
                    }
                    else{
                        const list_result = JSON.parse(result);
                        if (list_result.length == 1){
                            //set lov text
                            event.target.parentNode.nextElementSibling.querySelector('.common_lov_value').innerHTML = Object.values(list_result[0])[2];
                            //set new value in defaultValue used to save old value when editing next time
                            event.target.setAttribute('defaultValue', Object.values(list_result[0])[0]);
                        }
                        else{
                            event.stopPropagation();
                            event.preventDefault();
                            //set old value
                            event.target.innerHTML = event.target.getAttribute('defaultValue');
                            event.target.focus();    
                            //dispatch click on lov button
                            event.target.nextElementSibling.dispatchEvent(new Event('click'));
                        }
                    }
                };
                //app category LOV
                if (common.element_row(event.target).classList.contains('list_apps_row') && event.target.classList.contains('common_input_lov'))
                    if (event.target.innerHTML=='')
                        event.target.parentNode.nextElementSibling.querySelector('.common_lov_value').innerHTML = '';
                    else{
                        common.FFB('DB_API', `/app_category/admin?id=${event.target.innerHTML}`, 'GET', 'APP_ACCESS', null)
                        .then(result=>lov_action(null, result, event))
                        .catch(err=>lov_action(err, null, event));
                    }
                //parameter type LOV
                if (common.element_row(event.target).classList.contains('list_app_parameter_row') && event.target.classList.contains('common_input_lov'))
                    if (event.target.innerHTML=='')
                        event.target.innerHTML = event.target.getAttribute('defaultValue');
                    else{
                        common.FFB('DB_API', `/parameter_type/admin?id=${event.target.innerHTML}`, 'GET', 'APP_ACCESS', null)
                        .then(result=>lov_action(null, result, event))
                        .catch(err=>lov_action(err, null, event));
                    }
                //app role LOV
                if (common.element_row(event.target).classList.contains('list_user_account_row') && event.target.classList.contains('common_input_lov')){
                    let app_role_id_lookup='';
                    const old_value =event.target.innerHTML;
                    //if empty then lookup default
                    if (event.target.innerHTML=='')
                        app_role_id_lookup=2;
                    else
                        app_role_id_lookup=event.target.innerHTML;
                    common.FFB('DB_API', `/app_role/admin?id=${app_role_id_lookup}`, 'GET', 'APP_ACCESS', null)
                    .then(result=>{
                        lov_action(null, result, event);
                        //if wrong value then field is empty again, fetch default value for empty app_role
                        if (old_value!='' && event.target.innerHTML=='')
                            event.target.dispatchEvent(new Event('input'));
                    })
                    .catch(err=>lov_action(err, null, event));
                }
            }
            break;
        }
        case 'keyup':{
            switch (event_target_id){
                case 'list_user_account_search_input':{
                    if (!event.code.startsWith('Arrow') && 
                        event.code != 'Home' && 
                        event.code != 'End' &&
                        event.code != 'PageUp' &&
                        event.code != 'PageDown')
                        common.typewatch(search_users, 'username', 'asc', false);
                    break;
                }
                case 'list_server_log_search_input':{
                    if (!event.code.startsWith('Arrow') && 
                        event.code != 'Home' && 
                        event.code != 'End' &&
                        event.code != 'PageUp' &&
                        event.code != 'PageDown')
                        common.typewatch(show_server_logs, 'logdate', 'desc', document.querySelector('#list_server_log_search_input').innerText);
                    break;
                }
            }
            break;
        }
        case 'keydown':{
            if (event.target.classList.contains('list_edit')){
                if (event.code=='ArrowUp') {
                    APP_GLOBAL.previous_row = common.element_row(event.target);
                    event.preventDefault();
                    //focus on first list_edit item in the row
                    if (common.element_row(event.target).previousSibling)
                        common.element_row(event.target).previousSibling.querySelectorAll('.list_edit')[0].focus();
                }
                if (event.code=='ArrowDown') {
                    APP_GLOBAL.previous_row = common.element_row(event.target);
                    event.preventDefault();
                    //focus on first list_edit item in the row
                    if (common.element_row(event.target).nextSibling)
                        common.element_row(event.target).nextSibling.querySelectorAll('.list_edit')[0].focus();       
                }
            }
            break;
        }
    }
};
const init = () => {

    //SET GLOBALS
    APP_GLOBAL.page = 0;
    APP_GLOBAL.page_last =0;
    APP_GLOBAL.previous_row= '';

    APP_GLOBAL.module_leaflet_map_container      ='mapid';

    APP_GLOBAL.service_log_scope_request= '';
    APP_GLOBAL.service_log_scope_server= '';
    APP_GLOBAL.service_log_scope_app= '';
    APP_GLOBAL.service_log_scope_service= '';
    APP_GLOBAL.service_log_scope_db= '';
    APP_GLOBAL.service_log_level_verbose= '';
    APP_GLOBAL.service_log_level_error= '';
    APP_GLOBAL.service_log_level_info= '';                
    APP_GLOBAL.service_log_file_interval= '';

    if (common.COMMON_GLOBAL.system_admin!=''){
        common.COMMON_GLOBAL.module_leaflet_style			            ='OpenStreetMap_Mapnik';
        common.COMMON_GLOBAL.module_leaflet_jumpto		                ='0';
        common.COMMON_GLOBAL.module_leaflet_popup_offset		        ='-25';
        document.querySelector('#common_confirm_question').innerHTML    = common.ICONS.app_question;
    }

    //hide all first (display none in css using eval not working)
    for (let i=1;i<=10;i++){
        document.querySelector(`#menu_${i}`).style.display='none';
    }
    if (common.COMMON_GLOBAL.system_admin!=''){
        //show DASHBOARD
        document.querySelector('#menu_1').style.display='block';
        document.querySelector('#select_broadcast_type').innerHTML = 
            `<option value='ALERT' selected='selected'>${common.ICONS.app_alert}</option>
             <option value='MAINTENANCE' selected='selected'>${common.ICONS.app_maintenance}</option>`;                 
        
        //show MONITOR (only SERVER LOG)
        document.querySelector('#menu_5').style.display='block';
        //show PARAMETER
        document.querySelector('#menu_6').style.display='block';
        //show INSTALLATION
        document.querySelector('#menu_7').style.display='block';
        //show DATABASE
        document.querySelector('#menu_8').style.display='block';
        //show BACKUP/RESTORE
        document.querySelector('#menu_9').style.display='block';
        //show SERVER
        document.querySelector('#menu_10').style.display='block';
        //start with DASHBOARD
        show_menu(1);
    }
    else{
        //show DASHBOARD
        document.querySelector('#menu_1').style.display='block';
        document.querySelector('#select_broadcast_type').innerHTML = 
            `<option value='ALERT' selected='selected'>${common.ICONS.app_alert}</option>`;
        //show USER STAT
        document.querySelector('#menu_2').style.display='block';
        //show USERS
        document.querySelector('#menu_3').style.display='block';
        //show APP ADMIN
        document.querySelector('#menu_4').style.display='block';
        //show MONITOR
        document.querySelector('#menu_5').style.display='block';
        //show INSTALLATION
        document.querySelector('#menu_7').style.display='block';
        //start with DASHBOARD
        show_menu(1);
        common.common_translate_ui(common.COMMON_GLOBAL.user_locale, ()=>{});
    }
};
export {delete_globals,fix_pagination_buttons, set_broadcast_type, sendBroadcast, closeBroadcast, show_menu, app_events, init};