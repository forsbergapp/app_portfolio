/**
 * App
 * @module apps/default_app/component/app
 */

/**
 * @import types_common from '../../../common/types.d.ts'
 */

/**
 * @returns {string}
 */
const template = () =>` <div id='app_logo' class='common_icon_toolbar_logo'></div>
                        <div id='app_construction'></div>`;
/**
 * 
 * @param {{data:       {
 *                      commonMountdiv:string
 *                      },
 *          methods:    {COMMON:types_common.CommonModuleCommon}}} props 
 * @returns {Promise.<{ lifecycle:  types_common.CommonComponentLifecycle, 
 *                      data:       null, 
 *                      methods:    null,
 *                      template:   string}>}
 */
const component = async props => {
    const onMounted = async () =>
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#app_top_logo').innerHTML = 
            props.methods.COMMON.commonGlobalGet('Data').Apps.filter((/**@type{types_common.server['ORM']['View']['AppGetInfo']}*/app)=>app.Id == props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id)[0].Logo;
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;