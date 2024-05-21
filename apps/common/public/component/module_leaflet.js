/**@type{import('../../../types.js').AppDocument}} */
const AppDocument = document;
/**
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

const template =`   <link media="all" rel="stylesheet" href="<CSS_URL/>" type="text/css"/>
                    <div id='<LEAFLET_CONTAINER/>'></div>`;

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
* @returns {Promise.<{ props:{function_post:null}, 
*                      data:   leaflet_data,
*                      template:null}>}
*/
const component = async props => {
    const path_leaflet ='leaflet';
    /**@type {import('../../../types.js').module_leaflet} */
    const Leaflet = await import(path_leaflet);
    const LEAFLET_CONTAINER = 'leaflet';
    
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
            leaflet_map.doubleClickZoom.disable(); 
            //add scale
            //position values: 'topleft', 'topright', 'bottomleft' or 'bottomright'
            Leaflet.control.scale({position: 'topright'}).addTo(leaflet_map);
            
            if (doubleclick_event){
                leaflet_map.on('dblclick', doubleclick_event);
            }
            else{
                /**
                 * @param{import('../../../types.js').AppEventLeaflet} e
                 */
                const default_dbl_click_event = e => {
                    if (e.originalEvent.target.id == LEAFLET_CONTAINER){
                        const lng = e.latlng.lng;
                        const lat = e.latlng.lat;
                        //Update GPS position
                        props.function_get_place_from_gps(lng, lat).then((/**@type{string}*/gps_place) => {
                            props.function_map_update({ longitude:lng,
                                                        latitude:lat,
                                                        zoomvalue:null,//do not change zoom 
                                                        text_place: gps_place,
                                                        country:'',
                                                        city:'',
                                                        timezone_text :null,
                                                        marker_id:props.module_leaflet_marker_div_gps,
                                                        to_method:props.module_leaflet_jumpto
                                                    });
                        });
                    }
                };
                //also creates event:
                //Leaflet.DomEvent.addListener(leaflet_map, 'dblclick', default_dbl_click_event);
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