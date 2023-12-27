/** @module microservice/pdf */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const puppeteer = await import('puppeteer');
const {CONFIG, ConfigServices} = await import(`file://${process.cwd()}/microservice/microservice.service.js`);

/**@type{*} */
let BROWSER;
/**
 * 
 * @param {string} parameter 
 * @returns {Promise.<string|null>}
 */
const ConfigServiceGet = async (parameter)=>{
    /**@type{Types.microservice_config_service_record}*/
    const config = ConfigServices('PDF');
    for (const row of config.CONFIG){
        for (const key in row)
            if (key == parameter)
                return row[key];
    }
    return null;
};
/**
 * Init PDF service
 */
const initPDFService = async () => {
    if (!BROWSER){
        BROWSER = await puppeteer.launch({  pipe:true,
                                            headless: 'new',
                                            executablePath: await ConfigServiceGet('EXECUTABLE_PATH') ?? '',
                                            ignoreHTTPSErrors: true,
                                            ignoreDefaultArgs: ['--enable-automation'],
                                            args: [ '--disable-3d-apis',
                                                    '--disable-accelerated-video',
                                                    '--disable-audio-input',
                                                    '--disable-audio-output',
                                                    '--disable-background-mode',
                                                    '--disable-background-networking',
                                                    '--disable-breakpad',
                                                    '--disable-component-update',
                                                    '--disable-crash-reporter',
                                                    '--disable-databases',
                                                    '--disable-demo-mode',
                                                    '--disable-extensions',
                                                    '--disable-file-system',
                                                    '--disable-gpu',
                                                    '--disable-ios-password-suggestions',
                                                    '--disable-lcd-text',
                                                    '--disable-local-storage',
                                                    '--disable-logging',
                                                    '--disable-logging-redirect',
                                                    '--disable-loging-animations',
                                                    '--disable-media-sessiona-api',
                                                    '--disable-notifications',
                                                    '--disable-permissions-api',
                                                    '--disable-pinch',
                                                    '--disable-playback-api',
                                                    '--disable-plugins',
                                                    '--disable-plugins-discovery',
                                                    '--disable-preconnect',
                                                    '--disable-speech-api',
                                                    '--disable-system-font-check',
                                                    '--disable-test-root-certs',
                                                    '--disable-touch-drag-drop',
                                                    '--disable-translate',
                                                    '--disable-webgl',
                                                    '--dns-prefetch-disable',
                                                    '--hide-crash-restore-bubble',
                                                    '--ignore-certificate-errors',
                                                    '--no-experiments',
                                                    '--no-default-browser-check',
                                                    '--no-pings',
                                                    '--user-data-dir=' + process.cwd() + CONFIG.PATH_TEMP]
        }).catch(error=>{
            throw error;
        });
    }
};
/**
 * 
 * @param {Types.microservice_data_pdf} url_info
 * @returns 
 */
const getPDF = async (url_info) => {
    await initPDFService()
    .catch(error=>{
        throw error;
    });
    
    const user_agent = await ConfigServiceGet('USER_AGENT');
    const accept_language = await ConfigServiceGet('ACCEPT_LANGUAGE');
    const pdf_timeout = await ConfigServiceGet('PDF_TIMEOUT');
    const a4_width_viewport = await ConfigServiceGet('A4_WIDTH_VIEWPORT');
    const a4_height_viewport = await ConfigServiceGet('A4_HEIGHT_VIEWPORT');
    const letter_width_viewport = ConfigServiceGet('LETTER_WIDTH_VIEWPORT');
    const letter_height_viewport = ConfigServiceGet('LETTER_HEIGHT_VIEWPORT');
    const device_scalefactor = await ConfigServiceGet('DEVICE_SCALEFACTOR');
    const margin_top = await ConfigServiceGet('MARGIN_TOP');
    const margin_bottom = await ConfigServiceGet('MARGIN_BOTTOM');
    const margin_left = await ConfigServiceGet('MARGIN_LEFT');
    const margin_right = await ConfigServiceGet('MARGIN_RIGHT');

    const webPage = await BROWSER.newPage();
    await webPage.setJavaScriptEnabled(true);
    await webPage.setRequestInterception(true);
    /**@ts-ignore */
    webPage.on('request', interceptedRequest => {
        const data = {
            'headers': {
                ...interceptedRequest.headers(),
                'User-Agent': user_agent,
                'Accept-Language': accept_language
            },
        };
        interceptedRequest.continue(data);
    });
    await webPage.goto(url_info.url, {
        waitUntil: ['networkidle2'],
        timeout: pdf_timeout,
    });
    let width_viewport;
    let height_viewport;
    if (url_info.ps=='A4'){
        width_viewport = a4_width_viewport;
        height_viewport = a4_height_viewport;
        }
    if (url_info.ps=='Letter'){
        width_viewport = letter_width_viewport;
        height_viewport = letter_height_viewport;
    }
    await webPage.setViewport({ width:             width_viewport,
                                height:             height_viewport,
                                deviceScaleFactor:  device_scalefactor,
                            });
    const pdf = await webPage.pdf({ printBackground:        true,
                                    format:                 url_info.ps,
                                    displayHeaderFooter:    url_info.hf,
                                    margin: {   top:    margin_top,
                                                bottom: margin_bottom,
                                                left:   margin_left,
                                                right:  margin_right
                                    }});
    return pdf;
};
export{getPDF};