/**
 * @module apps/common/component/common_map_control_expand
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{expand_type:string,
 *          icons:{search:string}}} props 
 * @returns {string}
 */
const template = props => props.expand_type=='search'?
                            `   <div id='common_map_control_expand_select_country'></div>
                                <div id='common_map_control_expand_select_city'></div>
                                <div id='common_map_control_expand_search_input_row'>
                                    <div id='common_map_control_expand_search_input' contentEditable='true' class='common_input'/></div>
                                    <div id='common_map_control_expand_search_icon' class='common_link common_icon_list'>${props.icons.search}</div>
                                </div>
                                <div id='common_map_control_expand_search_list_wrap'>
                                    <div id='common_map_control_expand_search_list'></div>
                                </div>
                            `:
                            `   
                            <div id='common_map_control_expand_select_mapstyle' ></div>
                            `;
/**
* @name component
* @description Component
* @function
* @param {{data:        {
*                       commonMountdiv:string,
*                       data_app_id:number,
*                       expand_type:'search'|'layer',
*                       map_layers:common['commonMapLayers'][]
*                       },
*          methods:     {
*                       COMMON:common['CommonModuleCommon'],
*                       goTo:(arg0:{ip:string|null,
*                                   longitude:string|number|null,
*                                   latitude:string|number|null})=>void,
*                       setLayer:(arg0:string)=>void
*                       }}} props
* @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
*                      data:   null,
*                      methods:null,
*                      events:function,
*                      template:string}>}
*/
const component = async props => {
   /**
     * Map country
     * @param {string} locale 
     * @returns {Promise.<{value:string, text:string}[]>}
     */
   const map_country = async locale =>  
        [{value:'', text:'...'}]
        .concat(await props.methods.COMMON.commonFFB({
                                                path:'/app-common-module/COMMON_COUNTRY', 
                                                query:`locale=${locale}`,
                                                method:'POST', 
                                                authorization_type:'APP_ID', 
                                                body:{type:'FUNCTION',IAM_data_app_id:props.data.data_app_id}
                                            })
        .then((/**@type{*}*/result)=>JSON.parse(props.methods.COMMON.commonWindowFromBase64(JSON.parse(result).rows[0].data)))
        .then((/**@type{{id:number, country_code:string, flag_emoji:string, group_name:string, text:string}[]}*/result)=>
            result.map(country=>{
                        return {value:JSON.stringify({  id:country.id, 
                                                        country_code:country.country_code, 
                                                        flag_emoji:country.flag_emoji,
                                                        group_name:country.group_name}), 
                                                                text:country.text};})));

    
    /**
     * @description Get cities for given coun try code or empty list
     * @param {string|null} country_code 
     * @returns {Promise<void>}
     */
    const map_city = async (country_code=null) =>{
        /**
         * @param {string} default_value
         * @param {{value:string, text:string}[]} options
         */
        const updateSelect = async (default_value, options) =>{
            //set city select with first empty city
            props.methods.COMMON.commonComponentRender({
                mountDiv:       'common_map_control_expand_select_city',
                data:           {
                                default_data_value:'',
                                default_value:default_value,
                                options:options,
                                column_value:'value',
                                column_text:'text'
                                },
                methods:        null,
                path:           '/common/component/common_select.js'});
        };
        if (country_code==null)
            await updateSelect('...', [{value:'', text:''}]);
        else{
            /**@type{{id:number, country:string, iso2:string, lat:string, lng:string, admin_name:string, city:string}[]} */
            const cities = await props.methods.COMMON.commonFFB({
                                    path:'/app-common-module/COMMON_WORLDCITIES', 
                                    method:'POST', 
                                    authorization_type:'APP_ID', 
                                    body:{  type:'FUNCTION',
                                            searchType:'COUNTRY',
                                            searchString:country_code.toUpperCase(),
                                            IAM_data_app_id:props.data.data_app_id
                                        }})
                            .then(result=>
                                JSON.parse(props.methods.COMMON.commonWindowFromBase64(JSON.parse(result).rows[0].data)));
            await updateSelect( '...', 
                                [{value:'', text:''}]
                                .concat(cities.map(city=>{
                                            return {value:JSON.stringify({  id:city.id,
                                                                            countrycode:city.iso2, 
                                                                            country:city.country, 
                                                                            admin_name:city.admin_name, 
                                                                            city:city.city,
                                                                            latitude:city.lat, 
                                                                            longitude:city.lng}),
                                                    text:`${city.admin_name} - ${city.city}`};
                                            })));
        }
    };
    /**
     * @param {string} event_target_id
     */
    const eventClickCountry = event_target_id =>{
        const country_code = props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).getAttribute('data-value')==''?
                                null:
                                JSON.parse(props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).getAttribute('data-value')).country_code;
        map_city(country_code);
    };
    /**
     * @param {string} event_target_id
     */
    const eventClickCity = async event_target_id => {
        /**
         * @type{{  countrycode:string,
         *          country:string,
         *          admin_name:string,
         *          city:string,
         *          latitude:string,
         *          longitude:string}}
         */
        const city = JSON.parse(props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).getAttribute('data-value'));
        props.methods.goTo({ip:null, longitude:city.longitude, latitude:city.latitude});
    };
    /**
     * @description delay search result using delay type watch pattern
     * @function
     * @param {common['CommonAppEvent']} event
     * @param {string} search
     */
    const eventKeyUpDispatch = (event,search)=>{
        props.methods.COMMON.commonMiscListKeyEvent({
            event:event,
            event_function:eventKeyUpSearch,
            event_parameters:search,
            rows_element:'common_map_control_expand_search_list',
            search_input:'common_map_control_expand_search_input'});
    };
    /**
     * @description get result for search string > 2 characters
     * @function
     * @param {string} search
     */
    const eventKeyUpSearch = search=>{
        if (typeof search=='string' && search !='' && search !=null && search.length >2)
            props.methods.COMMON.commonComponentRender({
                mountDiv:   'common_map_control_expand_search_list_wrap',
                data:       {
                            data_app_id:props.data.data_app_id,
                            search:	search
                            },
                methods:    {
                            goTo:props.methods.goTo
                            },
                path:       '/common/component/common_map_control_expand_search_city.js'});
    };
    /**
     * @name events
     * @descption Events for map
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        switch (event_type){
            case 'click':{
                switch (true){
                    case event_target_id== 'common_map_control_expand_select_country':{
                        eventClickCountry(event_target_id);
                        break;
                    }
                    case event_target_id== 'common_map_control_expand_select_city' && 
                        event.target.classList.contains('common_select_option'):{
                        eventClickCity(event_target_id);
                        break;
                    }
                    case event_target_id=='common_map_control_expand_search_icon':{
                        props.methods.COMMON.COMMON_DOCUMENT
                            .querySelector('#common_map_control_expand_search_input')
                            .focus();
                        eventKeyUpDispatch( event, 
                                props.methods.COMMON.COMMON_DOCUMENT
                                .querySelector('#common_map_control_expand_search_input')
                                .textContent);
                        break;
                    }
                    case event_target_id=='common_map_control_expand_select_mapstyle':{
                        props.methods.setLayer(event.target?.getAttribute('data-value'));
                        break;
                    }
                }
                break;
            }
            case 'keyup':{
                switch (true){
                    case event_target_id=='common_map_control_expand_search_input':{
                        eventKeyUpDispatch( event, 
                                            props.methods.COMMON.COMMON_DOCUMENT
                                            .querySelector('#common_map_control_expand_search_input')
                                            .textContent);
                        break;
                    }
                }
            }
        }
    };
    const countries = await map_country(props.methods.COMMON.commonUserLocale());
    const onMounted = async () =>{
        if (props.data.expand_type=='search'){
            await props.methods.COMMON.commonComponentRender({
                mountDiv:   'common_map_control_expand_select_country',
                data:       {
                            default_data_value:'',
                            default_value:'...',
                            options: countries,
                            column_value:'value',
                            column_text:'text'
                            },
                methods:    null,
                path:       '/common/component/common_select.js'});
                map_city();
        }
        else
            await props.methods.COMMON.commonComponentRender({
                mountDiv:   'common_map_control_expand_select_mapstyle', 
                data:       {
                            default_data_value:props.data.map_layers[0].value,
                            default_value:props.data.map_layers[0].title,
                            options:props.data.map_layers,
                            column_value:'value',
                            column_text:'title'
                            },
                methods:    null,
                path:'/common/component/common_select.js'});
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        events:     events,
        template:   template({expand_type:props.data.expand_type, icons:{search:props.methods.COMMON.commonGlobalGet('ICONS')['search']}})
    };
};
export default component;