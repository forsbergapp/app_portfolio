const puppeteer = require('puppeteer');
global.browser;
async function initReportService(){
    global.browser = await puppeteer.launch({
        pipe:true,
        headless: true,
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
                '--user-data-dir=' + __dirname + '/tmp']
    });
    
};

module.exports = {
    getReportService: async (url, ps, hf) => {
        if (!global.browser)
            await initReportService();
        return await new Promise(function (resolve){
            global.browser.newPage().then(function(webPage){
                webPage.goto(url, {
                    waitUntil: "networkidle2",
                    timeout: process.env.SERVICE_REPORT_PDF_TIMEOUT,
                }).then(function(){
                    let width_viewport;
                    let height_viewport;
                    if (ps=='A4'){
                        //https://pixelsconverter.com/a-paper-sizes-to-pixels
                        //96DPI
                        width_viewport = 794;
                        height_viewport = 1123;
                        }
                    if (ps=='Letter'){
                        //https://pixelsconverter.com/us-paper-sizes-to-pixels
                        //96DPI
                        width_viewport = 816;
                        height_viewport = 1054;
                    }
                    webPage.setViewport({width: width_viewport,
                                        height: height_viewport,
                                        deviceScaleFactor: 1,
                                        }).then(function(){
                        setTimeout(() => {
                            webPage.pdf({   printBackground: true,
                                format: ps,
                                displayHeaderFooter: hf,
                                margin: {
                                    top: "0px",
                                    bottom: "0px",
                                    left: "0px",
                                    right: "0px"
                                }}).then(function(pdf){
                                            webPage.close().then(function(){
                                                //global.browser.close();
                                                resolve(pdf);
                                            });
                                        });    
                        }, process.env.SERVICE_REPORT_PDF_DELAY);
                    })
                })
            })
        })
    }
}