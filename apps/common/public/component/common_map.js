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

    //set default layer
    let TILE_URL = MAP_LAYERS[0].url;

    let z = 3; // zoom level
    z = Math.max(0, Math.min(19, z));
    const tileSize = 256;
    let offsetX = 0, offsetY = 0;
    let dragging = false;
    /**@type{number} */
    let startX;
    /**@type{number} */
    let startY;

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
        const n = 2 ** z;
        const x = (lon + 180) / 360 * n * tileSize;
        const y = (1 - Math.log(Math.tan(lat * rad) + 1 / Math.cos(lat * rad)) / Math.PI) / 2 * n * tileSize;
        return [x, y];
    };
    /**
     * @name drawTiles
     * @description Draw layer tiles
     * @function
     * @returns {Promise.<void>}
     */
    const drawTiles = async () => {
        const tilesDiv =    props.methods.COMMON_DOCUMENT.querySelector('#common_map_tiles');
        tilesDiv.innerHTML = '';
        const cols =        Math.ceil(window.innerWidth / tileSize) + 2;
        const rows =        Math.ceil(window.innerHeight / tileSize) + 2;
        const startTileX =  Math.floor(-offsetX / tileSize);
        const startTileY =  Math.floor(-offsetY / tileSize);
        for (let x = startTileX; x < startTileX + cols; x++) {
            for (let y = startTileY; y < startTileY + rows; y++) {
                await props.methods.commonComponentRender({
                    mountDiv:   null,
                    data:       {  
                                geoJSON:{   id:  'common_map_point_tile_' + Date.now(),
                                            type:'Feature',
                                            properties:{left:       x * tileSize + offsetX,
                                                        top:        y * tileSize + offsetY,
                                                        tileSize:   tileSize,
                                                        url:        TILE_URL
                                                                        .replace('{x}', x.toString())
                                                                        .replace('{y}', y.toString())
                                                                        .replace('{z}', z.toString())},
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
     * @description get popup for given GPS
     * @function
     * @param {number} longitude
     * @param {number} latitude
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
     * @descripts add the popup for given lat, long,x and y
     * @param {{lat: number, long:number, x:number, y:number}} parameters
     * @returns {Promise.<void>}
     */
    const addPopup = async parameters =>{
        const rect = props.methods.COMMON_DOCUMENT.querySelector('#common_map').getBoundingClientRect();
        const divX = parameters.x - rect.left;
        const divY = parameters.y - rect.top;
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
            properties:{x:divX, 
                        y:divY,
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
     * @description Adds a popup for given GPS
     * @param {number} long
     * @param {number} lat
     * @returns {Promise.<void>}
     */
    const addPopupLat = async (long, lat) =>{
        const points = project(long, lat);
        //popup.style.left = `${(wx+offsetX)-100}px`;
        //popup.style.top  = `${(wy+offsetY)-60}px`;
        await addPopup({long:long, lat:lat, x:points[0], y:points[1]});
    };
    /**
     * @description Adds a popup for given x and y
     * @param {number} x
     * @param {number} y
     * @returns {Promise.<void>}
     */
    const addPopupPos =  async (x, y) =>{
        const gps = getGPS(x,y);
        addPopup({long:gps.long, lat:gps.lat, x:x, y:y});
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
     * @name unproject
     * @description convert position to GPS
     * @function
     * @param {number} px
     * @param {number} py
     * @param {number} z
     */
    const unproject = (px, py, z) => {
        const tileSize = 256;
        const n = 2 ** z;
        const lon = px / (n * tileSize) * 360 - 180;
        const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * py / (n * tileSize))));
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
        const [lon, lat] = unproject(worldX, worldY, z);
        return {long:lon, lat:lat};
    };
    
    const updateDistance = () => {
        // Approximate meters per pixel at equator
        const metersPerPixel = 156543.03392 / Math.pow(2, z);
    
        // Example: 100 pixels on screen
        const meters = metersPerPixel * 100;
        const km = (meters / 1000).toFixed(2);
        const miles = (meters / 1609.344).toFixed(2);
    
        //Zoom ${z}, 
        props.methods.COMMON_DOCUMENT.querySelector('#common_map_measure').innerHTML = `${km} km / ${miles} mi`;
        };

    /**
     * @description zoom control
     * @param {{deltaY:number,
     *          x:Number,
     *          y:number}} parameters
     */
    const getZoom = parameters => {
        const zoomDelta = parameters.deltaY < 0 ? 1 : -1;
        const newZ = Math.min(Math.max(z + zoomDelta, 1), 19);
    
        if (newZ === z) return;
    
        // Mouse position relative to map
        const rect = props.methods.COMMON_DOCUMENT.querySelector('#common_map').getBoundingClientRect();
        const mouseX = parameters.x - rect.left;
        const mouseY = parameters.y - rect.top;
    
        // World coordinates before zoom
        const worldXBefore = (mouseX - offsetX);
        const worldYBefore = (mouseY - offsetY);
    
        // Scale factor between zoom levels
        const scale = 2 ** (newZ - z);
    
        // Adjust offsets so zoom centers on mouse
        offsetX = mouseX - worldXBefore * scale;
        offsetY = mouseY - worldYBefore * scale;
    
        z = newZ;
        draw();
        updateDistance();
    };
    /**
     * @descption Events for map
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
     * @descripton Set map layer
     * @param {string} value
     * @return {void}
     */
    const setLayer = value =>{
        TILE_URL = MAP_LAYERS.filter(layer=>layer.value==value)[0].url;
        draw();
    };
    /**
     * @param {{title:string,
     *          from_longitude:number,
     *          from_latitude:number,
     *          to_longitude:number,
     *          to_latitude:number,
     *          class:string,
     *          color:string,
     *          width:number}} parameters
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
     * @description Go to given gps and display popup
     * @param {number} longitude
     * @param {number} latitude
     */
    const goTo = async (longitude, latitude) =>{
        const [wx, wy] = project(longitude, latitude);
        const rect = props.methods.COMMON_DOCUMENT.querySelector('#common_map').getBoundingClientRect();
        offsetX = ((window.innerWidth / 2) - wx - (rect.left/2));
        offsetY = ((window.innerHeight / 2) - wy - (rect.top/2));
        if (getPopup(longitude, latitude).length==0)
            await addPopupLat(longitude, latitude);
        draw();
        updateDistance();
    };

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