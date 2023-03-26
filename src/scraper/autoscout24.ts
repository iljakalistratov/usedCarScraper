const puppeteer = require('puppeteer');


(async() => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log(await browser.version());
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 12000 });
    await page.goto('https://www.autoscout24.de/lst/toyota/celica?atype=C&cy=D&damaged_listing=exclude&desc=1&ocs_listing=include&powertype=kw&search_id=27ose429ogr&sort=age&ustate=N%2CU')
    await page.screenshot({path: 'screenshot.png'});

    //get Data
    const data = await page.evaluate(() => {
        const results: any[] = [];

        const carList = document.querySelectorAll('.list-page-item');

        return Array.from(carList).map((car) => {
            const title1 = (car.querySelector('a.ListItem_title__znV2I h2') as HTMLElement)?.innerText;
            const title2 = " " + (car.querySelector('span.ListItem_version__jNjur') as HTMLElement)?.innerText;
            const title = title1 + title2;
            const price = (car.querySelector('.Price_price__WZayw') as HTMLElement)?.innerText;
            const link = (car.querySelector('a.ListItem_title__znV2I') as HTMLElement)?.getAttribute('href');
            const km = (car.querySelectorAll('.VehicleDetailTable_item__koEV4')?.[0] as HTMLElement)?.innerText;
            const year = (car.querySelectorAll('.VehicleDetailTable_item__koEV4')?.[1] as HTMLElement)?.innerText;
            const imgSrc = (car.querySelector('.NewGallery_img__bi92g') as HTMLElement)?.getAttribute('src');
            // console.log({ title, price, km, year, link, imgSrc });
            results.push({ title, price, km, year, link, imgSrc });
            return results;
          });

        //console log entries of data
        // console.log(data);

        if(carList){
        }
        else {
            console.log('No cars found');
            return [];
        }


    });

    console.log(data);


    await browser.close();
})();