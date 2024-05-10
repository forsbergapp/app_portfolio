/**@type{{querySelector:function}} */
const AppDocument = document;
/**
 * @typedef {{id:number, city:string, admin_name:string, country:string, lat:string, lng:string}} record_type
 */
/**
 * 
 * @param {{
 *          records:record_type[]}
 *          } props 
 * @returns {string}
 */
const template = props =>`  <div id='common_module_leaflet_search_list' <SPINNER_CLASS/>>
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
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          search:string,
 *          function_click_function:function,
 *          function_FFB:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    let spinner = `class='css_spinner'`;
    
    /**
     * 
     * @param {{
     *          records:record_type[]}} props 
     * @returns {string}
     */
    const render_template = props =>{
        return template(props)
                .replace('<SPINNER_CLASS/>', spinner);
    }
    const post_component = async () =>{
        const records = props.search==''?[]:await props.function_FFB('WORLDCITIES', '/city/search', `search=${encodeURI(props.search)}`, 'GET', 'APP_DATA', null)
                            .then((/**@type{string}*/result)=>JSON.parse(result))
                            .catch((/**@type{Error}*/error)=>{throw error});
        spinner = '';
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template({records:records});
        if (props.search.length>0)
            AppDocument.querySelector('#common_module_leaflet_search_list')['data-function'] = props.function_click_function;
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template({records:[]})
    };
}
export default component;