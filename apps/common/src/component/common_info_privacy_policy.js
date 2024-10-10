/**
 * @module apps/common/src/component/common_info_privacy_policy
 */

/**
 * @param {{app_name:string}} props
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <link href="/common/css/font/font1.css" rel="stylesheet">
                                <link rel='stylesheet' type='text/css' href='/common/css/common_info.css' />
                            </head>	
                            <body>
                                <div class='info_content'>
                                    <div class='text_h1'>Privacy Policy</div>
                                    <div class='text_p'>
                                        ${props.app_name} does NOT use Cookies and no info is saved in the browser. Apps are deployed as stateless with the purpose of not saving any info in the browser.
                                    </div>
                                    ${props.app_name} is provided "as is" without warranty of any kind. 

                                    <div class='text_h1'>How to delete your account in this App</div>
                                    <div class='text_p'>1.Log in with your user account in main app.</div>
                                    <div class='text_p'>2.Choose Edit in user menu.</div>
                                    <div class='text_p'>3.Choose Delete Account.</div>
                                </div>
                            </body>`;
/**
 * 
 * @param {{data:       {app_name:string},
 *          methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props => {
    return template({app_name:props.data.app_name});
};
export default component;