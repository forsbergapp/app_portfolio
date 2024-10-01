/**
 * @module apps/app2/component/print
 */

/**
 * @param {{app_link_app_report_css:string,
 *          common_link_common_css:string,
 *          html:string}} props
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <title></title>
                                <link rel='stylesheet' type='text/css' href=${props.app_link_app_report_css} />
                                <link rel='stylesheet' type='text/css' href=${props.common_link_common_css} />
                            </head>
                            <body id="printbody">
                                ${props.html}
                            </body>
                            </html> `;
/**
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      html:string
 *                      },
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument}}} props
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          html:string}} props 
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {
    props;
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({  app_link_app_report_css:props.methods.common_document.querySelector('#app_link_app_report_css').attributes['href'].nodeValue,
                                common_link_common_css:props.methods.common_document.querySelector('#common_link_common_css').attributes['href'].nodeValue,
                                html: props.data.html})
    };
};
export default method;