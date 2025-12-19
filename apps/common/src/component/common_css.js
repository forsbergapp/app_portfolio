    /**
     * @description Returns common start css with fetched font files converted to base64 strings
     * @module apps/common/src/component/common_css
     */  

    /**
     * @import {server} from '../../../../server/types.js';
     */

    const {server} = await import('../../../../server/server.js');

    /**
     * @name template
     * @description Template
     * @function
     * @param {{font_base64_url:string[],
     *          font_urls_start:boolean,
     *          font_urls_ui:boolean}} props
    * @returns {string}
    */
    const template = props =>`  ${props.font_urls_ui?
                                    `
                                    @font-face {
                                        font-family: "Font Awesome 6 Free";
                                        font-style: normal;
                                        font-weight: 400;
                                        font-display: block;
                                        src: url(${props.font_base64_url[0]}) 
                                            format("woff2");
                                    }
                                    @font-face {
                                        font-family: "Font Awesome 6 Free";
                                        font-style: normal;
                                        font-weight: 900;
                                        font-display: block;
                                        src: url(${props.font_base64_url[1]}) 
                                                format("woff2");
                                    }
                                    @font-face {
                                        font-family: "Font Awesome 6 Brands";
                                        font-style: normal;
                                        font-weight: 900;
                                        font-display: block;
                                        src: url(${props.font_base64_url[2]}) 
                                            format("woff2");
                                    }`:''
                                }
                                ${props.font_urls_start?
                                    `/* cyrillic-ext */
                                    @font-face {
                                        font-family: 'Noto Sans';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-stretch: 100%;
                                        font-display: swap;
                                        src: url(${props.font_base64_url[3]}) format('woff2');
                                        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
                                    }
                                    /* cyrillic */
                                    @font-face {
                                        font-family: 'Noto Sans';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-stretch: 100%;
                                        font-display: swap;
                                        src: url(${props.font_base64_url[4]}) format('woff2');
                                        unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
                                    }
                                    /* devanagari */
                                    @font-face {
                                        font-family: 'Noto Sans';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-stretch: 100%;
                                        font-display: swap;
                                        src: url(${props.font_base64_url[5]}) format('woff2');
                                        unicode-range: U+0900-097F, U+1CD0-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FF;
                                    }
                                    /* greek-ext */
                                    @font-face {
                                        font-family: 'Noto Sans';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-stretch: 100%;
                                        font-display: swap;
                                        src: url(${props.font_base64_url[6]}) format('woff2');
                                        unicode-range: U+1F00-1FFF;
                                    }
                                    /* greek */
                                    @font-face {
                                        font-family: 'Noto Sans';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-stretch: 100%;
                                        font-display: swap;
                                        src: url(${props.font_base64_url[7]}) format('woff2');
                                        unicode-range: U+0370-03FF;
                                    }
                                    /* vietnamese */
                                    @font-face {
                                        font-family: 'Noto Sans';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-stretch: 100%;
                                        font-display: swap;
                                        src: url(${props.font_base64_url[8]}) format('woff2');
                                        unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
                                    }
                                    /* latin-ext */
                                    @font-face {
                                        font-family: 'Noto Sans';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-stretch: 100%;
                                        font-display: swap;
                                        src: url(${props.font_base64_url[9]}) format('woff2');
                                        unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
                                    }
                                    /* latin */
                                    @font-face {
                                        font-family: 'Noto Sans';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-stretch: 100%;
                                        font-display: swap;
                                        src: url(${props.font_base64_url[10]}) format('woff2');
                                        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                                    }`:''
                                }`;
    /**
    * @name component
    * @description Component
    * @function
    * @param {{ data:       {start:boolean,
    *                        ui:boolean},
    *           methods:    null
    *      }} props 
    * @returns {Promise.<string>}
    */
    const component = async props =>{
        props;
        const common_app_id = server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_COMMON_APP_ID.default)??1;
        const font_urls =[
            //Fontawesome fonts
            '/common/modules/fontawesome/webfonts/fa-regular-400.woff2',
            '/common/modules/fontawesome/webfonts/fa-solid-900.woff2',
            '/common/modules/fontawesome/webfonts/fa-brands-400.woff2',
            //Noto Sans 400 fonts
            '/common/css/font/notosans/v35/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aPdu2ui.woff2',
            '/common/css/font/notosans/v35/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5ardu2ui.woff2',
            '/common/css/font/notosans/v35/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a_du2ui.woff2',
            '/common/css/font/notosans/v35/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aLdu2ui.woff2',
            '/common/css/font/notosans/v35/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a3du2ui.woff2',
            '/common/css/font/notosans/v35/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aHdu2ui.woff2',
            '/common/css/font/notosans/v35/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aDdu2ui.woff2',
            '/common/css/font/notosans/v35/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a7duw.woff2'
        ]
        const font_base64_url = [];
        for (const url of font_urls)
            font_base64_url.push((await server.app_common.commonResourceFile({ 
                                        app_id:common_app_id, 
                                        resource_id:url,
                                        content_type:'font/woff2', 
                                        data_app_id:common_app_id})).result.resource)

        return template({   font_base64_url:font_base64_url,
                            font_urls_start: props.data.start,
                            font_urls_ui: props.data.ui
        });
    };
    export default component;