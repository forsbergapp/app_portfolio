/**
 * Displays start
 * @module apps/app1/component/menu_start
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{maintenance:0|1|null,
 *          user_stat:(common['ORM']['View']['IamUserGetStatCountAdmin'] & {count_connected:number})[],
 *          count_not_connected:number}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_start_content_widget1' class='widget'>
                                <div id='menu_start_row_sample'>
                                    <div id='menu_start_select_stat'></div>':    
                                    <div id='menu_start_select_app'></div>
                                    <div id='menu_start_select_year'></div>
                                    <div id='menu_start_select_month'></div>
                                </div>
                                <div id='menu_start_graphBox'></div>
                                <div id='menu_start_user_stat'>
                                    <div id="menu_start_user_stat_count_users" class='menu_start_user_stat_col common_icon'></div>
                                    <div class='menu_start_user_stat_col'>${props.user_stat[0].CountUsers}</div>
                                    <div id="menu_start_user_stat_count_connected" class='menu_start_user_stat_col common_icon'></div>
                                    <div class='menu_start_user_stat_col'>${props.user_stat[0].count_connected}</div>
                                    <div id="menu_start_user_stat_count_notconnected" class='menu_start_user_stat_col common_icon'></div>
                                    <div class='menu_start_user_stat_col'>${props.count_not_connected}</div>
                                </div>
                            </div>
                            <div id='menu_start_content_widget2' class='widget'>
                                <div id='menu_start_maintenance'>
                                    <div id='menu_start_maintenance_title' class='common_icon'></div>
                                    <div id='menu_start_maintenance_checkbox'>
                                        <div id='menu_start_checkbox_maintenance' class='common_switch ${props.maintenance==1?'checked':''}'></div>
                                    </div>
                                </div>
                                <div id='menu_start_broadcast'>
                                    <div id='menu_start_broadcast_title' class='common_icon'></div>
                                    <div id='menu_start_broadcast_button' class='chat_click common_icon'></div>
                                </div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{ data:       {commonMountdiv:string},
 *           methods:    {
 *                       COMMON:common['CommonModuleCommon']
 *                       },
 *           lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    /**
     * Count users if logged in or not
     * @param {number} logged_in 
     * @returns{Promise.<{count_connected:number}>}
     */
    const get_count = async (logged_in) => {
        return props.methods.COMMON.commonFFB({path:'/server-socket/socket-stat', query:`logged_in=${logged_in}`, method:'GET', authorization_type:'ADMIN'})
                .then((/**@type{string}*/result)=>JSON.parse(result).rows);
    };
    /**@type{(common['ORM']['View']['IamUserGetStatCountAdmin'] & {count_connected:number})[]} */
    const user_stat = await props.methods.COMMON.commonFFB({path:'/server-db/iamuser-stat', method:'GET', authorization_type:'ADMIN'})
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows);
    //add count stat
    for (const row of user_stat)
        row.count_connected = await get_count(1).then(result=>result.count_connected);

    const count_not_connected = await get_count(0).then(result=>result.count_connected);

    /**@type{{status_codes:[number, string][]}} */
    const result_obj = await props.methods.COMMON.commonFFB({path:'/server-info-statuscode', method:'GET', authorization_type:'ADMIN'}).then((/**@type{string}*/result)=>JSON.parse(result).rows);

    // syntax {VALUE:'[ADMIN_statGroup]#[value]#[unique 0/1]#[statgroup]', TEXT:['[ADMIN_STATGROUP] - [VALUE replaced '_' with ' ']']}
    // response has empty statgroup
    const stat_options = [
        {VALUE:'request#ip_total#0#Ip',                             TEXT:'REQUEST - IP TOTAL'},
        {VALUE:'request#ip_unqiue#1#Ip',                            TEXT:'REQUEST - IP UNIQUE'},
        {VALUE:'request#url_total#0#Url',                           TEXT:'REQUEST - URL TOTAL'},
        {VALUE:'request#url_unqiue#1#Url',                          TEXT:'REQUEST - URL UNIQUE'},
        {VALUE:'request#accept_language_total#0#AcceptLanguage',    TEXT:'REQUEST - ACCEPT LANGUAGE TOTAL'},
        {VALUE:'request#accept_language_unqiue#1#AcceptLanguage',   TEXT:'REQUEST - ACCEPT LANGUAGE UNIQUE'},
        {VALUE:'request#user_agent_total#0#UserAgent',              TEXT:'REQUEST - USER#AGENT TOTAL'},
        {VALUE:'request#user_agent_unqiue#1#UserAgent',             TEXT:'REQUEST - USER#AGENT UNIQUE'},
        {VALUE:'response##0#',                                 TEXT:'REPONSE - ∞'},
        ...Object.entries(result_obj.status_codes).map(code=>{
            return {VALUE:`response#${code[0]}#1#`, TEXT:`RESPONSE - ${code[0]} - ${code[1]}`};
        })
    ];
    /**@type{0|1|null} */
    const maintenance = await props.methods.COMMON.commonFFB({ path:'/server-db/configserver', 
                                                        query:'config_group=METADATA&parameter=MAINTENANCE', 
                                                        method:'GET', 
                                                        authorization_type:'ADMIN'})
                                .then((/**@type{string}*/result)=>JSON.parse(result).rows);

   const onMounted = async () =>{
        //mount select
        await props.methods.COMMON.commonComponentRender({mountDiv:'menu_start_select_stat',
            data:   {
                    default_value:'REQUEST - IP TOTAL',
                    default_data_value:'request#ip_total#0#Ip',
                    options:stat_options,
                    path:'',
                    query:'',
                    method:'',
                    authorization_type:'',
                    column_value:'VALUE',
                    column_text:'TEXT'
                    },
            methods:null,
            path:   '/common/component/common_select.js'});

        await props.methods.COMMON.commonComponentRender({mountDiv:'menu_start_select_year',
                data:   {
                        default_value:new Date().getFullYear(),
                        default_data_value:new Date().getFullYear(),
                        options:[ {VALUE:new Date().getFullYear(), TEXT:new Date().getFullYear()}, 
                                {VALUE:new Date().getFullYear() - 1, TEXT:new Date().getFullYear() -1},
                                {VALUE:new Date().getFullYear() - 2, TEXT:new Date().getFullYear() -2},
                                {VALUE:new Date().getFullYear() - 3, TEXT:new Date().getFullYear() -3},
                                {VALUE:new Date().getFullYear() - 4, TEXT:new Date().getFullYear() -4},
                                {VALUE:new Date().getFullYear() - 5, TEXT:new Date().getFullYear() -5}],
                        path:'',
                        query:'',
                        method:'',
                        authorization_type:'',
                        column_value:'VALUE',
                        column_text:'TEXT'
                        },
                methods:null,
                path:   '/common/component/common_select.js'});

        await props.methods.COMMON.commonComponentRender({mountDiv:'menu_start_select_month',
                data:   {
                        default_value:new Date().getMonth()+1,
                        default_data_value:new Date().getMonth()+1,
                        options:Array(...Array(12)).map((row,index)=>{return {VALUE:index+1, TEXT:index+1};}),
                        path:'',
                        query:'',
                        method:'',
                        authorization_type:'',
                        column_value:'VALUE',
                        column_text:'TEXT'
                        },
                methods:null,
                path:   '/common/component/common_select.js'});
        await props.methods.COMMON.commonComponentRender({mountDiv:'menu_start_select_app',
                data:   {
                        default_value:'∞',
                        default_data_value:'',
                        options:[{Id:'', Name:'∞'}],
                        path:'/server-db/app',
                        query:'key=Name',
                        method:'GET',
                        authorization_type:'ADMIN',
                        column_value:'Id',
                        column_text:'Name'
                        },
                methods:null,
                path:   '/common/component/common_select.js'});
   };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({maintenance:maintenance,
                            user_stat:user_stat,
                            count_not_connected:count_not_connected     
        })
    };
};
export default component;