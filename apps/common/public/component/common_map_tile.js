/**
 * @description map tile
 * @module apps/common/component/common_map_tile
 */

/**
 * @import types_common from '../../../common/types.d.ts'
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
                            </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:        {
*                       commonMountdiv:string,
*                       geoJSON:types_common.commonGeoJSONTile
*                       },
*          methods:     {
*                       COMMON:types_common.CommonModuleCommon,
*                       project:function,
*                       }}} props
* @returns {Promise.<{ lifecycle:types_common.CommonComponentLifecycle, 
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