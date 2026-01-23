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
 * @param {{css:string,
 *          html:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                           <html>
                           <head>
                               <meta charset='UTF-8'>
                               <title></title>
                               <style>
                                    ${props.css} 
                               </style>
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
    /**
     * 
     * @param {common['COMMON_DOCUMENT']|ShadowRoot} element 
     * @returns {string}
     */
    const getCss = element =>{
        let css ='';
        element.adoptedStyleSheets.forEach(sheet => { 
            for (const i in sheet.cssRules) {
                //skip fonts
                if (sheet.cssRules[i].cssText?.indexOf('@font-face')==-1)
                    css += sheet.cssRules[i].cssText + '\n'; 
            }
            
        });
        return css;
    }
    
    const templateRendered =  template({  
                                css:getCss(props.methods.COMMON.COMMON_DOCUMENT),
                                html: props.data.appHtml});
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   templateRendered
    };
};
export default component;