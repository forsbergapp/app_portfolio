const common = await import('common');
const APP_GLOBAL = {
    'module_leaflet_map_container':'',
    'module_leaflet_map_zoom':'',
    'module_leaflet_map_marker_div_gps':''
};
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, error);
};
const map_click_event = (event) =>{
    common.map_click_event(event,   APP_GLOBAL['module_leaflet_map_container'], 
                                    APP_GLOBAL['module_leaflet_map_zoom'], 
                                    APP_GLOBAL['module_leaflet_map_marker_div_gps']);
};
const init_app = () =>{
    APP_GLOBAL['module_leaflet_map_container']      ='mapid';
    APP_GLOBAL['module_leaflet_zoom_city']          = 8;
    APP_GLOBAL['module_leaflet_map_zoom']           = 14;
    APP_GLOBAL['module_leaflet_map_marker_div_gps'] = 'map_marker_gps';
    APP_GLOBAL['module_leaflet_map_marker_div_city'] = 'map_marker_city';

    return new Promise((resolve)=>{
        common.map_init(APP_GLOBAL['module_leaflet_map_container'], 
                        common.COMMON_GLOBAL['module_leaflet_style'], 
                        common.COMMON_GLOBAL['client_longitude'],
                        common.COMMON_GLOBAL['client_latitude'],
                        APP_GLOBAL['module_leaflet_map_marker_div_gps'],
                        APP_GLOBAL['module_leaflet_map_zoom'],
                        APP_GLOBAL['module_leaflet_map_marker_div_city'],
                        APP_GLOBAL['module_leaflet_map_zoom_city'],
                        false, 
                        true).then(()=>{
            
            common.map_update(  common.COMMON_GLOBAL['client_longitude'],
                                common.COMMON_GLOBAL['client_latitude'],
                                APP_GLOBAL['module_leaflet_map_zoom'],
                                common.COMMON_GLOBAL['client_place'],
                                null,
                                APP_GLOBAL['module_leaflet_map_marker_div_gps'],
                                common.COMMON_GLOBAL['module_leaflet_jumpto']);
            resolve();
        });
    });
};
const init = (parameters) => {
    return new Promise((resolve)=>{
        common.COMMON_GLOBAL['exception_app_function'] = app_exception;
        common.init_common(parameters).then(()=>{
            init_app().then(()=>{
                document.querySelector('#loading').innerHTML = '';
                resolve();
            });
        });
    });
};
export{APP_GLOBAL, map_click_event, init};
