/**
 * Settings tab 2
 * @module apps/app4/component/settings_tab2
 */

/**
 * @import {common}  from '../../../common_types.js'
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
 *                      user_settings:APP_user_setting_record
 *                      },
 *          methods:    {COMMON:common['CommonModuleCommon'],
 *                      appComponentSettingUpdate:appComponentSettingUpdate}}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {

    const onMounted = async () =>{

        //mount the map
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'mapid',
            data:       { 
                        longitude:props.data.user_settings.GpsLongText?.toString()??'',
                        latitude:props.data.user_settings.GpsLatText?.toString()??''
                        },
            methods:    null,
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