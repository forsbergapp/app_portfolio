/**
 * @module apps/common/component/common_map_line
 */

/**
 * @import {COMMON_DOCUMENT, CommonComponentLifecycle, commonGeoJSONPolyline}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{id:string,
 *          points:string,
 *          title:string,
 *          color:string,
 *          width:number}} props 
 * @returns {string}
 */
const template = props => ` <polyline id='${props.id}' class='common_map_line' points='${props.points}' fill='none' stroke='${props.color}' stroke-width='${props.width}'>
                            </polyline>`;
/**
* @name component
* @description Component
* @function
* @param {{data:        {
*                       commonMountdiv:string,
*                       geoJSON:commonGeoJSONPolyline
*                       },
*          methods:     {
*                       COMMON_DOCUMENT:COMMON_DOCUMENT,
*                       project:function,
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
                        id:     props.data.geoJSON.id,
                        points: props.data.geoJSON.geometry.coordinates
                                .map(([lon, lat]) => {
                                    const [wx, wy] = props.methods.project(lon, lat);
                                    return `${wx + props.data.geoJSON.properties.offsetX},${wy + props.data.geoJSON.properties.offsetY}`;
                                })
                                .join(' '),
                        title:  props.data.geoJSON.properties.title,
                        color:  props.data.geoJSON.properties.color,
                        width:  props.data.geoJSON.properties.width
                    })
   };
};
export default component;