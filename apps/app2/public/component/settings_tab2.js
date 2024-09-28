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
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      app_id:number,
 *                      user_settings:import('../js//types.js').APP_user_setting_record,
 *                      user_locale:string,
 *                      user_timezone:string
 *                      },
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument,
 *                      component_setting_update:import('../js/app.js')['component_setting_update'],
 *                      app_settings_get:import('../../../common_types.js').CommonModuleCommon['app_settings_get'],
 *                      lib_timetable_REPORT_GLOBAL:import('../js/types.js').APP_GLOBAL['lib_timetable']['REPORT_GLOBAL'],
 *                      map_show_search_on_map_app:import('../js/app.js')['map_show_search_on_map_app'],
 *                      getTimezone:import('../../../common_types.js').CommonModuleRegional['getTimezone'],
 *                      getTimezoneDate:import('../../../common_types.js').CommonModuleCommon['getTimezoneDate'],
 *                      map_init:import('../../../common_types.js').CommonModuleCommon['map_init'],
 *                      map_resize:import('../../../common_types.js').CommonModuleCommon['map_resize'],
 *                      set_current_value:import('../../../common_types.js').CommonModuleCommon['set_current_value'],
 *                      ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender']},
 *          lifecycle:  null}} props
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          app_id:number,
 *          user_settings:import('../js//types.js').APP_user_setting_record,
 *          }} props 
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {
    
    const onMounted = async () =>{
        const settings = (await props.methods.app_settings_get()).filter((/**@type{*}*/setting)=>
                                                                                        setting.app_id == props.data.app_id && 
                                                                                        setting.app_setting_type_name.startsWith('PLACE'));
        
        const empty_place = {value:JSON.stringify({id:'', latitude:'0', longitude:'0', timezone:''}), text:'...'};
        //places uses json in value to save multiple attributes
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_popular_place',
            data:       {
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
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:  null,
            path:       '/common/component/select.js'});
        props.methods.set_current_value(   'setting_select_popular_place', null, 'id', props.data.user_settings.gps_popular_place_id);
        props.methods.common_document.querySelector('#setting_input_place').innerHTML = props.data.user_settings.description;
        props.methods.common_document.querySelector('#setting_input_lat').innerHTML = props.data.user_settings.gps_lat_text;
        props.methods.common_document.querySelector('#setting_input_long').innerHTML = props.data.user_settings.gps_long_text;

        //init map thirdparty module
        /**
         * @param{import('../../../common_types.js').CommonModuleLeafletEvent} event
         */
        const dbl_click_event = event => {
            if (event.originalEvent.target.parentNode.id == 'mapid'){
                props.methods.common_document.querySelector('#setting_input_lat').innerHTML = event.latlng.lat;
                props.methods.common_document.querySelector('#setting_input_long').innerHTML = event.latlng.lng;
                //Update GPS position
                props.methods.component_setting_update('GPS', 'POSITION');
                const timezone = props.methods.getTimezone(   event.latlng.lat, event.latlng.lng);
                props.methods.lib_timetable_REPORT_GLOBAL.session_currentDate = props.methods.getTimezoneDate(timezone);
            }   
        };
        await props.methods.map_init('mapid',
                        props.methods.common_document.querySelector('#setting_input_long').innerHTML, 
                        props.methods.common_document.querySelector('#setting_input_lat').innerHTML,
                        dbl_click_event,
                        props.methods.map_show_search_on_map_app).then(() => {
            props.methods.component_setting_update('GPS', 'MAP');
            props.methods.map_resize();
        });
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template()
    };
};
export default method;