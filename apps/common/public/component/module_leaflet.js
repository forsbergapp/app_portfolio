/**@type{{querySelector:function, querySelectorAll:function}} */
const AppDocument = document;
/**
 * @typedef {object} AppEvent
 * @property {{ id:                 string
 *            }}  target
 * @typedef {{  originalEvent:AppEvent,
 *              latlng:{lat:string, 
 *                      lng:string}}} AppEventLeaflet 
 * @typedef {{  id:number,
 *              description:string,
 *              data:string,
 *              data2:string,
 *              data3:string,
 *              data4:string,
 *              session_map_layer:*}} type_map_layer_array
 *
 * @typedef {{  doubleClickZoom:function|null,
 *              invalidateSize:function|null,
 *              removeLayer:function|null,
 *              setView:function|null,
 *              flyTo:function|null,
 *              setZoom:function|null,
 *              getZoom:function|null}} type_module_leaflet_session_map
 * 
 * @typedef {{   map_layer_options:          string,
 *              map_layer_array:            type_map_layer_array[]|[],
 *              module_leaflet_session_map: type_module_leaflet_session_map|null}} type_map_data
 * @typedef {{  library_Leaflet:*,
 *              module_map: *,
 *              map_layer_array:type_map_layer_array[]|[]}} leaflet_data
 */

const template =`   <div id='common_module_leaflet_control_search' class='common_module_leaflet_control_button' title='<TITLE_SEARCH/>' role='button'>
                        <div id='common_module_leaflet_control_search_button' class='common_icon'></div>
                        <div id='common_module_leaflet_control_expand_search' class='common_module_leaflet_control_expand'>
                            <select id='common_module_leaflet_select_country'>
                                <COUNTRIES/>
                            </select>
                            <select id='common_module_leaflet_select_city'  >
                                <option value='' id='' label='…' selected='selected'>…</option>
                            </select>
                            <div id='common_module_leaflet_search_input_row'>
                                <div id='common_module_leaflet_search_input' contenteditable=true class='common_input'/></div>
                                <div id='common_module_leaflet_search_icon' class='common_icon'></div>
                            </div>
                            <div id='common_module_leaflet_search_list_wrap'>
                                <div id='common_module_leaflet_search_list'></div>
                            </div>
                        </div>
                    </div>
                    <div id='common_module_leaflet_control_fullscreen_id' class='common_module_leaflet_control_button common_icon' title='<TITLE_FULLSCREEN/>' role='button'></div>
                    <LOCATION/>
                    <div id='common_module_leaflet_control_layer' class='common_module_leaflet_control_button' title='Layer' role='button'>
                        <div id='common_module_leaflet_control_layer_button' class='common_icon'></div>
                        <div id='common_module_leaflet_control_expand_layer' class='common_module_leaflet_control_expand'>
                            <select id='common_module_leaflet_select_mapstyle' >
                                <MAP_LAYER_OPTIONS/>
                            </select>
                        </div>
                    </div>`;
const template_location = `<div id='common_module_leaflet_control_my_location_id' class='common_module_leaflet_control_button common_icon' title='<TITLE_MY_LOCATION/>' role='button'></div>`;

/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          data_app_id:number,
 *          locale:string,
 *          container:string,
 *          longitude:string,
 *          latitude:string,
 *          module_leaflet_zoom:number,
 *          module_leaflet_jumpto:number,
 *          module_leaflet_map_style:string,
 *          module_leaflet_map_styles:string,
 *          module_leaflet_marker_div_city:string,
 *          module_leaflet_marker_div_gps:string,
 *          function_FFB:function
 *          function_event_doubleclick:function,
 *          function_search_event:function,
 *          function_get_place_from_gps:function,
 *          function_SearchAndSetSelectedIndex:function,
 *          function_map_country:function,
 *          function_map_update:function,
 *          function_map_setstyle:function}} props 
* @returns {Promise.<{ props:{function_post:function|null}, 
*                      data:   leaflet_data,
*                      template:null}>}
*/
const component = async props => {
    /**@ts-ignore */
    const {L:Leaflet} = await import('leaflet');
    /*
        how to call:
        ComponentRender('mapid', 
                        {   data_app_id:COMMON_GLOBAL.common_app_id,
                            locale:COMMON_GLOBAL.user_locale,
                            container:APP_GLOBAL.module_leaflet_map_container
                            longitude:common.COMMON_GLOBAL.client_longitude,
                            latitude:common.COMMON_GLOBAL.client_latitude,
                            //module parameters
                            module_leaflet_zoom:COMMON_GLOBAL.module_leaflet_zoom,
                            module_leaflet_jumpto:COMMON_GLOBAL.module_leaflet_jumpto,
                            module_leaflet_map_style:COMMON_GLOBAL.module_leaflet_style,
                            module_leaflet_marker_div_gps:COMMON_GLOBAL.module_leaflet_marker_div_gps,
                            //functions
                            function_FFB:FFB,
                            function_event_doubleclick: doubleclick_event / null,
                            funcion_search_event:[map_show_search_on_map_app / null],
                            function_get_place_from_gps:get_place_from_gps,
                            function_SearchAndSetSelectedIndex:SearchAndSetSelectedIndex,
                            function_map_country:map_country,
                            function_map_update:map_update,
                            function_map_setstyle:map_setstyle,
                            },
                        '/common/component/module_leaflet.js')
        .then((leaflet_data)=>{
            COMMON_GLOBAL.module_leaflet =              leaflet_data.library_Leaflet;
            COMMON_GLOBAL.module_leaflet_session_map =  leaflet_data.module_map;
            COMMON_GLOBAL.module_leaflet_map_styles =   leaflet_data.map_layer_array;
        })
     */
    /**
     * 
     * @param {number} app_id 
     * @returns {Promise.<{ map_layer_options:string,
     *                      map_layer_array:type_map_layer_array[]|[]}>}
     */
    const get_map_layers = async (app_id)  =>{
        const map_layers = await props.function_FFB('DB_API', `/app_setting?data_app_id=${app_id}&setting_type=MAP_STYLE`, 'GET', 'APP_DATA')
                            .then((/**@type{string}*/result)=>JSON.parse(result))
                            .catch((/**@type{Error}*/error)=>error);
                            
        let map_layer_options ='';
        let map_layer_array = [];
        for (const map_layer_option of map_layers){
            map_layer_options +=`<option id=${map_layer_option.id} value='${map_layer_option.value}'>${map_layer_option.display_data}</option>`;
            map_layer_array.push({ id:map_layer_option.id, 
                                    description:map_layer_option.display_data, 
                                    data:map_layer_option.value, 
                                    data2:map_layer_option.data2, 
                                    data3:map_layer_option.data3, 
                                    data4:map_layer_option.data4, 
                                    session_map_layer:null});
        }
        return {map_layer_options:map_layer_options,
                map_layer_array:map_layer_array};
    }
    /**
     * Map init
     * @param {string} container 
     * @param {string} longitude 
     * @param {string} latitude 
     * @param {function|null} doubleclick_event 
     * @returns {Promise.<null>}
     */
    const map_init = async (container, longitude, latitude, doubleclick_event) => {
        return await new Promise((resolve)=>{
            map_data.module_leaflet_session_map = Leaflet.map(container).setView([latitude, longitude], props.module_leaflet_zoom);
            //disable doubleclick in event dblclick since e.preventdefault() does not work
            /**@ts-ignore */
            map_data.module_leaflet_session_map.doubleClickZoom.disable(); 
            //add scale
            //position values: 'topleft', 'topright', 'bottomleft' or 'bottomright'
            Leaflet.control.scale({position: 'topright'}).addTo(map_data.module_leaflet_session_map);
            
            if (doubleclick_event){
                /**@ts-ignore */
                map_data.module_leaflet_session_map.on('dblclick', doubleclick_event);
            }
            else{
                /**
                 * @param{AppEventLeaflet} e
                 */
                const default_dbl_click_event = (e) => {
                    if (e.originalEvent.target.id == 'mapid'){
                        const lng = e.latlng.lng;
                        const lat = e.latlng.lat;
                        //Update GPS position
                        props.function_get_place_from_gps(lng, lat).then((/**@type{string}*/gps_place) => {
                            props.function_map_update(  lng,
                                                        lat,
                                                        null, //do not change zoom 
                                                        gps_place,
                                                        null,
                                                        props.module_leaflet_marker_div_gps,
                                                        props.module_leaflet_jumpto);
                        });
                    }
                };
                //also creates event:
                //Leaflet.DomEvent.addListener(map_data.module_leaflet_session_map, 'dblclick', default_dbl_click_event);
                /**@ts-ignore */
                map_data.module_leaflet_session_map.on('dblclick', default_dbl_click_event);
            }
            resolve(null);
        });  
    };
    const render_template = async () =>{
        const template_result = template
                                .replace('<TITLE_SEARCH/>',         'Search')
                                .replace('<TITLE_FULLSCREEN/>',     'Fullscreen')
                                .replace('<COUNTRIES/>',            await props.function_map_country(props.locale))
                                .replace('<MAP_LAYER_OPTIONS/>',    map_data.map_layer_options)
                                .replace('<LOCATION/>',             (props.longitude == '' && props.latitude=='')?'':
                                                                        template_location.replace('<TITLE_MY_LOCATION/>',    'My location'));
        return template_result;
    }
    /**
     * @type{type_map_data}
     */
    const map_data = {... await get_map_layers(props.data_app_id),
                      module_leaflet_session_map:null};
    Object.seal(map_data);
    await map_init(props.container, props.longitude, props.latitude, props.function_event_doubleclick);
    props.common_document.querySelectorAll(`#${props.container} .leaflet-control`)[0].innerHTML += await render_template();

    const post_component = () =>{
        if (props.function_search_event){
            //add search function in data-function that event delegation will use
            props.common_document.querySelector('#common_module_leaflet_search_input')['data-function'] = props.function_search_event;
        }
        //set additonal settings on rendered Leaflet module
        props.function_map_setstyle(props.module_leaflet_map_style);
        //set map layer 
        props.function_SearchAndSetSelectedIndex(props.module_leaflet_map_style, AppDocument.querySelector('#common_module_leaflet_select_mapstyle'),1);
    }
    return {
        props:  {function_post:post_component},
        data:   {   library_Leaflet:Leaflet,
                    module_map:     map_data.module_leaflet_session_map,
                    map_layer_array:map_data.map_layer_array},
        template: null
    };
}
export default component;