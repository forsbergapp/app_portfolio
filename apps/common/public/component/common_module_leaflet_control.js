/**
 * @module apps/common/component/common_module_leaflet_control
 */

/**
 * @param {{
 *          title_search:string,
 *          title_fullscreen:string,
 *          title_my_location:string,
 *          longitude : string, 
 *          latitude : string}} props
 */
const template = props =>` <div id='common_module_leaflet_control_search' class='common_module_leaflet_control_button' title='${props.title_search}' role='button'>
                            <div id='common_module_leaflet_control_search_button' class='common_icon'></div>
                            <div id='common_module_leaflet_control_expand_search' class='common_module_leaflet_control_expand'>
                                <div id='common_module_leaflet_select_country'></div>
                                <div id='common_module_leaflet_select_city'></div>
                                <div id='common_module_leaflet_search_input_row'>
                                    <div id='common_module_leaflet_search_input' contentEditable='true' class='common_input'/></div>
                                    <div id='common_module_leaflet_search_icon' class='common_icon'></div>
                                </div>
                                <div id='common_module_leaflet_search_list_wrap'>
                                    <div id='common_module_leaflet_search_list'></div>
                                </div>
                            </div>
                        </div>
                        <div id='common_module_leaflet_control_fullscreen_id' class='common_module_leaflet_control_button common_icon' title='${props.title_fullscreen}' role='button'></div>
                        ${(props.longitude == '' && props.latitude=='')?'':
                            `<div   id='common_module_leaflet_control_my_location_id' 
                                    class='common_module_leaflet_control_button common_icon' 
                                    title='${props.title_my_location}' role='button'>
                            </div>`
                        }
                        <div id='common_module_leaflet_control_layer' class='common_module_leaflet_control_button' title='Layer' role='button'>
                            <div id='common_module_leaflet_control_layer_button' class='common_icon'></div>
                            <div id='common_module_leaflet_control_expand_layer' class='common_module_leaflet_control_expand'>
                                <div id='common_module_leaflet_select_mapstyle' ></div>
                            </div>
                        </div>`;
/**
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      data_app_id:number,
 *                      user_locale:string,
 *                      locale:string,
 *                      longitude:string,
 *                      latitude:string
 *                      },
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      function_search_event:function, 
 *                      function_event_doubleclick:function,
 *                      ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender'],
 *                      get_place_from_gps:import('../../../common_types.js').CommonModuleCommon['get_place_from_gps'],
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB'],
 *                      moduleLeafletContainer:function,
 *                      moduleleafletLibrary:function
 *                      }}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:  null,
 *                      methods:{
 *                                  eventClickCountry:          function, 
 *                                  eventClickCity:             function,
 *                                  eventClickMapLayer:         function,
 *                                  eventClickControlSearch:    function,
 *                                  eventClickControlFullscreen:function,
 *                                  eventClickControlLocation:  function,
 *                                  eventClickControlLayer:     function,
 *                                  eventClickSearchList:       function,
 *                                  eventKeyUpSearch:           function,
 *                                  map_country:                function,
 *                                  map_city:                   function,
 *                                  map_city_empty:             function,
 *                                  map_toolbar_reset:          function,
 *                                  map_show_search_on_map:     function,
 *                                  map_control_toggle_expand:  function,
 *                                  map_resize:                 function,
 *                                  map_line_removeall:         function,
 *                                  map_line_create:            function,
 *                                  map_setstyle:               function,
 *                                  map_update:                 function,
 *                                  moduleLeafletContainer:     function},
 *                      template:null}>}
 */
const component = async props => {

    const MODULE_LEAFLET_FLYTO      =1;
    const MODULE_LEAFLET_JUMPTO     =0;
    const MODULE_LEAFLET_STYLE      ='OpenStreetMap_Mapnik';
    const MODULE_LEAFLET_ZOOM       =14;
    const MODULE_LEAFLET_ZOOM_CITY  =8;
    const MODULE_LEAFLET_ZOOM_PP    =14;
    
    //get supported layers in database
    /** @type {import('../../../common_types.js').CommonModuleLeafletMapLayer[]}*/
    const MAP_LAYERS = await props.methods.FFB({path:'/server-db/app_settings_display', query:`data_app_id=${props.data.data_app_id}&setting_type=MAP_STYLE`, method:'GET', authorization_type:'APP_DATA'})
                                .then((/**@type{string}*/result)=>JSON.parse(result).rows);
    
    //format layers to use on Leaflet                                
    const MODULE_LEAFLET_SELECT_MAP_LAYERS =   MAP_LAYERS.map(map_layer=>{return {id:map_layer.id, 
                                                            display_data:map_layer.display_data, 
                                                            value:map_layer.value, 
                                                            data2:map_layer.data2, 
                                                            data3:map_layer.data3, 
                                                            data4:map_layer.data4,
                                                            session_map_layer:null};});

    //geoJSON objects on map
    /**@type{[]} */
    let MODULE_LEAFLET_GEOJSON = [];

    if (props.methods.function_event_doubleclick){
        props.methods.moduleLeafletContainer().on('dblclick', props.methods.function_event_doubleclick);
    }
    else{
        /**
         * @param{import('../../../common_types.js').CommonModuleLeafletEvent} e
         */
        const default_dbl_click_event = e => {
            if (e.originalEvent.target.id == props.methods.moduleLeafletContainer()._container.id){
                const lng = e.latlng.lng;
                const lat = e.latlng.lat;
                //Update GPS position
                props.methods.get_place_from_gps(lng, lat).then((/**@type{string}*/gps_place) => {
                    map_update({longitude:lng,
                                latitude:lat,
                                zoomvalue:null,//do not change zoom 
                                text_place: gps_place,
                                country:'',
                                city:'',
                                timezone_text :null,
                                to_method:MODULE_LEAFLET_JUMPTO
                            });
                });
            }
        };
        //also creates event:
        //Leaflet.DomEvent.addListener(leafletContainer(), 'dblclick', default_dbl_click_event);
        props.methods.moduleLeafletContainer().on('dblclick', default_dbl_click_event);
    }
    const eventClickCountry = () =>{
        return null;
    };
    const eventClickCity = () => {
        return null;
    };                        
    const eventClickMapLayer = () =>{
        return null;
    };
    const eventClickControlSearch = () =>{
        return null;
    };
    const eventClickControlFullscreen = () =>{
        return null;
    };
    const eventClickControlLocation = () =>{
        return null;
    };
    const eventClickControlLayer = () =>{
        return null;
    };
    const eventClickSearchList = () =>{
        return null;
    };
    const eventKeyUpSearch = ()  => {
        return null;
    };
    /**
     * Worldcities - Get cities
     * @param {string} countrycode 
     * @returns {Promise.<{id:number, country:string, iso2:string, lat:string, lng:string, admin_name:string, city:string}[]>}
     */
    const get_cities = async countrycode => {
        /**@type{{id:number, country:string, iso2:string, lat:string, lng:string, admin_name:string, city:string}[]} */
        const cities = await props.methods.FFB({path:`/worldcities/country/${countrycode}`, method:'GET', authorization_type:'APP_DATA'}).then(result=>JSON.parse(result));
        
        //sort admin name + city
        cities.sort((a, b) => {
            const x = a.admin_name.toLowerCase() + a.city.toLowerCase();
            const y = b.admin_name.toLowerCase() + b.city.toLowerCase();
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
        return cities;
    };

    /**
     * Map country
     * @param {string} lang_code 
     * @returns {Promise.<{value:string, text:string}[]>}
     */
    const map_country = async lang_code =>  [{value:'', text:'...'}].concat(await props.methods.FFB({path:'/server-db/country', query:`lang_code=${lang_code}`, method:'GET', authorization_type:'APP_DATA'})
                                                .then((/**@type{string}*/result)=>JSON.parse(result).rows)
                                                .then((/**@type{[{id:number, country_code:string, flag_emoji:string, group_name:string, text:string}]}*/result)=>
                                                    result.map(country=>{
                                                                return {value:JSON.stringify({  id:country.id, 
                                                                                                country_code:country.country_code, 
                                                                                                flag_emoji:country.flag_emoji,
                                                                                                group_name:country.group_name}), 
                                                                        text:`${country.group_name} - ${country.flag_emoji} ${country.text}`};})));
    /**
     * Map city
     * @param {*} country_code 
     * @returns {Promise<void>}
     */
    const map_city = async country_code =>{
        if (country_code!=null){
            await props.methods.ComponentRender({
                mountDiv:       'common_module_leaflet_select_city',
                data:           {
                                default_data_value:'',
                                default_value:'...',
                                options:[{value:'', text:''}].concat((await get_cities(country_code.toUpperCase())).map(city=>{
                                                                                        return {value:JSON.stringify({  id:city.id,
                                                                                                                        countrycode:city.iso2, 
                                                                                                                        country:city.country, 
                                                                                                                        admin_name:city.admin_name, 
                                                                                                                        city:city.city,
                                                                                                                        latitude:city.lat, 
                                                                                                                        longitude:city.lng}),
                                                                                                text:`${city.admin_name} - ${city.city}`};
                                                                                        })),
                                path:null,
                                query:null,
                                method:null,
                                authorization_type:null,
                                column_value:'value',
                                column_text:'text'
                                },
                methods:        {FFB:null},
                path:           '/common/component/common_select.js'});
        }
    };
    /**
     * Map city empty
     * @returns {void}
     */
    const map_city_empty = () =>{
        //set city select with first empty city
        props.methods.ComponentRender({
            mountDiv:       'common_module_leaflet_select_city',
            data:           {
                            default_data_value:'',
                            default_value:'...',
                            options:[{value:'', text:''}],
                            path:null,
                            query:null,
                            method:null,
                            authorization_type:null,
                            column_value:'value',
                            column_text:'text'
                            },
            methods:        {FFB:null},
            path:           '/common/component/common_select.js'});
    };
    /**
     * Map toolbar reset
     * @returns {void}
     */
    const map_toolbar_reset = ()=>{
        props.methods.common_document.querySelector('#common_module_leaflet_select_country .common_select_dropdown_value').setAttribute('data-value', '');
        props.methods.common_document.querySelector('#common_module_leaflet_select_country .common_select_dropdown_value').innerText = '';    
        map_city_empty();
        props.methods.common_document.querySelector('#common_module_leaflet_search_input').innerHTML ='';
        props.methods.common_document.querySelector('#common_module_leaflet_search_list').innerHTML ='';
        if (props.methods.common_document.querySelector('#common_module_leaflet_control_expand_search').style.display=='block')
            map_control_toggle_expand('search');
        if (props.methods.common_document.querySelector('#common_module_leaflet_control_expand_layer').style.display=='block')
            map_control_toggle_expand('layer');
    };
/**
 * Map show search on map
 * @param {{city:string, country:string, longitude:string, latitude:string}} data 
 * @returns {Promise<void>}
 */
const map_show_search_on_map = async data =>{
    const place =  data.city + ', ' + data.country;
    await map_update({  longitude:data.longitude,
                        latitude:data.latitude,
                        zoomvalue:MODULE_LEAFLET_ZOOM_CITY,
                        text_place:place,
                        country:'',
                        city:'',
                        timezone_text :null,
                        to_method:MODULE_LEAFLET_JUMPTO
                    });
    map_toolbar_reset();
};
/**
 * Map control toogle expand
 * @param {string} item 
 * @returns {Promise.<void>}
 */
const map_control_toggle_expand = async item =>{
    let style_display;
    if (props.methods.common_document.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display=='none' ||
    props.methods.common_document.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display ==''){
            style_display = 'block';
            if (item == 'search')
                await props.methods.ComponentRender({
                    mountDiv:   'common_module_leaflet_select_country',
                    data:       {
                                default_data_value:'',
                                default_value:'...',
                                options: await map_country(props.data.user_locale),
                                path:null,
                                query:null,
                                method:null,
                                authorization_type:null,
                                column_value:'value',
                                column_text:'text'
                                },
                    methods:    {FFB:null},
                    path:       '/common/component/common_select.js'});
        }
    else
        style_display = 'none';
    props.methods.common_document.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display = style_display;
};
/**
 * Map resize
 * @returns {Promise.<void>}
 */
const map_resize = async () => {
    //fixes not rendering correct showing map div
    props.methods.moduleLeafletContainer()?.invalidateSize?.();
};
/**
 * Map line remove all
 * @returns {void}
 */
const map_line_removeall = () => {
    if(MODULE_LEAFLET_GEOJSON)
        for (let i=0;i<MODULE_LEAFLET_GEOJSON.length;i++){
            props.methods.moduleLeafletContainer()?.removeLayer?.(MODULE_LEAFLET_GEOJSON[i]);
        }
        MODULE_LEAFLET_GEOJSON=[];
};
/**
 * Map line create 
 * @param {string} id 
 * @param {string} title 
 * @param {number} text_size 
 * @param {number} from_longitude 
 * @param {number} from_latitude 
 * @param {number} to_longitude 
 * @param {number} to_latitude 
 * @param {string} color 
 * @param {number} width 
 * @param {number} opacity 
 * @returns {void}
 */
const map_line_create = (id, title, text_size, from_longitude, from_latitude, to_longitude, to_latitude, color, width, opacity) => {
    /**Text size to be implemented */
    const geojsonFeature = {
        id: `"${id}"`,
        type: 'Feature',
        properties: { title: title },
        geometry: {
            type: 'LineString',
                coordinates: [
                    [from_longitude, from_latitude],
                    [to_longitude, to_latitude]
                ]
        }
    };
    //use GeoJSON to draw a line
    const myStyle = {
        color: color,
        weight: width,
        opacity: opacity
    };
    
    const layer = props.methods.moduleleafletLibrary().geoJSON(geojsonFeature, {style: myStyle}).addTo(props.methods.moduleLeafletContainer());
    /**@ts-ignore */
    MODULE_LEAFLET_GEOJSON.push(layer);
};
/**
 * Map set style
 * @param {string} mapstyle 
 * @returns {void}
 */
const map_setstyle = mapstyle => {
    for (const module_leaflet_map_style of MODULE_LEAFLET_SELECT_MAP_LAYERS){
        if (props.methods.moduleLeafletContainer() && module_leaflet_map_style.session_map_layer){
            props.methods.moduleLeafletContainer()?.removeLayer?.(module_leaflet_map_style.session_map_layer);
        }
    }
    const mapstyle_record = MODULE_LEAFLET_SELECT_MAP_LAYERS.filter(map_style=>map_style.value==mapstyle)[0];
    if (mapstyle_record.data3)
        mapstyle_record.session_map_layer = props.methods.moduleleafletLibrary().tileLayer(mapstyle_record.data2, {
            maxZoom: mapstyle_record.data3,
            attribution: mapstyle_record.data4
        }).addTo(props.methods.moduleLeafletContainer());
    else
        mapstyle_record.session_map_layer = props.methods.moduleleafletLibrary().tileLayer(mapstyle_record.data2, {
            attribution: mapstyle_record.data4
        }).addTo(props.methods.moduleLeafletContainer());
};
/**
 * Map update
 * @param {{longitude:string,
 *          latitude:string,
 *          zoomvalue:number|null,
 *          text_place:string,
 *          country:string,
 *          city:string,
 *          timezone_text :string|null,
 *          to_method:number
 *          }} parameters
 * @returns {Promise.<string|null>}
 */
const map_update = async (parameters) => {
    const path_regional ='regional';
    /**@type {import('../../../common_types.js').CommonModuleRegional} */
    const {getTimezone} = await import(path_regional);
    return new Promise((resolve)=> {
        /**
         * Map update GPS
         * @param {number} to_method 
         * @param {number|null} zoomvalue 
         * @param {string} longitude 
         * @param {string} latitude 
         */
        const map_update_gps = (to_method, zoomvalue, longitude, latitude) => {
            switch (to_method){
                case 0:{
                    if (zoomvalue == null){
                        const LatLng = props.methods.moduleleafletLibrary().LatLng;
                        props.methods.moduleLeafletContainer()?.setView?.(new LatLng(latitude, longitude));
                    }
                    else{
                        const LatLng = props.methods.moduleleafletLibrary().LatLng;
                        props.methods.moduleLeafletContainer()?.setView?.(new LatLng(latitude, longitude), zoomvalue);
                    }
                    break;
                }
                case 1:{
                    props.methods.moduleLeafletContainer()?.flyTo?.([latitude, longitude], MODULE_LEAFLET_ZOOM);
                    break;
                }
                //also have COMMON_GLOBAL.moduleLeafletContainer().panTo(new COMMON_GLOBAL.moduleLeaflet.LatLng({lng: longitude, lat: latitude}));
            }
        };
        map_update_gps(parameters.to_method, parameters.zoomvalue, parameters.longitude, parameters.latitude);
        if (parameters.timezone_text == null)
            parameters.timezone_text = getTimezone(parameters.latitude, parameters.longitude);

        props.methods.ComponentRender({
            mountDiv:   null,
            data:       {  
                        timezone_text:parameters.timezone_text,
                        latitude:parameters.latitude,
                        longitude:parameters.longitude,
                        text_place:parameters.text_place,
                        country:parameters.country,
                        city:parameters.city
                        },
            methods:    {
                        moduleLeafletLibrary:props.methods.moduleleafletLibrary,
                        moduleLeafletContainer:props.methods.moduleLeafletContainer
                        },
            path:       '/common/component/common_module_leaflet_popup.js'})
        .then(()=>resolve(parameters.timezone_text));
    });
};
    const onMounted = async () =>{
        //mount custom code inside Leaflet container
        props.methods.common_document.querySelectorAll(`#${props.methods.moduleLeafletContainer()._container.id} .leaflet-control`)[0].innerHTML += 
            template({
                        title_search:'Search',
                        title_fullscreen:'Fullscreen',
                        title_my_location:'My location',
                        longitude :props.data.latitude,
                        latitude :props.data.longitude
                    });
        //country
        await props.methods.ComponentRender({
            mountDiv:   'common_module_leaflet_select_country', 
            data:       {
                        default_data_value:'',
                        default_value:'...',
                        options:await map_country(props.data.locale),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            path:'/common/component/common_select.js'});
        //cities, caal function that sets empty record
        map_city_empty();

        //map layers
        await props.methods.ComponentRender({
            mountDiv:   'common_module_leaflet_select_mapstyle', 
            data:       {
                        default_data_value:MAP_LAYERS[0].value,
                        default_value:MAP_LAYERS[0].display_data,
                        options:MAP_LAYERS,
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'display_data'
                        },
            methods:    {FFB:null},
            path:'/common/component/common_select.js'});
        
        if (props.methods.function_search_event){
            //add search function in data-function that event delegation will use            
            props.methods.common_document.querySelector('#common_module_leaflet_search_input')['data-function'] = props.methods.function_search_event;
        }
        //set default map layer
        map_setstyle(MODULE_LEAFLET_STYLE);
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {	eventClickCountry:          eventClickCountry, 
                        eventClickCity:             eventClickCity,
                        eventClickMapLayer:         eventClickMapLayer,
                        eventClickControlSearch:    eventClickControlSearch,
                        eventClickControlFullscreen:eventClickControlFullscreen,
                        eventClickControlLocation:  eventClickControlLocation,
                        eventClickControlLayer:     eventClickControlLayer,
                        eventClickSearchList:       eventClickSearchList,
                        eventKeyUpSearch:           eventKeyUpSearch,
                        map_country:                map_country,
                        map_city:                   map_city,
                        map_city_empty:             map_city_empty,
                        map_toolbar_reset:          map_toolbar_reset,
                        map_show_search_on_map:     map_show_search_on_map,
                        map_control_toggle_expand:  map_control_toggle_expand,
                        map_resize:                 map_resize,
                        map_line_removeall:         map_line_removeall,
                        map_line_create:            map_line_create,
                        map_setstyle:               map_setstyle,
                        map_update:                 map_update,
                        moduleLeafletContainer:     props.methods.moduleLeafletContainer
                    },
        template:   null
    };
};
export default component;