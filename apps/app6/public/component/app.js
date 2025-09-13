/**
 * Displays app
 * @module apps/app6/component/app
 */
/**
 * @import {common}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () =>` <div id='app_top'>
                            <div id='app_top_logo'></div>
                            <div id='app_top_end'></div>
                        </div>
                        <div id='app_main'>
                            <div id='app_main_page'></div>
                        </div>
                        <div id='app_bottom'>
                            <div id='app_bottom_about'></div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      logo:string,
 *                      commonMountdiv:string
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {

    const onMounted = async () =>
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#app_top_logo').style.backgroundImage = `url(${props.data.logo})`;

    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;