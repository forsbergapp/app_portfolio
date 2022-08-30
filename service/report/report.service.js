const puppeteer = require('puppeteer');
module.exports = {
    getReportService: async (url, ps, hf) => {
        const browser = await puppeteer.launch({
            pipe:true,
            headless: true,
            ignoreHTTPSErrors: true,
            args: [ '--ignore-certificate-errors',
                    '--disable-gpu']
        });
        const webPage = await browser.newPage();
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
        await browser.close();
        return pdf;
    }
}