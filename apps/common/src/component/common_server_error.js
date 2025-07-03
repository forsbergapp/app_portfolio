/**
 * @module apps/common/src/component/common_server_error
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{font: string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body{
                                        --common_app_color_black: #404040;
                                        --common_app_color_blue1: rgb(81, 171, 255);
                                        --common_app_color_light :#f5f5f5;
                                        --common_app_color_shadow1: rgba(0,0,0,.2);
                                        --common_app_color_shadow2: rgba(0,0,0,0.19);
                                        /* latin */
                                        @font-face {
                                            font-family: 'Noto Sans';
                                            src: url(${props.font}) format('woff2');
                                        }
                                        font-size: 16px;
                                        font-family: 'Noto Sans';
                                        margin: 0;
                                        height: 100%;
                                        padding: 0px;
                                        color: var(--common_app_color_black);
                                        background: var(--common_app_color_blue1);
                                    }
                                    #common_dialogue_server_error{
                                        text-align:center;
                                        top: 50%;
                                        left: 50%;
                                        position: fixed;
                                        transform: translate(-50%, -50%);
                                        padding: 10px;
                                        width: 10em;
                                        height: auto;
                                        border-radius: 4px;
                                        background-color: var(--common_app_color_light);
                                        box-shadow: 0 4px 8px 0 var(--common_app_color_shadow1),0 6px 20px 0 var(--common_app_color_shadow2);
                                    }
                                    #common_server_error_countdown{
                                        font-size: 2em;
                                    }
                                </style>
                            </head>
                                <body>
                                    <div id='common_dialogue_server_error'>
                                        <div id='common_server_error_message'>SERVER ERROR</div>
                                        <div id='common_server_error_countdown'></div>
                                    </div>
                                    <script>
                                        const server_error_countdown = remaining => {
                                            if(remaining && remaining <= 0)
                                                location.reload();
                                            else{
                                                document.querySelector('#common_server_error_countdown').innerHTML = remaining;
                                                setTimeout(()=>{ server_error_countdown(remaining - 1); }, 1000);
                                            }
                                        };    
                                        server_error_countdown(60);
                                    </script>
                                </body>
                            </html>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       null,
 *          methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props =>{
    props;
    const fs = await import('node:fs');
    const {serverProcess} = await import('../../../../server/server.js');
    return template({font:await fs.promises
                                .readFile(`${serverProcess.cwd()}/apps/common/public/css/font/notosans/v35/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a7duw.woff2`)
                                /**@ts-ignore */
                                .then(file=>`data:font/woff2;charset=utf8;base64,${Buffer.from(file, 'binary').toString('base64')}`)
                    });  
};
export default component;