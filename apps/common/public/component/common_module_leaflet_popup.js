/**
 * @module apps/common/component/common_module_leaflet_popup
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
 *                      country:string,
 *                      city:string,
 *                      text_place:string,
 *                      module_leaflet:*,
 *                      module_leaflet_session_map:*},
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument},
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn, 
 *                      data:   null,
 *                      methods:null,
 *                      template:null}>}
 */
const component = async props => {

    const OFFSET = -25;
    props.data.module_leaflet.popup({ offset: [0, OFFSET], closeOnClick: false })
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
    props.data.module_leaflet.marker([props.data.latitude, props.data.longitude]).addTo(props.data.module_leaflet_session_map);
    
    return {
        lifecycle:  {onMounted:null},
        data:   null,
        methods:null,
        template: null
    };
};
export default component;