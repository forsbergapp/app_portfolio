/**
 * Displays app
 * @module apps/app5/component/app
 */
/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
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
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonMiscAssetFetch:CommonModuleCommon['commonMiscAssetFetch']}}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {

    const onMounted = async () =>{
        props.methods.commonMiscAssetFetch('/images/logo.png','app_top_logo', 'image/png');
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;