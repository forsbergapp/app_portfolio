/**
 * @description Settings tab 2
 * @module apps/app4/component/settings_tab2
 */

/**
 * @import types_common from '../../../common/types.d.ts'
 * @import {appComponentSettingUpdate}  from '../js/app.js'
 * @import types_app  from '../../types.d.ts'
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
 *                      user_settings:types_app.APP_user_setting_record
 *                      },
 *          methods:    {COMMON:types_common.CommonModuleCommon,
 *                      appComponentSettingUpdate:appComponentSettingUpdate}}} props
 * @returns {Promise.<{ lifecycle:types_common.CommonComponentLifecycle, 
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