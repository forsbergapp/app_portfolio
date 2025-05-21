/**
 * Displays start
 * @module apps/app1/component/menu_start
 */
/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{maintenance:0|1|null}} props
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
 *                       COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonComponentRender:CommonModuleCommon['commonComponentRender'],
 *                       commonFFB:CommonModuleCommon['commonFFB']
 *                       },
 *           lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    /**@type{{status_codes:[number, string][]}} */
    const result_obj = await props.methods.commonFFB({path:'/server-info-statuscode', method:'GET', authorization_type:'ADMIN'}).then((/**@type{string}*/result)=>JSON.parse(result).rows);

    // syntax {VALUE:'[ADMIN_statGroup]#[value]#[unique 0/1]#[statgroup]', TEXT:['[ADMIN_STATGROUP] - [VALUE replaced '_' with ' ']']}
    // response has empty statgroup
    const stat_options = [
        {VALUE:'request#ip_total#0#ip',                             TEXT:'REQUEST - IP TOTAL'},
        {VALUE:'request#ip_unqiue#1#ip',                            TEXT:'REQUEST - IP UNIQUE'},
        {VALUE:'request#url_total#0#url',                           TEXT:'REQUEST - URL TOTAL'},
        {VALUE:'request#url_unqiue#1#url',                          TEXT:'REQUEST - URL UNIQUE'},
        {VALUE:'request#accept_language_total#0#accept-language',   TEXT:'REQUEST - ACCEPT LANGUAGE TOTAL'},
        {VALUE:'request#accept_language_unqiue#1#accept-language',  TEXT:'REQUEST - ACCEPT LANGUAGE UNIQUE'},
        {VALUE:'request#user_agent_total#0#user-agent',             TEXT:'REQUEST - USER#AGENT TOTAL'},
        {VALUE:'request#user_agent_unqiue#1#user-agent',            TEXT:'REQUEST - USER#AGENT UNIQUE'},
        {VALUE:'response##0#',                                 TEXT:'REPONSE - ∞'},
        ...Object.entries(result_obj.status_codes).map(code=>{
            return {VALUE:`response#${code[0]}#1#`, TEXT:`RESPONSE - ${code[0]} - ${code[1]}`};
        })
    ];
    /**@type{0|1|null} */
    const maintenance = await props.methods.commonFFB({ path:'/server-db/configserver', 
                                                        query:'config_group=METADATA&parameter=MAINTENANCE', 
                                                        method:'GET', 
                                                        authorization_type:'ADMIN'})
                                .then((/**@type{string}*/result)=>JSON.parse(result).rows);

   const onMounted = async () =>{
        //mount select
        await props.methods.commonComponentRender({mountDiv:'menu_start_select_stat',
            data:{
                default_value:'REQUEST - IP TOTAL',
                default_data_value:'request#ip_total#0#ip',
                options:stat_options,
                path:'',
                query:'',
                method:'',
                authorization_type:'',
                column_value:'VALUE',
                column_text:'TEXT'
                },
            methods:{commonFFB:props.methods.commonFFB},
            path:'/common/component/common_select.js'});

        await props.methods.commonComponentRender({mountDiv:'menu_start_select_year',
                data:{
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
                methods:{commonFFB:props.methods.commonFFB},
                path:'/common/component/common_select.js'});

        await props.methods.commonComponentRender({mountDiv:'menu_start_select_month',
                data:{
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
                methods:{commonFFB:props.methods.commonFFB},
                path:'/common/component/common_select.js'});
        await props.methods.commonComponentRender({mountDiv:'menu_start_select_app',
                data:{
                    default_value:'∞',
                    default_data_value:'',
                    options:[{id:'', name:'∞'}],
                    path:'/server-db/app',
                    query:'key=name',
                    method:'GET',
                    authorization_type:'ADMIN',
                    column_value:'id',
                    column_text:'name'
                   },
                methods:{commonFFB:props.methods.commonFFB},
                path:'/common/component/common_select.js'});
   };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({maintenance:maintenance})
    };
};
export default component;