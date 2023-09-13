const common = await import('common');
const APP_GLOBAL = {
    'module_leaflet_map_container':'',
    'module_leaflet_map_zoom':'',
    'module_leaflet_map_marker_div_gps':''
};
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, error);
};
const map_init = async () =>{
    return new Promise((resolve)=>{
        //save library in variable for optimization
        import('leaflet').then(({L : Leaflet})=>{
            common.COMMON_GLOBAL['module_leaflet_library'] = Leaflet;
            common.COMMON_GLOBAL['module_leaflet_session_map'] = '';
            common.COMMON_GLOBAL['module_leaflet_session_map'] = 
                    common.COMMON_GLOBAL['module_leaflet_library'].map(APP_GLOBAL['module_leaflet_map_container']).setView([common.COMMON_GLOBAL['client_latitude'], 
                                                                                                                            common.COMMON_GLOBAL['client_longitude']],                                                                                                                         
                                                                                                                            APP_GLOBAL['module_leaflet_map_zoom']);

            common.COMMON_GLOBAL['module_leaflet_session_map'].on('dblclick', (e) => {
                if (e.originalEvent.target.id == 'mapid'){
                    const lng = e.latlng['lng'];
                    const lat = e.latlng['lat'];
                    //Update GPS position
                    common.get_place_from_gps(lng, lat).then((gps_place) => {
                        common.map_update(lng,
                                            lat,
                                            '', //do not change zoom 
                                            gps_place,
                                            null,
                                            APP_GLOBAL['module_leaflet_map_marker_div_gps'],
                                            common.COMMON_GLOBAL['module_leaflet_jumpto']);
                    });
                }
            });
            //add scale
            common.COMMON_GLOBAL['module_leaflet_library'].control.scale().addTo(common.COMMON_GLOBAL['module_leaflet_session_map']); 
            
            common.map_setstyle(common.COMMON_GLOBAL['module_leaflet_style']).then(()=>{
                //disable doubleclick in event dblclick since e.preventdefault() does not work
                common.COMMON_GLOBAL['module_leaflet_session_map'].doubleClickZoom.disable(); 
                resolve();
            });
        });
    });
    
};
const map_add_controls = ()=>{
    //add fullscreen button and my location button with eventlisteners
    const mapcontrol = document.querySelectorAll(`#${APP_GLOBAL['module_leaflet_map_container']} .leaflet-control`);
    mapcontrol[0].innerHTML += '<a id=\'common_leaflet_fullscreen_id\' href="#" title="Full Screen" role="button"></a>';
    document.getElementById('common_leaflet_fullscreen_id').innerHTML= common.ICONS['app_fullscreen'];
    if (common.COMMON_GLOBAL['client_latitude']!='' && common.COMMON_GLOBAL['client_longitude']!=''){
        mapcontrol[0].innerHTML += '<a id=\'common_leaflet_my_location_id\' href="#" title="My location" role="button"></a>';
        document.getElementById('common_leaflet_my_location_id').innerHTML= common.ICONS['map_my_location'];
    }
};
const mapclick_event = (event) =>{
    switch (event.target.id==''?event.target.parentNode.id:event.target.id){
        case 'common_leaflet_fullscreen_id':{
            if (document.fullscreenElement)
                document.exitFullscreen();
            else
                document.getElementById(APP_GLOBAL['module_leaflet_map_container']).requestFullscreen();
            break;
        }
        case 'common_leaflet_my_location_id':{
            if (common.COMMON_GLOBAL['client_latitude']!='' && common.COMMON_GLOBAL['client_longitude']!=''){
                common.map_update(common.COMMON_GLOBAL['client_longitude'],
                                    common.COMMON_GLOBAL['client_latitude'],
                                    APP_GLOBAL['module_leaflet_map_zoom'],
                                    common.COMMON_GLOBAL['client_place'],
                                    null,
                                    APP_GLOBAL['module_leaflet_map_marker_div_gps'],
                                    common.COMMON_GLOBAL['module_leaflet_jumpto']);
            }                                
            break;
        }
        default:{
            if (event.target.classList.contains('leaflet-control-zoom-in') || event.target.parentNode.classList.contains('leaflet-control-zoom-in'))
                common.COMMON_GLOBAL['module_leaflet_session_map'].setZoom(common.COMMON_GLOBAL['module_leaflet_session_map'].getZoom() + 1);
            if (event.target.classList.contains('leaflet-control-zoom-out') || event.target.parentNode.classList.contains('leaflet-control-zoom-out'))
                common.COMMON_GLOBAL['module_leaflet_session_map'].setZoom(common.COMMON_GLOBAL['module_leaflet_session_map'].getZoom() - 1);
            break;
        }
    }
};
const init_app = () =>{
    APP_GLOBAL['module_leaflet_map_container']      ='mapid';
    APP_GLOBAL['module_leaflet_map_zoom']           = 14;
    APP_GLOBAL['module_leaflet_map_marker_div_gps'] = 'map_marker_gps';
};
const init = (parameters) => {
    return new Promise((resolve)=>{
        common.COMMON_GLOBAL['exception_app_function'] = app_exception;
        common.init_common(parameters).then(()=>{
            init_app();
            resolve();
        });
    });
};
export{APP_GLOBAL, map_init, mapclick_event, map_add_controls, app_exception, init};
