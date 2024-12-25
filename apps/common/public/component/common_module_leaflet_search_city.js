/**
 * Displays Leaflet search city
 * @module apps/common/component/common_module_leaflet_search_city
 */

/**
 * @import {CommonMicroserviceWorldcitiesRecordType, CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{records:CommonMicroserviceWorldcitiesRecordType[]}
 *          } props 
 * @returns {string}
 */
const template = props =>`  <div id='common_module_leaflet_search_list'>
                                ${props.records.map(row=>
                                    `<div data-city='${row.city}' data-country='${row.admin_name + ',' + row.country}' data-latitude='${row.lat}' data-longitude='${row.lng}' class='common_module_leaflet_search_list_row common_row' tabindex=-1>
                                        <div class='common_module_leaflet_search_list_col'>
                                            <div class='common_module_leaflet_search_list_city_id'>${row.id}</div>
                                        </div>
                                        <div class='common_module_leaflet_search_list_col'>
                                            <div class='common_module_leaflet_search_list_city common_link common_module_leaflet_click_city'>${row.city}</div>
                                        </div>
                                        <div class='common_module_leaflet_search_list_col'>
                                            <div class='common_module_leaflet_search_list_country common_link common_module_leaflet_click_city'>${row.admin_name + ',' + row.country}</div>
                                        </div>
                                        <div class='common_module_leaflet_search_list_col'>
                                            <div class='common_module_leaflet_search_list_latitude'>${row.lat}</div>
                                        </div>
                                        <div class='common_module_leaflet_search_list_col'>
                                            <div class='common_module_leaflet_search_list_longitude'>${row.lng}</div>
                                        </div>
                                    </div>`).join('')
                                }
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      search:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      click_function:function,
 *                      commonFFB:commonFFB
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const records = props.data.search==''?[]:await props.methods.commonFFB({path:'/worldcities/city', query:`search=${encodeURI(props.data.search)}`, method:'GET', authorization_type:'APP_DATA'})
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows);
    const onMounted = async () =>{
        if (props.data.search.length>0)
            props.methods.COMMON_DOCUMENT.querySelector('#common_module_leaflet_search_list')['data-function'] = props.methods.click_function;
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({records:records})
    };
};
export default component;