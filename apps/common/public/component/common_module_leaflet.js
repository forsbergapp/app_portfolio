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
 *                      commonMountdiv:string,
 *                      longitude:string,
 *                      latitude:string,
 *                      app_eventListeners:import('../../../common_types.js').CommonGlobal['app_eventListeners']},
 *          methods:    {
 *                      COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT
 *                       }}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:import('../../../common_types.js').CommonModuleLeafletMethods,
 *                      template:string}>}
 */
const component = async props => {
    const path_leaflet ='leaflet';
    /**@type {import('../../../common_types.js').CommonModuleLeaflet} */
    const LEAFLET = await import(path_leaflet);
    const LEAFLET_CONTAINER_DIV = 'leaflet';
    /**@type{import('../../../common_types.js').CommonModuleLeafletMapData} */
    let LEAFLET_CONTAINER;
    const MODULE_LEAFLET_ZOOM       =14;
    
    /**
     * Returns Leaflet container
     */
    const leafletContainer =()=>LEAFLET_CONTAINER;

    /**
     * Returns Leaflet library
     */
    const leafletLibrary =()=>LEAFLET;

    const onMounted = async () =>{
         LEAFLET_CONTAINER = leafletLibrary().map(LEAFLET_CONTAINER_DIV).setView([props.data.latitude, props.data.longitude], MODULE_LEAFLET_ZOOM);
        //disable doubleclick in event dblclick since e.preventdefault() does not work
        leafletContainer().doubleClickZoom.disable(); 
        //add scale
        //position values: 'topleft', 'topright', 'bottomleft' or 'bottomright'
        leafletLibrary().control.scale({position: 'topright'}).addTo(leafletContainer());
        
    };
    const onUnmounted = ()=>{
        //remove Leaflet listeners if any one used
        if (props.data.app_eventListeners.LEAFLET.length>0){
            for (const listener of props.data.app_eventListeners.LEAFLET){
                if(listener[0]=='DOCUMENT' || listener[0]=='WINDOW'){
                    //document and window events are both created on document
                    props.methods.COMMON_DOCUMENT.removeEventListener(listener[2], listener[3]);
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
                    leafletLibrary:leafletLibrary,
                    leafletContainer:leafletContainer},
        template:   template({  css_url:'/common/modules/leaflet/leaflet.css',
                                leaflet_container:LEAFLET_CONTAINER_DIV
                            })
    };
};
export default component;