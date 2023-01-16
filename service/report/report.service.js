const puppeteer = await import('puppeteer');
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

let BROWSER;
async function initReportService(){
    //if ConfigGet(1, 'SERVICE_REPORT', 'EXECUTABLE_PATH') is empty then default is used
    BROWSER = await puppeteer.launch({
        pipe:true,
        headless: true,
        executablePath: ConfigGet(1, 'SERVICE_REPORT', 'EXECUTABLE_PATH'),
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
                '--user-data-dir=' + process.cwd() + '/service/report/tmp']
    });
    
};

async function getReportService(url, ps, hf){
    if (!BROWSER)
        await initReportService();
    return await new Promise(function (resolve){
        BROWSER.newPage().then(function(webPage){
            webPage.goto(url, {
                waitUntil: "networkidle2",
                timeout: parseInt(ConfigGet(1, 'SERVICE_REPORT', 'PDF_TIMEOUT')),
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
                let wait_count=0;
                function waitpdf(){
                    setTimeout(() => {
                        wait_count++;
                        webPage.pdf({   printBackground: true,
                            format: ps,
                            displayHeaderFooter: hf,
                            margin: {
                                top: "0px",
                                bottom: "0px",
                                left: "0px",
                                right: "0px"
                            }}).then(function(pdf){
                                    /*  empty string size 883 bytes from Pupeteer and chrome.exe:
                                        %PDF-1.4
                                        %����
                                        1 0 obj
                                        <</Creator (Chromium)
                                        /Producer (Skia/PDF m103)
                                        /CreationDate (D:20221021112120+00'00')
                                        /ModDate (D:20221021112120+00'00')>>
                                        endobj
                                        3 0 obj
                                        <</ca 1
                                        /BM /Normal>>
                                        endobj
                                        4 0 obj
                                        <</Filter /FlateDecode
                                        /Length 112>> stream
                                        x�U�1�0Ew���H��	>sY8j3�Tz�IX�����X��a(��� ��>a��C�א�%�6��Z�����QƢ��Bs�SQ*ˌ�93=fC�6sr��jս�Y�RB�
                                        endstream
                                        endobj
                                        2 0 obj
                                        <</Type /Page
                                        /Resources <</ProcSet [/PDF /Text /ImageB /ImageC /ImageI]
                                        /ExtGState <</G3 3 0 R>>>>
                                        /MediaBox [0 0 594.95996 841.91998]
                                        /Contents 4 0 R
                                        /StructParents 0
                                        /Parent 5 0 R>>
                                        endobj
                                        5 0 obj
                                        <</Type /Pages
                                        /Count 1
                                        /Kids [2 0 R]>>
                                        endobj
                                        6 0 obj
                                        <</Type /Catalog
                                        /Pages 5 0 R>>
                                        endobj
                                        xref
                                        0 7
                                        0000000000 65535 f 
                                        0000000015 00000 n 
                                        0000000374 00000 n 
                                        0000000155 00000 n 
                                        0000000192 00000 n 
                                        0000000574 00000 n 
                                        0000000629 00000 n 
                                        trailer
                                        <</Size 7
                                        /Root 6 0 R
                                        /Info 1 0 R>>
                                        startxref
                                        676
                                        %%EOF
                                    */
                                    if (pdf.toString().length < parseInt(ConfigGet(1, 'SERVICE_REPORT', 'PDF_EMPTY_SIZE_CHECK')))
                                        //try ConfigGet(1, 'SERVICE_REPORT', 'PDF_WAIT_ATTEMPTS') * ConfigGet(1, 'SERVICE_REPORT', 'PDF_WAIT_INTERVAL') = total time
                                        //ex. 20 * 500 = 10 seconds
                                        if (wait_count>parseInt(ConfigGet(1, 'SERVICE_REPORT', 'PDF_WAIT_ATTEMPTS')))
                                            resolve(null);
                                        else{
                                            //continue recursive call until PDF created with content
                                            waitpdf();
                                        }
                                    else
                                        webPage.close().then(function(){
                                            //if closing browser and not only page:
                                            //global.browser.close();
                                            resolve(pdf);
                                        });
                                    });    
                    }, parseInt(ConfigGet(1, 'SERVICE_REPORT', 'PDF_WAIT_INTERVAL')));
                }
                waitpdf();
                })
            })
        })
    })
}
export{getReportService};