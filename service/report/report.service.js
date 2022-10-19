const puppeteer = require('puppeteer');
global.browser;
async function initReportService(){
    global.browser = await puppeteer.launch({
        pipe:true,
        headless: true,
        ignoreHTTPSErrors: true,
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
                '--user-data-dir=' + __dirname + '/tmp']
    });
    
};

module.exports = {
    getReportService: async (url, ps, hf) => {
        if (!global.browser)
            await initReportService();
        const webPage = await global.browser.newPage();
        await webPage.goto(url, {
                timeout: 20000,
                waitUntil: "networkidle2"
            });
        
        if (ps=='A4'){
            //https://pixelsconverter.com/a-paper-sizes-to-pixels
            //96DPI
            await webPage.setViewport({
                        width: 794,
                        height: 1123,
                        deviceScaleFactor: 1,
                    });
        }
        if (ps=='Letter'){
            //https://pixelsconverter.com/us-paper-sizes-to-pixels
            //96DPI
            await webPage.setViewport({
                        width: 816,
                        height: 1054,
                        deviceScaleFactor: 1,
                    });
        }
        const pdf = await webPage.pdf({
            printBackground: true,
            format: ps,
            displayHeaderFooter: hf,
            margin: {
                top: "0px",
                bottom: "0px",
                left: "0px",
                right: "0px"
            }
        });
        await webPage.close();
        //await global.browser.close();
        return pdf;
    }
}