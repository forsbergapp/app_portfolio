/**
 * @module apps/common/component/common_map
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle, CommonAppEvent,
 *          commonMapLayers, commonGeoJSONPopup, commonGeoJSONPolyline}  from '../../../common_types.js'
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
                                </div>
                                <div id='common_map_measure'></div>
                                <div id='common_map_tiles' style='position:absolute;top:0;left:0;'></div>
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
*                      latitude:number|null,
*                      user_locale:string},
*          methods:    {
*                      COMMON_DOCUMENT:COMMON_DOCUMENT,
*                      commonComponentRender:CommonModuleCommon['commonComponentRender'],
*                      commonComponentRemove:CommonModuleCommon['commonComponentRemove'],
*                      commonWindowFromBase64:CommonModuleCommon['commonWindowFromBase64'],
*                      commonMiscElementRow:CommonModuleCommon['commonMiscElementRow'],
*                      commonMiscElementId:CommonModuleCommon['commonMiscElementId'],
*                      commonFFB:CommonModuleCommon['commonFFB']
*                      }}} props
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:   null,
*                      methods:{
*                               events:function,
*                               addLineString:function,
*                               goTo:function,
*                               drawVectors:function
*                              },
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
                                geoJSON:{   id:  'common_map_point_tile_' + Date.now(),
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
     * @description Draw layer vectors
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
                                                    title:'Vector',
                                                    color:line.properties.color,
                                                    width:line.properties.width},
                                        geometry:{
                                                    type:'Linestring',
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
     * @param {{lat: number, long:number, x:number, y:number}} parameters
     * @returns {Promise.<void>}
     */
    const addPopup = async parameters =>{
        /**
         * @type{{place:       string,
         *        countryCode: string,
         *        region:      string,
         *        country:     string,
         *        latitude:    string,
         *        longitude:   string,
         *        timezone:    string}}
         */
        const place = await props.methods.commonFFB({
                            path:'/geolocation/place', 
                            query:`longitude=${parameters.long}&latitude=${parameters.lat}`, 
                            method:'GET', 
                            authorization_type:'APP_ID'}).then(result=>JSON.parse(result).rows);
        /**@type{commonGeoJSONPopup} */
        const geoJSON = {   id:  'common_map_point_popup_' + Date.now(),
            type:'Feature',
            properties:{x:parameters.x, 
                        y:parameters.y,
                        countrycode:place.countryCode,
                        country:place.country,
                        region:place.region,
                        city:place.place,
                        timezone_text:place.timezone
                        },
            geometry:{
                        type:'Point',
                        coordinates:[[parameters.lat, parameters.long]]
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
        addPopup({long:gps.long, lat:gps.lat, x:x- rect.left, y:y-rect.top});
    };
    
    /**
     * @name draw
     * @description Draw layers
     * @function
     * @returns {void}
     */
    const draw = () => {
        drawTiles();
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
     *          x:Number,
     *          y:number}} parameters
     */
    const getZoom = parameters => {
        const zoomDelta = parameters.deltaY < 0 ? 1 : -1;
        const newZ = Math.min(Math.max(zoom_level + zoomDelta, 1), 19);
    
        if (newZ === zoom_level) return;
    
        // Mouse position relative to map
        const rect = props.methods.COMMON_DOCUMENT.querySelector('#common_map').getBoundingClientRect();
        const mouseX = parameters.x - rect.left;
        const mouseY = parameters.y - rect.top;
    
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
     * @name events
     * @descption Events for map
     * @function
     * @param {string} event_type
     * @param {CommonAppEvent|null} event
     */
    const events = async (event_type, event=null) =>{
        
        if (event==null)
            props.methods.COMMON_DOCUMENT.querySelector('#common_map').addEventListener(event_type, (/**@type{CommonAppEvent}*/event) => {
                events(event_type, event);
            });
        else{
            //only events for map
            if (event.currentTarget.id == 'common_map'){
                const event_target_id = props.methods.commonMiscElementId(event.target);
                switch (event_type){
                    case 'dblclick':{
                        switch (true){
                            case event.target.classList.contains('common_map_tile'):
                            case event.target.classList.contains('common_map_line'):{
                                await addPopupPos(event.clientX, event.clientY);
                                break;
                            }
                        }
                        break;
                        
                    }
                    case 'click':{
                        switch (true){
                            case event_target_id=='common_map_control_zoomin':{
                                getZoom({deltaY:-1, x:event.clientX, y:event.clientY});
                                break;
                            }
                            case event_target_id=='common_map_control_zoomout':{
                                getZoom({deltaY:1, x:event.clientX, y:event.clientY});
                                break;
                            }
                            case event_target_id=='common_map_control_layer':
                            case event_target_id=='common_map_control_search':{
                                const expand_type = event_target_id.split('_')[3];
                                if (props.methods.COMMON_DOCUMENT.querySelector(`#common_map_control_expand_${expand_type}`).innerHTML !='')
                                    props.methods.commonComponentRemove(`common_map_control_expand_${expand_type}`);
                                else
                                    props.methods.commonComponentRender({
                                        mountDiv:   `common_map_control_expand_${expand_type}`,
                                        data:       {  
                                                    data_app_id:props.data.data_app_id,
                                                    expand_type:expand_type,
                                                    user_locale:props.data.user_locale,
                                                    map_layers:MAP_LAYERS
                                                    },
                                        methods:    {commonWindowFromBase64:props.methods.commonWindowFromBase64,
                                                     commonFFB:props.methods.commonFFB,
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
                                    goTo(+props.data.longitude, +props.data.latitude);
                                break;
                                }
                            case event.target.classList.contains('common_map_popup_close'):{
                                event.target.parentNode.remove();
                                break;
                            }
                            case event_target_id=='common_map_control_select_mapstyle':{
                                setLayer(event.target?.getAttribute('data-value'));
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
            }
        }
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
     * @name add LineString
     * @description Adds geoJSON type Linestring
     * @function
     * @param {{title:string,
     *          from_longitude:number,
     *          from_latitude:number,
     *          to_longitude:number,
     *          to_latitude:number,
     *          class:string,
     *          color:string,
     *          width:number}} parameters
     * @returns {Promise.<void>}
     */
    const addLineString = parameters =>
        //text size, color, size and width should be in CSS
        
        props.methods.commonComponentRender({
            mountDiv:   null,
            data:       {  
                        geoJSON:{   id:  'Linestring_' + Date.now(),
                                    type:'Feature',
                                    properties:{offsetX:offsetX, 
                                                offsetY:offsetY,
                                                title:parameters.title,
                                                class: parameters.class,
                                                color:parameters.color,
                                                width:parameters.width},
                                    geometry:{
                                                type:'Linestring',
                                                coordinates:[   [parameters.from_longitude, parameters.from_latitude],
                                                                [parameters.to_longitude, parameters.to_latitude]]
                                            }
                                    }
                        },
            methods:    null,
            path:       '/common/component/common_map_line.js'})
            //Add to existing component
            .then(component=>props.methods.COMMON_DOCUMENT.querySelector('#common_map_lines').innerHTML += component.template);

    /**
     * @name goTo
     * @description Go to given gps and display popup
     * @function
     * @param {number} longitude
     * @param {number} latitude
     * @returns {Promise.<void>}
     */
    const goTo = async (longitude, latitude) =>{
        setZoom(ZOOM_LEVEL_GOTO);
        const [wx, wy] = project(longitude, latitude);
        const rect = props.methods.COMMON_DOCUMENT.querySelector('#common_map').getBoundingClientRect();
        offsetX = ((window.innerWidth-rect.left) / 2) - wx -100;
        offsetY = ((window.innerHeight-rect.top) / 2) - wy;
        draw();
        if (getPopup(longitude, latitude).length==0)
            await addPopup({long:longitude, lat:latitude, x:wx+offsetX, y:wy+offsetY});
        updateDistance();
    };
    /**
     * @name onMounted
     * @description onMounted
     * @returns {void}
     */
    const onMounted = ()=>{
        events('click');
        events('dblclick');
        events('mousedown');
        events('mouseup');
        events('mousemove');
        events('mouseleave');
        events('wheel');
        if (props.data.longitude && props.data.latitude)
            goTo(+props.data.longitude, +props.data.latitude);
    };    
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {
                    events:events,
                    addLineString:addLineString,
                    goTo:goTo,
                    drawVectors
        },
        template:   template({  longitude:props.data.longitude?+props.data.longitude:null, 
                                latitude:props.data.latitude?+props.data.latitude:null})
    };    
};
export default component;