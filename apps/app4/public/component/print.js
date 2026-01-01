/**
 * Print template
 * @module apps/app4/component/print
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_link_app_report_css:string|void,
 *          cssRoot:string|void,
 *          html:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                           <html>
                           <head>
                               <meta charset='UTF-8'>
                               <title></title>
                               <style>
                                    ${props.cssRoot} 
                               </style>
                               <link rel='stylesheet' type='text/css' href='${props.app_link_app_report_css}' />
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
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props
 * 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    //get css with variables in :root
    let cssRoot ='';
    props.methods.COMMON.COMMON_DOCUMENT.adoptedStyleSheets.forEach(sheet => { 
        for (const i in sheet.cssRules) { 
            //load variables in :root so css works, fonts already loaded when print is chosen
            if (sheet.cssRules[i].cssText?.startsWith(':root')){ 
                cssRoot += sheet.cssRules[i].cssText + '\n'; 
            }
        }
    });

    const templateRendered =  template({  
                                app_link_app_report_css:props.methods.COMMON.COMMON_DOCUMENT.querySelector('#app_link_app_report_css').attributes['href'].textContent,
                                cssRoot:cssRoot,
                                html: props.data.appHtml});
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   templateRendered
    };
};
export default component;