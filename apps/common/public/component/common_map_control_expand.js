/**
 * @module apps/common/component/common_map_search
 */

/**
 * @import {COMMON_DOCUMENT, CommonModuleCommon, CommonComponentLifecycle, 
 *          commonMapLayers}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{expand_type:string}} props 
 * @returns {string}
 */
const template = props => props.expand_type=='search'?
                            `   <div id='common_map_control_select_country'></div>
                                <div id='common_map_control_select_city'></div>
                                <div id='common_map_control_search_input_row'>
                                    <div id='common_map_control_search_input' contentEditable='true' class='common_input'/></div>
                                    <div id='common_map_control_search_icon' class='common_icon'></div>
                                </div>
                                <div id='common_map_control_search_list_wrap'>
                                    <div id='common_map_control_search_list'></div>
                                </div>
                            `:
                            `   
                            <div id='common_map_control_select_mapstyle' ></div>
                            `;
/**
* @name component
* @description Component
* @function
* @param {{data:        {
*                       commonMountdiv:string,
*                       data_app_id:number,
*                       expand_type:'search'|'layer',
*                       user_locale:string,
*                       map_layers:commonMapLayers[]
*                       },
*          methods:     {
*                       COMMON_DOCUMENT:COMMON_DOCUMENT,
*                       commonWindowFromBase64:CommonModuleCommon['commonWindowFromBase64'],
*                       commonFFB:CommonModuleCommon['commonFFB'],
*                       commonComponentRender:CommonModuleCommon['commonComponentRender']
*                       }}} props
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:   null,
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
   /**
     * Map country
     * @param {string} locale 
     * @returns {Promise.<{value:string, text:string}[]>}
     */
   const map_country = async locale =>  
    [{value:'', text:'...'}].concat(await props.methods.commonFFB({
                                                                    path:'/app-common-module/COMMON_COUNTRY', 
                                                                    query:`locale=${locale}`,
                                                                    method:'POST', 
                                                                    authorization_type:'APP_ID', 
                                                                    body:{type:'FUNCTION',IAM_data_app_id:props.data.data_app_id}
                                                                })
        .then((/**@type{*}*/result)=>JSON.parse(props.methods.commonWindowFromBase64(JSON.parse(result).rows[0].data)))
        .then((/**@type{{id:number, country_code:string, flag_emoji:string, group_name:string, text:string}[]}*/result)=>
            result.map(country=>{
                        return {value:JSON.stringify({  id:country.id, 
                                                        country_code:country.country_code, 
                                                        flag_emoji:country.flag_emoji,
                                                        group_name:country.group_name}), 
                                                                text:country.text};})));
    const onMounted = async () =>{
        if (props.data.expand_type=='search')
            await props.methods.commonComponentRender({
                mountDiv:   'common_map_control_select_country',
                data:       {
                            default_data_value:'',
                            default_value:'...',
                            options: await map_country(props.data.user_locale),
                            path:null,
                            query:null,
                            method:null,
                            authorization_type:null,
                            column_value:'value',
                            column_text:'text'
                            },
                methods:    {commonFFB:null},
                path:       '/common/component/common_select.js'});
        else
            await props.methods.commonComponentRender({
                mountDiv:   'common_map_control_select_mapstyle', 
                data:       {
                            default_data_value:props.data.map_layers[0].value,
                            default_value:props.data.map_layers[0].title,
                            options:props.data.map_layers,
                            path:null,
                            query:null,
                            method:null,
                            authorization_type:null,
                            column_value:'value',
                            column_text:'title'
                            },
                methods:    {commonFFB:null},
                path:'/common/component/common_select.js'});
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({expand_type:props.data.expand_type})
    };
};
export default component;