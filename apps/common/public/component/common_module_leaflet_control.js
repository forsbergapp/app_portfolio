/**
 * Displays Leaflet control
 * @module apps/common/component/common_module_leaflet_control
 */

/**
 * @import {CommonModuleRegional, CommonAppEvent, CommonModuleLeafletEvent, CommonModuleLeafletMapLayer, CommonGlobal, CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{
 *          title_search:string,
 *          title_fullscreen:string,
 *          title_my_location:string,
 *          longitude : string, 
 *          latitude : string}} props
 * @returns {string}
 */
const template = props =>` <div id='common_module_leaflet_control_search' class='common_module_leaflet_control_button' title='${props.title_search}' role='button'>
                            <div id='common_module_leaflet_control_search_button' class='common_module_leaflet_control_button common_icon'></div>
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
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      data_app_id:number,
 *                      user_locale:string,
 *                      locale:string,
 *                      longitude:string,
 *                      latitude:string
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      function_event_doubleclick:function,
 *                      commonMiscImportmap:CommonModuleCommon['commonMiscImportmap'],
 *                      commonComponentRender:CommonModuleCommon['commonComponentRender'],
 *                      commonMicroserviceGeolocationPlace:CommonModuleCommon['commonMicroserviceGeolocationPlace'],
 *                      commonMiscElementRow:CommonModuleCommon['commonMiscElementRow'],
 *                      commonWindowFromBase64:CommonModuleCommon['commonWindowFromBase64'],
 *                      commonFFB:CommonModuleCommon['commonFFB'],
 *                      moduleLeafletContainer:function,
 *                      moduleLeafletLibrary:function
 *                      }}} props
 * @returns {Promise.<{ lifecycle:  CommonComponentLifecycle, 
 *                      data:       null,
 *                      methods:    CommonGlobal['moduleLeaflet']['methods'],
 *                      template:   null}>}
 */
const component = async props => {

    const MODULE_LEAFLET_FLYTO      =1;
    const MODULE_LEAFLET_JUMPTO     =0;
    const MODULE_LEAFLET_STYLE      ='OpenStreetMap_Mapnik';
    const MODULE_LEAFLET_ZOOM       =14;
    const MODULE_LEAFLET_ZOOM_CITY  =14;
    const MODULE_LEAFLET_FLY_TO_DURATION  =8; //seconds
    
    /** @type {CommonModuleLeafletMapLayer[]}*/
    const  MAP_LAYERS = [{
                            display_data: 'OpenStreetMap_Mapnik',
                            value: 'OpenStreetMap_Mapnik',
                            data2: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                            data3: 19,
                            data4: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                            session_map_layer: null
                        },
                        {
                            display_data: 'Esri.WorldImagery',
                            value: 'Esri.WorldImagery',
                            data2: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                            data3: null,
                            data4: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                            session_map_layer: null
                        }];
    
    //format layers to use on Leaflet                                
    const MODULE_LEAFLET_SELECT_MAP_LAYERS =   MAP_LAYERS.map(map_layer=>{return {
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
         * @param{CommonModuleLeafletEvent} e
         */
        const default_dbl_click_event = e => {
            if (e.originalEvent.target.id == props.methods.moduleLeafletContainer()._container.id){
                const lng = e.latlng.lng;
                const lat = e.latlng.lat;
                //Update GPS position
                props.methods.commonMicroserviceGeolocationPlace(lng, lat).then((/**@type{string}*/gps_place) => {
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
    /**
     * @param {string} event_target_id
     */
    const eventClickCountry = event_target_id =>{
        const country_code = props.methods.COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).getAttribute('data-value')==''?
                                null:
                                JSON.parse(props.methods.COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).getAttribute('data-value')).country_code;
        if (country_code)
            map_city(country_code);
        else{
            map_city_empty();
        }
    };
    /**
     * @param {string} event_target_id
     */
    const eventClickCity = async event_target_id => {
        const city = props.methods.COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).getAttribute('data-value');
        await map_update({  longitude:      city==''?'':JSON.parse(city).longitude,
                            latitude:       city==''?'':JSON.parse(city).latitude,
                            zoomvalue:      MODULE_LEAFLET_ZOOM_CITY,
                            text_place:     city==''?'':JSON.parse(city).city,
                            country:        '',
                            city:           '',
                            timezone_text:  null,
                            to_method:      MODULE_LEAFLET_FLYTO
                        }).then(()=>map_toolbar_reset());
    };                        
    /**
     * @param {CommonAppEvent['target']} target
     */
    const eventClickMapLayer = target =>{
        map_setstyle(target?.getAttribute('data-value'));
    };
    const eventClickControlZoomIn = () =>{
        props.methods.moduleLeafletContainer()?.setZoom?.(props.methods.moduleLeafletContainer()?.getZoom?.() + 1);  
    };
    const eventClickControlZoomOut = () =>{
        props.methods.moduleLeafletContainer()?.setZoom?.(props.methods.moduleLeafletContainer()?.getZoom?.() - 1);  
    };
    /**
     * @param {string} locale
     */
    const eventClickControlSearch = locale =>{
        if (props.methods.COMMON_DOCUMENT.querySelector('#common_module_leaflet_control_expand_layer').style.display=='block')
            map_control_toggle_expand('layer');
        map_control_toggle_expand('search', locale);
    };
    const eventClickControlFullscreen = async () =>{
        if (props.methods.COMMON_DOCUMENT.fullscreenElement)
            props.methods.COMMON_DOCUMENT.exitFullscreen();
        else{
            await props.methods.COMMON_DOCUMENT.querySelector('.leaflet-container').requestFullscreen();
            map_resize();
        }
            
    };
    /**
     * @param {string} client_latitude
     * @param {string} client_longitude
     * @param {string} client_place
     */
    const eventClickControlLocation = (client_latitude, client_longitude, client_place) =>{
        if (client_latitude!='' && client_longitude!=''){
            map_update({longitude:client_longitude,
                        latitude:client_latitude,
                        zoomvalue:MODULE_LEAFLET_ZOOM,
                        text_place:client_place,
                        country:'',
                        city:'',
                        timezone_text :null,
                        to_method:MODULE_LEAFLET_FLYTO
                    });
            props.methods.COMMON_DOCUMENT.querySelector('#common_module_leaflet_select_country .common_select_dropdown_value').setAttribute('data-value', '');
            props.methods.COMMON_DOCUMENT.querySelector('#common_module_leaflet_select_country .common_select_dropdown_value').textContent = '';    
            map_city_empty();
            map_toolbar_reset();
        }
    };
    const eventClickControlLayer = () =>{
        if (props.methods.COMMON_DOCUMENT.querySelector('#common_module_leaflet_control_expand_search').style.display=='block')
            map_toolbar_reset();
        map_control_toggle_expand('layer');
    };
    /**
     * @param {CommonAppEvent['target']} target
     */
    const eventClickSearchList = async target =>{
        //execute function from inparameter or use default when not specified
        if (target.classList.contains('common_module_leaflet_click_city')){
            const row = props.methods.commonMiscElementRow(target);
            const data = {  city:       row.getAttribute('data-city') ?? '',
                            country:    row.getAttribute('data-country') ??'',
                            latitude:   row.getAttribute('data-latitude') ?? '',
                            longitude:  row.getAttribute('data-longitude') ?? ''
                        };
            const place =  data.city + ', ' + data.country;
            await map_update({  longitude:data.longitude,
                                latitude:data.latitude,
                                zoomvalue:MODULE_LEAFLET_ZOOM_CITY,
                                text_place:place,
                                country:'',
                                city:'',
                                timezone_text :null,
                                to_method:MODULE_LEAFLET_FLYTO
                            });
            map_toolbar_reset();
        }
    };
    const eventKeyUpSearch = ()  => {
        return null;
    };

    /**
     * Map country
     * @param {string} locale 
     * @returns {Promise.<{value:string, text:string}[]>}
     */
    const map_country = async locale =>  [{value:'', text:'...'}].concat(await props.methods.commonFFB({
                                                                                                            path:'/app-common-module/COMMON_COUNTRY', 
                                                                                                            query:`locale=${locale}`,
                                                                                                            method:'POST', 
                                                                                                            authorization_type:'APP_ID', 
                                                                                                            body:{type:'FUNCTION',IAM_data_app_id:props.data.data_app_id}
                                                                                                        })
                                                .then((/**@type{*}*/result)=>JSON.parse(props.methods.commonWindowFromBase64(JSON.parse(result).rows[0].data)))
                                                .then((/**@type{{id:number, country_code:string, flag_emoji:string, group_name:string, text:string}[]}*/result)=>
                                                    result.map(country=>{
                                                                return {value:JSON.stringify({  id:country.id, 
                                                                                                country_code:country.country_code, 
                                                                                                flag_emoji:country.flag_emoji,
                                                                                                group_name:country.group_name}), 
                                                                        text:country.text};})));
    /**
     * Map city
     * @param {*} country_code 
     * @returns {Promise<void>}
     */
    const map_city = async country_code =>{
        if (country_code!=null){
            /**@type{{id:number, country:string, iso2:string, lat:string, lng:string, admin_name:string, city:string}[]} */
            const cities = await props.methods.commonFFB({path:'/app-common-module/COMMON_WORLDCITIES_COUNTRY', 
                method:'POST', 
                authorization_type:'APP_ID', 
                body:{type:'FUNCTION',country:country_code.toUpperCase(), IAM_data_app_id:props.data.data_app_id}}).then(result=>JSON.parse(props.methods.commonWindowFromBase64(JSON.parse(result).rows[0].data)));
            
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
            await props.methods.commonComponentRender({
                mountDiv:       'common_module_leaflet_select_city',
                data:           {
                                default_data_value:'',
                                default_value:'...',
                                options:[{value:'', text:''}].concat(cities.map(city=>{
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
                methods:        {commonFFB:null},
                path:           '/common/component/common_select.js'});
        }
    };
    /**
     * Map city empty
     * @returns {void}
     */
    const map_city_empty = () =>{
        //set city select with first empty city
        props.methods.commonComponentRender({
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
            methods:        {commonFFB:null},
            path:           '/common/component/common_select.js'});
    };
    /**
     * Map toolbar reset
     * @returns {void}
     */
    const map_toolbar_reset = ()=>{
        props.methods.COMMON_DOCUMENT.querySelector('#common_module_leaflet_select_country .common_select_dropdown_value').setAttribute('data-value', '');
        props.methods.COMMON_DOCUMENT.querySelector('#common_module_leaflet_select_country .common_select_dropdown_value').textContent = '';    
        map_city_empty();
        props.methods.COMMON_DOCUMENT.querySelector('#common_module_leaflet_search_input').textContent ='';
        props.methods.COMMON_DOCUMENT.querySelector('#common_module_leaflet_search_list').textContent ='';
        if (props.methods.COMMON_DOCUMENT.querySelector('#common_module_leaflet_control_expand_search').style.display=='block')
            map_control_toggle_expand('search');
        if (props.methods.COMMON_DOCUMENT.querySelector('#common_module_leaflet_control_expand_layer').style.display=='block')
            map_control_toggle_expand('layer');
    };
    /**
     * Map control toogle expand
     * @param {string} item 
     * @param {string|null} locale
     * @returns {Promise.<void>}
     */
    const map_control_toggle_expand = async (item, locale = null) =>{
        let style_display;
        if (props.methods.COMMON_DOCUMENT.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display=='none' ||
        props.methods.COMMON_DOCUMENT.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display ==''){
                style_display = 'block';
                if (item == 'search')
                    await props.methods.commonComponentRender({
                        mountDiv:   'common_module_leaflet_select_country',
                        data:       {
                                    default_data_value:'',
                                    default_value:'...',
                                    options: await map_country(locale ?? props.data.user_locale),
                                    path:null,
                                    query:null,
                                    method:null,
                                    authorization_type:null,
                                    column_value:'value',
                                    column_text:'text'
                                    },
                        methods:    {commonFFB:null},
                        path:       '/common/component/common_select.js'});
            }
        else
            style_display = 'none';
        props.methods.COMMON_DOCUMENT.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display = style_display;
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
        
        const layer = props.methods.moduleLeafletLibrary().geoJSON(geojsonFeature, {style: myStyle}).addTo(props.methods.moduleLeafletContainer());
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
            mapstyle_record.session_map_layer = props.methods.moduleLeafletLibrary().tileLayer(mapstyle_record.data2, {
                maxZoom: mapstyle_record.data3,
                attribution: mapstyle_record.data4
            }).addTo(props.methods.moduleLeafletContainer());
        else
            mapstyle_record.session_map_layer = props.methods.moduleLeafletLibrary().tileLayer(mapstyle_record.data2, {
                attribution: mapstyle_record.data4
            }).addTo(props.methods.moduleLeafletContainer());
    };
    /**
     * Map update
     * @param {{longitude:string,
     *          latitude:string,
     *          zoomvalue?:number|null,
     *          text_place:string,
     *          country:string,
     *          city:string,
     *          timezone_text :string|null,
     *          to_method?:number
     *          }} parameters
     * @returns {Promise.<string|null>}
     */
    const map_update = async (parameters) => {
        /**@type {CommonModuleRegional} */
        const {getTimezone} = await import(props.methods.commonMiscImportmap('regional'));
        return new Promise((resolve)=> {
            /**
             * Map update GPS
             * @param {number|null} to_method 
             * @param {number|null} zoomvalue 
             * @param {string} longitude 
             * @param {string} latitude 
             */
            const map_update_gps = (to_method, zoomvalue, longitude, latitude) => {
                switch (to_method){
                    case MODULE_LEAFLET_JUMPTO:{
                        if (zoomvalue == null){
                            props.methods.moduleLeafletContainer()?.setView?.(new (props.methods.moduleLeafletLibrary()).LatLng(latitude, longitude));
                        }
                        else{
                            props.methods.moduleLeafletContainer()?.setView?.(new (props.methods.moduleLeafletLibrary()).LatLng(latitude, longitude), zoomvalue);
                        }
                        break;
                    }
                    case MODULE_LEAFLET_FLYTO:{
                        props.methods.moduleLeafletContainer()?.flyTo?.([latitude, longitude], zoomvalue, {duration:MODULE_LEAFLET_FLY_TO_DURATION});
                        break;
                    }
                }
            };
            map_update_gps(parameters?.to_method ?? MODULE_LEAFLET_JUMPTO, parameters.zoomvalue ?? MODULE_LEAFLET_ZOOM, parameters.longitude, parameters.latitude);
            if (parameters.timezone_text == null)
                parameters.timezone_text = getTimezone(parameters.latitude, parameters.longitude);

            props.methods.commonComponentRender({
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
                            moduleLeafletLibrary:props.methods.moduleLeafletLibrary,
                            moduleLeafletContainer:props.methods.moduleLeafletContainer
                            },
                path:       '/common/component/common_module_leaflet_popup.js'})
            .then(()=>resolve(parameters.timezone_text));
        });
    };
    const onMounted = async () =>{
        //mount custom code inside Leaflet container
        props.methods.COMMON_DOCUMENT.querySelectorAll(`#${props.methods.moduleLeafletContainer()._container.id} .leaflet-control`)[0].innerHTML += 
            template({
                        title_search:'Search',
                        title_fullscreen:'Fullscreen',
                        title_my_location:'My location',
                        longitude :props.data.latitude,
                        latitude :props.data.longitude
                    });
        //country
        await props.methods.commonComponentRender({
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
            methods:    {commonFFB:null},
            path:'/common/component/common_select.js'});
        //cities, caal function that sets empty record
        map_city_empty();

        //map layers
        await props.methods.commonComponentRender({
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
            methods:    {commonFFB:null},
            path:'/common/component/common_select.js'});
        
        //set default map layer
        map_setstyle(MODULE_LEAFLET_STYLE);
        //refresh Leaflet so div looks ok in browser
        map_resize();
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {	eventClickCountry:          eventClickCountry, 
                        eventClickCity:             eventClickCity,
                        eventClickMapLayer:         eventClickMapLayer,
                        eventClickControlZoomIn:    eventClickControlZoomIn,
                        eventClickControlZoomOut:   eventClickControlZoomOut,
                        eventClickControlSearch:    eventClickControlSearch,
                        eventClickControlFullscreen:eventClickControlFullscreen,
                        eventClickControlLocation:  eventClickControlLocation,
                        eventClickControlLayer:     eventClickControlLayer,
                        eventClickSearchList:       eventClickSearchList,
                        eventKeyUpSearch:           eventKeyUpSearch,
                        map_toolbar_reset:          map_toolbar_reset,
                        map_line_removeall:         map_line_removeall,
                        map_line_create:            map_line_create,
                        map_update:                 map_update
                    },
        template:   null
    };
};
export default component;