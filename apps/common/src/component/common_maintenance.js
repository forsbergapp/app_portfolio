/**
 * @module apps/common/src/component/common_maintenance
 */

const {server} = await import('../../../../server/server.js');
/**
 * @name template
 * @description Template
 * @function
 * @param {{message:string,
 *          footer:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <title>⚒</title>
                                <style>
                                    :root{
                                        --common_app_color_light :#f5f5f5;
                                        --common_app_color_black: #404040;
                                        --common_app_color_blue1: rgb(81, 171, 255);
                                        --common_app_color_shadow1: rgba(0,0,0,.2);
	                                    --common_app_color_shadow2: rgba(0,0,0,0.19);
                                        --common_app_css_border_radius: 4px;
                                    }
                                    body{
                                        font-family: 'sans-serif';
                                        font-size: 18px;
                                        background-color: var(--common_app_color_blue1);
                                        color:var(--common_app_color_black);
                                        height:100%;
                                        width: 100%;
                                    }   
                                    #common_app_dialogues_maintenance{
                                        height:100%;
                                        width: 100%;
                                        position: fixed;
                                        display: flex;
                                        justify-content: center;
                                        align-items:center;
                                    }
                                    .common_app_dialogues_content{
                                        word-break: break-word;
	                                    border-radius: var(--common_app_css_border_radius);
                                        background-color: var(--common_app_color_light);
                                        box-shadow: 0 4px 8px 0 var(--common_app_color_shadow1),0 6px 20px 0 var(--common_app_color_shadow2);
                                    }
                                    #common_maintenance_header{
                                        background-color: var(--common_app_color_blue1);                                        
                                    }
                                    #common_app_dialogues_maintenance_content{
                                        height:250px;
                                        width:300px;
                                        display: grid;
                                        grid-template-rows: [header] 10% [message] 20% [countdown] 50% [footer] 20%;
                                    }
                                    #common_app_dialogues_maintenance_content > div{
                                        align-items: center;
                                        display: flex;
                                        justify-content: center;
                                        text-align:center;
                                    }
                                    #common_maintenance_countdown{
                                        font-size: 30px;
                                    }
                                </style>
                                <script type='module' >
                                    const maintenance_countdown = (remaining = null) => {
                                        if(remaining && remaining <= 0)
                                            window.location.href = '/';
                                        else{
                                            document.querySelector('#common_maintenance_countdown').textContent = remaining;
                                            window.setTimeout(()=>{ maintenance_countdown((remaining ?? 60) - 1); }, 1000);
                                        }
                                    }
                                    maintenance_countdown();
                                </script>
                            </head>
                            <body>
                                <div id='common_app_dialogues_maintenance'>
                                    <div id='common_app_dialogues_maintenance_content' class='common_app_dialogues_content'>
                                        <div id='common_maintenance_header'><svg width="1em" height="1em" viewBox="0 0 576 512"><path fill="currentColor" d="M70.8-6.7c5.4-5.4 13.8-6.2 20.2-2L209.9 70.5c8.9 5.9 14.2 15.9 14.2 26.6l0 49.6 90.8 90.8c33.3-15 73.9-8.9 101.2 18.5L542.2 382.1c18.7 18.7 18.7 49.1 0 67.9l-60.1 60.1c-18.7 18.7-49.1 18.7-67.9 0L288.1 384c-27.4-27.4-33.5-67.9-18.5-101.2l-90.8-90.8-49.6 0c-10.7 0-20.7-5.3-26.6-14.2L23.4 58.9c-4.2-6.3-3.4-14.8 2-20.2L70.8-6.7zm145 303.5c-6.3 36.9 2.3 75.9 26.2 107.2l-94.9 95c-28.1 28.1-73.7 28.1-101.8 0s-28.1-73.7 0-101.8l135.4-135.5 35.2 35.1zM384.1 0c20.1 0 39.4 3.7 57.1 10.5 10 3.8 11.8 16.5 4.3 24.1L388.8 91.3c-3 3-4.7 7.1-4.7 11.3l0 41.4c0 8.8 7.2 16 16 16l41.4 0c4.2 0 8.3-1.7 11.3-4.7l56.7-56.7c7.6-7.5 20.3-5.7 24.1 4.3 6.8 17.7 10.5 37 10.5 57.1 0 43.2-17.2 82.3-45 111.1l-49.1-49.1c-33.1-33-78.5-45.7-121.1-38.4l-56.8-56.8 0-29.7-.2-5c-.8-12.4-4.4-24.3-10.5-34.9 29.4-35 73.4-57.2 122.7-57.3z"/></svg></div>
                                        <div id='common_maintenance_message'>${props.message}</div>
                                        <div id='common_maintenance_countdown'></div>
                                        <div id='common_maintenance_footer'>${props.footer}</div>
                                    </div>
                                </div>
                            </body>
                            </html>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       null,
 *          methods:    {commonResourceFile:import('../common.js')['commonResourceFile']}}} props 
 * @returns {Promise.<string>}
 */
const component = async props =>{
    props;
    return template({   message:server.ORM.OpenApiComponentParameters.config.SERVER_MAINTENANCE_MESSAGE.default,
                        footer:''
    });
};
export default component;