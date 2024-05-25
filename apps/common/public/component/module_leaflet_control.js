/**@type{import('../../../types.js').AppDocument} */
const AppDocument = document;

/**
 * @typedef {{  id:number,
 *              display_data:string,
 *              value:string,
 *              data:string,
 *              data2:string,
 *              data3:string,
 *              data4:string,
 *              session_map_layer:*}} type_map_layer_array
 * @typedef {{id:number, value:string, display_data:string}} countries_type
 */

/**
 * 
 * @param {{
 *          current_group_name:string,
 *          countries:countries_type[],
 *          longitude : string, 
 *          latitude : string,
 *          map_layers:type_map_layer_array[]}} props 
 * @returns 
 */
const template = props =>` <div id='common_module_leaflet_control_search' class='common_module_leaflet_control_button' title='<TITLE_SEARCH/>' role='button'>
                            <div id='common_module_leaflet_control_search_button' class='common_icon'></div>
                            <div id='common_module_leaflet_control_expand_search' class='common_module_leaflet_control_expand'>
                                <select id='common_module_leaflet_select_country'>
                                    <option value='' id='' label='…'>…</option>
                                    ${props.countries.map((/**@type{*}*/country, index)=>{
                                            const row = (props.current_group_name !== country.group_name?`<optgroup label=${country.group_name}/>`:'')
                                                        +
                                                        `<option value=${index}
                                                                id=${country.id} 
                                                                country_code=${country.country_code} 
                                                                flag_emoji=${country.flag_emoji} 
                                                                group_name=${country.group_name}>${country.flag_emoji} ${country.text}
                                                        </option>`;
                                            props.current_group_name = country.group_name;
                                            return row;
                                        }).join('')
                                    }
                                </select>
                                <select id='common_module_leaflet_select_city'  >
                                    <option value='' id='' label='…'>…</option>
                                </select>
                                <div id='common_module_leaflet_search_input_row'>
                                    <div id='common_module_leaflet_search_input' contentEditable='true' class='common_input'/></div>
                                    <div id='common_module_leaflet_search_icon' class='common_icon'></div>
                                </div>
                                <div id='common_module_leaflet_search_list_wrap'>
                                    <div id='common_module_leaflet_search_list'></div>
                                </div>
                            </div>
                        </div>
                        <div id='common_module_leaflet_control_fullscreen_id' class='common_module_leaflet_control_button common_icon' title='<TITLE_FULLSCREEN/>' role='button'></div>
                        ${(props.longitude == '' && props.latitude=='')?'':
                            `<div   id='common_module_leaflet_control_my_location_id' 
                                    class='common_module_leaflet_control_button common_icon' 
                                    title='<TITLE_MY_LOCATION/>' role='button'>
                            </div>`
                        }
                        <div id='common_module_leaflet_control_layer' class='common_module_leaflet_control_button' title='Layer' role='button'>
                            <div id='common_module_leaflet_control_layer_button' class='common_icon'></div>
                            <div id='common_module_leaflet_control_expand_layer' class='common_module_leaflet_control_expand'>
                                <select id='common_module_leaflet_select_mapstyle' >
                                    ${props.map_layers.map((/**@type{*}*/row)=>(
                                        `<option id=${row.id} value='${row.value}'>${row.display_data}</option>`)
                                        ).join('')
                                    }
                                </select>
                            </div>
                        </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          data_app_id:number,
 *          locale:string,
 *          longitude:string,
 *          latitude:string,
 *          map_layer:string,
 *          map_layers:type_map_layer_array[],
 *          module_leaflet_container:string,
 *          function_FFB:function,
 *          function_search_event:function,
 *          function_SearchAndSetSelectedIndex:function,
 *          function_map_setstyle:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:  null,
 *                      template:null}>}
 */
const component = async props => {
    
    /**
     * 
     * @param {countries_type[]} countries 
     * @returns 
     */
    const render_template = (countries) =>{
        return template({
                            current_group_name:'',
                            countries:countries,
                            longitude :props.latitude,
                            latitude :props.longitude,
                            map_layers:props.map_layers,
                        })
                .replace('<TITLE_SEARCH/>',         'Search')
                .replace('<TITLE_FULLSCREEN/>',     'Fullscreen')
                .replace('<TITLE_MY_LOCATION/>',    'My location');
    }
    
    const post_component = async () =>{
        await props.function_FFB('/server-db/country', `lang_code=${props.locale}`, 'GET', 'APP_DATA', null)
        .then((/**@type{string}*/countries_json)=>{
            //mount custom code inside Leaflet container
            props.common_document.querySelectorAll(`#${props.common_mountdiv} #${props.module_leaflet_container} .leaflet-control`)[0].innerHTML += render_template(JSON.parse(countries_json).rows);
            if (props.function_search_event){
                //add search function in data-function that event delegation will use
                props.common_document.querySelector('#common_module_leaflet_search_input')['data-function'] = props.function_search_event;
            }
            //set additonal settings on rendered Leaflet module
            props.function_map_setstyle(props.map_layer);
            //set map layer 
            props.function_SearchAndSetSelectedIndex(props.map_layer, AppDocument.querySelector('#common_module_leaflet_select_mapstyle'),1);
        });
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: null
    };
}
export default component;