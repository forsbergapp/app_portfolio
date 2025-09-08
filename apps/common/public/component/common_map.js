/**
 * @module apps/common/component/common_map
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle, CommonAppEvent,
 *          commonGeoJSONPopup, commonGeoJSONPolyline}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () =>`  
                            <div id="common_map">
                                <div id="common_map_measure"></div>
                                <div id="common_map_tiles" style="position:absolute;top:0;left:0;"></div>
                                <svg id="common_map_lines"></svg>
                                <div id='common_map_popups'></div>
                            </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      app_id:number,
*                      longitude:number,
*                      latitude:number,
*                      user_locale:string},
*          methods:    {
*                      COMMON_DOCUMENT:COMMON_DOCUMENT,
*                      commonComponentRender:CommonModuleCommon['commonComponentRender'],
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
        max_zzom: null,
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
     * @returns {void}
     */
    const drawTiles = () => {
        const tilesDiv = props.methods.COMMON_DOCUMENT.querySelector('#common_map_tiles');
        tilesDiv.innerHTML = '';
        const cols = Math.ceil(window.innerWidth / tileSize) + 2;
        const rows = Math.ceil(window.innerHeight / tileSize) + 2;
        const startTileX = Math.floor(-offsetX / tileSize);
        const startTileY = Math.floor(-offsetY / tileSize);
        for (let x = startTileX; x < startTileX + cols; x++) {
            for (let y = startTileY; y < startTileY + rows; y++) {
                const url = TILE_URL.replace('{x}', x.toString()).replace('{y}', y.toString()).replace('{z}',z.toString());
                tilesDiv.innerHTML += ` <div class='common_map_tile' style='left:${(x * tileSize + offsetX)}px;top:${(y * tileSize + offsetY)}px;width:${tileSize}px;height:${tileSize}px;background-image:url(${url})'>
                                        </div`;
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
                            geoJSON:{   id:  'common_map_Linestring_' + Date.now(),
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
        const geoJSON = {   id:  'common_map_Point_' + Date.now(),
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
                            case event.target.classList.contains('common_map_popup_close'):{
                                event.target.parentNode.remove();
                                break;
                            }
                            case event_target_id=='common_map_select_mapstyle':{
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
                                const zoomDelta = event.deltaY < 0 ? 1 : -1;
                                const newZ = Math.min(Math.max(z + zoomDelta, 1), 19);
                            
                                if (newZ === z) return;
                            
                                // Mouse position relative to map
                                const rect = props.methods.COMMON_DOCUMENT.querySelector('#common_map').getBoundingClientRect();
                                const mouseX = event.clientX - rect.left;
                                const mouseY = event.clientY - rect.top;
                            
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
        template:   template()
    };    
};
export default component;