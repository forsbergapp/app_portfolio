/**
 * @module apps/common/component/common_map_popup
 */

/**
 * @import {COMMON_DOCUMENT, commonGeoJSONPopup, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{id:string,
 *          x:number,
 *          y:number,
 *          countrycode:string,
 *          country:string,
 *          region:string,
 *          city:string,
 *          timezone_text:string,
 *          latitude:number,
 *          longitude:number}} props 
 * @returns {string}
 */
const template = props => `<div id='${props.id}' class='common_map_popup' 
                                style='left:${props.x}px; top: ${props.y-85}px;'> 
                                <div class='common_map_popup_close common_icon'></div>
                                <div class='common_map_popup_title'>${props.region}, ${props.city}</div>
                                <div class='common_map_popup_sub_title'>${props.country} (${props.countrycode})</div>
                                <div class='common_map_popup_sub_title_timezone'><div class='common_map_popup_sub_title_timezone_icon common_icon'></div>${props.timezone_text}</div>
                                <div class='common_map_popup_sub_title_gps' 
                                    data-country='${props.country}'
                                    data-city='${props.city}'
                                    data-timezone='${props.timezone_text}'
                                    data-latitude='${props.latitude}' 
                                    data-longitude='${props.longitude}'><div class='common_map_popup_sub_title_gps_icon common_icon'></div>${props.latitude.toFixed(6) + ', ' + props.longitude.toFixed(6)}
                                </div>
                                <div class="common_map_popup_tip_container">
                                <div class="common_map_popup_tip"></div>
                            </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:        {
*                       commonMountdiv:string,
*                       geoJSON:commonGeoJSONPopup,
*                       },
*          methods:     {
*                       COMMON_DOCUMENT:COMMON_DOCUMENT
*                       }}} props
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:   null,
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
    
   return {
       lifecycle:  null,
       data:       null,
       methods:    null,
       template:   template({
                        id:             props.data.geoJSON.id??'',
                        x:              props.data.geoJSON.properties.x,
                        y:              props.data.geoJSON.properties.y,
                        countrycode:    props.data.geoJSON.properties.countrycode,
                        country:        props.data.geoJSON.properties.country,
                        region:         props.data.geoJSON.properties.region,
                        city:           props.data.geoJSON.properties.city,
                        timezone_text:  props.data.geoJSON.properties.timezone_text,
                        latitude:       props.data.geoJSON.geometry.coordinates[0][0],
                        longitude:      props.data.geoJSON.geometry.coordinates[0][1]
                    })
   };
};
export default component;