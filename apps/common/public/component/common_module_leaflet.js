/**
 * @module apps/common/component/common_module_leaflet
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
 *                      moduleLeafletZoom:number,
 *                      moduleLeafletJumpTo:number,
 *                      app_eventListeners:import('../../../common_types.js').CommonGlobal['app_eventListeners']},
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      function_event_doubleclick:function,
 *                      get_place_from_gps:import('../../../common_types.js').CommonModuleCommon['get_place_from_gps'],
 *                      map_update:import('../../../common_types.js').CommonModuleCommon['map_update']
 *                       }}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:import('../../../common_types.js').CommonModuleLeafletMethods,
 *                      template:string}>}
 */
const component = async props => {
    const path_leaflet ='leaflet';
    /**@type {import('../../../common_types.js').CommonModuleLeaflet} */
    const Leaflet = await import(path_leaflet);
    const LEAFLET_CONTAINER_DIV = 'leaflet';
    /**@type{import('../../../common_types.js').CommonModuleLeafletMapData} */
    let LEAFLET_CONTAINER;
    
    /**
     * Returns Leaflet container
     */
    const leafletContainer =()=>LEAFLET_CONTAINER;

    const onMounted = async () =>{
         LEAFLET_CONTAINER = Leaflet.map(LEAFLET_CONTAINER_DIV).setView([props.data.latitude, props.data.longitude], props.data.moduleLeafletZoom);
        //disable doubleclick in event dblclick since e.preventdefault() does not work
        LEAFLET_CONTAINER.doubleClickZoom.disable(); 
        //add scale
        //position values: 'topleft', 'topright', 'bottomleft' or 'bottomright'
        Leaflet.control.scale({position: 'topright'}).addTo(LEAFLET_CONTAINER);
        
        if (props.methods.function_event_doubleclick){
            LEAFLET_CONTAINER.on('dblclick', props.methods.function_event_doubleclick);
        }
        else{
            /**
             * @param{import('../../../common_types.js').CommonModuleLeafletEvent} e
             */
            const default_dbl_click_event = e => {
                if (e.originalEvent.target.id == LEAFLET_CONTAINER_DIV){
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
                                                    to_method:props.data.moduleLeafletJumpTo
                                                });
                    });
                }
            };
            //also creates event:
            //Leaflet.DomEvent.addListener(LEAFLET_CONTAINER, 'dblclick', default_dbl_click_event);
            LEAFLET_CONTAINER.on('dblclick', default_dbl_click_event);
        }
    };
    const onUnmounted = ()=>{
        //remove Leaflet listeners if any one used
        if (props.data.app_eventListeners.LEAFLET.length>0){
            for (const listener of props.data.app_eventListeners.LEAFLET){
                if(listener[0]=='DOCUMENT' || listener[0]=='WINDOW'){
                    //document and window events are both created on document
                    props.methods.common_document.removeEventListener(listener[2], listener[3]);
                }
                else
                    listener[1].removeEventListener(listener[2], listener[3]);
            }
        }
        props.data.app_eventListeners.LEAFLET = [];
    };
    return {
        lifecycle:  {onMounted:onMounted, onUnmounted:onUnmounted},
        data:       null,
        methods:    {
                    leafletLibrary:Leaflet,
                    leafletContainer:leafletContainer},
        template:   template({  css_url:'/common/modules/leaflet/leaflet.css',
                                leaflet_container:LEAFLET_CONTAINER_DIV
                            })
    };
};
export default component;