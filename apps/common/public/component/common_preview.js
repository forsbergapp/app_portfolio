/**
 * @module apps/common/component/common_preview
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{paper_class:string,
 *          html:string}} props
 * @returns {string}
 */
const template = props =>` <div id="paper" class='${props.paper_class}'>
                                ${props.html}
                            </div> `;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      paper_class:string,
 *                      appHtml:string
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props
 * 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({  
                                paper_class:props.data.paper_class,
                                html: props.data.appHtml})
    };
};
export default component;