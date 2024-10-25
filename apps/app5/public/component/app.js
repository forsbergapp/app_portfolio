/**
 * Displays app
 * @module apps/app5/component/app
 */
/**
 * @import {COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @returns {string}
 */
const template = () =>` <div id='app_top'>
                            <div id='app_top_logo'></div>
                            <div id='app_top_usermenu'></div>
                        </div>
                        <div id='app_main'>
                            <div id='app_main_page'></div>
                        </div>
                        <div id='app_bottom'>
                            <div id='app_bottom_about'></div>
                        </div>`;
/**
 * 
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;