/**
 * Print template
 * @module apps/app4/component/print
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_link_app_report_css:string|void,
 *          common_link_common_css:string|void,
 *          html:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                           <html>
                           <head>
                               <meta charset='UTF-8'>
                               <title></title>
                               <link rel='stylesheet' type='text/css' href='${props.app_link_app_report_css}' />
                               <link rel='stylesheet' type='text/css' href='${props.common_link_common_css}' />
                            </head>
                            <body id="printbody">
                                ${props.html}
                            </body>
                            </html> `;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      appHtml:string
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonMiscResourceFetch:CommonModuleCommon['commonMiscResourceFetch']
 *                      }}} props
 * 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({  app_link_app_report_css:props.methods.COMMON_DOCUMENT.querySelector('#app_link_app_report_css').attributes['href'].textContent,
                                common_link_common_css:props.methods.COMMON_DOCUMENT.querySelector('#common_link_common_css').attributes['href'].textContent,
                                html: props.data.appHtml})
    };
};
export default component;