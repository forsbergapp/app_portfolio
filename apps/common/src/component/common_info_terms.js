/**
 * @module apps/common/src/component/common_info_terms
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_name:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <link href="/common/css/font/font1.css" rel="stylesheet">
                                <link rel='stylesheet' type='text/css' href='/common/css/common_info.css' />
                            </head>	
                            <body>
                                <div class=info_content>
                                    <div class='text_h1'>Legal disclaimer</div>
                                    ${props.app_name} is provided "as is" without warranty of any kind. 
                                </div> 
                            </body>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {app_name:string},
 *          methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props => {
    return template({app_name:props.data.app_name});
};
export default component;