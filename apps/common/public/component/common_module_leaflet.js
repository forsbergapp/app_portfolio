/**
 * Displays Leaflet
 * @module apps/common/component/common_module_leaflet
 */
/**
 * @import {CommonModuleCommon, CommonModuleLeaflet, CommonModuleLeafletMapData, CommonModuleLeafletMethods, CommonGlobal, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{css_url:string,
 *          leaflet_container:string}} props
 * @returns {string}
 */
const template = props => ` <link id="common_link_common_module_leaflet_css" media="all" rel="stylesheet" href='${props.css_url}' type="text/css"/>
                            <div id='${props.leaflet_container}'></div>`;

/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      longitude:string,
 *                      latitude:string,
 *                      app_eventListeners:CommonGlobal['app_eventListeners']
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonMiscImportmap:CommonModuleCommon['commonMiscImportmap']
 *                       }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:CommonModuleLeafletMethods,
 *                      template:string}>}
 */
const component = async props => {
    /**@type {CommonModuleLeaflet} */
    const LEAFLET = await import(props.methods.commonMiscImportmap('leaflet'));
    const LEAFLET_CONTAINER_DIV = 'leaflet';
    /**@type{CommonModuleLeafletMapData} */
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