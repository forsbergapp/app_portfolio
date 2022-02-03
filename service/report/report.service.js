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