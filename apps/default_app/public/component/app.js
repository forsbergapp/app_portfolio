/**
 * App
 * @module apps/default_app/component/app
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @returns {string}
 */
const template = () =>` <div id='dialogue_documents' class='dialogue'>
                            <div id='dialogue_documents_content' class='dialogue_content'>
                                <div id='app_logo'></div>
                                <div id='app_construction'></div>
                            </div>
                        </div>`;
/**
 * 
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT,
*                       commonMiscResourceFetch:CommonModuleCommon['commonMiscResourceFetch']}}} props 
 * @returns {Promise.<{ lifecycle:  CommonComponentLifecycle, 
 *                      data:       null, 
 *                      methods:    null,
 *                      template:   string}>}
 */
const component = async props => {
    const onMounted = async () =>{
        props.methods.commonMiscResourceFetch( '/images/logo.png', 
                                            props.methods.COMMON_DOCUMENT.querySelector('#app_logo'), 
                                            'image/png');
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;