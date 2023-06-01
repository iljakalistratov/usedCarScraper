const puppeteer = require('puppeteer');


export async function scrapeAutoscout24(make: string, model: string) {

    const transformedModel = transformModelString(model);

    const baseUrl = 'https://www.autoscout24.de';
    const searchUrl = baseUrl + '/lst/' + make + '/' + transformedModel + '?atype=C&cy=D&damaged_listing=exclude&desc=1&ocs_listing=include&powertype=kw&search_id=27ose429ogr&sort=age&ustate=N%2CU';
    

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log(await browser.version());
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 12000 });
    await page.goto(searchUrl,)
    await page.screenshot({path: 'screenshot.png'});

    //get Data
    const data = await page.evaluate(() => {
        const carList = document.querySelectorAll('.list-page-item');
        const results: any[] = [];
    
        Array.from(carList).forEach((car) => {
            const title1 = (car.querySelector('a.ListItem_title__znV2I h2') as HTMLElement)?.innerText;
            const title2 = (car.querySelector('span.ListItem_version__jNjur') as HTMLElement)?.innerText;
            const title = title1 + title2;
            const price = (car.querySelector('.Price_price__WZayw') as HTMLElement)?.innerText;
            const linkRedirect = (car.querySelector('a.ListItem_title__znV2I') as HTMLElement)?.getAttribute('href');
            const link = 'https://www.autoscout24.de' + linkRedirect;
            const km = (car.querySelectorAll('.VehicleDetailTable_item__koEV4')?.[0] as HTMLElement)?.innerText;
            const year = (car.querySelectorAll('.VehicleDetailTable_item__koEV4')?.[1] as HTMLElement)?.innerText;
            const imgSrc = (car.querySelector('.NewGallery_img__bi92g') as HTMLElement)?.getAttribute('src')?.replace(/\/\d+x\d+\.webp$/,'');

            results.push({ title, price, km, year, link, imgSrc });
        });
    
        return results;
        });


    // console.log(data);


    await browser.close();
    return data;
}

function transformModelString(model: string) {
    return model.replace(/\s/g, '-').toLowerCase();
}