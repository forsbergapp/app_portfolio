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
 * 
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string,
 *          timezone_text:string,
 *          latitude:string,
 *          longitude:string,
 *          marker_id:string,
 *          country:string,
 *          city:string,
 *          text_place:string,
 *          module_leaflet:*,
 *          module_leaflet_popup_offset: number,
 *          module_leaflet_session_map:*}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:   null,
 *                      template:null}>}
 */
const component = async props => {
    
    props.module_leaflet.popup({ offset: [0, props.module_leaflet_popup_offset], closeOnClick: false })
        .setLatLng([props.latitude, props.longitude])
        .setContent(template({
            country:props.country,
            city:props.city,
            text_place:props.text_place,
            timezone_text:props.timezone_text,
            latitude:props.latitude,
            longitude:props.longitude
        }))
        .openOn(props.module_leaflet_session_map);
    const marker = props.module_leaflet.marker([props.latitude, props.longitude]).addTo(props.module_leaflet_session_map);
    //setting id so apps can customize if necessary
    marker._icon.id = props.marker_id;
    
    return {
        props:  {function_post:null},
        data:   null,
        template: null
    };
};
export default component;