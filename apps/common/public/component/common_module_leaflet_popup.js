/**
 * Displays Leaflet popup
 * @module apps/common/component/common_module_leaflet_popup
 */

/**
 * @import {COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{country:string,
 *          city:string,
 *          timezone_text:string,
 *          text_place:string,
 *          latitude:string,
 *          longitude:string}} props 
 * @returns {string}
 */
const template = props => ` <div class='common_module_leaflet_popup_title'>${props.text_place}</div>
                            <div class='common_module_leaflet_popup_sub_title common_icon'></div>
                            <div class='common_module_leaflet_popup_sub_title_timezone'>${props.timezone_text}</div>
                            <div class='common_module_leaflet_popup_sub_title_gps' 
                                data-country='${props.country}'
                                data-city='${props.city}'
                                data-timezone='${props.timezone_text}'
                                data-latitude='${props.latitude}' 
                                data-longitude='${props.longitude}'>${props.latitude + ', ' + props.longitude}</div>
                        `;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      timezone_text:string,
 *                      latitude:string,
 *                      longitude:string,
 *                      country:string,
 *                      city:string,
 *                      text_place:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      moduleLeafletLibrary:function,
 *                      moduleLeafletContainer:function
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:null}>}
 */
const component = async props => {

    const OFFSET = -25;
    props.methods.moduleLeafletLibrary().popup({ offset: [0, OFFSET], closeOnClick: false })
        .setLatLng([props.data.latitude, props.data.longitude])
        .setContent(template({
            country:props.data.country,
            city:props.data.city,
            text_place:props.data.text_place,
            timezone_text:props.data.timezone_text,
            latitude:props.data.latitude,
            longitude:props.data.longitude
        }))
        .openOn(props.methods.moduleLeafletContainer());
    props.methods.moduleLeafletLibrary().marker([props.data.latitude, props.data.longitude]).addTo(props.methods.moduleLeafletContainer());
    
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   null
    };
};
export default component;