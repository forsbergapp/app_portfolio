/**
 * @module apps/common/component/module_leaflet_popup
 */

/**
 * 
 * @param {{country:string,
 *          city:string,
 *          timezone_text:string,
 *          text_place:string,
 *          latitude:string,
 *          longitude:string}} props 
 * @returns 
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
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      timezone_text:string,
 *                      latitude:string,
 *                      longitude:string,
 *                      marker_id:string,
 *                      country:string,
 *                      city:string,
 *                      text_place:string,
 *                      module_leaflet:*,
 *                      module_leaflet_popup_offset: number,
 *                      module_leaflet_session_map:*},
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument},
 *          lifecycle:  null}} props
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:   null,
 *                      template:null}>}
 */
const component = async props => {
    
    props.data.module_leaflet.popup({ offset: [0, props.data.module_leaflet_popup_offset], closeOnClick: false })
        .setLatLng([props.data.latitude, props.data.longitude])
        .setContent(template({
            country:props.data.country,
            city:props.data.city,
            text_place:props.data.text_place,
            timezone_text:props.data.timezone_text,
            latitude:props.data.latitude,
            longitude:props.data.longitude
        }))
        .openOn(props.data.module_leaflet_session_map);
    const marker = props.data.module_leaflet.marker([props.data.latitude, props.data.longitude]).addTo(props.data.module_leaflet_session_map);
    //setting id so apps can customize if necessary
    marker._icon.id = props.data.marker_id;
    
    return {
        props:  {function_post:null},
        data:   null,
        template: null
    };
};
export default component;