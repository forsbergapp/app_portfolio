/**
 * @module apps/default_PWA/component/app
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
 *          methods:    {COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT}}} props 
 * @returns {Promise.<{ lifecycle:  import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:       null, 
 *                      methods:    null,
 *                      template:   string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  {onMounted:null},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;