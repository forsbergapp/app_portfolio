/**
 * Settings tab 2
 * @module apps/app2/component/settings_tab2
 */

/**
 * @import {CommonModuleCommon, CommonModuleRegional, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleRegional['getTimezone']} getTimezone
 * @typedef {CommonModuleCommon['commonDbAppSettingsGet']} commonDbAppSettingsGet
 * @typedef {CommonModuleCommon['commonSelectCurrentValueSet']} commonSelectCurrentValueSet
 * @typedef {CommonModuleCommon['commonComponentRender']} commonComponentRender
 * @typedef {CommonModuleCommon['commonTimezoneDate']} commonTimezoneDate
 * @typedef {CommonModuleCommon['commonModuleLeafletInit']} commonModuleLeafletInit
 * @import {appComponentSettingUpdate}  from '../js/app.js'
 * @import {APP_REPORT_GLOBAL, APP_user_setting_record}  from '../js/types.js'
 */
/**
 * @returns {string}
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
 *                      commonMountdiv:string,
 *                      app_id:number,
 *                      user_settings:APP_user_setting_record,
 *                      user_locale:string,
 *                      user_timezone:string
 *                      },
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      appComponentSettingUpdate:appComponentSettingUpdate,
 *                      REPORT_GLOBAL:APP_REPORT_GLOBAL,
 *                      getTimezone:getTimezone,
 *                      commonDbAppSettingsGet:commonDbAppSettingsGet,
 *                      commonTimezoneDate:commonTimezoneDate,
 *                      commonModuleLeafletInit:commonModuleLeafletInit,
 *                      commonSelectCurrentValueSet:commonSelectCurrentValueSet,
 *                      commonComponentRender:commonComponentRender}}} props
 * @param {{COMMON_DOCUMENT:COMMON_DOCUMENT,
 *          commonMountdiv:string,
 *          app_id:number,
 *          user_settings:import('../js//types.js').APP_user_setting_record,
 *          }} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {
    const settings = (await props.methods.commonDbAppSettingsGet()).filter((/**@type{*}*/setting)=>
        setting.app_id == props.data.app_id && 
        setting.app_setting_type_name.startsWith('PLACE'));

    const empty_place = {value:JSON.stringify({id:null, latitude:'0', longitude:'0', timezone:''}), text:'...'};

    const onMounted = async () =>{
        //places uses json in value to save multiple attributes
        await props.methods.commonComponentRender({
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
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        props.methods.commonSelectCurrentValueSet(   'setting_select_popular_place', null, 'id', props.data.user_settings.gps_popular_place_id);
        props.methods.COMMON_DOCUMENT.querySelector('#setting_input_place').textContent = props.data.user_settings.description;
        props.methods.COMMON_DOCUMENT.querySelector('#setting_input_lat').textContent = props.data.user_settings.gps_lat_text;
        props.methods.COMMON_DOCUMENT.querySelector('#setting_input_long').textContent = props.data.user_settings.gps_long_text;

        //init map thirdparty module
        /**
         * @param{import('../../../common_types.js').CommonModuleLeafletEvent} event
         */
        const dbl_click_event = event => {
            if (event.originalEvent.target.parentNode.id == 'mapid'){
                props.methods.COMMON_DOCUMENT.querySelector('#setting_input_lat').textContent = event.latlng.lat;
                props.methods.COMMON_DOCUMENT.querySelector('#setting_input_long').textContent = event.latlng.lng;
                //Update GPS position
                props.methods.appComponentSettingUpdate('GPS', 'POSITION');
                const timezone = props.methods.getTimezone(   event.latlng.lat, event.latlng.lng);
                props.methods.REPORT_GLOBAL.session_currentDate = props.methods.commonTimezoneDate(timezone);
            }   
        };
        await props.methods.commonModuleLeafletInit({
                                                    mount_div:'mapid',
                                                    longitude:props.methods.COMMON_DOCUMENT.querySelector('#setting_input_long').textContent, 
                                                    latitude:props.methods.COMMON_DOCUMENT.querySelector('#setting_input_lat').textContent,
                                                    place:'',
                                                    doubleclick_event:dbl_click_event,
                                                    update_map:false}).then(() => {
            props.methods.appComponentSettingUpdate('GPS', 'MAP');
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