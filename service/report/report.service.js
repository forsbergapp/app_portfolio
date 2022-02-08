const puppeteer = require('puppeteer');
module.exports = {
    getReportService: async (html, url, ps, hf) => {
        const browser = await puppeteer.launch({
            headless: true,
            args: [ '--ignore-certificate-errors' ]
        });
        const webPage = await browser.newPage();
        if (html!='')
            await  webPage.setContent(html, {waitUntil: 'networkidle0'}); 
        else
            await webPage.goto(url, {
                    timeout: 12000,
                    waitUntil: "networkidle0"
                });
        
        if (ps=='A4'){
            //https://pixelsconverter.com/a-paper-sizes-to-pixels
            //72DPI
            await webPage.setViewport({
                        width: 595,
                        height: 842,
                        deviceScaleFactor: 1,
                    });
        }
        if (ps=='Letter'){
            //https://pixelsconverter.com/us-paper-sizes-to-pixels
            //72DPI
            await webPage.setViewport({
                        width: 612,
                        height: 791,
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
        await browser.close();
        return pdf;
    }
}