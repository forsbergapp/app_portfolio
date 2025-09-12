/**
 * Settings tab 2
 * @module apps/app4/component/settings_tab2
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @import {appComponentSettingUpdate}  from '../js/app.js'
 * @import {APP_user_setting_record}  from '../js/types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () => `<div id='mapid'>
                       </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      common_app_id:number,
 *                      user_settings:APP_user_setting_record
 *                      },
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      appComponentSettingUpdate:appComponentSettingUpdate,
 *                      commonMiscListKeyEvent:CommonModuleCommon['commonMiscListKeyEvent'],
 *                      commonMiscElementRow:CommonModuleCommon['commonMiscElementRow'],
 *                      commonMiscElementId:CommonModuleCommon['commonMiscElementId'],
 *                      commonMiscImport:CommonModuleCommon['commonMiscImport'],
 *                      commonComponentRender:CommonModuleCommon['commonComponentRender'], 
 *                      commonComponentRemove:CommonModuleCommon['commonComponentRemove'], 
 *                      commonFFB:CommonModuleCommon['commonFFB'],
 *                      commonWindowFromBase64:CommonModuleCommon['commonWindowFromBase64'],
 *                      commonUserLocale:CommonModuleCommon['commonUserLocale']}}} props
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
const component = async props => {

    const onMounted = async () =>{

        //mount the map
        await props.methods.commonComponentRender({
            mountDiv:   'mapid',
            data:       { 
                        data_app_id :props.data.common_app_id,
                        longitude:props.data.user_settings.gps_long_text?.toString()??'',
                        latitude:props.data.user_settings.gps_lat_text?.toString()??''
                        },
            methods:    {
                        commonComponentRender:props.methods.commonComponentRender,
                        commonComponentRemove:props.methods.commonComponentRemove,
                        commonWindowFromBase64:props.methods.commonWindowFromBase64,
                        commonMiscListKeyEvent:props.methods.commonMiscListKeyEvent,
                        commonMiscElementRow:props.methods.commonMiscElementRow,
                        commonMiscElementId:props.methods.commonMiscElementId,
                        commonMiscImport:props.methods.commonMiscImport,
                        commonUserLocale:props.methods.commonUserLocale,
                        commonFFB:props.methods.commonFFB
                        },
            path:       '/common/component/common_map.js'});
        props.methods.appComponentSettingUpdate('GPS', 'CITY');
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template()
    };
};
export default component;