/**
 * @module apps/admin/secure
 */

/**@type{import('../../../common_types.js').CommonAppDocument} */
 const CommonAppDocument = document;
/**@type{import('../../../common_types.js').CommonAppWindow} */
const CommonAppWindow = window;

const common_path ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(common_path);

/**
 * App globals
 */
const APP_GLOBAL = {
    page_navigation:(item='')=>item,
    monitor_detail_server_log:(sort='', order_by='', search='')=>{sort;order_by;search;},
    limit:0,
    previous_row:{},
    module_leaflet_map_container:'',
    service_log_file_interval:''
};
Object.seal(APP_GLOBAL);
/**
 * Set globals to null
 * @returns {void}
 */
const delete_globals = () => {
    APP_GLOBAL.previous_row = {};
    APP_GLOBAL.module_leaflet_map_container = '';
    APP_GLOBAL.service_log_file_interval = '';
};

/**
 * Rounds a number with 2 decimals
 * @param {number} num 
 * @returns number
 */
const roundOff = num => {
    const x = Math.pow(10,2);
    return Math.round(num * x) / x;
  };
/**
 * Generate given amount of options for a select element
 * @param {number} amount 
 * @returns string
 */
const list_generate = amount =>{
    let html = '';
    for (let i=1; i<=amount;i++){
        html += `<option value='${i}'>${i}</option>`;
    }
    return html;
};
/**
 * Show given menu
 * @param {number} menu 
 * @returns {void}
 */
const show_menu = menu => {
    CommonAppDocument.querySelectorAll('.menuitem').forEach((/**@type{HTMLElement}*/content) =>content.classList.remove('menuitem_selected'));
    CommonAppDocument.querySelector(`#menu_${menu}`).classList.add('menuitem_selected');
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
            common.ComponentRender('menu_content', {function_FFB:common.FFB}, '/component/menu_user_stat.js');
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
            common.ComponentRender('menu_content', {app_id:common.COMMON_GLOBAL.app_id, 
                                                    system_admin:common.COMMON_GLOBAL.system_admin, 
                                                    function_get_log_parameters:get_log_parameters,
                                                    function_nav_click:nav_click,
                                                    function_map_mount:map_mount,
                                                    function_ComponentRender:common.ComponentRender,
                                                    function_FFB:common.FFB}, '/component/menu_monitor.js')
            .then(result=>{
                APP_GLOBAL.limit = result.limit;
                nav_click('list_monitor_nav_connected');
            });
            break;
        }
        //SERVER CONFIG
        case 6:{
            common.ComponentRender('menu_content', {function_nav_click:nav_click}, '/component/menu_config.js');
            break;
        }
        //INSTALLATION
        case 7:{
            common.ComponentRender('menu_content', {system_admin:common.COMMON_GLOBAL.system_admin, function_FFB:common.FFB}, '/component/menu_installation.js');
            break;
        }
        //DATABASE
        case 8:{
            common.ComponentRender('menu_content', {function_roundOff:roundOff, function_FFB:common.FFB}, '/component/menu_db_info.js');
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
/**
 * Show charts
 * @returns{Promise.<void>}
 */
const show_charts = async () => {
    if (admin_token_has_value()){
        //chart 1 shows for all apps, app id used for chart 2
        const app_id = CommonAppDocument.querySelector('#select_app_menu1 .common_select_dropdown_value').getAttribute('data-value'); 
        const year = CommonAppDocument.querySelector('#select_year_menu1').value;
        const month = CommonAppDocument.querySelector('#select_month_menu1').value;
        const select_system_admin_stat = common.COMMON_GLOBAL.system_admin!=null?
                                            CommonAppDocument.querySelector('#select_system_admin_stat'):null;
        const system_admin_statGroup = common.COMMON_GLOBAL.system_admin!=null?
                                            select_system_admin_stat.options[select_system_admin_stat.selectedIndex].parentNode.label:null;
        const system_admin_statValues = common.COMMON_GLOBAL.system_admin!=null?
                                            { value: CommonAppDocument.querySelector('#select_system_admin_stat').value,
                                                unique:select_system_admin_stat.options[select_system_admin_stat.selectedIndex].getAttribute('unique'),
                                                statGroup:select_system_admin_stat.options[select_system_admin_stat.selectedIndex].getAttribute('statGroup')
                                            }:{value:0, unique:0, statGroup:0};

        CommonAppDocument.querySelector('#graphBox').classList.add('common_icon','css_spinner');
        CommonAppDocument.querySelector('#graphBox').innerHTML='';
        let path;
        let query;
        let authorization_type;
        if (common.COMMON_GLOBAL.system_admin!=null){
            path = '/server-log/log-stat';
            if (system_admin_statGroup=='REQUEST'){
                query = `select_app_id=${app_id}&statGroup=${system_admin_statValues.statGroup}&statValue=&unique=${system_admin_statValues.unique}&year=${year}&month=${month}`;
            }
            else
                query = `select_app_id=${app_id}&statGroup=&statValue=${system_admin_statValues.value}&unique=&year=${year}&month=${month}`;
            authorization_type = 'SYSTEMADMIN';
        }
        else{
            path = '/server-db_admin/app_data_stat-log-stat';
            query = `select_app_id=${app_id}&year=${year}&month=${month}`;
            authorization_type = 'APP_ACCESS';
        }
        //return result for both charts
        common.FFB(path, query, 'GET', authorization_type, null)
        .then((/**@type{string}*/result)=>{
            let html = '';
            /**@type{{  chart:number,
             *          app_id:number,
             *          day:number,
             *          amount:number,
             *          statValue:string}[]} */
            const charts = JSON.parse(result).rows;
            //chart 1=Piechart, 2= Barchart
            //CHART 1
            /**
             * 
             * @param {HTMLSelectElement} item 
             * @param {string} search 
             * @returns 
             */
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
                if (common.COMMON_GLOBAL.system_admin!=null)
                    if (system_admin_statGroup=='REQUEST')
                        legend_text_chart1 = stat.statValue;
                    else
                        legend_text_chart1 = SearchAndGetText(CommonAppDocument.querySelector('#select_system_admin_stat'), stat.statValue);
                else{
                    legend_text_chart1 = Array.from(CommonAppDocument.querySelectorAll('#select_app_menu1 .common_select_option')).filter(app=>parseInt(app.getAttribute('data-value'))==stat.app_id)[0].innerHTML;
                }
                    
                html += `<div class='box_legend_row'>
                            <div id='box1_legend_col1' class='box_legend_col' style='background-color:rgb(${i/chart_1.length*200},${i/chart_1.length*200},255)'></div>
                            <div id='box1_legend_col2' class='box_legend_col'>${legend_text_chart1}</div>
                        </div>`;
                degree_start = degree_start + stat.amount/sum_amount*360;
            });
            //display pie chart
            const box1_chart = `<div id='box1_pie' style='background-image:conic-gradient(${chart_colors})'></div>`;
            //show legend below chart
            const box1_legend = html;

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
            const box2_chart = `<div id='box2_bar_legendY'>
                                    <div id='box2_bar_legend_max'>${max_amount}</div>
                                    <div id='box2_bar_legend_medium'>${max_amount/2}</div>
                                    <div id='box2_bar_legend_min'>0</div>
                                </div>
                                <div id='box2_bar_data'>${html}</div>`;
            //legend below chart
            let legend_text_chart2;
            let box2_legend = '';
            if (common.COMMON_GLOBAL.system_admin!=null){
                //as system admin you can filter http codes and application
                legend_text_chart2 = CommonAppDocument.querySelector('#select_system_admin_stat').options[CommonAppDocument.querySelector('#select_system_admin_stat').selectedIndex].text;
                const legend_text_chart2_apps = CommonAppDocument.querySelector('#select_app_menu1 .common_select_dropdown_value').innerHTML;
                box2_legend = ` <div id='box2_legend_row' class='box_legend_row'>
                                    <div id='box2_legend_col1' class='box_legend_col' style='background-color:${bar_color}'></div>
                                    <div id='box2_legend_col2' class='box_legend_col'>${legend_text_chart2}</div>
                                    <div id='box2_legend_col3' class='box_legend_col' style='background-color:${bar_color}'></div>
                                    <div id='box2_legend_col4' class='box_legend_col'>${legend_text_chart2_apps}</div>
                                </div>` ;
            }
                
            else{
                // as admin you can filter application
                legend_text_chart2 = CommonAppDocument.querySelector('#select_app_menu1 .common_select_dropdown_value').innerHTML;
                box2_legend = ` <div id='box2_legend_row' class='box_legend_row'>
                                    <div id='box2_legend_col1' class='box_legend_col' style='background-color:${bar_color}'></div>
                                    <div id='box2_legend_col2' class='box_legend_col'>${legend_text_chart2}</div>
                                </div>` ;
            }
            let box_title_class;
            if (common.COMMON_GLOBAL.system_admin!=null)
                box_title_class = 'system_admin';
            else
                box_title_class = 'admin';

            CommonAppDocument.querySelector('#graphBox').innerHTML =  
                `<div id='box1'>
                    <div id='box1_title' class='box_title ${box_title_class} common_icon'></div>
                    <div id='box1_chart' class='box_chart'>${box1_chart}</div>
                    <div id='box1_legend' class='box_legend'>${box1_legend}</div>
                </div>
                <div id='box2'>
                    <div id='box2_title' class='box_title ${box_title_class} common_icon'></div>
                    <div id='box2_chart' class='box_chart'>${box2_chart}</div>
                    <div id='box2_legend' class='box_legend'>${box2_legend}</div>
                </div>`;
            CommonAppDocument.querySelector('#graphBox').classList.remove('common_icon','css_spinner');
        })
        .catch(()=>CommonAppDocument.querySelector('#graphBox').classList.remove('common_icon','css_spinner')); 
    }
};
/**
 * Show start
 * @param {string} yearvalues
 * @returns{Promise.<void>}
 */
const show_start = async (yearvalues) =>{
    /**
     * Get system admin stat options
     * @returns{Promise.<string|null>}
     */
    const get_system_admin_stat = async () =>{
        return new Promise((resolve)=>{
            common.FFB('/server/info-statuscode', null, 'GET', 'SYSTEMADMIN', null)
            .then((/**@type{string}*/result)=>{
                let html = `<optgroup label='REQUEST'>
                                <option value='ip_total' unique=0 statGroup='ip'>IP TOTAL</option>
                                <option value='ip_unique' unique=1 statGroup='ip'>IP UNIQUE</option>
                                <option value='url_total' unique=0 statGroup='url'>URL TOTAL</option>
                                <option value='url_unique' unique=1 statGroup='url'>URL UNIQUE</option>
                                <option value='accept-language_total' unique=0 statGroup='accept-language'>ACCEPT-LANGUAGE TOTAL</option>
                                <option value='accept-language_unique' unique=1 statGroup='accept-language'>ACCEPT-LANGUAGE UNIQUE</option>
                                <option value='user-agent_total' unique=0 statGroup='user-agent'>USER-AGENT TOTAL</option>
                                <option value='user-agent_unique' unique=1 statGroup='user-agent'>USER-AGENT UNIQUE</option>
                            </optgroup>
                            <optgroup label='RESPONSE HTTP Codes'>
                                <option value='' unique=0 statGroup=''>${common.ICONS.infinite}</option>
                            </optgroup>`;
                /**@type{{status_codes:[number, string][]}} */
                const result_obj = JSON.parse(result);
                for (const status_code of Object.entries(result_obj.status_codes)){
                    html += `<option value='${status_code[0]}' statGroup=''>${status_code[0]} - ${status_code[1]}</option>`;
                }
                CommonAppDocument.querySelector('#menu_content').classList.remove('common_icon', 'css_spinner');
                resolve(html);
            })
            .catch(()=>{
                CommonAppDocument.querySelector('#menu_content').classList.remove('common_icon', 'css_spinner');
                resolve(null);
            });
        });
    };
    CommonAppDocument.querySelector('#menu_content').innerHTML = 
            `<div id='menu_1_content_widget1' class='widget'>
                <div id='menu_1_row_sample'>
                    <select id='select_system_admin_stat'>${common.COMMON_GLOBAL.system_admin!=null?await get_system_admin_stat():''}</select>
                    <div id='select_app_menu1' class='common_select'>${await get_apps_div()}</div>
                    <select id='select_year_menu1'>${yearvalues}</select>
                    <select id='select_month_menu1'>${list_generate(12)}</select>
                </div>
                <div id='graphBox'></div>
            </div>
            <div id='menu_1_content_widget2' class='widget'>
                <div id='menu_1_maintenance'>
                    <div id='menu_1_maintenance_title' class='common_icon'></div>
                    <div id='menu_1_maintenance_checkbox'>
                        <div id='menu_1_checkbox_maintenance' class='common_switch'></div>
                    </div>
                </div>
                <div id='menu_1_broadcast'>
                    <div id='menu_1_broadcast_title' class='common_icon'></div>
                    <div id='menu_1_broadcast_button' class='chat_click common_icon'></div>
                </div>
            </div>`;
    if (common.COMMON_GLOBAL.system_admin!=null){
        CommonAppDocument.querySelector('#menu_1_maintenance').style.display = 'inline-block';
        CommonAppDocument.querySelector('#select_system_admin_stat').style.display = 'inline-block';
    }
    else{
        CommonAppDocument.querySelector('#menu_1_maintenance').style.display = 'none';
        CommonAppDocument.querySelector('#select_system_admin_stat').style.display = 'none';
    }    
    CommonAppDocument.querySelector('#select_year_menu1').selectedIndex = 0;
    CommonAppDocument.querySelector('#select_month_menu1').selectedIndex = new Date().getMonth();

    if (common.COMMON_GLOBAL.system_admin!=null)
        check_maintenance();
    show_charts();
};
/**
 * Get apps div select HTML
 * @returns{Promise.<string|null>}
 */
const get_apps_div = async () =>{
    return new Promise((resolve)=>{
        let options = '';
        let authorization_type;
        if (common.COMMON_GLOBAL.system_admin!=null)
            authorization_type = 'SYSTEMADMIN';
        else
            authorization_type = 'APP_ACCESS';
        common.FFB('/server-config/config-apps/', 'key=NAME', 'GET', authorization_type, null)
        .then((/**@type{string}*/result)=>{
            const apps = JSON.parse(result).rows;
            for (const app of apps) {
                options += `<div class='common_select_option' data-value='${app.APP_ID}'>${app.APP_ID} - ${app.NAME}</div>`;
            }
            resolve(`   <div class='common_select_dropdown'>
                            <div class='common_select_dropdown_value' data-value=''>∞</div>
                            <div class='common_select_dropdown_icon common_icon'></div>
                        </div>
                        <div class='common_select_options'>
                            <div class='common_select_option' data-value=''>∞</div>
                            ${options}
                        </div>`);
        })
        .catch(()=>resolve(null));
    });
};

/**
 * Broadcast send
 * @returns{void}
 */
const sendBroadcast = () => {
    let broadcast_type ='';
    let client_id;
    let app_id;
    const broadcast_message = CommonAppDocument.querySelector('#send_broadcast_message').innerHTML;

    if (broadcast_message==''){
        common.show_message('INFO', null, null, 'message_text', '!', common.COMMON_GLOBAL.app_id);
    }
    else{
        if (CommonAppDocument.querySelector('#client_id').innerHTML==''){
            app_id = CommonAppDocument.querySelector('#select_app_broadcast .common_select_dropdown_value').getAttribute('data-value');
            client_id = '';
            broadcast_type = CommonAppDocument.querySelector('#select_broadcast_type .common_select_dropdown_value').getAttribute('data-value');
        }
        else{
            client_id = CommonAppDocument.querySelector('#client_id').innerHTML;
            app_id = '';
            broadcast_type = 'CHAT';
        }
            
        const json_data ={  app_id:             app_id==''?null:app_id,
                            client_id:          client_id==''?null:client_id,
                            client_id_current:  common.COMMON_GLOBAL.service_socket_client_ID,
                            broadcast_type:     broadcast_type, 
                            broadcast_message:  CommonAppWindow.btoa(broadcast_message)};
        let path='';
        let token_type;
        if (common.COMMON_GLOBAL.system_admin!=null){
            path = '/server-socket/message';
            token_type = 'SYSTEMADMIN';
        }
        else{
            path = '/server-socket/message';
            token_type = 'APP_ACCESS';
        }
        common.FFB(path, null, 'POST', token_type, json_data)
        .then((/**@type{string}*/result)=>{
            if (Number(JSON.parse(result).sent) > 0)
                common.show_message('INFO', null, null, 'message_success', `(${Number(JSON.parse(result).sent)})`, common.COMMON_GLOBAL.app_id);
            else
                common.show_message('INFO', null, null, 'message_fail', null, common.COMMON_GLOBAL.app_id);
        })
        .catch(()=>null);
    }
};    
/**
 * Broadcast close
 * @returns{void}
 */
const closeBroadcast = () => {
    common.ComponentRemove('dialogue_send_broadcast', true);
};
/**
 * Broadcast close
 * @param {string} dialogue_type 
 * @param {number|null} client_id 
 * @returns{Promise.<void>}
 */
const show_broadcast_dialogue = async (dialogue_type, client_id=null) => {
    common.ComponentRender('dialogue_send_broadcast', {
                                                        system_admin:common.COMMON_GLOBAL.system_admin,
                                                        function_ComponentRender:common.ComponentRender,
                                                        function_FFB:common.FFB
                                                        }, '/component/dialogue_send_broadcast.js')
    .then(()=>{
        switch (dialogue_type){
            case 'CHAT':{
                //hide and set INFO, should not be able to send MAINTENANCE message here
                CommonAppDocument.querySelector('#select_broadcast_type').style.display='none';
                //hide app selection
                CommonAppDocument.querySelector('#select_app_broadcast').style.display='none';
                //show client id
                CommonAppDocument.querySelector('#client_id_label').style.display = 'inline-block';
                CommonAppDocument.querySelector('#client_id').style.display = 'inline-block';
                CommonAppDocument.querySelector('#client_id').innerHTML = client_id;
                break;
            }
            case 'APP':{
                //hide and set INFO, should not be able to send MAINTENANCE message here
                CommonAppDocument.querySelector('#select_broadcast_type').style.display='none';
                //show app selection
                CommonAppDocument.querySelector('#select_app_broadcast').style.display='block';
                //hide client id
                CommonAppDocument.querySelector('#client_id_label').style.display = 'none';
                CommonAppDocument.querySelector('#client_id').style.display = 'none';
                CommonAppDocument.querySelector('#client_id').innerHTML = '';
                break;
            }
            case 'ALL':{
                //show broadcast type and INFO
                CommonAppDocument.querySelector('#select_broadcast_type').style.display='inline-block';
                //show app selection
                CommonAppDocument.querySelector('#select_app_broadcast').style.display='block';
                //hide client id
                CommonAppDocument.querySelector('#client_id_label').style.display = 'none';
                CommonAppDocument.querySelector('#client_id').style.display = 'none';
                CommonAppDocument.querySelector('#client_id').innerHTML = '';
                break;
            }
        }
    });
};
/**
 * Broadcast set type
 * @returns{void}
 */
const set_broadcast_type = () => {
    switch (CommonAppDocument.querySelector('#select_broadcast_type .common_select_dropdown_value').getAttribute('data-value')){
        case 'ALERT':{
            //show app selection
            CommonAppDocument.querySelector('#select_app_broadcast').style.display='block';
            //hide client id
            CommonAppDocument.querySelector('#client_id_label').style.display = 'none';
            CommonAppDocument.querySelector('#client_id').style.display = 'none';
            CommonAppDocument.querySelector('#client_id').innerHTML = '';
            break;
        }
        case 'MAINTENANCE':{
            //hide app selection
            CommonAppDocument.querySelector('#select_app_broadcast').style.display='none';
            //hide client id
            CommonAppDocument.querySelector('#client_id_label').style.display = 'none';
            CommonAppDocument.querySelector('#client_id').style.display = 'none';
            CommonAppDocument.querySelector('#client_id').innerHTML = '';
            break;
        }
    }
};
/**
 * Maintenance check
 * @returns{Promise.<void>}
 */
const check_maintenance = async () => {
    if (admin_token_has_value()){
        await common.FFB('/server-config/config/SERVER', 'config_group=METADATA&parameter=MAINTENANCE', 'GET', 'SYSTEMADMIN', null)
        .then((/**@type{string}*/result)=>{
            if (JSON.parse(result).data==1)
                CommonAppDocument.querySelector('#menu_1_checkbox_maintenance').classList.add('checked');
            else
                CommonAppDocument.querySelector('#menu_1_checkbox_maintenance').classList.remove('checked');
        })
        .catch(()=>null);
    }
};
/**
 * Maintenance set
 * @returns{void}
 */
const set_maintenance = () => {
    if (admin_token_has_value()){
        let check_value;
        if (CommonAppDocument.querySelector('#menu_1_checkbox_maintenance').classList.contains('checked'))
            check_value = 1;
        else
            check_value = 0;
        const json_data = {maintenance:check_value};
        common.FFB('/server-config/config/SERVER', null, 'PUT', 'SYSTEMADMIN', json_data).catch(()=>null);
    }
};
/**
 * Show users
 * @returns {void}
 */
const show_users = () =>{
    CommonAppDocument.querySelector('#menu_content').innerHTML = 
            `<div id='menu_3_content_widget1' class='widget'>
                <div id='list_user_account_title' class='common_icon'></div>
                <div class='list_search'>
                    <div id='list_user_account_search_input' contentEditable='true's class='common_input list_search_input' /></div>
                    <div id='list_user_search_icon' class='list_search_icon common_icon'></div>
                </div>
                <div id='list_user_account' class='common_list_scrollbar'></div>
            </div>
            <div id='menu_3_content_widget2' class='widget'>
                <div id='list_user_account_logon_title' class='common_icon'></div>
                <div id='list_user_account_logon' class='common_list_scrollbar'></div>
                <div id='users_buttons' class="save_buttons">
                    <div id='users_save' class='common_dialogue_button button_save common_icon' ></div>
                </div>
            </div>`;
    search_users();
};
/**
 * 
 * @param {string} sort 
 * @param {string} order_by 
 * @param {boolean} focus 
 * @returns 
 */
const search_users = (sort='username', order_by='asc', focus=true) => {

    if (common.input_control(null,{check_valid_list_elements:[[CommonAppDocument.querySelector('#list_user_account_search_input'),100]]})==false)
        return;

    CommonAppDocument.querySelector('#list_user_account').classList.add('common_icon', 'css_spinner');
    CommonAppDocument.querySelector('#list_user_account').innerHTML = '';
    let search_user='*';
    //show all records if no search criteria
    if (CommonAppDocument.querySelector('#list_user_account_search_input').innerText!='')
        search_user = encodeURI(CommonAppDocument.querySelector('#list_user_account_search_input').innerText);
    common.FFB('/server-db_admin/user_account', `search=${search_user}&sort=${sort}&order_by=${order_by}`, 'GET', 'APP_ACCESS', null)
    .then((/**@type{string}*/result)=>{
        let html = `<div class='list_user_account_row'>
                        <div data-column='avatar' class='list_user_account_col list_title common_icon'></div>
                        <div data-column='id' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='app_role_id' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='app_role_icon' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='active' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='user_level' class='list_user_account_col list_sort_click list_title'></div>
                        <div data-column='private' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='username' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='bio' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='email' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='emal_unverified' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='password' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='password_reminder' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='verification_code' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='identity_provider_id' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='provider_name' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='provider_id' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='provider_first_name' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='provider_last_name' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='provider_image' class='list_user_account_col list_title common_icon'></div>
                        <div data-column='provider_image_url' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='provider_email' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='date_created' class='list_user_account_col list_sort_click list_title common_icon'></div>
                        <div data-column='date_modified' class='list_apps_col list_sort_click list_title common_icon'></div>
                    </div>`;
        let input_contentEditable = '';
        let lov_div = '';
        let lov_class = '';
        //superadmin can edit
        if (common.COMMON_GLOBAL.user_app_role_id==0){
            lov_div = '<div class=\'common_lov_button common_list_lov_click common_icon\'></div>';
            lov_class = 'common_input_lov';
            input_contentEditable = 'contentEditable="true"';
        }
        else
            input_contentEditable = 'contentEditable="false"';
        for (const user of JSON.parse(result).rows) {
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
                    <div ${input_contentEditable} class='common_input list_edit ${lov_class}' data-defaultValue='${user.app_role_id ?? ''}'/>${user.app_role_id ?? ''}</div>
                    ${lov_div}
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly common_lov_value'>${user.app_role_icon}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${user.active ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${user.level ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${user.private ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${user.username ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${user.bio ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${user.email ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${user.email_unverified ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit common_input_password' placeholder='******'/></div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${user.password_reminder ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div ${input_contentEditable} class='common_input list_edit'/>${user.verification_code ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${user.identity_provider ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${user.provider_name ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${user.provider_id ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${user.provider_first_name ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${user.provider_last_name ?? ''}</div>                        
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>
                        <img class='list_user_account_avatar' ${common.list_image_format_src(user.provider_image)}/>
                    </div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${user.provider_image_url ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${user.provider_email ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${user.date_created ?? ''}</div>
                </div>
                <div class='list_user_account_col'>
                    <div class='list_readonly'>${user.date_modified ?? ''}</div>
                </div>
            </div>`;
        }
        CommonAppDocument.querySelector('#list_user_account').classList.remove('common_icon', 'css_spinner');
        CommonAppDocument.querySelector('#list_user_account').innerHTML = html;
        CommonAppDocument.querySelector(`#list_user_account .list_title[data-column='${sort}']`).classList.add(order_by);
    
        if (focus==true){
            //set focus at start
            //set focus first column in first row
            //this will trigger to show detail records
            if (CommonAppDocument.querySelectorAll('#list_user_account .list_edit')[0].getAttribute('readonly')==true){
                CommonAppDocument.querySelectorAll('#list_user_account .list_edit')[0].setAttribute('readonly', false);
                CommonAppDocument.querySelectorAll('#list_user_account .list_edit')[0].focus();
                CommonAppDocument.querySelectorAll('#list_user_account .list_edit')[0].setAttribute('readonly', true);
            }
            else
                CommonAppDocument.querySelectorAll('#list_user_account .list_edit')[0].focus();
                
        }
        else{
            //trigger focus event on first row set focus back again to search field
            CommonAppDocument.querySelectorAll('#list_user_account .list_edit')[0].focus();
            CommonAppDocument.querySelector('#list_user_account_search_input').focus();
        }
    })
    .catch(()=>CommonAppDocument.querySelector('#list_user_account').classList.remove('common_icon', 'css_spinner'));
};
/**
 * Show user account logon
 * @param {number} user_account_id 
 */
const show_user_account_logon = async (user_account_id) => {
    CommonAppDocument.querySelector('#list_user_account_logon').classList.add('common_icon', 'css_spinner');
    CommonAppDocument.querySelector('#list_user_account_logon').innerHTML = '';
    common.FFB('/server-db_admin/user_account_logon', `data_user_account_id=${user_account_id}&data_app_id=''`, 'GET', 'APP_ACCESS', null)
    .then((/**@type{string}*/result)=>{
        let html = `<div id='list_user_account_logon_row_title' class='list_user_account_logon_row'>
                        <div id='list_user_account_logon_col_title1' class='list_user_account_logon_col list_title'>USER ACCOUNT ID</div>
                        <div id='list_user_account_logon_col_title2' class='list_user_account_logon_col list_title'>DATE CREATED</div>
                        <div id='list_user_account_logon_col_title3' class='list_user_account_logon_col list_title'>APP ID</div>
                        <div id='list_user_account_logon_col_title4' class='list_user_account_logon_col list_title'>RESULT</div>
                        <div id='list_user_account_logon_col_title5' class='list_user_account_logon_col list_title'>IP</div>
                        <div id='list_user_account_logon_col_title6' class='list_user_account_logon_col list_title'>GPS LONG</div>
                        <div id='list_user_account_logon_col_title7' class='list_user_account_logon_col list_title'>GPS LAT</div>
                        <div id='list_user_account_logon_col_title8' class='list_user_account_logon_col list_title'>USER AGENT</div>
                        <div id='list_user_account_logon_col_title9' class='list_user_account_logon_col list_title'>ACCESS TOKEN</div>
                    </div>`;
        for (const user_account_logon of JSON.parse(result)) {
            html += 
            `<div data-changed-record='0' class='list_user_account_logon_row'>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${user_account_logon.user_account_id}</div>
                </div>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${user_account_logon.date_created ?? ''}</div>
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
                    <div class='list_readonly'>${user_account_logon.client_longitude ?? ''}</div>
                </div>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${user_account_logon.client_latitude ?? ''}</div>
                </div>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${user_account_logon.client_user_agent}</div>
                </div>
                <div class='list_user_account_logon_col'>
                    <div class='list_readonly'>${user_account_logon.access_token ?? ''}</div>
                </div>
            </div>`;
        }
        CommonAppDocument.querySelector('#list_user_account_logon').classList.remove('common_icon', 'css_spinner');
        CommonAppDocument.querySelector('#list_user_account_logon').innerHTML = html;
    })
    .catch(()=>CommonAppDocument.querySelector('#list_user_account_logon').classList.remove('common_icon', 'css_spinner'));
};
/**
 * Show apps
 * @returns{Promise.<void>}
 */
const show_apps = async () => {
    CommonAppDocument.querySelector('#menu_content').innerHTML = 
    `<div id='menu_4_content_widget1' class='widget'>
         <div id='list_apps_title' class='common_icon'></div>
         <div id='list_apps' class='common_list_scrollbar common_icon css_spinner'></div>
     </div>
     <div id='menu_4_content_widget2' class='widget'>
         <div id='list_app_parameter_title' class='common_icon'></div>
         <div id='list_app_parameter' class='common_list_scrollbar'></div>
         <div id='apps_buttons' class="save_buttons">
             <div id='apps_save' class='common_dialogue_button button_save common_icon'></div>
         </div>
     </div>`;
    await common.FFB('/app_admin/apps', null, 'GET', 'APP_ACCESS', null)
    .then((/**@type{string}*/result)=>{
        let html = `<div id='list_apps_row_title' class='list_apps_row'>
                        <div id='list_apps_col_title1' class='list_apps_col list_title'>ID</div>
                        <div id='list_apps_col_title2' class='list_apps_col list_title'>NAME</div>
                        <div id='list_apps_col_title3' class='list_apps_col list_title'>URL</div>
                        <div id='list_apps_col_title4' class='list_apps_col list_title'>LOGO</div>
                        <div id='list_apps_col_title5' class='list_apps_col list_title'>STATUS</div>
                        <div id='list_apps_col_title6' class='list_apps_col list_title'>CATEGORY ID</div>
                        <div id='list_apps_col_title7' class='list_apps_col list_title'>CATEGORY NAME</div>
                    </div>`;
        for (const app of JSON.parse(result).rows) {
            html += 
            `<div data-changed-record='0' data-app_id = '${app.ID}' class='list_apps_row common_row' >
                <div class='list_apps_col'>
                    <div class='list_readonly'>${app.ID}</div>
                </div>
                <div class='list_apps_col'>
                    <div contentEditable='false' class='common_input list_readonly'/>${app.NAME}</div>
                </div>
                <div class='list_apps_col'>
                    <div contentEditable='false' class='common_input list_readonly'/>${app.PROTOCOL}${app.SUBDOMAIN}.${app.HOST}:${app.PORT}</div>
                </div>
                <div class='list_apps_col'>
                    <div contentEditable='false' class='common_input list_readonly'/>${app.LOGO}</div>
                </div>
                <div class='list_apps_col'>
                    <div class='list_readonly' class='list_readonly'>${app.STATUS}</div>
                </div>
                <div class='list_apps_col'>
                    <div contentEditable='true' class='common_input list_edit common_input_lov' data-defaultValue='${app.APP_CATEGORY_ID ?? ''}'/>${app.APP_CATEGORY_ID ?? ''}</div>
                    <div class='common_lov_button common_list_lov_click common_icon'></div>
                </div>
                <div class='list_apps_col'>
                    <div class='list_readonly common_lov_value'>${app.APP_CATEGORY_TEXT ?? ''} </div>
                </div>
            </div>`;
        }
        CommonAppDocument.querySelector('#list_apps').classList.remove('common_icon', 'css_spinner');
        CommonAppDocument.querySelector('#list_apps').innerHTML = html;
        //set focus first column in first row
        //this will trigger to show detail records
        CommonAppDocument.querySelectorAll('#list_apps .list_edit')[0].focus();
    })
    .catch(()=>CommonAppDocument.querySelector('#list_apps').classList.remove('common_icon', 'css_spinner'));
};
/**
 * 
 * @param {number} app_id 
 * @returns{void}
 */
const show_app_parameter = (app_id) => {
    CommonAppDocument.querySelector('#list_app_parameter').classList.add('common_icon', 'css_spinner');
    CommonAppDocument.querySelector('#apps_save').style.display = 'none';
    CommonAppDocument.querySelector('#list_app_parameter').innerHTML = '';

    common.FFB(`/server-config/config-apps/${app_id}`, 'key=PARAMETERS', 'GET', 'APP_ACCESS', null)
    .then((/**@type{string}*/result)=>{
        let html = `<div id='list_app_parameter_row_title' class='list_app_parameter_row'>
                        <div id='list_app_parameter_col_title1' class='list_app_parameter_col list_title'>APP ID</div>
                        <div id='list_app_parameter_col_title2' class='list_app_parameter_col list_title'>NAME</div>
                        <div id='list_app_parameter_col_title3' class='list_app_parameter_col list_title'>VALUE</div>
                        <div id='list_app_parameter_col_title4' class='list_app_parameter_col list_title'>COMMENT</div>
                    </div>`;
        for (const app_parameter of JSON.parse(result)[0].PARAMETERS) {
            html += 
            `<div data-changed-record='0' class='list_app_parameter_row common_row'>
                <div class='list_app_parameter_col'>
                    <div class='list_readonly'>${app_id}</div>
                </div>
                <div class='list_app_parameter_col'>
                    <div class='list_readonly'>${Object.keys(app_parameter).filter(key=>key != 'app_id' && key != 'COMMENT')[0]}</div>
                </div>
                <div class='list_app_parameter_col'>
                    <div contentEditable='true' class='common_input list_edit'/>${app_parameter[Object.keys(app_parameter).filter(key=>key != 'app_id' && key != 'COMMENT')[0]] ?? ''}</div>
                </div>
                <div class='list_app_parameter_col'>
                    <div contentEditable='true' class='common_input list_edit'/>${app_parameter.COMMENT ?? ''}</div>
                </div>
            </div>`;
        }
        CommonAppDocument.querySelector('#list_app_parameter').classList.remove('common_icon', 'css_spinner');
        CommonAppDocument.querySelector('#apps_save').style.display = 'inline-block';
        CommonAppDocument.querySelector('#list_app_parameter').innerHTML = html;
    })
    .catch(()=>CommonAppDocument.querySelector('#list_app_parameter').classList.remove('common_icon', 'css_spinner'));
};
/**
 * Button save
 * @param {string} item 
 */
const button_save = async (item) => {
    switch (item){
        case 'apps_save':{
            //save changes in list_apps
            let x = CommonAppDocument.querySelectorAll('.list_apps_row');
            for (const record of x){
                if (record.getAttribute('data-changed-record')=='1'){
                    await update_record('app',
                                        record,
                                        item,
                                        {   user_account:{  id:0,
                                                            app_role_id:0,
                                                            active:0,
                                                            user_level:0,
                                                            private:0,
                                                            username:'',
                                                            bio:'',
                                                            email:'',
                                                            email_unverified:'',
                                                            password:'',
                                                            password_reminder:'',
                                                            verification_code:''},
                                            app:{           id: record.children[0].children[0].innerHTML,
                                                            app_category_id: record.children[5].children[0].innerHTML},
                                            app_parameter: {app_id:0,
                                                            parameter_name:'',
                                                            parameter_value:'',
                                                            parameter_comment:''}});
                }
            }
            //save changes in list_app_parameter
            x = CommonAppDocument.querySelectorAll('.list_app_parameter_row');
            for (const record of x){
                if (record.getAttribute('data-changed-record')=='1'){
                    await update_record('app_parameter',
                                        record,
                                        item,
                                        {   user_account:{  id:0,
                                                            app_role_id:0,
                                                            active:0,
                                                            user_level:0,
                                                            private:0,
                                                            username:'',
                                                            bio:'',
                                                            email:'',
                                                            email_unverified:'',
                                                            password:'',
                                                            password_reminder:'',
                                                            verification_code:''},
                                            app:{           id: 0,
                                                            app_category_id: 0},
                                            app_parameter: {app_id:record.children[0].children[0].innerHTML,
                                                            parameter_name:  record.children[1].children[0].innerHTML,
                                                            parameter_value: record.children[2].children[0].innerHTML,
                                                            parameter_comment: record.children[3].children[0].innerHTML}});
                }
            }
            break;
        }
        case 'users_save':{
            //save changes in list_user_account
            const x = CommonAppDocument.querySelectorAll('.list_user_account_row');
            for (const record of x){
                if (record.getAttribute('data-changed-record')=='1'){
                    await update_record('user_account',
                                        record,
                                        item,
                                        {   user_account:{  id:record.children[1].children[0].innerHTML,
                                                            app_role_id:record.children[2].children[0].innerHTML,
                                                            active:record.children[4].children[0].innerHTML,
                                                            user_level:record.children[5].children[0].innerHTML,
                                                            private:record.children[6].children[0].innerHTML,
                                                            username:record.children[7].children[0].innerHTML,
                                                            bio: record.children[8].children[0].innerHTML,
                                                            email: record.children[9].children[0].innerHTML,
                                                            email_unverified: record.children[10].children[0].innerHTML,
                                                            password: record.children[11].children[0].innerHTML,
                                                            password_reminder: record.children[12].children[0].innerHTML,
                                                            verification_code: record.children[13].children[0].innerHTML},
                                            app:{           id: 0,
                                                            app_category_id: 0},
                                            app_parameter: {app_id:0,
                                                            parameter_name:  '',
                                                            parameter_value: '',
                                                            parameter_comment: ''}});
                }
            }
            break;
        }
        case 'config_save':{
            const config_create_server_json = () => {
                /**@type{object[]} */
                const config_json = [];
                CommonAppDocument.querySelectorAll('#list_config .list_config_group').forEach((/**@type{HTMLElement}*/e_group) => 
                    {
                        let config_group='';
                        CommonAppDocument.querySelectorAll(`#${e_group.id} .list_config_row`).forEach((/**@type{HTMLElement}*/e_row) => 
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
            const file = CommonAppDocument.querySelectorAll('#menu_6_content .list_nav .list_nav_selected_tab')[0].id.substring(16).toUpperCase();
            //file:'SERVER', 'APPS', 'IAM_BLOCKIP', 'IAM_POLICY', 'IAM_USERAGENT', 'IAM_USER', 'MICROSERVICE_CONFIG', 'MICROSERVICE_SERVICES'
            const json_data = { config:    file=='SERVER'?config_create_server_json():JSON.parse(CommonAppDocument.querySelector('#list_config_edit').innerHTML)};

            CommonAppDocument.querySelector('#' + item).classList.add('css_spinner');
            common.FFB(`/server-config/config/${file}`, null, 'PUT', 'SYSTEMADMIN', json_data)
            .then(()=>CommonAppDocument.querySelector('#' + item).classList.remove('css_spinner'))
            .catch(()=>CommonAppDocument.querySelector('#' + item).classList.remove('css_spinner'));
            break;
        }
    }
};
/**
 * Update record
 * @param {string} table 
 * @param {HTMLElement} row_element 
 * @param {string} button 
 * @param {{user_account:{  id:number,
 *                          app_role_id:number,
 *                          active:number,
 *                          user_level:number,
 *                          private:number,
 *                          username:string,
 *                          bio:string,
 *                          email:string,
 *                          email_unverified:string,
 *                          password:string,
 *                          password_reminder:string,
 *                          verification_code:string},
 *          app:{           id:number,
 *                          app_category_id:number},
 *          app_parameter: {app_id:number,
 *                          parameter_name:string,
 *                          parameter_value:string,
 *                          parameter_comment:string}}} parameters
 */
const update_record = async (table, 
                             row_element,
                             button,
                             parameters) => {
    if (admin_token_has_value()){
        let path = '';
        let json_data;
        let token_type = '';
        let method = '';
        CommonAppDocument.querySelector('#' + button).classList.add('css_spinner');
        switch (table){
            case 'user_account':{
                json_data = {   app_role_id:        parameters.user_account.app_role_id,
                                active:             parameters.user_account.active,
                                user_level:         parameters.user_account.user_level,
                                private:            parameters.user_account.private,
                                username:           parameters.user_account.username,
                                bio:                parameters.user_account.bio,
                                email:              parameters.user_account.email,
                                email_unverified:   parameters.user_account.email_unverified,
                                password_new:       parameters.user_account.password,
                                password_reminder:  parameters.user_account.password_reminder,
                                verification_code:  parameters.user_account.verification_code};
                path = `/server-db_admin/user_account/${parameters.user_account.id}`;
                token_type = 'SUPERADMIN';
                method = 'PATCH';
                break;
            }
            case 'app':{
                json_data = {   
                                app_category_id:parameters.app.app_category_id
                            };
                path = `/server-db_admin/apps/${parameters.app.id}`;
                token_type = 'APP_ACCESS';
                method = 'PUT';
                break;
            }
            case 'app_parameter':{
                json_data = {   parameter_name:     parameters.app_parameter.parameter_name,
                                parameter_value:    parameters.app_parameter.parameter_value,
                                parameter_comment:  parameters.app_parameter.parameter_comment};
                path = `/server-config/config-apps-parameter/${parameters.app_parameter.app_id}`;
                token_type = 'APP_ACCESS';
                method = 'PATCH';
                break;
            }
        }
        await common.FFB(path, null, method, token_type, json_data)
        .then(()=>{ row_element.setAttribute('data-changed-record', '0');
                    CommonAppDocument.querySelector('#' + button).classList.remove('css_spinner');})
        .catch(()=>CommonAppDocument.querySelector('#' + button).classList.remove('css_spinner'));
    }
};
/**
 * Mounts map in monitor component
 */
const map_mount = () =>{
    //show map only for this condition
    if (common.COMMON_GLOBAL.system_admin_only != 1)
        common.map_init(APP_GLOBAL.module_leaflet_map_container,
                        common.COMMON_GLOBAL.client_longitude,
                        common.COMMON_GLOBAL.client_latitude,
                        null,
                        null).then(() => {
            common.map_update({ longitude:common.COMMON_GLOBAL.client_longitude,
                                latitude:common.COMMON_GLOBAL.client_latitude,
                                zoomvalue:common.COMMON_GLOBAL.module_leaflet_zoom,
                                text_place:common.COMMON_GLOBAL.client_place,
                                country:'',
                                city:'',
                                timezone_text :null,
                                marker_id:common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                to_method:common.COMMON_GLOBAL.module_leaflet_jumpto
                            });
            common.map_resize();
        });
};

/**
 * Navigation click
 * @param {string} item_id 
 * @returns{void}
 */
const nav_click = (item_id) => {
    const reset_monitor = () => {
        CommonAppDocument.querySelector('#list_monitor_nav_connected').classList.remove('list_nav_selected_tab');
        if (CommonAppDocument.querySelector('#list_monitor_nav_app_log'))
            CommonAppDocument.querySelector('#list_monitor_nav_app_log').classList.remove('list_nav_selected_tab');
        if (CommonAppDocument.querySelector('#list_monitor_nav_server_log'))
            CommonAppDocument.querySelector('#list_monitor_nav_server_log').classList.remove('list_nav_selected_tab');
    };
    const reset_config = () => {
        CommonAppDocument.querySelector('#list_config_nav_server').classList.remove('list_nav_selected_tab');
        CommonAppDocument.querySelector('#list_config_nav_iam_blockip').classList.remove('list_nav_selected_tab');
        CommonAppDocument.querySelector('#list_config_nav_iam_useragent').classList.remove('list_nav_selected_tab');
        CommonAppDocument.querySelector('#list_config_nav_iam_policy').classList.remove('list_nav_selected_tab');
    };
    
    switch (item_id){
        //MONITOR
        case 'list_monitor_nav_connected':{
            reset_monitor();
            CommonAppDocument.querySelector('#list_monitor_nav_connected').classList.add('list_nav_selected_tab');
            show_connected();
            break;
        }
        case 'list_monitor_nav_app_log':{
            reset_monitor();
            CommonAppDocument.querySelector('#list_monitor_nav_app_log').classList.add('list_nav_selected_tab');
            show_app_log();
            break;
        }
        case 'list_monitor_nav_server_log':{
            reset_monitor();
            CommonAppDocument.querySelector('#list_monitor_nav_server_log').classList.add('list_nav_selected_tab');
            show_server_logs('logdate', 'desc');
            break;
        }
        //SERVER CONFIG
        case 'list_config_nav_server':{
            reset_config();
            CommonAppDocument.querySelector('#list_config_nav_server').classList.add('list_nav_selected_tab');
            common.ComponentRender('list_config_container', {file:'SERVER', function_FFB:common.FFB}, '/component/menu_config_detail.js');
            break;
        }
        case 'list_config_nav_iam_blockip':{
            reset_config();
            CommonAppDocument.querySelector('#list_config_nav_iam_blockip').classList.add('list_nav_selected_tab');
            common.ComponentRender('list_config_container', {file:'IAM_BLOCKIP', function_FFB:common.FFB}, '/component/menu_config_detail.js');
            break;
        }
        case 'list_config_nav_iam_useragent':{
            reset_config();
            CommonAppDocument.querySelector('#list_config_nav_iam_useragent').classList.add('list_nav_selected_tab');
            common.ComponentRender('list_config_container', {file:'IAM_USERAGENT', function_FFB:common.FFB}, '/component/menu_config_detail.js');
            break;
        }
        case 'list_config_nav_iam_policy':{
            reset_config();
            CommonAppDocument.querySelector('#list_config_nav_iam_policy').classList.add('list_nav_selected_tab');
            common.ComponentRender('list_config_container', {file:'IAM_POLICY', function_FFB:common.FFB}, '/component/menu_config_detail.js');
            break;
        }
    }
};
/**
 * Show list
 * @param {'CONNECTED'|'APP_LOG'|'SERVER_LOG'} list_detail
 * @param {string} query
 * @param {string} sort 
 * @param {string} order_by 
 */
const show_list = async (list_detail, query, sort, order_by) => {
    common.ComponentRender('list_monitor', {app_id:common.COMMON_GLOBAL.app_id,
                                            system_admin:common.COMMON_GLOBAL.system_admin,
                                            monitor_detail:list_detail,
                                            query:query,
                                            sort:sort,
                                            order_by:order_by,
                                            service_socket_client_ID:common.COMMON_GLOBAL.service_socket_client_ID,
                                            limit:APP_GLOBAL.limit,
                                            function_input_control:common.input_control,
                                            function_ComponentRender:common.ComponentRender,
                                            function_getUserAgentPlatform:common.getUserAgentPlatform,
                                            function_get_log_parameters:get_log_parameters,
                                            function_show_app_log:show_app_log,
                                            function_roundOff:roundOff,
                                            function_FFB:common.FFB}, '/component/menu_monitor_detail.js')
    .then(result=>{
        APP_GLOBAL.page_navigation = result.function_page_navigation;
        APP_GLOBAL.monitor_detail_server_log = result.function_monitor_detail_server_log;
    });
};
/**
 * Show connected
 * @param {string} sort 
 * @param {string} order_by
 */
const show_connected = async (sort='connection_date', order_by='desc') => {
    show_list('CONNECTED', 
              '', 
              sort,
              order_by);
};    

/**
 * Show app log
 * @param {string} sort 
 * @param {string} order_by
 * @param {number} offset 
 * @returns{Promise.<void>}
 */
const show_app_log = async (sort='date_created', order_by='desc', offset=0) => {
    show_list('APP_LOG', 
              `&offset=${offset}`, 
              sort,
              order_by);
};
/**
 * List sort click
 * @param {string} list 
 * @param {string} sortcolumn 
 * @param {string} order_by 
 * @returns {void}
 */
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
            APP_GLOBAL.monitor_detail_server_log(sortcolumn, order_by);
            break;
        }
        case 'list_user_account':{
            search_users(sortcolumn, order_by);
            break;
        }
    }
};
/**
 * List item click
 * @param {string} item_type 
 * @param {{ip:string,
 *          latitude:string,
 *          longitude:string,
 *          id:number}} data 
 */
const list_item_click = (item_type, data) => {
    //check if gps_click and if not system admin only when map is not loaded
    if (item_type=='GPS' && common.COMMON_GLOBAL.system_admin_only != 1){
        if (data['ip']){
            common.FFB('/geolocation/ip', data['ip'] != '::1'?`ip=${data['ip']}`:null, 'GET', 'APP_DATA', null)
            .then((/**@type{string}*/result)=>{
                const geodata = JSON.parse(result);
                common.map_update({ longitude:geodata.geoplugin_longitude,
                                    latitude:geodata.geoplugin_latitude,
                                    zoomvalue:common.COMMON_GLOBAL.module_leaflet_zoom,
                                    text_place: geodata.geoplugin_city + ', ' +
                                                geodata.geoplugin_regionName + ', ' +
                                                geodata.geoplugin_countryName,
                                    country:'',
                                    city:'',
                                    timezone_text :null,
                                    marker_id:common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                    to_method:common.COMMON_GLOBAL.module_leaflet_jumpto
                                });
            })
            .catch(()=>null);
        }
        else{
            common.FFB('/geolocation/place', `latitude=${data['latitude']}&longitude=${data['longitude']}`, 'GET', 'APP_DATA', null)
            .then((/**@type{string}*/result)=>{
                /**@type{{geoplugin_place:string, geoplugin_region:string, geoplugin_countryCode:string}} */
                const geodata = JSON.parse(result);
                common.map_update({ longitude:data['longitude'],
                                    latitude:data['latitude'],
                                    zoomvalue:common.COMMON_GLOBAL.module_leaflet_zoom,
                                    text_place: geodata.geoplugin_place + ', ' + 
                                                geodata.geoplugin_region + ', ' + 
                                                geodata.geoplugin_countryCode,
                                    country:'',
                                    city:'',
                                    timezone_text :null,
                                    marker_id:common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                    to_method:common.COMMON_GLOBAL.module_leaflet_jumpto
                                });
            })
            .catch(()=>null);
        }
    }
    else
        if (item_type=='CHAT'){
            show_broadcast_dialogue('CHAT', data['id']);
        }
    
};
/**
 * Get log parameters
 * @returns {Promise.<{parameters:{ SCOPE_REQUEST:string,
 *                                  SCOPE_SERVER:string, 
 *                                  SCOPE_SERVICE:string,
 *                                  SCOPE_APP:string,
 *                                  SCOPE_DB:string,
 *                                  REQUEST_LEVEL:number,
 *                                  SERVICE_LEVEL:number,
 *                                  DB_LEVEL:number,
 *                                  APP_LEVEL:number,
 *                                  LEVEL_VERBOSE:string 
 *                                  LEVEL_ERROR:string
 *                                  LEVEL_INFO:string,
 *                                  FILE_INTERVAL:string},
 *                     logscope_level_options:string}>}
 */
const get_log_parameters = async () => {
    return new Promise((resolve)=>{
        common.FFB('/server-config/config/SERVER', 'config_group=SERVICE_LOG', 'GET', 'SYSTEMADMIN', null)
        .then((/**@type{string}*/result)=>{
            const log_parameters = {
                SCOPE_REQUEST : JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_REQUEST' in row)[0]['SCOPE_REQUEST'],
                SCOPE_SERVER :  JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_SERVER' in row)[0]['SCOPE_SERVER'],
                SCOPE_SERVICE : JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_SERVICE' in row)[0]['SCOPE_SERVICE'],
                SCOPE_APP :     JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_APP' in row)[0]['SCOPE_APP'],
                SCOPE_DB :      JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_DB' in row)[0]['SCOPE_DB'],
                REQUEST_LEVEL : JSON.parse(result).data.filter((/**@type{*}*/row)=>'REQUEST_LEVEL' in row)[0]['REQUEST_LEVEL'],
                SERVICE_LEVEL : JSON.parse(result).data.filter((/**@type{*}*/row)=>'SERVICE_LEVEL' in row)[0]['SERVICE_LEVEL'],
                DB_LEVEL :      JSON.parse(result).data.filter((/**@type{*}*/row)=>'DB_LEVEL' in row)[0]['DB_LEVEL'],
                APP_LEVEL :     JSON.parse(result).data.filter((/**@type{*}*/row)=>'APP_LEVEL' in row)[0]['APP_LEVEL'],
                LEVEL_INFO :    JSON.parse(result).data.filter((/**@type{*}*/row)=>'LEVEL_INFO' in row)[0]['LEVEL_INFO'],
                LEVEL_ERROR :   JSON.parse(result).data.filter((/**@type{*}*/row)=>'LEVEL_ERROR' in row)[0]['LEVEL_ERROR'],
                LEVEL_VERBOSE : JSON.parse(result).data.filter((/**@type{*}*/row)=>'LEVEL_VERBOSE' in row)[0]['LEVEL_VERBOSE'],
                FILE_INTERVAL : JSON.parse(result).data.filter((/**@type{*}*/row)=>'FILE_INTERVAL' in row)[0]['FILE_INTERVAL']
               };
            const logscope_level_options = 
                        
                    `   <option value=0 log_scope='${log_parameters.SCOPE_REQUEST}'  log_level='${log_parameters.LEVEL_INFO}'>${log_parameters.SCOPE_REQUEST} - ${log_parameters.LEVEL_INFO}
                        </option>
                        <option value=1 log_scope='${log_parameters.SCOPE_REQUEST}'  log_level='${log_parameters.LEVEL_ERROR}'>${log_parameters.SCOPE_REQUEST} - ${log_parameters.LEVEL_ERROR}
                        </option>
                        <option value=2 log_scope='${log_parameters.SCOPE_REQUEST}'  log_level='${log_parameters.LEVEL_VERBOSE}'>${log_parameters.SCOPE_REQUEST} - ${log_parameters.LEVEL_VERBOSE}
                        </option>
                        <option value=3 log_scope='${log_parameters.SCOPE_SERVER}'   log_level='${log_parameters.LEVEL_INFO}'>${log_parameters.SCOPE_SERVER} - ${log_parameters.LEVEL_INFO}
                        </option>
                        <option value=4 log_scope='${log_parameters.SCOPE_SERVER}'   log_level='${log_parameters.LEVEL_ERROR}'>${log_parameters.SCOPE_SERVER} - ${log_parameters.LEVEL_ERROR}
                        </option>
                        <option value=5 log_scope='${log_parameters.SCOPE_APP}'      log_level='${log_parameters.LEVEL_INFO}'>${log_parameters.SCOPE_APP} - ${log_parameters.LEVEL_INFO}
                        </option>
                        <option value=6 log_scope='${log_parameters.SCOPE_APP}'      log_level='${log_parameters.LEVEL_ERROR}'>${log_parameters.SCOPE_APP} - ${log_parameters.LEVEL_ERROR}
                        </option>
                        <option value=7 log_scope='${log_parameters.SCOPE_SERVICE}'  log_level='${log_parameters.LEVEL_INFO}'>${log_parameters.SCOPE_SERVICE} - ${log_parameters.LEVEL_INFO}
                        </option>
                        <option value=8 log_scope='${log_parameters.SCOPE_SERVICE}'  log_level='${log_parameters.LEVEL_ERROR}'>${log_parameters.SCOPE_SERVICE} - ${log_parameters.LEVEL_ERROR}
                        </option>
                        <option value=9 log_scope='${log_parameters.SCOPE_DB}'       log_level='${log_parameters.LEVEL_INFO}'>${log_parameters.SCOPE_DB} - ${log_parameters.LEVEL_INFO}
                        </option>
                        <option value=10 log_scope='${log_parameters.SCOPE_DB}'      log_level='${log_parameters.LEVEL_ERROR}'>${log_parameters.SCOPE_DB} - ${log_parameters.LEVEL_ERROR}
                        </option>`;
            APP_GLOBAL.service_log_file_interval = log_parameters.FILE_INTERVAL;
            resolve({   parameters:log_parameters,
                        logscope_level_options:logscope_level_options});
        });
    })
    .catch(()=>null);
};
/**
 * Show server logs
 * @param {string} sort 
 * @param {string} order_by 
 * @returns {void}
 */
const show_server_logs = (sort='logdate', order_by='desc') => {
    

    show_list('SERVER_LOG', 
              '',
              sort,
              order_by);
};
/**
 * Show existing logfiles
 * @returns {void}
 */
const show_existing_logfiles = () => {
    if (admin_token_has_value()){
        /**
         * Event for LOV
         * @param {import('../../../common_types.js').CommonAppEvent} event 
         */
        const function_event = event => {
                                //format: 'LOGSCOPE_LOGLEVEL_20220101.log'
                                //logscope and loglevel
                                let filename = common.element_row(event.target).getAttribute('data-value') ?? '';
                                const logscope = filename.substring(0,filename.indexOf('_'));
                                filename = filename.substring(filename.indexOf('_')+1);
                                const loglevel = filename.substring(0,filename.indexOf('_'));
                                filename = filename.substring(filename.indexOf('_')+1);
                                const year     = parseInt(filename.substring(0, 4));
                                const month    = parseInt(filename.substring(4, 6));
                                const day      = parseInt(filename.substring(6, 8));
                                /**
                                 * 
                                 * @param {HTMLSelectElement} select 
                                 * @param {string} logscope 
                                 * @param {string} loglevel 
                                 * @returns 
                                 */
                                const setlogscopelevel = (select, logscope, loglevel) =>{
                                    for (let i = 0; i < select.options.length; i++) {
                                        if (select[i].getAttribute('log_scope') == logscope &&
                                            select[i].getAttribute('log_level') == loglevel) {
                                            select.selectedIndex = i;
                                            return null;
                                        }
                                    }
                                };
                                setlogscopelevel(CommonAppDocument.querySelector('#select_logscope5'),
                                                logscope, 
                                                loglevel);
                                //year
                                CommonAppDocument.querySelector('#select_year_menu5 .common_select_dropdown_value').setAttribute('data-value', year);
                                CommonAppDocument.querySelector('#select_year_menu5 .common_select_dropdown_value').innerText = year;

                                //month
                                CommonAppDocument.querySelector('#select_month_menu5 .common_select_dropdown_value').setAttribute('data-value', month);
                                CommonAppDocument.querySelector('#select_month_menu5 .common_select_dropdown_value').innerText = month;
                                //day if applicable
                                if (APP_GLOBAL.service_log_file_interval=='1D'){
                                    CommonAppDocument.querySelector('#select_day_menu5 .common_select_dropdown_value').setAttribute('data-value', day);
                                    CommonAppDocument.querySelector('#select_day_menu5 .common_select_dropdown_value').innerText = day;
                                }
                                    

                                APP_GLOBAL.monitor_detail_server_log('logdate', 'desc');
                                common.lov_close();
                            };
        common.lov_show({lov:'SERVER_LOG_FILES', function_event:function_event});
    }
};

/**
 * Executes installation rest API and presents the result
 * @param {string} id 
 * @param {boolean|null} db_icon 
 * @param {string} path 
 * @param {string} query
 * @param {string} method 
 * @param {string} tokentype 
 * @param {{demo_password:string}|null} data 
 * @returns {void}
 */
const installation_function = (id, db_icon, path, query, method, tokentype, data) => {
    CommonAppDocument.querySelector(`#${id}`).classList.add('css_spinner');
    common.FFB(path, query, method, tokentype, data)
    .then((/**@type{string}*/result)=>{
        CommonAppDocument.querySelector(`#${id}`).classList.remove('css_spinner');
        if (db_icon!=null)
            if (db_icon)
                CommonAppDocument.querySelector('#install_db_icon').classList.add('installed');
            else
                CommonAppDocument.querySelector('#install_db_icon').classList.remove('installed');
        common.show_message('LOG', null, null, null, JSON.parse(result).info, common.COMMON_GLOBAL.common_app_id);
    })
    .catch(()=>CommonAppDocument.querySelector(`#${id}`).classList.remove('css_spinner'));
};
/**
 * Installs DB
 * @returns {void}
 */
const db_install = () =>{
    common.ComponentRemove('common_dialogue_message');
    const optional = Number(CommonAppDocument.querySelector('#install_db_country_language_translations').classList.contains('checked'));
    installation_function(  'install_db_button_install', true, 
                            '/server-db_admin/database', 
                            `client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}&optional=${optional}`, 
                            'POST', 'SYSTEMADMIN', null);
};
/**
 * Uninstalls DB
 * @returns {void}
 */
const db_uninstall = () =>{
    common.ComponentRemove('common_dialogue_message');
    installation_function(  'install_db_button_uninstall', false, 
                            '/server-db_admin/database', 
                            `client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`, 'DELETE', 'SYSTEMADMIN', null);
};
/**
 * Installs Demo data
 * @returns {void}
 */
const demo_install = () =>{
    if (common.input_control(null,
                        {
                            check_valid_list_elements:[[CommonAppDocument.querySelector('#install_demo_password'),null]]
                        })==true){
        const json_data = {demo_password: CommonAppDocument.querySelector('#install_demo_password').innerHTML};
        installation_function(  'install_demo_button_install', null, 
                                '/server-db_admin/database-demo', 
                                `client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`,
                                'POST', 'APP_ACCESS', json_data);
    }
};
/**
 * Uninstalls Demo data
 * @returns {void}
 */
const demo_uninstall = () =>{
    installation_function(  'install_demo_button_uninstall', null, 
                            '/server-db_admin/database-demo', 
                            `?client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`,
                            'DELETE', 'APP_ACCESS', null);
};
/**
 * Show server info
 * @returns {void}
 */
const show_server_info = () => {
    if (admin_token_has_value()){
        CommonAppDocument.querySelector('#menu_content').innerHTML = 
                `<div id='menu_10_content_widget1' class='widget'>
                    <div id='menu_10_os_title' class='common_icon'></div>
                    <div id='menu_10_os_info'></div>
                </div>
                <div id='menu_10_content_widget2' class='widget'>
                    <div id='menu_10_process_title' class='common_icon'></div>
                    <div id='menu_10_process_info'></div>
                </div>`;
        CommonAppDocument.querySelector('#menu_10_os_info').classList.add('css_spinner');
        CommonAppDocument.querySelector('#menu_10_process_info').classList.add('css_spinner');
        common.FFB('/server/info', null, 'GET', 'SYSTEMADMIN', null)
        .then((/**@type{string}*/result)=>{
            /**
             * Seconds to time string
             * @param {number} seconds 
             * @returns {string}
             */
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
            CommonAppDocument.querySelector('#menu_10_os_info').classList.remove('css_spinner');
            CommonAppDocument.querySelector('#menu_10_process_info').classList.remove('css_spinner');
            CommonAppDocument.querySelector('#menu_10_os_info').innerHTML = 
                       `<div id='menu_10_os_info_hostname_title'>${'HOSTNAME'}</div><div id='menu_10_os_info_hostname_data'>${server_info.os.hostname}</div>
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
                        <div id='menu_10_os_info_userinfo_homedir_title'>${'USER HOMEDIR'}</div><div id='menu_10_os_info_userinfo_homedir_data'>${server_info.os.userinfo.homedir}</div>`;
            CommonAppDocument.querySelector('#menu_10_process_info').innerHTML =     
                       `<div id='menu_10_process_info_memoryusage_rss_title'>${'MEMORY RSS'}</div><div id='menu_10_process_info_memoryusage_rss_data'>${server_info.process.memoryusage_rss}</div>
                        <div id='menu_10_process_info_memoryusage_heaptotal_title'>${'MEMORY HEAPTOTAL'}</div><div id='menu_10_process_info_memoryusage_heaptotal_data'>${server_info.process.memoryusage_heaptotal}</div>
                        <div id='menu_10_process_info_memoryusage_heapused_title'>${'MEMORY HEAPUSED'}</div><div id='menu_10_process_info_memoryusage_heapused_data'>${server_info.process.memoryusage_heapused}</div>
                        <div id='menu_10_process_info_memoryusage_external_title'>${'MEMORY EXTERNAL'}</div><div id='menu_10_process_info_memoryusage_external_data'>${server_info.process.memoryusage_external}</div>
                        <div id='menu_10_process_info_memoryusage_arraybuffers_title'>${'MEMORY ARRAYBUFFERS'}</div><div id='menu_10_process_info_memoryusage_arraybuffers_data'>${server_info.process.memoryusage_arraybuffers}</div>
                        <div id='menu_10_process_info_uptime_title'>${'UPTIME'}</div><div id='menu_10_process_info_uptime_data'>${seconds_to_time(server_info.process.uptime)}</div>
                        <div id='menu_10_process_info_version_title'>${'NODEJS VERSION'}</div><div id='menu_10_process_info_version_data'>${server_info.process.version}</div>
                        <div id='menu_10_process_info_path_title'>${'PATH'}</div><div id='menu_10_process_info_path_data'>${server_info.process.path}</div>
                        <div id='menu_10_process_info_start_arg_0_title'>${'START ARG 0'}</div><div id='menu_10_process_info_start_arg_0_data'>${server_info.process.start_arg_0}</div>
                        <div id='menu_10_process_info_start_arg_1_title'>${'START ARG 1'}</div><div id='menu_10_process_info_start_arg_1_data'>${server_info.process.start_arg_1}</div>`;
        })
        .catch(()=>{
                CommonAppDocument.querySelector('#menu_10_os_info').classList.remove('css_spinner');
                CommonAppDocument.querySelector('#menu_10_process_info').classList.remove('css_spinner');});
    }
};
/**
 * Checks if tokens have values
 * @returns {boolean}
 */
const admin_token_has_value = () => !(common.COMMON_GLOBAL.token_at=='' && common.COMMON_GLOBAL.token_admin_at =='');

/**
 * App events
 * @param {string} event_type 
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @param {string} event_target_id 
 * @param {HTMLElement|null} event_list_title 
 * @returns {void}
 */
const app_events = (event_type, event, event_target_id, event_list_title=null)=> {
    switch (event_type){
        case 'click':{
            switch (event_target_id){
                case (event_target_id=='select_app_menu1' && event.target.classList.contains('common_select_option'))?event_target_id:'':{
                    show_charts();
                    break;
                }
                case (event_target_id=='select_app_menu5' && event.target.classList.contains('common_select_option'))?event_target_id:'':{
                    nav_click(CommonAppDocument.querySelector('#list_monitor_nav .list_nav_selected_tab').id);
                    break;
                }
                case 'menu_1_broadcast_button':{
                    show_broadcast_dialogue('ALL');
                    break;
                }
                case 'menu_1_checkbox_maintenance':{
                    set_maintenance();
                    break;
                }
                case 'list_user_search_icon':{
                    CommonAppDocument.querySelector('#list_user_account_search_input').focus();
                    CommonAppDocument.querySelector('#list_user_account_search_input').dispatchEvent(new KeyboardEvent('keyup'));
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
                    CommonAppDocument.querySelector('#list_server_log_search_input').focus();
                    CommonAppDocument.querySelector('#list_server_log_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                    break;
                }
                case 'list_monitor_nav_connected':
                case 'list_monitor_nav_app_log':
                case 'list_monitor_nav_server_log':{
                    nav_click(event_target_id);    
                    break;
                }
                case 'list_app_log_first':
                case 'list_app_log_previous':
                case 'list_app_log_next':
                case 'list_app_log_last':{
                    APP_GLOBAL.page_navigation(event_target_id);
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
                case 'list_config_nav_server' :
                case 'list_config_nav_iam_blockip':
                case 'list_config_nav_iam_useragent':
                case 'list_config_nav_iam_policy':{
                    nav_click(event_target_id);
                    break;
                }
                case 'install_db_button_install':{
                    common.show_message('CONFIRM',null,db_install, null, null, common.COMMON_GLOBAL.app_id);
                    break;
                }
                case 'install_db_button_uninstall':{
                    common.show_message('CONFIRM',null,db_uninstall, null, null, common.COMMON_GLOBAL.app_id);
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
                case event_list_title && event_list_title.classList.contains('list_sort_click')?event_target_id:'':{
                    event_list_title!=null?list_sort_click(event_target_id, 
                                    event_list_title.getAttribute('data-column') ?? '',
                                    event_list_title.classList.contains('desc')?'asc':'desc'
                                    ):null;
                    break;
                }
                case event.target.classList.contains('gps_click')?event_target_id:'':{
                    list_item_click('GPS',
                                    {
                                        latitude:   event.target.getAttribute('data-latitude') ?? '',
                                        longitude:  event.target.getAttribute('data-longitude') ?? '',
                                        ip:         event.target.getAttribute('data-ip') ?? '',
                                        id:         0
                                    });
                    break;
                }
                case event.target.classList.contains('chat_click')?event_target_id:'':{
                    list_item_click('CHAT', {latitude:'',
                                             longitude:'',
                                             ip:'',
                                             id: Number(event.target.getAttribute('data-id'))});
                    break;
                }
                case 'list_apps':{
                    if (event.target.classList.contains('common_list_lov_click'))
                        common.lov_event(event, 'APP_CATEGORY');
                    break;
                }
                case 'list_user_account':{
                    if (event.target.classList.contains('common_list_lov_click'))
                        common.lov_event(event, 'APP_ROLE');
                    break;
                }
                case 'send_broadcast_send':{
                    sendBroadcast();
                    break;
                }
                case 'send_broadcast_close':{
                    closeBroadcast();
                    break;
                }
            }
            break;
        }
        case 'change':{
            switch (event_target_id){
                case 'select_system_admin_stat':
                case 'select_year_menu1':
                case 'select_month_menu1':{
                    show_charts();
                    break;
                }
                case 'select_year_menu5':
                case 'select_month_menu5':
                case 'select_day_menu5':{
                    const current_tab = CommonAppDocument.querySelector('#list_monitor_nav .list_nav_selected_tab').id;
                    if (current_tab=='list_monitor_nav_server_log')
                        APP_GLOBAL.monitor_detail_server_log('logdate', 'desc');
                    else
                        nav_click(current_tab);
                    break;
                }
                case 'select_logscope5':{
                    APP_GLOBAL.monitor_detail_server_log('logdate', 'desc');
                    break;
                }
                case 'select_broadcast_type':{
                    set_broadcast_type();
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
                        show_app_parameter(parseInt(common.element_row(event.target).getAttribute('data-app_id') ?? ''));
                    }
                    break;
                }
                case 'list_user_account':{
                    //event on master to automatically show detail records
                    if (APP_GLOBAL.previous_row != common.element_row(event.target)){
                        APP_GLOBAL.previous_row = common.element_row(event.target);
                        show_user_account_logon(parseInt(common.element_row(event.target).getAttribute('data-user_account_id') ?? ''));
                    }
                    break;
                }   
            }
            break;
        }
        case 'input':{
            if (event.target.classList.contains('list_edit')){
                common.element_row(event.target).setAttribute('data-changed-record','1');
                event.target.innerText = event.target.innerText.replace('\n', '');
                //app category LOV
                if (common.element_row(event.target).classList.contains('list_apps_row') && event.target.classList.contains('common_input_lov'))
                    if (event.target.innerText=='')
                        event.target.parentNode.nextElementSibling.querySelector('.common_lov_value').innerText = '';
                    else
                        common.lov_action(event, 'APP_CATEGORY', null, '/server-db_admin/app_category', `id=${event.target.innerText}`, 'GET', 'APP_ACCESS', null);
                //app role LOV
                if (common.element_row(event.target).classList.contains('list_user_account_row') && event.target.classList.contains('common_input_lov')){
                    let app_role_id_lookup='';
                    const old_value =event.target.innerText;
                    //if empty then lookup default
                    if (event.target.innerText=='')
                        app_role_id_lookup='2';
                    else
                        app_role_id_lookup=event.target.innerText;
                    common.lov_action(event, 'APP_ROLE', old_value, '/server-db_admin/app_role', `id=${app_role_id_lookup}`, 'GET', 'APP_ACCESS', null);
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
                        common.typewatch(APP_GLOBAL.monitor_detail_server_log, 'logdate', 'desc');
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
                    const element_previous = common.element_row(event.target).previousSibling;
                    /**@ts-ignore */
                    if (element_previous && element_previous.classList.contains('common_row')){
                        /**@ts-ignore */
                        element_previous.querySelectorAll('.list_edit')[0].focus();
                    }
                }
                if (event.code=='ArrowDown') {
                    APP_GLOBAL.previous_row = common.element_row(event.target);
                    event.preventDefault();
                    //focus on first list_edit item in the row
                    const element_next = common.element_row(event.target).nextSibling;
                    if (element_next){
                        /**@ts-ignore */
                        element_next.querySelectorAll('.list_edit')[0].focus();       
                    }
                }
            }
            break;
        }
    }
};
/**
 * Init
 * @returns {void}
 */
const init = () => {
    //SET GLOBALS
    APP_GLOBAL.previous_row= {};
    APP_GLOBAL.module_leaflet_map_container      ='mapid';
    APP_GLOBAL.service_log_file_interval= '';

    if (common.COMMON_GLOBAL.system_admin!=null){
        common.COMMON_GLOBAL.module_leaflet_style			            ='OpenStreetMap_Mapnik';
        common.COMMON_GLOBAL.module_leaflet_jumpto		                =0;
        common.COMMON_GLOBAL.module_leaflet_popup_offset		        =-25;
    }
    for (let i=1;i<=10;i++){
        CommonAppDocument.querySelector(`#menu_${i}`).style.display='none';
    }
    if (common.COMMON_GLOBAL.system_admin!=null){
        CommonAppDocument.querySelector('#menu_secure').classList.add('system_admin');
        show_menu(1);
    }
    else{
        CommonAppDocument.querySelector('#menu_secure').classList.add('admin');
        show_menu(1);
        common.common_translate_ui(common.COMMON_GLOBAL.user_locale);
    }
};
export {delete_globals, show_menu, app_events, init};