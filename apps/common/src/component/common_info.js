/**
 * @module apps/common/src/component/common_info
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_name:string, type:'INFO_DISCLAIMER'|'INFO_PRIVACY_POLICY'|'INFO_TERMS'}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <link rel='stylesheet' type='text/css' data-href='/common/css/common_info.css' />
                            </head>	
                            <body>
                                <div class='info_content'>
                                    ${props.type=='INFO_DISCLAIMER'?
                                        `<div class='text_h1'>Legal disclaimer</div>
                                        ${props.app_name} is provided "as is" without warranty of any kind. `:''
                                    }
                                    ${props.type=='INFO_PRIVACY_POLICY'?
                                        `<div class='text_h1'>Privacy Policy</div>
                                        <div class='text_p'>
                                            ${props.app_name} does NOT use Cookies and no info is saved in the browser. Apps are deployed as stateless with the purpose of not saving any info in the browser.
                                        </div>
                                        ${props.app_name} is provided "as is" without warranty of any kind. 

                                        <div class='text_h1'>How to delete your account in this App</div>
                                        <div class='text_p'>1.Log in with your user account in main app.</div>
                                        <div class='text_p'>2.Choose Edit in user menu.</div>
                                        <div class='text_p'>3.Choose Delete Account.</div>`:''
                                    }
                                    ${props.type=='INFO_TERMS'?
                                        `<div class='text_h1'>Terms</div>
                                        ${props.app_name} is provided "as is" without warranty of any kind. `:''
                                    }
                                </div> 
                            </body>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {app_name:string,
 *                      type:'INFO_DISCLAIMER'|'INFO_PRIVACY_POLICY'|'INFO_TERMS'},
 *          methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props => {
    return template({app_name:props.data.app_name, type:props.data.type});
};
export default component;