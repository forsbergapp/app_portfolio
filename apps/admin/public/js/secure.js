/**@ts-ignore */
const common = await import('common');

/**@type{{body:{className:string},
 *        querySelector:function,
 *        querySelectorAll:function}} */
const AppDocument = document;

/**
 * @typedef {object}        AppEvent
 * @property {string}       code
 * @property {function}     preventDefault
 * @property {function}     stopPropagation
 * @property {{ id:                 string,
 *              innerHTML:          string,
 *              value:              string,
 *              parentNode:         {nextElementSibling:{querySelector:function}},
 *              nextElementSibling: {dispatchEvent:function},
 *              focus:              function,
 *              getAttribute:       function,
 *              setAttribute:       function,
 *              dispatchEvent:      function,
 *              classList:          {contains:function}
 *            }}  target
 */
/**
 * App globals
 */
const APP_GLOBAL = {
    page:0,
    page_last:0,
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
    APP_GLOBAL.page = 0;
    APP_GLOBAL.page_last = 0;
    APP_GLOBAL.limit = 0;
    APP_GLOBAL.previous_row = {};
    APP_GLOBAL.module_leaflet_map_container = '';
    APP_GLOBAL.service_log_file_interval = '';
};

/**
 * Rounds a number with 2 dceimals
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
 * @returbs {void}
 */
const show_menu = menu => {
    AppDocument.querySelectorAll('.menuitem').forEach((/**@type{HTMLElement}*/content) =>content.classList.remove('menuitem_selected'));
    AppDocument.querySelectorAll('.main_content').forEach((/**@type{HTMLElement}*/content) => {
        content.innerHTML = '';
        content.style.display='none';
    });
    AppDocument.querySelector(`#menu_${menu}_content`).style.display='block';
    AppDocument.querySelector(`#menu_${menu}`).classList.add('menuitem_selected');
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
/**
 * Show charts
 * @returns{Promise.<void>}
 */
const show_charts = async () => {
    if (admin_token_has_value()){
        //chart 1 shows for all apps, app id used for chart 2
        const app_id = AppDocument.querySelector('#select_app_menu1 .common_select_dropdown_value').getAttribute('data-value'); 
        const year = AppDocument.querySelector('#select_year_menu1').value;
        const month = AppDocument.querySelector('#select_month_menu1').value;
        const select_system_admin_stat = common.COMMON_GLOBAL.system_admin!=''?
                                            AppDocument.querySelector('#select_system_admin_stat'):null;
        const system_admin_statGroup = common.COMMON_GLOBAL.system_admin!=''?
                                            select_system_admin_stat.options[select_system_admin_stat.selectedIndex].parentNode.label:null;
        const system_admin_statValues = common.COMMON_GLOBAL.system_admin!=''?
                                            { value: AppDocument.querySelector('#select_system_admin_stat').value,
                                                unique:select_system_admin_stat.options[select_system_admin_stat.selectedIndex].getAttribute('unique'),
                                                statGroup:select_system_admin_stat.options[select_system_admin_stat.selectedIndex].getAttribute('statGroup')
                                            }:{value:0, unique:0, statGroup:0};

        AppDocument.querySelector('#graphBox').classList.add('common_icon','css_spinner');
        AppDocument.querySelector('#graphBox').innerHTML='';
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
        .then((/**@type{string}*/result)=>{
            let html = '';
            /**@type{{  chart:number,
             *          app_id:number,
             *          day:number,
             *          amount:number,
             *          statValue:string}[]} */
            const charts = JSON.parse(result);
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
                if (common.COMMON_GLOBAL.system_admin!='')
                    if (system_admin_statGroup=='REQUEST')
                        legend_text_chart1 = stat.statValue;
                    else
                        legend_text_chart1 = SearchAndGetText(AppDocument.querySelector('#select_system_admin_stat'), stat.statValue);
                else{
                    legend_text_chart1 = Array.from(AppDocument.querySelectorAll('#select_app_menu1 .common_select_option')).filter(app=>parseInt(app.getAttribute('data-value'))==stat.app_id)[0].innerHTML;
                }
                    
                html += `<div id='box1_legend_row' class='box_legend_row'>
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
            if (common.COMMON_GLOBAL.system_admin!=''){
                //as system admin you can filter http codes and application
                legend_text_chart2 = AppDocument.querySelector('#select_system_admin_stat').options[AppDocument.querySelector('#select_system_admin_stat').selectedIndex].text;
                const legend_text_chart2_apps = AppDocument.querySelector('#select_app_menu1 .common_select_dropdown_value').innerHTML;
                box2_legend = ` <div id='box2_legend_row' class='box_legend_row'>
                                    <div id='box2_legend_col1' class='box_legend_col' style='background-color:${bar_color}'></div>
                                    <div id='box2_legend_col2' class='box_legend_col'>${legend_text_chart2}</div>
                                    <div id='box2_legend_col3' class='box_legend_col' style='background-color:${bar_color}'></div>
                                    <div id='box2_legend_col4' class='box_legend_col'>${legend_text_chart2_apps}</div>
                                </div>` ;
            }
                
            else{
                // as admin you can filter application
                legend_text_chart2 = AppDocument.querySelector('#select_app_menu1 .common_select_dropdown_value').innerHTML;
                box2_legend = ` <div id='box2_legend_row' class='box_legend_row'>
                                    <div id='box2_legend_col1' class='box_legend_col' style='background-color:${bar_color}'></div>
                                    <div id='box2_legend_col2' class='box_legend_col'>${legend_text_chart2}</div>
                                </div>` ;
            }
            let box_title_class;
            if (common.COMMON_GLOBAL.system_admin!='')
                box_title_class = 'system_admin';
            else
                box_title_class = 'admin';

            AppDocument.querySelector('#graphBox').innerHTML =  
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
            AppDocument.querySelector('#graphBox').classList.remove('common_icon','css_spinner');
        })
        .catch(()=>AppDocument.querySelector('#graphBox').classList.remove('common_icon','css_spinner')); 
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
            common.FFB('LOG', '/log/statuscode?', 'GET', 'SYSTEMADMIN', null)
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
                AppDocument.querySelector('#menu_1_content').classList.remove('common_icon', 'css_spinner');
                resolve(html);
            })
            .catch(()=>{
                AppDocument.querySelector('#menu_1_content').classList.remove('common_icon', 'css_spinner');
                resolve(null);
            });
        });
    };
    AppDocument.querySelector('#menu_1_content').innerHTML = 
            `<div id='menu_1_content_widget1' class='widget'>
                <div id='menu_1_row_sample'>
                    <select id='select_system_admin_stat'>${common.COMMON_GLOBAL.system_admin!=''?await get_system_admin_stat():null}</select>
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
    if (common.COMMON_GLOBAL.system_admin!=''){
        AppDocument.querySelector('#menu_1_maintenance').style.display = 'inline-block';
        AppDocument.querySelector('#select_system_admin_stat').style.display = 'inline-block';
    }
    else{
        AppDocument.querySelector('#menu_1_maintenance').style.display = 'none';
        AppDocument.querySelector('#select_system_admin_stat').style.display = 'none';
    }    
    AppDocument.querySelector('#select_year_menu1').selectedIndex = 0;
    AppDocument.querySelector('#select_month_menu1').selectedIndex = new Date().getMonth();

    if (common.COMMON_GLOBAL.system_admin!='')
        check_maintenance();
    show_charts();
};
/**
 * Get user agent
 * @param {string} user_agent 
 * @returns {string}
 */
const show_user_agent = user_agent => {
    return user_agent;
};
/**
 * Get apps div select HTML
 * @returns{Promise.<string|null>}
 */
const get_apps_div = async () =>{
    return new Promise((resolve)=>{
        let options = '';
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
        .then((/**@type{string}*/result)=>{
            const apps = JSON.parse(result);
            if (common.COMMON_GLOBAL.system_admin!='')
                for (const app of apps) {
                    options += `<div class='common_select_option' data-value='${app.APP_ID}'>${app.APP_ID} - ${' '}</div>`;
                }
            else
                for (const app of apps) {
                    options += `<div class='common_select_option' data-value='${app.ID}'>${app.ID} - ${app.NAME}</div>`;
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
 * Get apps select semantic HTML 
 * @returns{Promise.<string|null>}
 */
const get_apps = async () => {
    return new Promise((resolve)=>{
        let html = `<option value=''>${'∞'}</option>`;
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
        .then((/**@type{string}*/result)=>{
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

/**
 * Broadcast send
 * @returns{void}
 */
const sendBroadcast = () => {
    let broadcast_type ='';
    let client_id;
    let app_id;
    const broadcast_message = AppDocument.querySelector('#send_broadcast_message').innerHTML;

    if (broadcast_message==''){
        common.show_message('INFO', null, null, 'message_text', '!', common.COMMON_GLOBAL.app_id);
    }
    else{
        if (AppDocument.querySelector('#client_id').innerHTML==''){
            app_id = AppDocument.querySelector('#select_app_broadcast').options[AppDocument.querySelector('#select_app_broadcast').selectedIndex].value;
            client_id = '';
            broadcast_type = AppDocument.querySelector('#select_broadcast_type .common_select_dropdown_value').getAttribute('data-value');
        }
        else{
            client_id = AppDocument.querySelector('#client_id').innerHTML;
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
    AppDocument.querySelector('#dialogue_send_broadcast').style.visibility='hidden'; 
    AppDocument.querySelector('#client_id_label').style.display='inline-block';
    AppDocument.querySelector('#client_id').style.display='inline-block';
    AppDocument.querySelector('#select_app_broadcast').style.display='inline-block';
    AppDocument.querySelector('#client_id').innerHTML='';
    AppDocument.querySelector('#send_broadcast_message').innerHTML='';
};
/**
 * Broadcast close
 * @param {string} dialogue_type 
 * @param {number|null} client_id 
 * @returns{Promise.<void>}
 */
const show_broadcast_dialogue = async (dialogue_type, client_id=null) => {
    AppDocument.querySelector('#select_app_broadcast').innerHTML = await get_apps();
    switch (dialogue_type){
        case 'CHAT':{
            //hide and set INFO, should not be able to send MAINTENANCE message here
            AppDocument.querySelector('#select_broadcast_type').style.display='none';
            //hide app selection
            AppDocument.querySelector('#select_app_broadcast').style.display='none';
            //show client id
            AppDocument.querySelector('#client_id_label').style.display = 'inline-block';
            AppDocument.querySelector('#client_id').style.display = 'inline-block';
            AppDocument.querySelector('#client_id').innerHTML = client_id;
            break;
        }
        case 'APP':{
            //hide and set INFO, should not be able to send MAINTENANCE message here
            AppDocument.querySelector('#select_broadcast_type').style.display='none';
            //show app selection
            AppDocument.querySelector('#select_app_broadcast').style.display='block';
            //hide client id
            AppDocument.querySelector('#client_id_label').style.display = 'none';
            AppDocument.querySelector('#client_id').style.display = 'none';
            AppDocument.querySelector('#client_id').innerHTML = '';
            break;
        }
        case 'ALL':{
            //show broadcast type and INFO
            AppDocument.querySelector('#select_broadcast_type').style.display='inline-block';
            //show app selection
            AppDocument.querySelector('#select_app_broadcast').style.display='block';
            //hide client id
            AppDocument.querySelector('#client_id_label').style.display = 'none';
            AppDocument.querySelector('#client_id').style.display = 'none';
            AppDocument.querySelector('#client_id').innerHTML = '';
            break;
        }
    }
    AppDocument.querySelector('#dialogue_send_broadcast').style.visibility='visible';
};
/**
 * Broadcast set type
 * @returns{void}
 */
const set_broadcast_type = () => {
    switch (AppDocument.querySelector('#select_broadcast_type .common_select_dropdown_value').getAttribute('data-value')){
        case 'ALERT':{
            //show app selection
            AppDocument.querySelector('#select_app_broadcast').style.display='block';
            //hide client id
            AppDocument.querySelector('#client_id_label').style.display = 'none';
            AppDocument.querySelector('#client_id').style.display = 'none';
            AppDocument.querySelector('#client_id').innerHTML = '';
            break;
        }
        case 'MAINTENANCE':{
            //hide app selection
            AppDocument.querySelector('#select_app_broadcast').style.display='none';
            //hide client id
            AppDocument.querySelector('#client_id_label').style.display = 'none';
            AppDocument.querySelector('#client_id').style.display = 'none';
            AppDocument.querySelector('#client_id').innerHTML = '';
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
        await common.FFB('SERVER', '/config/systemadmin/maintenance?', 'GET', 'SYSTEMADMIN', null)
        .then((/**@type{string}*/result)=>{
            if (JSON.parse(result).value==1)
                AppDocument.querySelector('#menu_1_checkbox_maintenance').classList.add('checked');
            else
                AppDocument.querySelector('#menu_1_checkbox_maintenance').classList.remove('checked');
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
        if (AppDocument.querySelector('#menu_1_checkbox_maintenance').classList.contains('checked'))
            check_value = 1;
        else
            check_value = 0;
        const json_data = {value: check_value};
        common.FFB('SERVER', '/config/systemadmin/maintenance?', 'PATCH', 'SYSTEMADMIN', json_data).catch(()=>null);
    }
};
/**
 * Display stat of users
  * @returns{Promise.<void>}
 */
const count_users = async () => {
    AppDocument.querySelector('#menu_2_content').innerHTML =
               `<div id='menu_2_content' class='main_content'>
                    <div id='menu_2_content_widget1' class='widget'>
                        <div id='list_user_stat_row_title' class='list_user_stat_row'>
                            <div id='list_user_stat_col_title1' class='list_user_stat_col common_icon'></div>
                            <div id='list_user_stat_col_title2' class='list_user_stat_col common_icon'></div>
                            <div id='list_user_stat_col_title3' class='list_user_stat_col common_icon'></div>
                            <div id='list_user_stat_col_title4' class='list_user_stat_col common_icon'></div>
                        </div>
                        <div id='list_user_stat' class='common_list_scrollbar'></div>
                    </div>
                </div>`;
    const count_connected = async () => {
        /**
         * Count users for given provider and if logged in or not
         * @param {string} identity_provider_id 
         * @param {number} count_logged_in 
         * @returns{Promise.<{count_connected:number}>}
         */
        const get_count = async (identity_provider_id, count_logged_in) => {
            return await common.FFB('SOCKET', `/socket/connection/Admin/count?identity_provider_id=${identity_provider_id}&count_logged_in=${count_logged_in}`, 'GET', 'APP_ACCESS', null)
            .then((/**@type{string}*/result)=>JSON.parse(result))
            .catch((/**@type{Error}*/err)=>{throw err;});
        };
        for (const row of AppDocument.querySelectorAll('.list_user_stat_row')){
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
        AppDocument.querySelector('#list_user_stat').classList.add('common_icon', 'css_spinner');
        AppDocument.querySelector('#list_user_stat').innerHTML = '';
        await common.FFB('DB_API', '/user_account/admin/count?', 'GET', 'APP_ACCESS', null)
        .then((/**@type{string}*/result)=>{
            let html='';
            let i=0;
            for (const user of JSON.parse(result)){
                html +=  `<div id='list_user_stat_row_${i}' class='list_user_stat_row'>
                                <div class='list_user_stat_col'>
                                    <div>${user.identity_provider_id ?? ''}</div>
                                </div>
                                <div class='list_user_stat_col'>
                                    <div class='${user.provider_name==null?'list_user_start_common_logo':''}'>${user.provider_name==null?'':user.provider_name}</div>
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
                            <div id='list_user_stat_not_connected_icon' class='common_icon'></div>
                        </div>
                        <div class='list_user_stat_col'>
                            <div></div>
                        </div>
                        <div class='list_user_stat_col'>
                            <div></div>
                        </div>
                    </div>`;
            AppDocument.querySelector('#list_user_stat').classList.remove('common_icon', 'css_spinner');
            AppDocument.querySelector('#list_user_stat').innerHTML = html;
            //count logged in
            count_connected();
        })
        .catch(()=>AppDocument.querySelector('#list_user_stat').classList.remove('common_icon', 'css_spinner'));
    }
};
/**
 * Show users
 * @returns {void}
 */
const show_users = () =>{
    AppDocument.querySelector('#menu_3_content').innerHTML = 
            `<div id='menu_3_content_widget1' class='widget'>
                <div id='list_user_account_title' class='common_icon'></div>
                <div class='list_search'>
                    <div id='list_user_account_search_input' contenteditable=true class='common_input list_search_input' /></div>
                    <div id='list_user_search_icon' 'class='list_search_icon common_icon'></div>
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

    if (common.input_control(null,{check_valid_list:[[AppDocument.querySelector('#list_user_account_search_input'),100]]})==false)
        return;

    AppDocument.querySelector('#list_user_account').classList.add('common_icon', 'css_spinner');
    AppDocument.querySelector('#list_user_account').innerHTML = '';
    let search_user='*';
    //show all records if no search criteria
    if (AppDocument.querySelector('#list_user_account_search_input').innerText!='')
        search_user = encodeURI(AppDocument.querySelector('#list_user_account_search_input').innerText);
    common.FFB('DB_API', `/user_account/admin?search=${search_user}&sort=${sort}&order_by=${order_by}`, 'GET', 'APP_ACCESS', null)
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
                    <div ${input_contentEditable} class='common_input list_edit ${lov_class}' defaultValue='${user.app_role_id ?? ''}'/>${user.app_role_id ?? ''}</div>
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
        AppDocument.querySelector('#list_user_account').classList.remove('common_icon', 'css_spinner');
        AppDocument.querySelector('#list_user_account').innerHTML = html;
        AppDocument.querySelector(`#list_user_account .list_title[data-column='${sort}']`).classList.add(order_by);
    
        if (focus==true){
            //set focus at start
            //set focus first column in first row
            //this will trigger to show detail records
            if (AppDocument.querySelectorAll('#list_user_account .list_edit')[0].getAttribute('readonly')==true){
                AppDocument.querySelectorAll('#list_user_account .list_edit')[0].setAttribute('readonly', false);
                AppDocument.querySelectorAll('#list_user_account .list_edit')[0].focus();
                AppDocument.querySelectorAll('#list_user_account .list_edit')[0].setAttribute('readonly', true);
            }
            else
                AppDocument.querySelectorAll('#list_user_account .list_edit')[0].focus();
                
        }
        else{
            //trigger focus event on first row set focus back again to search field
            AppDocument.querySelectorAll('#list_user_account .list_edit')[0].focus();
            AppDocument.querySelector('#list_user_account_search_input').focus();
        }
    })
    .catch(()=>AppDocument.querySelector('#list_user_account').classList.remove('common_icon', 'css_spinner'));
};
/**
 * Show user account logon
 * @param {number} user_account_id 
 */
const show_user_account_logon = async (user_account_id) => {
    AppDocument.querySelector('#list_user_account_logon').classList.add('common_icon', 'css_spinner');
    AppDocument.querySelector('#list_user_account_logon').innerHTML = '';
    common.FFB('DB_API', `/user_account_logon/admin?data_user_account_id=${user_account_id}&data_app_id=''`, 'GET', 'APP_ACCESS', null)
    .then((/**@type{string}*/result)=>{
        let html = `<div id='list_user_account_logon_row_title' class='list_user_account_logon_row'>
                        <div id='list_user_account_logon_col_title1' class='list_user_account_logon_col list_title'>USER ACCOUNT ID</div>
                        <div id='list_user_account_logon_col_title4' class='list_user_account_logon_col list_title'>DATE CREATED</div>
                        <div id='list_user_account_logon_col_title1' class='list_user_account_logon_col list_title'>APP ID</div>
                        <div id='list_user_account_logon_col_title1' class='list_user_account_logon_col list_title'>RESULT</div>
                        <div id='list_user_account_logon_col_title2' class='list_user_account_logon_col list_title'>IP</div>
                        <div id='list_user_account_logon_col_title4' class='list_user_account_logon_col list_title'>GPS LONG</div>
                        <div id='list_user_account_logon_col_title4' class='list_user_account_logon_col list_title'>GPS LAT</div>
                        <div id='list_user_account_logon_col_title3' class='list_user_account_logon_col list_title'>USER AGENT</div>
                        <div id='list_user_account_logon_col_title1' class='list_user_account_logon_col list_title'>ACCESS TOKEN</div>
                    </div>`;
        let i=0;
        for (const user_account_logon of JSON.parse(result)) {
            html += 
            `<div id='list_user_account_logon_row_${i}' data-changed-record='0' class='list_user_account_logon_row'>
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
            i++;
        }
        AppDocument.querySelector('#list_user_account_logon').classList.remove('common_icon', 'css_spinner');
        AppDocument.querySelector('#list_user_account_logon').innerHTML = html;
    })
    .catch(()=>AppDocument.querySelector('#list_user_account_logon').classList.remove('common_icon', 'css_spinner'));
};
/**
 * Show apps
 * @returns{Promise.<void>}
 */
const show_apps = async () => {
    AppDocument.querySelector('#menu_4_content').innerHTML = 
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
    await common.FFB('APP', '/apps/admin?', 'GET', 'APP_ACCESS', null)
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
                    <div contenteditable=true class='common_input list_edit common_input_lov' defaultValue='${app.APP_CATEGORY_ID ?? ''}'/>${app.APP_CATEGORY_ID ?? ''}</div>
                    <div class='common_lov_button common_list_lov_click common_icon'></div>
                </div>
                <div class='list_apps_col'>
                    <div class='list_readonly common_lov_value'>${app.APP_CATEGORY_TEXT ?? ''} </div>
                </div>
            </div>`;
        }
        AppDocument.querySelector('#list_apps').classList.remove('common_icon', 'css_spinner');
        AppDocument.querySelector('#list_apps').innerHTML = html;
        //set focus first column in first row
        //this will trigger to show detail records
        AppDocument.querySelectorAll('#list_apps .list_edit')[0].focus();
    })
    .catch(()=>AppDocument.querySelector('#list_apps').classList.remove('common_icon', 'css_spinner'));
};
/**
 * 
 * @param {number} app_id 
 * @returns{void}
 */
const show_app_parameter = (app_id) => {
    AppDocument.querySelector('#list_app_parameter').classList.add('common_icon', 'css_spinner');
    AppDocument.querySelector('#apps_save').style.display = 'none';
    AppDocument.querySelector('#list_app_parameter').innerHTML = '';
    common.FFB('DB_API', `/app_parameter/admin/all?data_app_id=${app_id}`, 'GET', 'APP_ACCESS', null)
    .then((/**@type{string}*/result)=>{
        let html = `<div id='list_app_parameter_row_title' class='list_app_parameter_row'>
                        <div id='list_app_parameter_col_title1' class='list_app_parameter_col list_title'>APP ID</div>
                        <div id='list_app_parameter_col_title1' class='list_app_parameter_col list_title'>TYPE ID</div>
                        <div id='list_app_parameter_col_title1' class='list_app_parameter_col list_title'>TYPE NAME</div>
                        <div id='list_app_parameter_col_title2' class='list_app_parameter_col list_title'>NAME</div>
                        <div id='list_app_parameter_col_title3' class='list_app_parameter_col list_title'>VALUE</div>
                        <div id='list_app_parameter_col_title4' class='list_app_parameter_col list_title'>COMMENT</div>
                    </div>`;
        for (const app_parameter of JSON.parse(result)) {
            html += 
            `<div data-changed-record='0' class='list_app_parameter_row common_row'>
                <div class='list_app_parameter_col'>
                    <div class='list_readonly'>${app_parameter.app_id}</div>
                </div>
                <div class='list_app_parameter_col'>
                    <div contenteditable=true class='common_input list_edit common_input_lov' defaultValue='${app_parameter.parameter_type_id}'/>${app_parameter.parameter_type_id}</div>
                    <div class='common_lov_button common_list_lov_click common_icon'></div>
                </div>
                <div class='list_app_parameter_col'>
                    <div class='list_readonly common_lov_value'>${app_parameter.parameter_type_text}</div>
                </div>
                <div class='list_app_parameter_col'>
                    <div class='list_readonly'>${app_parameter.parameter_name}</div>
                </div>
                <div class='list_app_parameter_col'>
                    <div contenteditable=true class='common_input list_edit'/>${app_parameter.parameter_value ?? ''}</div>
                </div>
                <div class='list_app_parameter_col'>
                    <div contenteditable=true class='common_input list_edit'/>${app_parameter.parameter_comment ?? ''}</div>
                </div>
            </div>`;
        }
        AppDocument.querySelector('#list_app_parameter').classList.remove('common_icon', 'css_spinner');
        AppDocument.querySelector('#apps_save').style.display = 'inline-block';
        AppDocument.querySelector('#list_app_parameter').innerHTML = html;
    })
    .catch(()=>AppDocument.querySelector('#list_app_parameter').classList.remove('common_icon', 'css_spinner'));
};
/**
 * Button save
 * @param {string} item 
 */
const button_save = async (item) => {
    if (item=='apps_save'){
        //save changes in list_apps
        let x = AppDocument.querySelectorAll('.list_apps_row');
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
                                                        parameter_type_id:0,
                                                        parameter_name:'',
                                                        parameter_value:'',
                                                        parameter_comment:''}});
            }
        }
        //save changes in list_app_parameter
        x = AppDocument.querySelectorAll('.list_app_parameter_row');
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
                                                        parameter_type_id: record.children[1].children[0].innerHTML,
                                                        parameter_name:  record.children[3].children[0].innerHTML,
                                                        parameter_value: record.children[4].children[0].innerHTML,
                                                        parameter_comment: record.children[5].children[0].innerHTML}});
            }
        }
    }
    else 
        if (item == 'users_save'){
            //save changes in list_user_account
            const x = AppDocument.querySelectorAll('.list_user_account_row');
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
                                                            parameter_type_id: 0,
                                                            parameter_name:  '',
                                                            parameter_value: '',
                                                            parameter_comment: ''}});
                }
            }
        }
        else
            if (item == 'config_save'){
                const config_create_server_json = () => {
                    /**@type{object[]} */
                    const config_json = [];
                    AppDocument.querySelectorAll('#list_config .list_config_group').forEach((/**@type{HTMLElement}*/e_group) => 
                        {
                            let config_group='';
                            AppDocument.querySelectorAll(`#${e_group.id} .list_config_row`).forEach((/**@type{HTMLElement}*/e_row) => 
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
                const file = AppDocument.querySelectorAll('#menu_6_content .list_nav .list_nav_selected_tab')[0].id.substring(16).toUpperCase();
                const json_data = { config_json:    [
                                                    ['CONFIG',                  file=='CONFIG'?config_create_server_json():null],
                                                    ['APPS',                    file=='APPS'?JSON.parse(AppDocument.querySelector('#list_config_edit').innerHTML):null],
                                                    ['IAM_BLOCKIP',             file=='IAM_BLOCKIP'?JSON.parse(AppDocument.querySelector('#list_config_edit').innerHTML):null],
                                                    ['IAM_POLICY',              file=='IAM_POLICY'?JSON.parse(AppDocument.querySelector('#list_config_edit').innerHTML):null],
                                                    ['IAM_USERAGENT',           file=='IAM_USERAGENT'?JSON.parse(AppDocument.querySelector('#list_config_edit').innerHTML):null],
                                                    ['IAM_USER',                file=='IAM_USER'?JSON.parse(AppDocument.querySelector('#list_config_edit').innerHTML):null],
                                                    ['MICROSERVICE_CONFIG',     file=='MICROSERVICE_CONFIG'?JSON.parse(AppDocument.querySelector('#list_config_edit').innerHTML):null],
                                                    ['MICROSERVICE_SERVICES',   file=='MICROSERVICE_SERVICES'?JSON.parse(AppDocument.querySelector('#list_config_edit').innerHTML):null]
                                                    ]};
                AppDocument.querySelector('#' + item).classList.add('css_spinner');
                common.FFB('SERVER', '/config/systemadmin?', 'PUT', 'SYSTEMADMIN', json_data)
                .then(()=>AppDocument.querySelector('#' + item).classList.remove('css_spinner'))
                .catch(()=>AppDocument.querySelector('#' + item).classList.remove('css_spinner'));
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
 *                          parameter_type_id:number,
 *                          parameter_name:string,
 *                          parameter_value:string,
 *                          parameter_comment:string}}} parameters
 */
const update_record = async (table, 
                             row_element,
                             button,
                             parameters) => {
    if (admin_token_has_value()){
        let path;
        let json_data;
        let token_type;
        AppDocument.querySelector('#' + button).classList.add('css_spinner');
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
                path = `/user_account/admin?PUT_ID=${parameters.user_account.id}`;
                token_type = 'SUPERADMIN';
                break;
            }
            case 'app':{
                json_data = {   
                                app_category_id:parameters.app.app_category_id
                            };
                path = `/apps/admin?PUT_ID=${parameters.app.id}`;
                token_type = 'APP_ACCESS';
                break;
            }
            case 'app_parameter':{
                json_data = {   app_id:             parameters.app_parameter.app_id,
                                parameter_name:     parameters.app_parameter.parameter_name,
                                parameter_type_id:  parameters.app_parameter.parameter_type_id,
                                parameter_value:    parameters.app_parameter.parameter_value,
                                parameter_comment:  parameters.app_parameter.parameter_comment};
                path = '/app_parameter/admin?';
                token_type = 'APP_ACCESS';
                break;
            }
        }
        await common.FFB('DB_API', path, 'PUT', token_type, json_data)
        .then(()=>{ row_element.setAttribute('data-changed-record', '0');
                    AppDocument.querySelector('#' + button).classList.remove('css_spinner');})
        .catch(()=>AppDocument.querySelector('#' + button).classList.remove('css_spinner'));
    }
};

/**
 * Show monitor
 * @param {string} yearvalues 
 * @returns{Promise.<void>}
 */
const show_monitor = async (yearvalues) =>{
    AppDocument.querySelector('#menu_5_content').innerHTML = 
        `<div id='menu_5_content_widget1' class='widget'>
            <div id='list_monitor_nav' class='list_nav'>
                <div id='list_monitor_nav_connected' class='list_nav_list list_button common_icon'></div>
                <div id='list_monitor_nav_app_log' class='list_nav_list list_nav_list_hide list_button common_icon'></div>
                <div id='list_monitor_nav_server_log' class='list_nav_list list_nav_list_hide list_button common_icon'></div>
            </div>
            <div id='list_row_sample' class='common_icon css_spinner'></div>
            <div id='list_connected_form'>    
                <div id='list_connected' class='common_list_scrollbar'></div>
            </div>
            <div id='list_app_log_form'>
                <div id='list_app_log' class='common_list_scrollbar'></div>
                <div id='list_app_pagination'>
                    <div id='list_app_log_first' class='common_icon'></div>
                    <div id='list_app_log_previous' class='common_icon'></div>
                    <div id='list_app_log_next' class='common_icon'></div>
                    <div id='list_app_log_last' class='common_icon'></div>
                </div>
            </div>
            <div id='list_server_log_form'>
                <div id='menu5_row_parameters'>
                    <div class='menu5_row_parameters_col'>
                        <div id='menu5_row_parameters_col1' class='common_icon'></div>
                        <div id='menu5_row_parameters_col1_1' class='common_icon'></div>
                        <div id='menu5_row_parameters_col1_0' class='common_icon'></div>
                    </div>
                    <div class='menu5_row_parameters_col'>
                        <div id='menu5_row_parameters_col2' class='common_icon'></div>
                        <div id='menu5_row_parameters_col2_1' class='common_icon'></div>
                        <div id='menu5_row_parameters_col2_0' class='common_icon'></div>
                    </div>
                    <div class='menu5_row_parameters_col'>
                        <div id='menu5_row_parameters_col3' class='common_icon'></div>
                        <div id='menu5_row_parameters_col3_1' class='common_icon'></div>
                        <div id='menu5_row_parameters_col3_0' class='common_icon'></div>
                    </div>
                </div>
                <div class='list_search'>
                    <div id='list_server_log_search_input' contenteditable=true class='common_input list_search_input'/></div>
                    <div id='list_server_log_search_icon' class='list_search_icon common_icon'></div>
                </div>
                <div id='list_server_log' class='common_list_scrollbar'></div>
            </div>
        </div>
        <div id='menu_5_content_widget2' class='widget'>
            <div id='mapid'></div>
        </div>`;
    if (common.COMMON_GLOBAL.system_admin!='')
        AppDocument.querySelector('#list_monitor_nav_server_log').classList.remove('list_nav_list_hide');
    else
        AppDocument.querySelector('#list_monitor_nav_app_log').classList.remove('list_nav_list_hide');
    
    //both admin and system admin:
    const monitor_apps =  await get_apps();
    const monitor_years = yearvalues;
    const monitor_month = list_generate(12);
    const monitor_day = common.COMMON_GLOBAL.system_admin!=''?list_generate(31):'';
    
    const monitor_log_data = common.COMMON_GLOBAL.system_admin !=''?await get_log_parameters():{parameters:{SERVICE_LOG_SCOPE_REQUEST:'',
                                                                                                            SERVICE_LOG_SCOPE_SERVER:'', 
                                                                                                            SERVICE_LOG_SCOPE_SERVICE:'',
                                                                                                            SERVICE_LOG_SCOPE_APP:'',
                                                                                                            SERVICE_LOG_SCOPE_DB:'',
                                                                                                            SERVICE_LOG_REQUEST_LEVEL:0,
                                                                                                            SERVICE_LOG_SERVICE_LEVEL:0,
                                                                                                            SERVICE_LOG_DB_LEVEL:0,
                                                                                                            SERVICE_LOG_LEVEL_VERBOSE:'',
                                                                                                            SERVICE_LOG_LEVEL_ERROR:'',
                                                                                                            SERVICE_LOG_LEVEL_INFO:'',
                                                                                                            SERVICE_LOG_FILE_INTERVAL:''},
                                                                                                logscope_level_options:''};

    //fetch geolocation once
    if ((common.COMMON_GLOBAL.client_longitude && common.COMMON_GLOBAL.client_latitude)==false)
        await common.get_gps_from_ip();
    let path;
    let token_type = '';
    if (common.COMMON_GLOBAL.system_admin!=''){
        path  = '/config/systemadmin?config_group=SERVICE_DB&parameter=LIMIT_LIST_SEARCH';
        token_type = 'SYSTEMADMIN';
    }
    else{
        path  = '/config/admin?config_group=SERVICE_DB&parameter=LIMIT_LIST_SEARCH';
        token_type = 'APP_ACCESS';
    }      
    const result_limit = await common.FFB('SERVER', path, 'GET', token_type, null).catch(()=> null);
    APP_GLOBAL.limit = parseInt(JSON.parse(result_limit).data);

    AppDocument.querySelector('#list_row_sample').classList.remove('common_icon','css_spinner');
    AppDocument.querySelector('#list_row_sample').innerHTML = 
                        `<select id='select_logscope5'>${monitor_log_data.logscope_level_options}</select>
                         <select id='select_app_menu5'>${monitor_apps}</select>
                         <select id='select_year_menu5'>${monitor_years}</select>
                         <select id='select_month_menu5'>${monitor_month}</select>
                         <select id='select_day_menu5'>${monitor_day}</select>
                         <div id='filesearch_menu5' class='common_dialogue_button common_icon'></div>`;
    if (common.COMMON_GLOBAL.system_admin!=''){
        //server log
        AppDocument.querySelector('#select_day_menu5').selectedIndex = new Date().getDate() -1;
        
        AppDocument.querySelector('#menu5_row_parameters_col1_1').style.display = 'none';
        AppDocument.querySelector('#menu5_row_parameters_col1_0').style.display = 'none';
        AppDocument.querySelector('#menu5_row_parameters_col2_1').style.display = 'none';
        AppDocument.querySelector('#menu5_row_parameters_col2_0').style.display = 'none';
        AppDocument.querySelector('#menu5_row_parameters_col3_1').style.display = 'none';
        AppDocument.querySelector('#menu5_row_parameters_col3_0').style.display = 'none';
        if (monitor_log_data.parameters.SERVICE_LOG_REQUEST_LEVEL==1 ||monitor_log_data.parameters.SERVICE_LOG_REQUEST_LEVEL==2)
                AppDocument.querySelector('#menu5_row_parameters_col1_1').style.display = 'inline-block';
            else
                AppDocument.querySelector('#menu5_row_parameters_col1_0').style.display = 'inline-block';
            if (monitor_log_data.parameters.SERVICE_LOG_SERVICE_LEVEL==1 || monitor_log_data.parameters.SERVICE_LOG_SERVICE_LEVEL==2)
                AppDocument.querySelector('#menu5_row_parameters_col2_1').style.display = 'inline-block';
            else
                AppDocument.querySelector('#menu5_row_parameters_col2_0').style.display = 'inline-block';
            if (monitor_log_data.parameters.SERVICE_LOG_DB_LEVEL==1 || monitor_log_data.parameters.SERVICE_LOG_DB_LEVEL==2)
                AppDocument.querySelector('#menu5_row_parameters_col3_1').style.display = 'inline-block';
            else
                AppDocument.querySelector('#menu5_row_parameters_col3_0').style.display = 'inline-block';
        if (APP_GLOBAL.service_log_file_interval=='1M')
            AppDocument.querySelector('#select_day_menu5').style.display = 'none';
        else
            AppDocument.querySelector('#select_day_menu5').style.display = 'inline-block';
    }
    else{
        //app log
        AppDocument.querySelector('#select_logscope5').style.display = 'none';
        AppDocument.querySelector('#select_day_menu5').style.display = 'none';
        AppDocument.querySelector('#filesearch_menu5').style.display = 'none';
    }
    AppDocument.querySelector('#select_year_menu5').selectedIndex = 0;
    AppDocument.querySelector('#select_month_menu5').selectedIndex = new Date().getMonth();

    
    if (common.COMMON_GLOBAL.system_admin=='')
        APP_GLOBAL.page = 0;
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
    nav_click('list_monitor_nav_connected'); 
};

/**
 * Navigation click
 * @param {string} item_id 
 * @returns{void}
 */
const nav_click = (item_id) => {
    const reset_monitor = () => {
        AppDocument.querySelector('#list_monitor_nav_connected').classList.remove('list_nav_selected_tab');
        AppDocument.querySelector('#list_monitor_nav_app_log').classList.remove('list_nav_selected_tab');
        AppDocument.querySelector('#list_monitor_nav_server_log').classList.remove('list_nav_selected_tab');
    };
    const reset_config = () => {
        AppDocument.querySelector('#list_config_nav_config').classList.remove('list_nav_selected_tab');
        AppDocument.querySelector('#list_config_nav_iam_blockip').classList.remove('list_nav_selected_tab');
        AppDocument.querySelector('#list_config_nav_iam_useragent').classList.remove('list_nav_selected_tab');
        AppDocument.querySelector('#list_config_nav_iam_policy').classList.remove('list_nav_selected_tab');
    };
    
    switch (item_id){
        //MONITOR
        case 'list_monitor_nav_connected':{
            reset_monitor();
            AppDocument.querySelector('#list_connected_form').style.display='flex';
            AppDocument.querySelector('#list_app_log_form').style.display='none';
            AppDocument.querySelector('#list_server_log_form').style.display='none';
            AppDocument.querySelector('#list_monitor_nav_connected').classList.add('list_nav_selected_tab');
            show_connected();
            break;
        }
        case 'list_monitor_nav_app_log':{
            reset_monitor();
            AppDocument.querySelector('#list_connected_form').style.display='none';
            AppDocument.querySelector('#list_app_log_form').style.display='flex';
            AppDocument.querySelector('#list_server_log_form').style.display='none';
            AppDocument.querySelector('#list_monitor_nav_app_log').classList.add('list_nav_selected_tab');
            APP_GLOBAL.page = 0;
            show_app_log();
            break;
        }
        case 'list_monitor_nav_server_log':{
            reset_monitor();
            AppDocument.querySelector('#list_connected_form').style.display='none';
            AppDocument.querySelector('#list_app_log_form').style.display='none';
            AppDocument.querySelector('#list_server_log_form').style.display='block';
            AppDocument.querySelector('#list_monitor_nav_server_log').classList.add('list_nav_selected_tab');
            show_server_logs('logdate', 'desc', AppDocument.querySelector('#list_server_log_search_input').innerText);
            break;
        }
        //SERVER CONFIG
        case 'list_config_nav_config':{
            reset_config();
            AppDocument.querySelector('#list_config_nav_config').classList.add('list_nav_selected_tab');
            show_config('CONFIG');
            break;
        }
        case 'list_config_nav_iam_blockip':{
            reset_config();
            AppDocument.querySelector('#list_config_nav_iam_blockip').classList.add('list_nav_selected_tab');
            show_config('IAM_BLOCKIP');
            break;
        }
        case 'list_config_nav_iam_useragent':{
            reset_config();
            AppDocument.querySelector('#list_config_nav_iam_useragent').classList.add('list_nav_selected_tab');
            show_config('IAM_USERAGENT');
            break;
        }
        case 'list_config_nav_iam_policy':{
            reset_config();
            AppDocument.querySelector('#list_config_nav_iam_policy').classList.add('list_nav_selected_tab');
            show_config('IAM_POLICY');
            break;
        }
    }
};
/**
 * Show list
 * @param {string} list_div 
 * @param {string} url_parameters 
 * @param {string} sort 
 * @param {string} order_by 
 */
const show_list = async (list_div, url_parameters, sort, order_by) => {
    if (admin_token_has_value()){
        /**@type{string} */
        let logscope;
        let logs;
        let token_type;
        let path;
        let service;
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
                break;
            }
            case 'list_app_log':{
                path = `/app_log/admin?${url_parameters}`;
                service = 'DB_API';
                token_type = 'APP_ACCESS';
                break;
            }
            case 'list_server_log':{
                logscope = AppDocument.querySelector('#select_logscope5')[AppDocument.querySelector('#select_logscope5').selectedIndex].getAttribute('log_scope');
                path = `/log/logs?${url_parameters}`;
                service = 'LOG';
                token_type = 'SYSTEMADMIN';
                break;
            }
        }
        AppDocument.querySelector('#' + list_div).classList.add('css_spinner');
        AppDocument.querySelector('#' + list_div).innerHTML = '';
        common.FFB(service, path, 'GET', token_type, null)
        .then((/**@type{string}*/result)=>{
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
                                app_role_class = 'app_role_system_admin common_icon';
                                app_role_icon = '';
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
                                            ${log.user_account_id ?? ''}
                                        </div>
                                        <div class='list_connected_col'>
                                            ${log.system_admin}
                                        </div>
                                        <div class='list_connected_col'>
                                            ${log.ip.replace('::ffff:','')}
                                        </div>
                                        <div class='list_connected_col gps_click' 
                                            data-latitude='${log.gps_latitude ?? ''}'
                                            data-longitude='${log.gps_longitude ?? ''}'>
                                            ${log.gps_latitude ?? ''}
                                        </div>
                                        <div class='list_connected_col gps_click'
                                            data-latitude='${log.gps_latitude ?? ''}'
                                            data-longitude='${log.gps_longitude ?? ''}'>
                                            ${log.gps_longitude ?? ''}
                                        </div>
                                        <div class='list_connected_col common_wide_list_column'>
                                            ${show_user_agent(log.user_agent) ?? ''}
                                        </div>
                                        <div class='list_connected_col chat_click common_icon' data-id='${log.id}'></div>
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
                                            data-latitude='${log.client_latitude ?? ''}'
                                            data-longitude='${log.client_longitude ?? ''}'>
                                            ${log.client_latitude ?? ''}
                                        </div>
                                        <div class='list_app_log_col gps_click'
                                            data-latitude='${log.client_latitude ?? ''}'
                                            data-longitude='${log.client_longitude ?? ''}'>>
                                            ${log.client_longitude ?? ''}
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
                AppDocument.querySelector('#' + list_div).classList.remove('css_spinner');
                AppDocument.querySelector('#' + list_div).innerHTML = html;
                AppDocument.querySelector(`#${list_div} .list_title[data-column='${sort}']`).classList.add(order_by);
            }  
        })
        .catch(()=>AppDocument.querySelector('#' + list_div).classList.remove('css_spinner'));   
    }
};
/**
 * Show connected
 * @param {string} sort 
 * @param {string} order_by
 */
const show_connected = async (sort='connection_date', order_by='desc') => {
    const app_id = AppDocument.querySelector('#select_app_menu5').options[AppDocument.querySelector('#select_app_menu5').selectedIndex].value;
    const year = AppDocument.querySelector('#select_year_menu5').value;
    const month = AppDocument.querySelector('#select_month_menu5').value;
    show_list('list_connected', 
              `select_app_id=${app_id}&year=${year}&month=${month}&sort=${sort}&order_by=${order_by}&limit=${APP_GLOBAL.limit}`, 
              sort,
              order_by);
};    

/**
 * Show app log
 * @param {string} sort 
 * @param {string} order_by
 * @param {number} offset 
 * @param {number} limit 
 * @returns{Promise.<void>}
 */
const show_app_log = async (sort='id', order_by='desc', offset=0, limit=APP_GLOBAL.limit) => {
    const app_id = AppDocument.querySelector('#select_app_menu5').options[AppDocument.querySelector('#select_app_menu5').selectedIndex].value;
    const year = AppDocument.querySelector('#select_year_menu5').value;
    const month = AppDocument.querySelector('#select_month_menu5').value;
    show_list('list_app_log', 
              `select_app_id=${app_id}&year=${year}&month=${month}&sort=${sort}&order_by=${order_by}&offset=${offset}&limit=${limit}`, 
              sort,
              order_by);
};
/**
 * Get column sort
 * @param {number} order_by 
 * @returns{'asc'|'desc'|string}
 */
const get_sort = (order_by=0) => {
    const sort = '';
    for (const col_title of AppDocument.querySelectorAll('#list_app_log .list_title')){
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
            show_server_logs(sortcolumn, order_by, AppDocument.querySelector('#list_server_log_search_input').innerText);
            break;
        }
        case 'list_user_account':{
            search_users(sortcolumn, order_by);
            break;
        }
    }
};
/**
 * Page navigation
 * @param {string} item 
 * @returns {void}
 */
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
/**
 * List item click
 * @param {string} item_type 
 * @param {{ip:string,
 *          latitude:string,
 *          longitude:string,
 *          id:number}} data 
 */
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
            .then((/**@type{string}*/result)=>{
                const geodata = JSON.parse(result);
                common.map_update(  geodata.geoplugin_longitude,
                                    geodata.geoplugin_latitude,
                                    common.COMMON_GLOBAL.module_leaflet_zoom,
                                    geodata.geoplugin_city + ', ' +
                                    geodata.geoplugin_regionName + ', ' +
                                    geodata.geoplugin_countryName,
                                    null,
                                    common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                    common.COMMON_GLOBAL.module_leaflet_jumpto);
            })
            .catch(()=>null);
        }
        else{
            //clicking on GPS, show on map
            path = `/place?latitude=${data['latitude']}&longitude=${data['longitude']}`;
            if (common.COMMON_GLOBAL.system_admin!='')
                tokentype = 'SYSTEMADMIN';
            else
                tokentype = 'APP_ACCESS';
            common.FFB('GEOLOCATION', path, 'GET', tokentype, null)
            .then((/**@type{string}*/result)=>{
                /**@type{{geoplugin_place:string, geoplugin_region:string, geoplugin_countryCode:string}} */
                const geodata = JSON.parse(result);
                common.map_update(  data['longitude'],
                                    data['latitude'],
                                    common.COMMON_GLOBAL.module_leaflet_zoom,
                                    geodata.geoplugin_place + ', ' + 
                                    geodata.geoplugin_region + ', ' + 
                                    geodata.geoplugin_countryCode,
                                    null,
                                    common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                    common.COMMON_GLOBAL.module_leaflet_jumpto);
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
 * @returns {Promise.<{parameters:{ SERVICE_LOG_SCOPE_REQUEST:string,
 *                                  SERVICE_LOG_SCOPE_SERVER:string, 
 *                                  SERVICE_LOG_SCOPE_SERVICE:string,
 *                                  SERVICE_LOG_SCOPE_APP:string,
 *                                  SERVICE_LOG_SCOPE_DB:string,
 *                                  SERVICE_LOG_REQUEST_LEVEL:number,
 *                                  SERVICE_LOG_SERVICE_LEVEL:number,
 *                                  SERVICE_LOG_DB_LEVEL:number,
 *                                  SERVICE_LOG_LEVEL_VERBOSE:string 
 *                                  SERVICE_LOG_LEVEL_ERROR:string
 *                                  SERVICE_LOG_LEVEL_INFO:string,
 *                                  SERVICE_LOG_FILE_INTERVAL:string},
 *                     logscope_level_options:string}>}
 */
const get_log_parameters = async () => {
    return new Promise((resolve)=>{
        common.FFB('LOG', '/log/parameters?', 'GET', 'SYSTEMADMIN', null)
        .then((/**@type{string}*/result)=>{
            const log_parameters = JSON.parse(result);
            const logscope_level_options = 
                    `   <option value=0 log_scope='${log_parameters.SERVICE_LOG_SCOPE_REQUEST}'  log_level='${log_parameters.SERVICE_LOG_LEVEL_INFO}'>${log_parameters.SERVICE_LOG_SCOPE_REQUEST} - ${log_parameters.SERVICE_LOG_LEVEL_INFO}
                        </option>
                        <option value=1 log_scope='${log_parameters.SERVICE_LOG_SCOPE_REQUEST}'  log_level='${log_parameters.SERVICE_LOG_LEVEL_ERROR}'>${log_parameters.SERVICE_LOG_SCOPE_REQUEST} - ${log_parameters.SERVICE_LOG_LEVEL_ERROR}
                        </option>
                        <option value=2 log_scope='${log_parameters.SERVICE_LOG_SCOPE_REQUEST}'  log_level='${log_parameters.SERVICE_LOG_LEVEL_VERBOSE}'>${log_parameters.SERVICE_LOG_SCOPE_REQUEST} - ${log_parameters.SERVICE_LOG_LEVEL_VERBOSE}
                        </option>
                        <option value=3 log_scope='${log_parameters.SERVICE_LOG_SCOPE_SERVER}'   log_level='${log_parameters.SERVICE_LOG_LEVEL_INFO}'>${log_parameters.SERVICE_LOG_SCOPE_SERVER} - ${log_parameters.SERVICE_LOG_LEVEL_INFO}
                        </option>
                        <option value=4 log_scope='${log_parameters.SERVICE_LOG_SCOPE_SERVER}'   log_level='${log_parameters.SERVICE_LOG_LEVEL_ERROR}'>${log_parameters.SERVICE_LOG_SCOPE_SERVER} - ${log_parameters.SERVICE_LOG_LEVEL_ERROR}
                        </option>
                        <option value=5 log_scope='${log_parameters.SERVICE_LOG_SCOPE_APP}'      log_level='${log_parameters.SERVICE_LOG_LEVEL_INFO}'>${log_parameters.SERVICE_LOG_SCOPE_APP} - ${log_parameters.SERVICE_LOG_LEVEL_INFO}
                        </option>
                        <option value=6 log_scope='${log_parameters.SERVICE_LOG_SCOPE_APP}'      log_level='${log_parameters.SERVICE_LOG_LEVEL_ERROR}'>${log_parameters.SERVICE_LOG_SCOPE_APP} - ${log_parameters.SERVICE_LOG_LEVEL_ERROR}
                        </option>
                        <option value=7 log_scope='${log_parameters.SERVICE_LOG_SCOPE_SERVICE}'  log_level='${log_parameters.SERVICE_LOG_LEVEL_INFO}'>${log_parameters.SERVICE_LOG_SCOPE_SERVICE} - ${log_parameters.SERVICE_LOG_LEVEL_INFO}
                        </option>
                        <option value=8 log_scope='${log_parameters.SERVICE_LOG_SCOPE_SERVICE}'  log_level='${log_parameters.SERVICE_LOG_LEVEL_ERROR}'>${log_parameters.SERVICE_LOG_SCOPE_SERVICE} - ${log_parameters.SERVICE_LOG_LEVEL_ERROR}
                        </option>
                        <option value=9 log_scope='${log_parameters.SERVICE_LOG_SCOPE_DB}'       log_level='${log_parameters.SERVICE_LOG_LEVEL_INFO}'>${log_parameters.SERVICE_LOG_SCOPE_DB} - ${log_parameters.SERVICE_LOG_LEVEL_INFO}
                        </option>
                        <option value=10 log_scope='${log_parameters.SERVICE_LOG_SCOPE_DB}'      log_level='${log_parameters.SERVICE_LOG_LEVEL_ERROR}'>${log_parameters.SERVICE_LOG_SCOPE_DB} - ${log_parameters.SERVICE_LOG_LEVEL_ERROR}
                        </option>`;
            APP_GLOBAL.service_log_file_interval = log_parameters.SERVICE_LOG_FILE_INTERVAL;
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
 * @param {string|null} search 
 * @returns {void}
 */
const show_server_logs = (sort='logdate', order_by='desc', search=null) => {
    if (search != null){
        if (common.input_control(null,{check_valid_list:[[AppDocument.querySelector('#list_server_log_search_input'),100]]})==false)
            return;
    }
    const logscope = AppDocument.querySelector('#select_logscope5')[AppDocument.querySelector('#select_logscope5').selectedIndex].getAttribute('log_scope');
    const loglevel = AppDocument.querySelector('#select_logscope5')[AppDocument.querySelector('#select_logscope5').selectedIndex].getAttribute('log_level');
    const year = AppDocument.querySelector('#select_year_menu5').value;
    const month= AppDocument.querySelector('#select_month_menu5').value;
    const day  = AppDocument.querySelector('#select_day_menu5').value;
    let app_id_filter='';
    if (logscope=='APP' || logscope=='SERVICE' || logscope=='DB'){
        //show app filter and use it
        AppDocument.querySelector('#select_app_menu5').style.display = 'inline-block';
        app_id_filter = `select_app_id=${AppDocument.querySelector('#select_app_menu5').options[AppDocument.querySelector('#select_app_menu5').selectedIndex].value}&`;
    }
    else{
        //no app filter for request
        AppDocument.querySelector('#select_app_menu5').style.display = 'none';
        app_id_filter = 'select_app_id=&';
    }
    let url_parameters;
    search=search?encodeURI(search):search;
    if (APP_GLOBAL.service_log_file_interval=='1M')
        url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}&search=${search}`;
    else
        url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}&day=${day}&search=${search}`;
    show_list('list_server_log', 
              `${url_parameters}&sort=${sort}&order_by=${order_by}`,
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
         * @param {AppEvent} event 
         */
        const function_event = event => {
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
                                setlogscopelevel(AppDocument.querySelector('#select_logscope5'),
                                                logscope, 
                                                loglevel);
                                //year
                                AppDocument.querySelector('#select_year_menu5').value = year;
                                //month
                                AppDocument.querySelector('#select_month_menu5').value = month;
                                //day if applicable
                                if (APP_GLOBAL.service_log_file_interval=='1D')
                                    AppDocument.querySelector('#select_day_menu5').value = day;

                                nav_click('list_monitor_nav_server_log');
                                common.lov_close();
                            };
        common.lov_show('SERVER_LOG_FILES', function_event);
    }
};
/**
 * Show server config
 * @returns {void}
 */
const show_server_config = () =>{
    AppDocument.querySelector('#menu_6_content').innerHTML = 
        `<div id='menu_6_content_widget1' class='widget'>
            <div id='list_config_nav' class='list_nav'>
                <div id='list_config_nav_config'        class='list_nav_list list_button common_icon'></div>
                <div id='list_config_nav_iam_blockip'   class='list_nav_list list_button common_icon'></div>
                <div id='list_config_nav_iam_useragent' class='list_nav_list list_button common_icon'></div>
                <div id='list_config_nav_iam_policy'    class='list_nav_list list_button common_icon'></div>
            </div>
            <div id='list_config' class='common_list_scrollbar'></div>
            <div id='list_config_edit'></div>
            <div id='config_buttons' class="save_buttons">
                <div id='config_save' class='common_dialogue_button button_save common_icon' ></div>
            </div>
        </div>`;
    nav_click('list_config_nav_config');
};
/**
 * Show config
 * @param {string} file 
 * @returns{Promise.<void>}
 */
const show_config = async file => {
    AppDocument.querySelector('#list_config').innerHTML = '';
    AppDocument.querySelector('#list_config_edit').innerHTML = '';
    if (file=='CONFIG'){
        AppDocument.querySelector('#list_config').classList.add('common_icon','css_spinner');
        AppDocument.querySelector('#list_config').style.display = 'flex';
        AppDocument.querySelector('#list_config_edit').style.display = 'none';
    }
    else{
        AppDocument.querySelector('#list_config_edit').classList.add('common_icon','css_spinner');
        AppDocument.querySelector('#list_config_edit').style.display = 'flex';
        AppDocument.querySelector('#list_config').style.display = 'none';
    }

    await common.FFB('SERVER', `/config/systemadmin/saved?file=${file}`, 'GET', 'SYSTEMADMIN', null)
    .then((/**@type{string}*/result)=>{
        const config = JSON.parse(result);
        let i = 0;
        AppDocument.querySelector('#list_config_edit').contentEditable = true;
        switch (file){
            case 'CONFIG':{
                let html = `<div id='list_config_row_title' class='list_config_row'>
                                <div id='list_config_col_title1' class='list_config_col list_title'>PARAMETER NAME</div>
                                <div id='list_config_col_title2' class='list_config_col list_title'>PARAMETER VALUE</div>
                                <div id='list_config_col_title3' class='list_config_col list_title'>COMMENT</div>
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
                AppDocument.querySelector('#list_config').classList.remove('common_icon','css_spinner');
                AppDocument.querySelector('#list_config').innerHTML = html;
                
                //set focus first column in first row
                AppDocument.querySelectorAll('#list_config .list_edit')[0].focus();
                break;
            }
            default:{
                AppDocument.querySelector('#list_config_edit').classList.remove('common_icon','css_spinner');
                AppDocument.querySelector('#list_config_edit').innerHTML = JSON.stringify(config, undefined, 2);
                break;
            }
        }
    })
    .catch(()=>{
            AppDocument.querySelector('#list_config').classList.remove('common_icon','css_spinner');
            AppDocument.querySelector('#list_config_edit').classList.add('common_icon','css_spinner');});
};
/**
 * Executes installation rest API and presents the result
 * @param {string} id 
 * @param {boolean|null} db_icon 
 * @param {string} path 
 * @param {string} method 
 * @param {string} tokentype 
 * @param {{demo_password:string}|null} data 
 * @returns {void}
 */
const installation_function = (id, db_icon, path, method, tokentype, data) => {
    AppDocument.querySelector(`#${id}`).classList.add('css_spinner');
    common.FFB('DB_API', path, method, tokentype, data)
    .then((/**@type{string}*/result)=>{
        AppDocument.querySelector(`#${id}`).classList.remove('css_spinner');
        if (db_icon!=null)
            if (db_icon)
                AppDocument.querySelector('#install_db_icon').classList.add('installed');
            else
                AppDocument.querySelector('#install_db_icon').classList.remove('installed');
        common.show_message('LOG', null, null, null, common.show_message_info_list(JSON.parse(result).info), common.COMMON_GLOBAL.common_app_id);
    })
    .catch(()=>AppDocument.querySelector(`#${id}`).classList.remove('css_spinner'));
};
/**
 * Installs DB
 * @returns {void}
 */
const db_install = () =>{
    AppDocument.querySelector('#common_dialogue_message').style.visibility = 'hidden';
    const path = `/systemadmin/install?client_id=${common.COMMON_GLOBAL.service_socket_client_ID}&optional=${Number(AppDocument.querySelector('#install_db_country_language_translations').classList.contains('checked'))}`;
    installation_function('install_db_button_install', true, path, 'POST', 'SYSTEMADMIN', null);
};
/**
 * Uninstalls DB
 * @returns {void}
 */
const db_uninstall = () =>{
    AppDocument.querySelector('#common_dialogue_message').style.visibility = 'hidden';
    const path = `/systemadmin/install?client_id=${common.COMMON_GLOBAL.service_socket_client_ID}`;
    installation_function('install_db_button_uninstall', false, path, 'DELETE', 'SYSTEMADMIN', null);
};
/**
 * Installs Demo data
 * @returns {void}
 */
const demo_install = () =>{
    if (common.input_control(null,
                        {
                        check_valid_list:[[AppDocument.querySelector('#install_demo_password'),null]]
                        })==true){
        const json_data = {demo_password: AppDocument.querySelector('#install_demo_password').innerHTML};
        const path = `/admin/demo?client_id=${common.COMMON_GLOBAL.service_socket_client_ID}`;
        installation_function('install_db_demo_button_install', null, path, 'POST', 'APP_ACCESS', json_data);
    }
};
/**
 * Uninstalls Demo data
 * @returns {void}
 */
const demo_uninstall = () =>{
    const path = `/admin/demo?client_id=${common.COMMON_GLOBAL.service_socket_client_ID}`;
    installation_function('install_db_demo_button_uninstall', null, path, 'DELETE', 'APP_ACCESS', null);
};
/**
 * Show installation
 * @returns {void}
 */
const show_installation = () =>{
    if (common.COMMON_GLOBAL.system_admin!=''){
        AppDocument.querySelector('#menu_7_content').innerHTML =
            `<div id='menu_7_content_widget1' class='widget'>
                <div id='install_db'>
                    <div id='install_db_icon' class='common_icon'></div>
                    <div id='install_db_button_row'>
                        <div id='install_db_button_install' class='common_dialogue_button common_icon'></div>
                        <div id='install_db_button_uninstall' class='common_dialogue_button common_icon'></div>
                    </div>
                    <div id='install_db_input'>
                        <div id='install_db_country_language_translations_icon' class='common_icon'></div>
                        <div id='install_db_country_language_translations' class='common_switch'></div>
                    </div>
                </div>
            </div>`;
        AppDocument.querySelector('#install_db_icon').classList.add('css_spinner');
        common.FFB('DB_API', '/systemadmin/install?', 'GET', 'SYSTEMADMIN', null)
        .then((/**@type{string}*/result)=>{
            AppDocument.querySelector('#install_db_icon').classList.remove('css_spinner');
            AppDocument.querySelector('#install_db_icon').classList.remove('installed');
            if (JSON.parse(result)[0].installed == 1)
                AppDocument.querySelector('#install_db_icon').classList.add('installed');
            })
        .catch(()=>AppDocument.querySelector('#install_db_icon').classList.remove('css_spinner'));
    }
    else{
        AppDocument.querySelector('#menu_7_content').innerHTML =
            `<div id='menu_7_content_widget2' class='widget'>
                <div id='install_demo'>
                    <div id='install_demo_demo_users_icon' class='common_icon'></div>
                    <div id='install_demo_button_row'>
                        <div id='install_demo_button_install' class='common_dialogue_button common_icon'></div>
                        <div id='install_demo_button_uninstall' class='common_dialogue_button common_icon'></div>
                    </div>
                    <div id='install_demo_input'>
                        <div id="install_demo_password_icon" class='common_icon'></div>
                        <div class='common_password_container common_input'>
                                <div id='install_demo_password' contenteditable=true class='common_input common_password'></div>
                                <div id='install_demo_password_mask' class='common_input common_password_mask'/></div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
};
/**
 * Show DB info
 * @returns {void}
 */
const show_db_info = () => {
    if (admin_token_has_value()){
        const size = '(Mb)';
        AppDocument.querySelector('#menu_8_content').innerHTML = 
                `<div id='menu_8_content_widget1' class='widget'>
                    <div id='menu_8_db_info1'></div>
                </div>
                <div id='menu_8_content_widget2' class='widget'>
                    <div id='menu_8_db_info_space_title' class='common_icon'></div>
                    <div id='menu_8_db_info_space_detail' class='common_list_scrollbar'></div>
                </div>`;
        AppDocument.querySelector('#menu_8_db_info1').classList.add('css_spinner');
        common.FFB('DB_API', '/systemadmin/DBInfo?', 'GET', 'SYSTEMADMIN', null)
        .then((/**@type{string}*/result)=>{
            const database = JSON.parse(result)[0];
            AppDocument.querySelector('#menu_8_db_info1').classList.remove('css_spinner');
            AppDocument.querySelector('#menu_8_db_info1').innerHTML = 
                    `<div id='menu_8_db_info_database_title' class='common_icon'></div>          <div id='menu_8_db_info_database_data'>${database.database_use}</div>
                        <div id='menu_8_db_info_name_title' class='common_icon'></div>              <div id='menu_8_db_info_name_data'>${database.database_name}</div>
                        <div id='menu_8_db_info_version_title' class='common_icon'></div>           <div id='menu_8_db_info_version_data'>${database.version}</div>
                        <div id='menu_8_db_info_database_schema_title' class='common_icon'></div>   <div id='menu_8_db_info_database_schema_data'>${database.database_schema}</div>
                        <div id='menu_8_db_info_host_title' class='common_icon'></div>              <div id='menu_8_db_info_host_data'>${database.hostname}</div>
                        <div id='menu_8_db_info_connections_title' class='common_icon'></div>       <div id='menu_8_db_info_connections_data'>${database.connections}</div>
                        <div id='menu_8_db_info_started_title' class='common_icon'></div>           <div id='menu_8_db_info_started_data'>${database.started}</div>`;
            AppDocument.querySelector('#menu_8_db_info_space_detail').classList.add('css_spinner');
            common.FFB('DB_API', '/systemadmin/DBInfoSpace?', 'GET', 'SYSTEMADMIN', null)
            .then((/**@type{string}*/result)=>{
                let html = `<div id='menu_8_db_info_space_detail_row_title' class='menu_8_db_info_space_detail_row'>
                                <div id='menu_8_db_info_space_detail_col_title1' class='menu_8_db_info_space_detail_col list_title'>TABLE NAME</div>
                                <div id='menu_8_db_info_space_detail_col_title2' class='menu_8_db_info_space_detail_col list_title'>SIZE ${size}</div>
                                <div id='menu_8_db_info_space_detail_col_title3' class='menu_8_db_info_space_detail_col list_title'>DATA USED ${size}</div>
                                <div id='menu_8_db_info_space_detail_col_title4' class='menu_8_db_info_space_detail_col list_title'>DATA FREE ${size}</div>
                                <div id='menu_8_db_info_space_detail_col_title5' class='menu_8_db_info_space_detail_col list_title'>% USED</div>
                            </div>`;
                let i=0;
                for (const databaseInfoSpaceTable of JSON.parse(result)) {
                    html += 
                    `<div id='menu_8_db_info_space_detail_row_${i}' class='menu_8_db_info_space_detail_row' >
                        <div class='menu_8_db_info_space_detail_col'>${databaseInfoSpaceTable.table_name}</div>
                        <div class='menu_8_db_info_space_detail_col'>${roundOff(databaseInfoSpaceTable.total_size)}</div>
                        <div class='menu_8_db_info_space_detail_col'>${roundOff(databaseInfoSpaceTable.data_used)}</div>
                        <div class='menu_8_db_info_space_detail_col'>${roundOff(databaseInfoSpaceTable.data_free)}</div>
                        <div class='menu_8_db_info_space_detail_col'>${roundOff(databaseInfoSpaceTable.pct_used)}</div>
                    </div>`;
                    i=0;
                }
                AppDocument.querySelector('#menu_8_db_info_space_detail').classList.remove('css_spinner');
                AppDocument.querySelector('#menu_8_db_info_space_detail').innerHTML = html;
                common.FFB('DB_API', '/systemadmin/DBInfoSpaceSum?', 'GET', 'SYSTEMADMIN', null)
                .then((/**@type{string}*/result)=>{
                    const databaseInfoSpaceSum = JSON.parse(result)[0];
                    AppDocument.querySelector('#menu_8_db_info_space_detail').innerHTML += 
                        `<div id='menu_8_db_info_space_detail_row_total' class='menu_8_db_info_space_detail_row' >
                            <div id='menu_8_info_space_db_sum' class='menu_8_db_info_space_detail_col'></div>
                            <div class='menu_8_db_info_space_detail_col'>${roundOff(databaseInfoSpaceSum.total_size)}</div>
                            <div class='menu_8_db_info_space_detail_col'>${roundOff(databaseInfoSpaceSum.data_used)}</div>
                            <div class='menu_8_db_info_space_detail_col'>${roundOff(databaseInfoSpaceSum.data_free)}</div>
                            <div class='menu_8_db_info_space_detail_col'>${roundOff(databaseInfoSpaceSum.pct_used)}</div>
                        </div>`;
                });
            })
            .catch(()=>AppDocument.querySelector('#menu_8_db_info_space_detail').classList.remove('css_spinner'));
        })
        .catch(()=>AppDocument.querySelector('#menu_8_db_info1').classList.remove('css_spinner'));
    }
};
/**
 * Show server info
 * @returns {void}
 */
const show_server_info = () => {
    if (admin_token_has_value()){
        AppDocument.querySelector('#menu_10_content').innerHTML = 
                `<div id='menu_10_content_widget1' class='widget'>
                    <div id='menu_10_os_title' class='common_icon'></div>
                    <div id='menu_10_os_info'></div>
                </div>
                <div id='menu_10_content_widget2' class='widget'>
                    <div id='menu_10_process_title' class='common_icon'></div>
                    <div id='menu_10_process_info'></div>
                </div>`;
        AppDocument.querySelector('#menu_10_os_info').classList.add('css_spinner');
        AppDocument.querySelector('#menu_10_process_info').classList.add('css_spinner');
        common.FFB('SERVER', '/info?', 'GET', 'SYSTEMADMIN', null)
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
            AppDocument.querySelector('#menu_10_os_info').classList.remove('css_spinner');
            AppDocument.querySelector('#menu_10_process_info').classList.remove('css_spinner');
            AppDocument.querySelector('#menu_10_os_info').innerHTML = 
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
            AppDocument.querySelector('#menu_10_process_info').innerHTML =     
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
                AppDocument.querySelector('#menu_10_os_info').classList.remove('css_spinner');
                AppDocument.querySelector('#menu_10_process_info').classList.remove('css_spinner');});
    }
};
/**
 * Checks if tokens have values
 * @returns {boolean}
 */
const admin_token_has_value = () => !(common.COMMON_GLOBAL.rest_at=='' && common.COMMON_GLOBAL.rest_admin_at =='');

/**
 * App events
 * @param {string} event_type 
 * @param {AppEvent} event 
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
                case 'menu_1_broadcast_button':{
                    show_broadcast_dialogue('ALL');
                    break;
                }
                case 'menu_1_checkbox_maintenance':{
                    set_maintenance();
                    break;
                }
                case 'list_user_search_icon':{
                    AppDocument.querySelector('#list_user_account_search_input').focus();
                    AppDocument.querySelector('#list_user_account_search_input').dispatchEvent(new KeyboardEvent('keyup'));
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
                    AppDocument.querySelector('#list_server_log_search_input').focus();
                    AppDocument.querySelector('#list_server_log_search_input').dispatchEvent(new KeyboardEvent('keyup'));
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
                case 'list_config_nav_config' :
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
                case 'list_apps':
                case 'list_app_parameter':
                case 'list_user_account':{
                    /**
                     * LOV event
                     * @param {AppEvent} event_lov 
                     */
                    const lov_event = event_lov => {
                        //setting values from LOV
                        common.element_row(event.target).querySelector('.common_input_lov').innerHTML = common.element_row(event_lov.target).getAttribute('data-id');
                        common.element_row(event.target).querySelector('.common_input_lov').focus();
                        common.element_row(event.target).querySelector('.common_lov_value').innerHTML = common.element_row(event_lov.target).getAttribute('data-value');
                        AppDocument.querySelector('#common_lov_close').dispatchEvent(new Event('click'));
                    };
                    if (event.target.classList.contains('common_list_lov_click')){
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
                case 'send_broadcast_send':{
                    sendBroadcast();
                    break;
                }
                case 'send_broadcast_close':{
                    closeBroadcast();
                    break;
                }
                //common
                case 'common_lov_list':{
                    AppDocument.querySelector('#common_lov_list')['data-function'](event);
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

                case 'select_app_menu5':
                case 'select_year_menu5':
                case 'select_month_menu5':{
                    nav_click(AppDocument.querySelector('#list_monitor_nav .list_nav_selected_tab').id);
                    break;
                }
                case 'select_logscope5':
                case 'select_day_menu5':{
                    nav_click('list_monitor_nav_server_log');
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
                        show_app_parameter(parseInt(common.element_row(event.target).getAttribute('data-app_id')));
                    }
                    break;
                }
                case 'list_user_account':{
                    //event on master to automatically show detail records
                    if (APP_GLOBAL.previous_row != common.element_row(event.target)){
                        APP_GLOBAL.previous_row = common.element_row(event.target);
                        show_user_account_logon(parseInt(common.element_row(event.target).getAttribute('data-user_account_id')));
                    }
                    break;
                }   
            }
            break;
        }
        case 'input':{
            if (event.target.classList.contains('list_edit')){
                common.element_row(event.target).setAttribute('data-changed-record','1');
                /**
                 * 
                 * @param {Error|null} err 
                 * @param {string|null} result 
                 * @param {AppEvent} event 
                 */
                const lov_action = (err, result, event) => {
                    if (err){
                        event.stopPropagation();
                        event.preventDefault();
                        //set old value
                        event.target.innerHTML = event.target.getAttribute('defaultValue') ?? '';
                        event.target.focus();
                        event.target.nextElementSibling?event.target.nextElementSibling.dispatchEvent(new Event('click')):null;
                    }
                    else{
                        const list_result = result?JSON.parse(result):{};
                        if (list_result.length == 1){
                            //set lov text
                            if (event.target.parentNode && event.target.parentNode.nextElementSibling)
                                event.target.parentNode.nextElementSibling.querySelector('.common_lov_value').innerHTML = Object.values(list_result[0])[2];
                            //set new value in defaultValue used to save old value when editing next time
                            event.target.setAttribute('defaultValue', Object.values(list_result[0])[0]);
                        }
                        else{
                            event.stopPropagation();
                            event.preventDefault();
                            //set old value
                            event.target.innerHTML = event.target.getAttribute('defaultValue') ?? '';
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
                        .then((/**@type{string}*/result)=>lov_action(null, result, event))
                        .catch((/**@type{Error}*/err)=>lov_action(err, null, event));
                    }
                //parameter type LOV
                if (common.element_row(event.target).classList.contains('list_app_parameter_row') && event.target.classList.contains('common_input_lov'))
                    if (event.target.innerHTML=='')
                        event.target.innerHTML = event.target.getAttribute('defaultValue') ?? '';
                    else{
                        common.FFB('DB_API', `/parameter_type/admin?id=${event.target.innerHTML}`, 'GET', 'APP_ACCESS', null)
                        .then((/**@type{string}*/result)=>lov_action(null, result, event))
                        .catch((/**@type{Error}*/err)=>lov_action(err, null, event));
                    }
                //app role LOV
                if (common.element_row(event.target).classList.contains('list_user_account_row') && event.target.classList.contains('common_input_lov')){
                    let app_role_id_lookup='';
                    const old_value =event.target.innerHTML;
                    //if empty then lookup default
                    if (event.target.innerHTML=='')
                        app_role_id_lookup='2';
                    else
                        app_role_id_lookup=event.target.innerHTML;
                    common.FFB('DB_API', `/app_role/admin?id=${app_role_id_lookup}`, 'GET', 'APP_ACCESS', null)
                    .then((/**@type{string}*/result)=>{
                        lov_action(null, result, event);
                        //if wrong value then field is empty again, fetch default value for empty app_role
                        if (old_value!='' && event.target.innerHTML=='')
                            event.target.dispatchEvent(new Event('input'));
                    })
                    .catch((/**@type{Error}*/err)=>lov_action(err, null, event));
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
                        common.typewatch(show_server_logs, 'logdate', 'desc', AppDocument.querySelector('#list_server_log_search_input').innerText);
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
/**
 * Init
 * @returns {void}
 */
const init = () => {

    //SET GLOBALS
    APP_GLOBAL.page = 0;
    APP_GLOBAL.page_last =0;
    APP_GLOBAL.previous_row= {};
    APP_GLOBAL.module_leaflet_map_container      ='mapid';
    APP_GLOBAL.service_log_file_interval= '';

    if (common.COMMON_GLOBAL.system_admin!=''){
        common.COMMON_GLOBAL.module_leaflet_style			            ='OpenStreetMap_Mapnik';
        common.COMMON_GLOBAL.module_leaflet_jumpto		                ='0';
        common.COMMON_GLOBAL.module_leaflet_popup_offset		        ='-25';
        AppDocument.querySelector('#common_confirm_question').innerHTML    = '';
    }

    //hide all first (display none in css using eval not working)
    for (let i=1;i<=10;i++){
        AppDocument.querySelector(`#menu_${i}`).style.display='none';
    }
    if (common.COMMON_GLOBAL.system_admin!=''){
        AppDocument.querySelector('#select_broadcast_type').classList.add('system_admin');
        AppDocument.querySelector('#menu_secure').classList.add('system_admin');
        show_menu(1);
    }
    else{
        AppDocument.querySelector('#select_broadcast_type').classList.add('admin');
        AppDocument.querySelector('#menu_secure').classList.add('admin');
        show_menu(1);
        common.common_translate_ui(common.COMMON_GLOBAL.user_locale);
    }
};
export {delete_globals, show_menu, app_events, init};