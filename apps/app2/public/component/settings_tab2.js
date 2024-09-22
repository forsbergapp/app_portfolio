/**
 * @module apps/app2/component/settings_tab2
 */

const template = () => `<div id='mapid'></div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_gps_popular_place' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_select_popular_place'></div>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_gps_place' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_input_place' contentEditable='true' class='common_input'></div>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_input_lat' contentEditable='true' class='common_input'></div>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_input_long' contentEditable='true' class='common_input'></div>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>`;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          app_id:number,
 *          current_place_id:number,
 *          current_place_description:string,
 *          current_latitude:string,
 *          current_longitude:string,
 *          lib_timetable_REPORT_GLOBAL:*,
 *          function_component_setting_update:function,
 *          function_map_show_search_on_map_app:function,
 *          function_getTimezone:function,
 *          function_getTimezoneDate:function,
 *          function_map_init:function,
 *          function_map_resize:function,
 *          function_set_current_value:function,
 *          function_ComponentRender:function,
 *          function_app_settings_get:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    
    const post_component = async () =>{
        /**@type{[{value:string, data2:string, data3:string, data4:string, data5:string, text:string}]} */
        const settings = (await props.function_app_settings_get()).filter((/**@type{*}*/setting)=>
                                                                                        setting.app_id == props.app_id && 
                                                                                        setting.app_setting_type_name.startsWith('PLACE'));
        
        const empty_place = {value:JSON.stringify({id:'', latitude:'0', longitude:'0', timezone:''}), text:'...'};
        //places uses json in value to save multiple attributes
        await props.function_ComponentRender('setting_select_popular_place',
            {
                default_data_value:empty_place.value,
                default_value:empty_place.text,
                options: [empty_place].concat(settings.map(place=>{
                                return {value:JSON.stringify({id:place.value, latitude:place.data2, longitude:place.data3, timezone:place.data4}), text:`${place.data5} ${place.text}`};
                            })),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        props.function_set_current_value(   'setting_select_popular_place', null, 'id', props.current_place_id);
        props.common_document.querySelector('#setting_input_place').innerHTML = props.current_place_description;
        props.common_document.querySelector('#setting_input_lat').innerHTML = props.current_latitude;
        props.common_document.querySelector('#setting_input_long').innerHTML = props.current_longitude;

        //init map thirdparty module
        /**
         * @param{import('../../../common_types.js').CommonModuleLeafletEvent} event
         */
        const dbl_click_event = event => {
            if (event.originalEvent.target.parentNode.id == 'mapid'){
                props.common_document.querySelector('#setting_input_lat').innerHTML = event.latlng.lat;
                props.common_document.querySelector('#setting_input_long').innerHTML = event.latlng.lng;
                //Update GPS position
                props.function_component_setting_update('GPS', 'POSITION');
                const timezone = props.function_getTimezone(   event.latlng.lat, event.latlng.lng);
                props.lib_timetable_REPORT_GLOBAL.session_currentDate = props.function_getTimezoneDate(timezone);
            }   
        };
        await props.function_map_init('mapid',
                        props.common_document.querySelector('#setting_input_long').innerHTML, 
                        props.common_document.querySelector('#setting_input_lat').innerHTML,
                        dbl_click_event,
                        props.function_map_show_search_on_map_app).then(() => {
            props.function_component_setting_update('GPS', 'MAP');
            props.function_map_resize();
        });
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template()
    };
};
export default method;