/**
 * @module apps/common/src/component/common_maintenance
 */
/**
 * @typedef {import('../common.js')['commonConvertBinary']} commonConvertBinary
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{font_noto_sans_latin_ext:string,
 *          font_noto_sans_latin:string,
 *          message:string,
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
                                        --common_app_icon_maintenance: '⚒';
                                    }
                                    /* latin-ext */
                                    @font-face {
                                    font-family: 'Noto Sans';
                                    font-style: normal;
                                    font-weight: 400;
                                    font-stretch: 100%;
                                    font-display: swap;
                                    src: url(${props.font_noto_sans_latin_ext}) format('woff2');
                                    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
                                    }
                                    /* latin */
                                    @font-face {
                                    font-family: 'Noto Sans';
                                    font-style: normal;
                                    font-weight: 400;
                                    font-stretch: 100%;
                                    font-display: swap;
                                    src: url(${props.font_noto_sans_latin}) format('woff2');
                                    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                                    }
                                    /* latin-ext */
                                    @font-face {
                                    font-family: 'Noto Sans';
                                    font-style: normal;
                                    font-weight: 700;
                                    font-stretch: 100%;
                                    font-display: swap;
                                    src: url(${props.font_noto_sans_latin_ext}) format('woff2');
                                    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
                                    }
                                    /* latin */
                                    @font-face {
                                    font-family: 'Noto Sans';
                                    font-style: normal;
                                    font-weight: 700;
                                    font-stretch: 100%;
                                    font-display: swap;
                                    src: url(${props.font_noto_sans_latin}) format('woff2');
                                    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                                    }

                                    body{
                                        font-family: 'Noto Sans';
                                        font-size: 18px;
                                        background-color: var(--common_app_color_blue1);
                                        color:var(--common_app_color_black);
                                        height:100%;
                                        width: 100%;
                                    }   
                                    #common_dialogue_maintenance{
                                        height:100%;
                                        width: 100%;
                                        position: fixed;
                                        display: flex;
                                        justify-content: center;
                                        align-items:center;
                                    }
                                    .common_dialogue_content{
                                        word-break: break-word;
	                                    border-radius: var(--common_app_css_border_radius);
                                        background-color: var(--common_app_color_light);
                                        box-shadow: 0 4px 8px 0 var(--common_app_color_shadow1),0 6px 20px 0 var(--common_app_color_shadow2);
                                    }
                                    #common_maintenance_header{
                                        background-color: var(--common_app_color_blue1);                                        
                                    }
                                    #common_maintenance_header::before{
                                        content:var(--common_app_icon_maintenance)
                                    }
                                    #common_dialogue_maintenance_content{
                                        height:250px;
                                        width:300px;
                                        display: grid;
                                        grid-template-rows: [header] 10% [message] 20% [countdown] 50% [footer] 20%;
                                    }
                                    #common_dialogue_maintenance_content > div{
                                        align-items: center;
                                        display: flex;
                                        justify-content: center;
                                    }
                                    #common_maintenance_countdown{
                                        font-size: 30px;
                                    }
                                </style>
                                <script type='module' >
                                    const maintenance_countdown = (remaining = null) => {
                                        if(remaining && remaining <= 0)
                                            window.location.reload();
                                        else{
                                            document.querySelector('#common_maintenance_countdown').textContent = remaining;
                                            window.setTimeout(()=>{ maintenance_countdown((remaining ?? 60) - 1); }, 1000);
                                        }
                                    }
                                    maintenance_countdown();
                                </script>
                                <meta name="HandheldFriendly" content="true"/>
                                <meta name='mobile-web-app-capable' content='yes'>
                            </head>
                            <body>
                                <div id='common_dialogue_maintenance' class='common_dialogues_modal'>
                                    <div id='common_dialogue_maintenance_content' class='common_dialogue_content'>
                                        <div id='common_maintenance_header'></div>
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
 *          methods:    {commonConvertBinary:commonConvertBinary}}} props 
 * @returns {Promise.<string>}
 */
const component = async props =>{

    return template({   font_noto_sans_latin_ext:   (await props.methods.commonConvertBinary(
                                                        'font/woff2',
                                                        '/apps/common/public/css/font/notosans/v35/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aDdu2ui.woff2'))
                                                        .result.resource,
                        font_noto_sans_latin:       (await props.methods.commonConvertBinary(
                                                        'font/woff2',
                                                        '/apps/common/public/css/font/notosans/v35/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a7duw.woff2'))
                                                        .result.resource,
                        message:'',
                        footer:''
    });
};
export default component;