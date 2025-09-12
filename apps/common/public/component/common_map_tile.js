/**
 * @module apps/common/component/common_map_tile
 */

/**
 * @import {COMMON_DOCUMENT, CommonComponentLifecycle, commonGeoJSONTile}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{id:string,
 *          left:number,
 *          top:number,
 *          tileSize:number,
 *          url:string}} props 
 * @returns {string}
 */
const template = props => ` <div id='${props.id}' 
                                 class='common_map_tile' 
                                 style='left:${(props.left)}px;top:${(props.top)}px;width:${props.tileSize}px;height:${props.tileSize}px;background-image:url(${props.url})'>
                            </div`;
/**
* @name component
* @description Component
* @function
* @param {{data:        {
*                       commonMountdiv:string,
*                       geoJSON:commonGeoJSONTile
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
                        id:     props.data.geoJSON.id??'',
                        left:   props.data.geoJSON.properties.left,
                        top:    props.data.geoJSON.properties.top,
                        tileSize:  props.data.geoJSON.properties.tileSize,
                        url:  props.data.geoJSON.properties.url
                    })
    };
};
export default component;