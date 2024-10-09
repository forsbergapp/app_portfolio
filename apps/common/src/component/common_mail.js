/**
 * @module apps/common/src/component/common_mail
 */

/**
 * @param {{host:string, verification_code:string}} props
 */
const template = props =>`  <html>
                                <head>
                                    <style>
                                        body {
                                            background-color: #ffffff;
                                            color: #a49775;
                                            margin: 0;
                                            padding: 20px;
                                            text-align: center;
                                            font-family: Arial, Helvetica, sans-serif;
                                        }

                                        #app_logo {
                                            vertical-align: middle;
                                            margin: 20px;
                                            height: 64px;
                                        }

                                        a {
                                            color: #a49775
                                        }

                                        a:link,
                                        a:visited {
                                            text-decoration: none;
                                        }

                                        a:hover,
                                        a:active {
                                            cursor: pointer;
                                        }

                                        table {
                                            width: 100%;
                                            margin: 0 auto;
                                            text-align: center;
                                            color: #a49775;
                                            font-family: Arial, Helvetica, sans-serif;
                                        }

                                        table td {
                                            text-align: center;
                                        }

                                        #table_header {
                                            background-color: white;
                                            padding: 20px;
                                        }

                                        #table_verification {
                                            background-color: #2b2b32;
                                            border-radius: 4px;
                                        }

                                        #table_footer {
                                            background-color: unset;
                                        }

                                        #verification_code_title {
                                            font-size: 14pt;
                                            padding-bottom: 16px;
                                        }

                                        #verification_code {
                                            font-size: 28pt;
                                            text-align: center;
                                            padding-bottom: 10px;
                                        }

                                        #footer {
                                            font-size: 8pt;
                                        }
                                    </style>
                                    </head>
                            <body>
                                <table id=table_header>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table id=table_verification>
                                                    <tbody>
                                                    <tr>
                                                        <td >
                                                            <img id='app_logo' src='/apps/common/images/logo.png'>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td id='verification_code' >
                                                            <p> ${props.verification_code}</p>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table id=table_footer>
                                    <tbody>
                                    <tr>
                                        <td id='footer'>
                                            <a target='_blank' href='https://${props.host}'>${props.host}</a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </body>
                            </html> `;
/**
 * 
 * @param {{data:       {host:string, verification_code:string},
 *          methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props => template({host:props.data.host, verification_code:props.data.verification_code});
export default component;