/**
 * @module apps/common/src/component/common_server_error
 */

const {server} = await import('../../../../server/server.js');

/**
 * @name template
 * @description Server error
 * @function
 * @param {{message:string|null}} props
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
                                        font-family: 'sans-serif';
                                        font-size: 16px;
                                        margin: 0;
                                        height: 100%;
                                        padding: 0px;
                                        color: var(--common_app_color_black);
                                        background: var(--common_app_color_blue1);
                                    }
                                    #common_app_dialogues_server_error{
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
                                    <div id='common_app_dialogues_server_error'>
                                        <div id='common_server_error_message'>${props.message??'SERVER ERROR'}</div>
                                        <div id='common_server_error_countdown'></div>
                                    </div>
                                    <script>
                                        const server_error_countdown = remaining => {
                                            if(remaining && remaining <= 0)
                                                window.location.href = '/';
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
 * @param {{data:       {message:string|null},
 *          methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props =>{
    return template({message:props.data.message});
};
export default component;