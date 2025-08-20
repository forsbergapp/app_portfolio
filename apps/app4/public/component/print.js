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
 *          app_fonts_css:string|void,
 *          html:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                           <html>
                           <head>
                               <meta charset='UTF-8'>
                               <title></title>
                               <style>
                                    ${props.app_fonts_css} 
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
    //get css with variables in :root
    let cssRoot ='';
    props.methods.COMMON_DOCUMENT.adoptedStyleSheets.forEach(sheet => { 
        for (const i in sheet.cssRules) { 
            //load css with base64 strings and variables in :root
            if (sheet.cssRules[i].cssText?.indexOf('data:font/woff2;') ||
                sheet.cssRules[i].cssText?.startsWith(':root')){ 
                cssRoot += sheet.cssRules[i].cssText + '\n'; 
            }
        }
    });

    const templateRendered =  template({  
                                app_link_app_report_css:props.methods.COMMON_DOCUMENT.querySelector('#app_link_app_report_css').attributes['href'].textContent,
                                app_fonts_css:cssRoot,
                                html: props.data.appHtml});
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   templateRendered
    };
};
export default component;