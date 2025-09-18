/**
 * App
 * @module apps/default_app/component/app
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @returns {string}
 */
const template = () =>` <div id='app_logo'></div>
                        <div id='app_construction'></div>`;
/**
 * 
 * @param {{data:       {
 *                      logo:string,
 *                      commonMountdiv:string
 *                      },
 *          methods:    {COMMON:common['CommonModuleCommon']}}} props 
 * @returns {Promise.<{ lifecycle:  common['CommonComponentLifecycle'], 
 *                      data:       null, 
 *                      methods:    null,
 *                      template:   string}>}
 */
const component = async props => {
    const onMounted = async () =>
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#app_logo').style.backgroundImage = `url(${props.data.logo})`;
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;