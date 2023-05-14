const puppeteer = await import('puppeteer');

let BROWSER;
const ConfigGet = async (parameter)=>{
    const fs = await import('node:fs');
    let CONFIG = await fs.promises.readFile(`${process.cwd()}/service/pdf/config/config.json`, 'utf8');
    CONFIG = JSON.parse(CONFIG)['PDF'];
    for (let row of CONFIG){
        for (let key in row)
            if (key == parameter)
                return row[key];
    }
    return null;
}
const initPDFService = async () => {
    if (!BROWSER)
        BROWSER = await puppeteer.launch({  pipe:true,
                                            headless: true,
                                            executablePath: await ConfigGet('EXECUTABLE_PATH'),
                                            ignoreHTTPSErrors: true,
                                            ignoreDefaultArgs: ['--enable-automation'],
                                            args: [ '--ignore-certificate-errors',
                                                    '--disable-gpu',
                                                    '--disable-3d-apis',
                                                    '--disable-accelerated-video',
                                                    '--disable-background-mode',
                                                    '--disable-plugins',
                                                    '--disable-plugins-discovery',
                                                    '--disable-preconnect',
                                                    '--disable-translate',
                                                    '--dns-prefetch-disable',
                                                    '--no-experiments',
                                                    '--no-pings',
                                                    '--disable-audio-input',
                                                    '--disable-audio-output',
                                                    '--disable-background-networking',
                                                    '--disable-breakpad',
                                                    '--disable-component-update',
                                                    '--disable-crash-reporter',
                                                    '--disable-databases',
                                                    '--disable-demo-mode',
                                                    '--disable-extensions',
                                                    '--disable-file-system',
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
                                                    '--disable-speech-api',
                                                    '--disable-system-font-check',
                                                    '--disable-test-root-certs',
                                                    '--disable-touch-drag-drop',
                                                    '--disable-webgl',
                                                    '--no-default-browser-check',
                                                    '--hide-crash-restore-bubble',
                                                    '--user-data-dir=' + process.cwd() + await ConfigGet('TMP_DIR')]
        }).catch(error=>{
            console.log(error);
            throw error;
        })
}

const getPDF = async (message) => {
    await initPDFService()
    .catch(error=>{
        reject(error)
    })
    let user_agent = await ConfigGet('USER_AGENT');
    let accept_language = await ConfigGet('ACCEPT_LANGUAGE');
    let pdf_timeout = await ConfigGet('PDF_TIMEOUT');
    let a4_width_viewport = await ConfigGet('A4_WIDTH_VIEWPORT');
    let a4_height_viewport = await ConfigGet('A4_HEIGHT_VIEWPORT');
    let letter_width_viewport = ConfigGet('LETTER_WIDTH_VIEWPORT');;
    let letter_height_viewport = ConfigGet('LETTER_HEIGHT_VIEWPORT');
    let device_scalefactor = await ConfigGet('DEVICE_SCALEFACTOR');
    let margin_top = await ConfigGet('MARGIN_TOP');
    let margin_bottom = await ConfigGet('MARGIN_BOTTOM');
    let margin_left = await ConfigGet('MARGIN_LEFT');
    let margin_right = await ConfigGet('MARGIN_RIGHT');
    let pdf_empty_sizecheck = await ConfigGet('PDF_EMPTY_SIZE_CHECK');
    let pdf_wait_attempts = await ConfigGet('PDF_WAIT_ATTEMPTS');
    let pdf_wait_interval = await ConfigGet('PDF_WAIT_INTERVAL');
    return await new Promise((resolve, reject) => {
        BROWSER.newPage().then((webPage) => {
            webPage.setRequestInterception(true).then(()=>{
                webPage.on('request', interceptedRequest => {
                    let data = {
                        'headers': {
                            ...interceptedRequest.headers(),
                            'User-Agent': user_agent,
                            'Accept-Language': accept_language
                        },
                    };
                    interceptedRequest.continue(data);
                });

                webPage.goto(message.url, {
                    waitUntil: ['networkidle2'],
                    timeout: pdf_timeout,
                }).then(() => {
                    let width_viewport;
                    let height_viewport;
                    if (message.ps=='A4'){
                        width_viewport = a4_width_viewport;
                        height_viewport = a4_height_viewport;
                        }
                    if (message.ps=='Letter'){
                        width_viewport = letter_width_viewport;
                        height_viewport = letter_height_viewport;
                    }
                    webPage.setViewport({width:             width_viewport,
                                        height:             height_viewport,
                                        deviceScaleFactor:  device_scalefactor,
                                        }).then(() => {
                    let wait_count=0;
                    const waitpdf = () => {
                        setTimeout(() => {
                            wait_count++;
                            webPage.pdf({   printBackground:        true,
                                            format:                 message.ps,
                                            displayHeaderFooter:    message.hf,
                                            margin: {   top:    margin_top,
                                                        bottom: margin_bottom,
                                                        left:   margin_left,
                                                        right:  margin_right
                                            }}).then((pdf) => {
                                                    if (pdf.toString().length < pdf_empty_sizecheck)
                                                        //try PDF_WAIT_ATTEMPTS * PDF_WAIT_INTERVAL = total time
                                                        //ex. 20 * 500 = 10 seconds
                                                        if (wait_count> pdf_wait_attempts)
                                                            resolve(null);
                                                        else{
                                                            //continue recursive call until PDF created with content
                                                            waitpdf();
                                                        }
                                                    else
                                                        webPage.close().then(() => {
                                                            //if closing browser and not only page:
                                                            //BROWSER.close();
                                                            resolve(pdf);
                                                        });
                                                    });    
                        }, pdf_wait_interval);
                    }
                    waitpdf();
                    })
                })
                .catch(error=>{
                    reject(error)
                })
            })
        })
    })
}
export{getPDF};