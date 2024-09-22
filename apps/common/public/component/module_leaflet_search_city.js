/**
 * @module apps/common/component/module_leaflet_search_city
 */

/**
 * 
 * @param {{spinner:string,
 *          records:import('../../../common_types.js').CommonMicroserviceWorldcitiesRecordType[]}
 *          } props 
 * @returns {string}
 */
const template = props =>`  <div id='common_module_leaflet_search_list' class='${props.spinner}'>
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
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          search:string,
 *          function_click_function:function,
 *          function_FFB:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    
    const post_component = async () =>{
        const records = props.search==''?[]:await props.function_FFB('/worldcities/city', `search=${encodeURI(props.search)}`, 'GET', 'APP_DATA', null)
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows)
                            .catch((/**@type{Error}*/error)=>{throw error;});
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template({spinner:'', records:records});
        if (props.search.length>0)
            props.common_document.querySelector('#common_module_leaflet_search_list')['data-function'] = props.function_click_function;
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template({spinner:'css_spinner', records:[]})
    };
};
export default component;