/**
 * @module apps/common/component/module_leaflet
 */
/**
 * @param {{css_url:string,
 *          leaflet_container:string}} props
 */
const template = props => ` <link media="all" rel="stylesheet" href='${props.css_url}' type="text/css"/>
                            <div id='${props.leaflet_container}'></div>`;

/**
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      longitude:string,
 *                      latitude:string,
 *                      module_leaflet_zoom:number,
 *                      module_leaflet_jumpto:number,
 *                      module_leaflet_marker_div_gps:string,},
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      function_event_doubleclick:function,
 *                      get_place_from_gps:import('../../../common_types.js').CommonModuleCommon['get_place_from_gps'],
 *                      map_update:import('../../../common_types.js').CommonModuleCommon['map_update']
 *                       },
 *          lifecycle:  null}} props
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:   import('../../../common_types.js').CommonModuleLeafletData,
 *                      template:null}>}
 */
const component = async props => {
    const path_leaflet ='leaflet';
    /**@type {import('../../../common_types.js').CommonModuleLeaflet} */
    const Leaflet = await import(path_leaflet);
    const LEAFLET_CONTAINER = 'leaflet';
    
    /**
     * Map init
     * @param {string} longitude 
     * @param {string} latitude 
     * @param {function|null} doubleclick_event 
     * @returns {Promise.<import('../../../common_types.js').CommonModuleLeafletMapData>}
     */
    const map_init = async (longitude, latitude, doubleclick_event) => {
        return await new Promise((resolve)=>{
            const leaflet_map = Leaflet.map(LEAFLET_CONTAINER).setView([latitude, longitude], props.data.module_leaflet_zoom);
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
                 * @param{import('../../../common_types.js').CommonModuleLeafletEvent} e
                 */
                const default_dbl_click_event = e => {
                    if (e.originalEvent.target.id == LEAFLET_CONTAINER){
                        const lng = e.latlng.lng;
                        const lat = e.latlng.lat;
                        //Update GPS position
                        props.methods.get_place_from_gps(lng, lat).then((/**@type{string}*/gps_place) => {
                            props.methods.map_update({ longitude:lng,
                                                        latitude:lat,
                                                        zoomvalue:null,//do not change zoom 
                                                        text_place: gps_place,
                                                        country:'',
                                                        city:'',
                                                        timezone_text :null,
                                                        marker_id:props.data.module_leaflet_marker_div_gps,
                                                        to_method:props.data.module_leaflet_jumpto
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
    //mounts template with css and Leaflet div inside apps mountdiv props
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML += template({css_url:'/common/modules/leaflet/leaflet.css',
                                                                                            leaflet_container:LEAFLET_CONTAINER
                                                                                            });    
    return {
        props:  {function_post:null},
        data:   {   
                    library_Leaflet:Leaflet,
                    //return Leaflet mounted map on already mounted div
                    module_map:await map_init(props.data.longitude, props.data.latitude, props.methods.function_event_doubleclick),
                    //return Leaflet inner mounted map div to add custom code inside Leaflet
                    leaflet_container:LEAFLET_CONTAINER
                },
        template: null
    };
};
export default component;