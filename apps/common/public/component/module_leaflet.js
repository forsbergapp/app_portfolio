/**@type{{querySelector:function, querySelectorAll:function}} */
const AppDocument = document;
/**
 * @typedef {object} AppEvent
 * @property {{ id:                 string
 *            }}  target
 * @typedef {{  originalEvent:AppEvent,
 *              latlng:{lat:string, 
 *                      lng:string}}} AppEventLeaflet 
 *
 * @typedef {{  doubleClickZoom:function,
 *              invalidateSize:function,
 *              removeLayer:function,
 *              setView:function,
 *              flyTo:function,
 *              setZoom:function,
 *              getZoom:function}} type_map_data
 * 
 * @typedef {{  library_Leaflet:*,
 *              module_map: type_map_data,
 *              leaflet_container:string}} leaflet_data
 */

const template =`   <link media="print" onload="this.media='all'" rel="stylesheet" href="<CSS_URL/>" type="text/css"/>
                    <div id='<LEAFLET_CONTAINER/>'>`;

/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          longitude:string,
 *          latitude:string,
 *          module_leaflet_zoom:number,
 *          module_leaflet_jumpto:number,
 *          module_leaflet_marker_div_gps:string,
 *          function_event_doubleclick:function,
 *          function_get_place_from_gps:function,
 *          function_map_update:function}} props 
* @returns {Promise.<{ props:{function_post:function|null}, 
*                      data:   leaflet_data,
*                      template:null}>}
*/
const component = async props => {
    /**@ts-ignore */
    const {L:Leaflet} = await import('leaflet');
    const LEAFLET_CONTAINER = 'leaflet';
    /*
        how to call:
        const leaflet_data = await
        ComponentRender('mapid', 
                        {   
                            longitude:common.COMMON_GLOBAL.client_longitude,
                            latitude:common.COMMON_GLOBAL.client_latitude,
                            //module parameters
                            module_leaflet_zoom:COMMON_GLOBAL.module_leaflet_zoom,
                            module_leaflet_jumpto:COMMON_GLOBAL.module_leaflet_jumpto,
                            module_leaflet_marker_div_gps:COMMON_GLOBAL.module_leaflet_marker_div_gps,
                            //functions
                            function_event_doubleclick: doubleclick_event / null,
                            function_get_place_from_gps:get_place_from_gps,
                            function_map_update:map_update
                            },
                        '/common/component/module_leaflet.js');

        COMMON_GLOBAL.module_leaflet =              leaflet_data.library_Leaflet;
        COMMON_GLOBAL.module_leaflet_session_map =  leaflet_data.module_map;
        //adding custom code inside Leaflet rendered div
        ComponentRender('mapid', //outer app div
                        {   
                            //props
                            ...
                            //module parameter
                            module_leaflet_container:leaflet_data.leaflet_container,    //inner Leaflet div returned from Leaflet
                            //functions
                            ...
                            },
                        '/component/[custom_component].js');
     */
    
    /**
     * Map init
     * @param {string} longitude 
     * @param {string} latitude 
     * @param {function|null} doubleclick_event 
     * @returns {Promise.<type_map_data>}
     */
    const map_init = async (longitude, latitude, doubleclick_event) => {
        return await new Promise((resolve)=>{
            const leaflet_map = Leaflet.map(LEAFLET_CONTAINER).setView([latitude, longitude], props.module_leaflet_zoom);
            //disable doubleclick in event dblclick since e.preventdefault() does not work
            /**@ts-ignore */
            leaflet_map.doubleClickZoom.disable(); 
            //add scale
            //position values: 'topleft', 'topright', 'bottomleft' or 'bottomright'
            Leaflet.control.scale({position: 'topright'}).addTo(leaflet_map);
            
            if (doubleclick_event){
                /**@ts-ignore */
                leaflet_map.on('dblclick', doubleclick_event);
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
                //Leaflet.DomEvent.addListener(leaflet_map, 'dblclick', default_dbl_click_event);
                /**@ts-ignore */
                leaflet_map.on('dblclick', default_dbl_click_event);
            }
            resolve(leaflet_map);
        });  
    };
    const render_template = () =>{
        return template
                    .replace('<LEAFLET_CONTAINER/>', LEAFLET_CONTAINER)
                    .replace('<CSS_URL/>', '/common/modules/leaflet/leaflet.css');
    }
    //mounts template with css and Leaflet div inside apps mountdiv props
    props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML += render_template();
    
    return {
        props:  {function_post:null},
        data:   {   
                    library_Leaflet:Leaflet,
                    //return Leaflet mounted map on already mounted div
                    module_map:await map_init(props.longitude, props.latitude, props.function_event_doubleclick),
                    //return Leaflet inner mounted map div to add custom code inside Leaflet
                    leaflet_container:LEAFLET_CONTAINER
                },
        //return empty template
        template: null
    };
}
export default component;