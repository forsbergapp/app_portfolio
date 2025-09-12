/**
 * @module apps/common/component/common_map
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle, CommonAppEvent,commonEventType,
 *          commonMapLayers, commonGeoJSONPopup, commonGeoJSONPolyline, commonMapPlace}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{longitude:number|null,
 *          latitude:number|null}} props
 * @returns {string}
 */
const template = props =>`  
                            <div id="common_map">
                                <div id='common_map_control'>
                                    <div id='common_map_control_zoomin' class='common_map_control_button common_icon'></div>
                                    <div id='common_map_control_zoomout' class='common_map_control_button common_icon'></div>
                                    <div id='common_map_control_search_container' class='common_map_control_button'>
                                        <div id='common_map_control_search' class='common_map_control_button common_icon'></div>
                                        <div id='common_map_control_expand_search' class='common_map_control_expand'></div>
                                    </div>
                                    <div id='common_map_control_fullscreen' class='common_map_control_button common_icon'></div>
                                    ${(props.longitude == null && props.latitude==null)?'':
                                        `<div id='common_map_control_my_location' class='common_map_control_button common_icon'>
                                        </div>`
                                    }
                                    <div id='common_map_control_layer_container' class='common_map_control_button'>
                                        <div id='common_map_control_layer' class='common_map_control_button common_icon'></div>
                                        <div id='common_map_control_expand_layer' class='common_map_control_expand'></div>
                                    </div>
                                    <div id='common_map_control_query' class='common_map_control_button common_icon'></div>
                                </div>
                                <div id='common_map_cursor' class='common_icon'></div>
                                <div id='common_map_measure'></div>
                                <div id='common_map_tiles'></div>
                                <svg id='common_map_lines'></svg>
                                <div id='common_map_popups'></div>
                            </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      data_app_id:number,
*                      longitude:number|null,
*                      latitude:number|null},
*          methods:    {
*                      COMMON_DOCUMENT:COMMON_DOCUMENT,
*                      commonComponentRender:CommonModuleCommon['commonComponentRender'],
*                      commonComponentRemove:CommonModuleCommon['commonComponentRemove'],
*                      commonWindowFromBase64:CommonModuleCommon['commonWindowFromBase64'],
*                      commonMiscListKeyEvent:CommonModuleCommon['commonMiscListKeyEvent'],
*                      commonMiscElementRow:CommonModuleCommon['commonMiscElementRow'],
*                      commonMiscElementId:CommonModuleCommon['commonMiscElementId'],
*                      commonUserLocale:CommonModuleCommon['commonUserLocale'],
*                      commonFFB:CommonModuleCommon['commonFFB']
*                      }}} props
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:   null,
*                      methods:{
*                               goTo:function,
*                               drawVectors:function
*                              },
*                      events:  function       
*                      template:string}>}
*/
const component = async props => {

    /**@type{commonMapLayers[]} */
    const  MAP_LAYERS = [{
        title: 'OpenStreetMap_Mapnik',
        value: 'OpenStreetMap_Mapnik',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        max_zoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    {
        title: 'Esri.WorldImagery',
        value: 'Esri.WorldImagery',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png',
        max_zoom: null,
        attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }];

    /**
     * @name ZOOM_LEVEL_GOTO
     * @description Constant for zoom level for goto
     * @constant
     */
    const ZOOM_LEVEL_GOTO = 5;
    /**
     * @name MEASURE_DISTANCE_PIXEL
     * @description Constant for distance pixels
     * @constant
     */
    const MEASURE_DISTANCE_PIXEL = 100;
    /**
     * @name TILE_SIZE
     * @description Constant for map tile size
     * @constant
     */
    const TILE_SIZE = 256;

    //set default layer
    let TILE_URL = MAP_LAYERS[0].url;
    let zoom_level = 3;
    let offsetX = 0, offsetY = 0;
    let dragging = false;
    /**@type{number} */
    let startX;
    /**@type{number} */
    let startY;

    /**
     * @name drawTiles
     * @description Draw layer tiles
     * @function
     * @returns {Promise.<void>}
     */
    const drawTiles = async () => {
        const tilesDiv =    props.methods.COMMON_DOCUMENT.querySelector('#common_map_tiles');
        tilesDiv.innerHTML = '';
        const cols =        Math.ceil(window.innerWidth / TILE_SIZE) + 2;
        const rows =        Math.ceil(window.innerHeight / TILE_SIZE) + 2;
        const startTileX =  Math.floor(-offsetX / TILE_SIZE);
        const startTileY =  Math.floor(-offsetY / TILE_SIZE);
        for (let x = startTileX; x < startTileX + cols; x++) {
            for (let y = startTileY; y < startTileY + rows; y++) {
                await props.methods.commonComponentRender({
                    mountDiv:   null,
                    data:       {  
                                geoJSON:{   id:  'common_map_tiles_point_' + Date.now(),
                                            type:'Feature',
                                            properties:{left:       x * TILE_SIZE + offsetX,
                                                        top:        y * TILE_SIZE + offsetY,
                                                        tileSize:   TILE_SIZE,
                                                        url:        TILE_URL
                                                                        .replace('{x}', x.toString())
                                                                        .replace('{y}', y.toString())
                                                                        .replace('{z}', zoom_level.toString())},
                                            geometry:{
                                                        type:'Point',
                                                        coordinates:null
                                                    }
                                            }
                                },
                    methods:    {project:project},
                    path:       '/common/component/common_map_tile.js'})
                    //Add to existing component
                    .then(component=>tilesDiv.innerHTML += component.template);
            }
        }
    };
    /**
     * @name drawVectors
     * @description Adds array of geoJSON type Linestring, RFC 7946 Linestring
     * @function
     * @param {commonGeoJSONPolyline[]}vectorLinesgeoJSON
     * @returns {Promise.<void>}
     */
    const drawVectors = async vectorLinesgeoJSON => {
        vectorLinesgeoJSON.map(row=>{row.properties.offsetX=offsetX;row.properties.offsetY=offsetY;});
        const lines = props.methods.COMMON_DOCUMENT.querySelector('#common_map_lines');
        lines.innerHTML = '';
        for (const line of vectorLinesgeoJSON) {
            await props.methods.commonComponentRender({
                mountDiv:   null,
                data:       {  
                            geoJSON:{   id:  'common_map_linestring_' + Date.now(),
                                        type:'Feature',
                                        properties:{offsetX:offsetX, 
                                                    offsetY:offsetY,
                                                    title:line.properties.title,
                                                    color:line.properties.color,
                                                    width:line.properties.width},
                                        geometry:{
                                                    type:'Linestring',
                                                    //WGS 84 format
                                                    //[ [longitude (start) decimal period '.', 
                                                    //  latitude (start) decimal period '.', (altitude in meters)],
                                                    //  [longitude (end) decimal period '.', 
                                                    //  latitude (end) decimal period '.', (altitude in meters)],
                                                    //  ...]
                                                    coordinates:line.geometry.coordinates
                                                }
                                        }
                            },
                methods:    {project:project},
                path:       '/common/component/common_map_line.js'})
                //Add to existing component
                .then(component=>lines.innerHTML += component.template);            
        }
    };
    /**
     * @name updateVectors
     * @description Draw layer popups
     * @function
     * @returns {void}
     */
    const updateVectors = () =>{
        for (const line of Array.from(props.methods.COMMON_DOCUMENT.querySelectorAll('.common_map_line'))) {
            //use saved gps to calculate new positions
            const points = JSON.parse(line.getAttribute('data-gps'))
                            .map((/**@type{[string, string]}*/[long, lat])=>{
                                const [wx, wy] = project(+long, +lat);
                                return `${wx + offsetX},${wy + offsetY}`;
                            })
                            .join(' ');
            line.setAttribute('points', points);
        }      
    };
    /**
     * @name getPopup
     * @description get popup for given GPS
     * @function
     * @param {number} longitude
     * @param {number} latitude
     * @returns {HTMLElement[]}
     */
    const getPopup = (longitude, latitude) =>
        Array.from(props.methods.COMMON_DOCUMENT.querySelectorAll('.common_map_popup'))
        .filter(popup=> Number(popup.querySelectorAll('.common_map_popup_sub_title_gps')[0].getAttribute('data-longitude'))==longitude && 
                        Number(popup.querySelectorAll('.common_map_popup_sub_title_gps')[0].getAttribute('data-latitude'))==latitude);
    /**
     * @name updatePopups
     * @description Draw layer popups
     * @function
     * @returns {void}
     */
    const updatePopups = () =>{
        for (const popup of Array.from(props.methods.COMMON_DOCUMENT.querySelectorAll('.common_map_popup'))) {
            const [wx, wy] = project(   Number(popup.querySelectorAll('.common_map_popup_sub_title_gps')[0].getAttribute('data-longitude')), 
                                        Number(popup.querySelectorAll('.common_map_popup_sub_title_gps')[0].getAttribute('data-latitude')));
            popup.style.left = `${(wx+offsetX)-100}px`;
            popup.style.top  = `${(wy+offsetY)-60}px`;
        }
    };
    /**
     * @name addPopup
     * @description Add geoJSON type Point with a popup and geolocation data for given lat, long,x and y
     * @function
     * @param {{place:commonMapPlace, x:number, y:number}} parameters
     * @returns {Promise.<void>}
     */
    const addPopup = async parameters =>{
        /**@type{commonGeoJSONPopup} */
        const geoJSON = {   id:  'common_map_popups_point_' + Date.now(),
            type:'Feature',
            properties:{x:parameters.x, 
                        y:parameters.y,
                        countrycode:parameters.place.countryCode,
                        country:parameters.place.country,
                        region:parameters.place.region,
                        city:parameters.place.place,
                        timezone_text:parameters.place.timezone
                        },
            geometry:{
                        type:'Point',
                        coordinates:[[+parameters.place.latitude, +parameters.place.longitude]]
                    }
            };
        await props.methods.commonComponentRender({
            mountDiv:   null,
            data:       {  
                        geoJSON:geoJSON
                        },
            methods:    null,
            path:       '/common/component/common_map_popup.js'})
            //Add to existing component
            .then(component=>props.methods.COMMON_DOCUMENT.querySelector('#common_map_popups').innerHTML += component.template);
    };
    /**
     * @description get place for gps
     * @param {{longitude:number,
     *          latitude:number}} parameters
     * @returns {Promise.<commonMapPlace>}
     */
    const getPlace = async parameters =>
        await props.methods.commonFFB({
            path:'/geolocation/place', 
            query:`longitude=${parameters.longitude}&latitude=${parameters.latitude}`, 
            method:'GET', 
            authorization_type:'APP_ID'}).then(result=>JSON.parse(result).rows);
    /**
     * @name addPopupPos
     * @description Adds a popup for given x and y
     * @function
     * @param {number} x
     * @param {number} y
     * @returns {Promise.<void>}
     */
    const addPopupPos =  async (x, y) =>{
        const gps = getGPS(x,y);
        const rect = props.methods.COMMON_DOCUMENT.querySelector('#common_map').getBoundingClientRect();
        await addPopup({place:await getPlace({longitude:gps.long, latitude:gps.lat}), x:x- rect.left, y:y-rect.top});
    };
    
    /**
     * @name draw
     * @description Draw layers
     * @function
     * @returns {void}
     */
    const draw = () => {
        drawTiles();
        updateVectors();
        updatePopups();
    };

    /**
     * @name project
     * @description Convert GPS to world pixel coords at zoom z
     * @function
     * @param {number} lon
     * @param {number} lat
     * @returns {[number, number]}
     */
    const project = (lon, lat) =>{
        const rad = Math.PI / 180;
        const n = 2 ** zoom_level;
        const x = (lon + 180) / 360 * n * TILE_SIZE;
        const y = (1 - Math.log(Math.tan(lat * rad) + 1 / Math.cos(lat * rad)) / Math.PI) / 2 * n * TILE_SIZE;
        return [x, y];
    };

    /**
     * @name unproject
     * @description convert position to GPS
     * @function
     * @param {number} px
     * @param {number} py
     */
    const unproject = (px, py) => {
        const n = 2 ** zoom_level;
        const lon = px / (n * TILE_SIZE) * 360 - 180;
        const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * py / (n * TILE_SIZE))));
        const lat = latRad * 180 / Math.PI;
        return [lon, lat];
    };
    /**
     * @name getGPS
     * @description Get GPS from mouse position
     * @function
     * @param {number} x
     * @param {number} y
     */
    const getGPS = (x,y) =>{
        // Mouse position relative to the map container
        const rect = props.methods.COMMON_DOCUMENT.querySelector('#common_map').getBoundingClientRect();
        const mouseX = x - rect.left;
        const mouseY = y - rect.top;
    
        // Convert to "world pixel" coordinates
        const worldX = mouseX - offsetX;
        const worldY = mouseY - offsetY;
    
        // Get GPS coordinates
        const [lon, lat] = unproject(worldX, worldY);
        return {long:lon, lat:lat};
    };
    /**
     * @name updateDistance
     * @description Update distance in measure
     * @function
     */
    const updateDistance = () => {
        // Approximate meters per pixel at equator
        const metersPerPixel = 156543.03392 / Math.pow(2, zoom_level);
    
        const meters = metersPerPixel * MEASURE_DISTANCE_PIXEL;
        const km = (meters / 1000).toFixed(2);
        const miles = (meters / 1609.344).toFixed(2);
    
        props.methods.COMMON_DOCUMENT.querySelector('#common_map_measure').innerHTML = `${km} km / ${miles} mi`;
    };

    /**
     * @name setZoom
     * @descriptionm Sets zoom level
     * @function
     * @param {number} level
     */
    const setZoom = level =>{
        if (MAP_LAYERS.some(row=>row.url==TILE_URL && (row.max_zoom !=null &&  row.max_zoom< level)))
            zoom_level = MAP_LAYERS.filter(row=>row.url==TILE_URL)[0].max_zoom ?? 0;
        else
            if (level<0)
                zoom_level = 0;
            else
                zoom_level = level;
    };
    /**
     * @name getZoom
     * @description zoom control
     * @function
     * @param {{deltaY:number,
     *          x:number,
     *          y:number,
     *          control?:boolean|false}} parameters
     */
    const getZoom = parameters => {
        const zoomDelta = parameters.deltaY < 0 ? 1 : -1;
        const newZ = Math.min(Math.max(zoom_level + zoomDelta, 1), 19);
    
        if (newZ === zoom_level) return;
    
        // Mouse position relative to map
        const rect = props.methods.COMMON_DOCUMENT.querySelector('#common_map').getBoundingClientRect();

        const mouseX =  parameters.control?
                            rect.left + (rect.width/2):
                                (parameters.x - rect.left);
                                
        const mouseY =  parameters.control?
                            (rect.height / 2):
                                (parameters.y - rect.top);
                                
        // World coordinates before zoom
        const worldXBefore = (mouseX - offsetX);
        const worldYBefore = (mouseY - offsetY);
    
        // Scale factor between zoom levels
        const scale = 2 ** (newZ - zoom_level);
    
        // Adjust offsets so zoom centers on mouse
        offsetX = mouseX - worldXBefore * scale;
        offsetY = mouseY - worldYBefore * scale;
    
        setZoom(newZ);
        
        draw();
        updateDistance();
    };
    
    /**
     * @name setLayer
     * @descripton Set map layer
     * @function
     * @param {string} value
     * @return {void}
     */
    const setLayer = value =>{
        TILE_URL = MAP_LAYERS.filter(layer=>layer.value==value)[0].url;
        draw();
    };
    
    /**
     * @name goTo
     * @description Go to given gps and display popup
     * @function
     * @param {{ip:string|null,
<<<<<<< HEAD
     *          longitude:string|number|null,
     *          latitude:string|number|null}} parameters
=======
     *          longitude:string|null,
     *          latitude:string|null}} parameters
>>>>>>> 0df011dd (AP-110 adds ip and gps click support in admin app and removes commonGeolocationIP in common.js, consolidates return restult with returnPlace() in common_geolocation.js, consolidates place with getPlace() used by goTo() and addPopupPos() and adds ip parameter for goTo() in common_map.js, removes parameter appSecureDialogueSendBroadcastShow and calls from app.js, removes monitorDetailClickItemDetail() and monitorDetailClickItem and removes commonGeolocationIP, commonGeolocationPlace and map_update parameters in admin app)
     * @returns {Promise.<void>}
     */
    const goTo = async parameters =>{
        /** @type{commonMapPlace}*/
        const place =  parameters.ip?
                            await props.methods.commonFFB({ path:'/geolocation/ip', 
                                                            query:`ip=${parameters.ip}`, 
                                                            method:'GET', 
                                                            authorization_type:'APP_ID'})
                            .then(result=>JSON.parse(result).rows):
                                (parameters.longitude!='' && parameters.latitude!='' &&
                                 parameters.longitude!=null && parameters.latitude!=null
                                )?
                                    await getPlace({longitude:+parameters.longitude, 
                                                    latitude:+parameters.latitude}):
                                        null;
        const longitude =   place?+place.longitude:parameters.longitude;
        const latitude  =   place?+place.latitude:parameters.latitude;
        if (longitude && latitude){
            setZoom(ZOOM_LEVEL_GOTO);
            const [wx, wy] = project(+longitude, +latitude);
            const rect = props.methods.COMMON_DOCUMENT.querySelector('#common_map').getBoundingClientRect();
            offsetX = ((window.innerWidth-rect.left) / 2) - wx -100;
            offsetY = ((window.innerHeight-rect.top) / 2) - wy;
            draw();
            if (getPopup(+longitude, +latitude).length==0)
                await addPopup({place:place, x:wx+offsetX, y:wy+offsetY});
            updateDistance();
        }
    };
    /**
     * @name events
     * @descption Events for map
     * @function
     * @param {commonEventType} event_type
     * @param {CommonAppEvent} event
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.commonMiscElementId(event.target);
        switch (event_type){
            case 'click':{
                switch (true){
                    case event_target_id=='common_map_control_zoomin':{
                        getZoom({deltaY:-1, x:event.clientX, y:event.clientY,control:true});
                        break;
                    }
                    case event_target_id=='common_map_control_zoomout':{
                        getZoom({deltaY:1, x:event.clientX, y:event.clientY, control:true});
                        break;
                    }
                    case event_target_id=='common_map_control_layer':
                    case event_target_id=='common_map_control_search':{
                        const expand_type = event_target_id.split('_')[3];
                        const expand = props.methods.COMMON_DOCUMENT
                                        .querySelector(`#common_map_control_expand_${expand_type}`)
                                        .innerHTML =='';
                        if (props.methods.COMMON_DOCUMENT.querySelector('#common_map_control_expand_search').innerHTML !='' ||
                            props.methods.COMMON_DOCUMENT.querySelector('#common_map_control_expand_layer').innerHTML !=''){
                            props.methods.commonComponentRemove('common_map_control_expand_search');
                            props.methods.commonComponentRemove('common_map_control_expand_layer');
                        }
                        if (expand)
                            props.methods.commonComponentRender({
                                mountDiv:   `common_map_control_expand_${expand_type}`,
                                data:       {  
                                            data_app_id:props.data.data_app_id,
                                            expand_type:expand_type,
                                            map_layers:MAP_LAYERS
                                            },
                                methods:    {
                                            goTo:goTo,
                                            setLayer:setLayer,
                                            commonWindowFromBase64:props.methods.commonWindowFromBase64,
                                            commonMiscListKeyEvent:props.methods.commonMiscListKeyEvent,
                                            commonUserLocale:props.methods.commonUserLocale,
                                            commonFFB:props.methods.commonFFB,
                                            commonMiscElementId:props.methods.commonMiscElementId,
                                            commonMiscElementRow:props.methods.commonMiscElementRow,
                                            commonComponentRender:props.methods.commonComponentRender
                                            },
                                path:       '/common/component/common_map_control_expand.js'});    
                        
                        break;
                    }
                    case event_target_id=='common_map_control_fullscreen':{
                        if (props.methods.COMMON_DOCUMENT.fullscreenElement)
                            props.methods.COMMON_DOCUMENT.exitFullscreen();
                        else
                            props.methods.COMMON_DOCUMENT.querySelector('#common_map').requestFullscreen();
                        break;
                    }
                    case event_target_id=='common_map_control_my_location':{
                        if (props.data.longitude && props.data.latitude)
                            goTo({  ip:null, 
                                    longitude:+props.data.longitude, 
                                    latitude:+props.data.latitude});
                        break;
                        }
                    case event_target_id=='common_map_control_query':{
                        //update button
                        event.target.classList.contains('common_map_control_active')?
                            event.target.classList.remove('common_map_control_active'):
                                event.target.classList.add('common_map_control_active');
                        //add or remove class on map to change cursor
                        props.methods.COMMON_DOCUMENT.querySelector('#common_map').classList.contains('common_map_control_active')?
                            props.methods.COMMON_DOCUMENT.querySelector('#common_map').classList.remove('common_map_control_active'):
                                props.methods.COMMON_DOCUMENT.querySelector('#common_map').classList.add('common_map_control_active');
                        break;
                    }
                    case event.target.classList.contains('common_map_tile'):
                    case event.target.classList.contains('common_map_line'):{
                        props.methods.COMMON_DOCUMENT.querySelector('#common_map_control_query').classList.contains('common_map_control_active')?
                            await addPopupPos(event.clientX, event.clientY):
                                null;
                        break;
                    }
                    case event.target.classList.contains('common_map_popup_close'):{
                        event.target.parentNode.remove();
                        break;
                    }
                }
                break;
            }
            case 'mousedown':{
                switch (true){
                    case event_target_id=='common_map_measure':
                    case event.target.classList.contains('common_map_tile'):
                    case event.target.classList.contains('common_map_line'):{
                        dragging = true;
                        startX = event.clientX - offsetX;
                        startY = event.clientY - offsetY;
                        break;
                    }
                }
                break;
            }
            case 'mouseup':
            case 'mouseleave':{
                switch (true){
                    case event_target_id=='common_map_measure':
                    case event.target.classList.contains('common_map_tile'):
                    case event.target.classList.contains('common_map_line'):{
                        dragging = false;
                        break;
                    }
                }
                break;
            }
            case 'mousemove':{
                if (event_target_id.startsWith('common_map')){
                    props.methods.COMMON_DOCUMENT.querySelector('#common_map_cursor').style.left = `${event.clientX}px`;
                    props.methods.COMMON_DOCUMENT.querySelector('#common_map_cursor').style.top = `${event.clientY}px`;
                }
                switch (true){
                    case event_target_id=='common_map_measure':
                    case event.target.classList.contains('common_map_tile'):
                    case event.target.classList.contains('common_map_line'):{
                        if (!dragging) return;
                        offsetX = event.clientX - startX;
                        offsetY = event.clientY - startY;
                        draw();
                        break;
                    }

                }
                break;
                
            }
            case 'wheel':{
                switch (true){
                    case event_target_id=='common_map_measure':
                    case event.target.classList.contains('common_map_tile'):
                    case event.target.classList.contains('common_map_line'):{
                        event.preventDefault();
                        getZoom({deltaY:event.deltaY, x:event.clientX, y:event.clientY});
                        break;
                    }
                }
                break;
            }
        }
    };
    /**
     * @name onMounted
     * @description onMounted
     * @returns {Promise.<void>}
     */
    const onMounted = async ()=>{
        if (props.data.longitude && props.data.latitude)
            await goTo({  ip:null,
                    longitude:+props.data.longitude, 
                    latitude:+props.data.latitude});
    };    
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {
                    goTo:goTo,
                    drawVectors:drawVectors
        },
        events:     events,
        template:   template({  longitude:props.data.longitude?+props.data.longitude:null, 
                                latitude:props.data.latitude?+props.data.latitude:null})
    };    
};
export default component;