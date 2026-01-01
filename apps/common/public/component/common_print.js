/**
 * @module apps/common/component/common_print
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_link_app_css:string,
 *          app_link_app_report_css:string,
 *          cssCommon:string,
 *          html:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                           <html>
                           <head>
                               <meta charset='UTF-8'>
                               <title></title>
                               <style>
                                    ${props.cssCommon} 
                               </style>
                               <link rel='stylesheet' type='text/css' href='${props.app_link_app_css}' />
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
    //get common css 
    let cssCommon ='';
     props.methods.COMMON.COMMON_DOCUMENT.adoptedStyleSheets.forEach(sheet => { 
        for (const i in sheet.cssRules) {
            //skip fonts
            if (sheet.cssRules[i].cssText?.indexOf('@font-face')==-1)
                cssCommon += sheet.cssRules[i].cssText + '\n'; 
        }
        return;
    });
    const templateRendered =  template({  
                                app_link_app_css:props.methods.COMMON.COMMON_DOCUMENT.querySelector('#app_link_app_css').attributes['href'].textContent,
                                app_link_app_report_css:props.methods.COMMON.COMMON_DOCUMENT.querySelector('#app_link_app_report_css').attributes['href'].textContent,
                                cssCommon:cssCommon,
                                html: props.data.appHtml});
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   templateRendered
    };
};
export default component;