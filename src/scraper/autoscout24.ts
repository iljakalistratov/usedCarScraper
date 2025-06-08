// const puppeteer = require('puppeteer');


// export async function scrapeAutoscout24(make: string, model: string) {

//     const transformedModel = transformModelString(model);

//     const baseUrl = 'https://www.autoscout24.de';
//     const searchUrl = baseUrl + '/lst/' + make + '/' + transformedModel + '?atype=C&cy=D&damaged_listing=exclude&desc=1&ocs_listing=include&powertype=kw&search_id=27ose429ogr&sort=age&ustate=N%2CU';
    

//     const browser = await puppeteer.launch({
//         args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });
//     console.log(await browser.version());
//     const page = await browser.newPage();
//     await page.setViewport({ width: 1280, height: 12000 });
//     await page.goto(searchUrl)
//     await page.screenshot({path: 'screenshot.png'});

//     //get Data
//     let data = [];
//     try {
//     await page.waitForSelector('.list-page-item', { timeout: 10000 });

//     data = await page.evaluate(() => {
//     const carList = document.querySelectorAll('.list-page-item');
//     const results: any[] = [];

//     carList.forEach((car) => {
//       const title1 = car.querySelector('a.ListItem_title__znV2I h2')?.textContent || '';
//       const title2 = car.querySelector('span.ListItem_version__jNjur')?.textContent || '';
//       const title = title1 + ' ' + title2;
//       const price = car.querySelector('.Price_price__WZayw')?.textContent || '';
//       const linkRedirect = car.querySelector('a.ListItem_title__znV2I')?.getAttribute('href') || '';
//       const link = 'https://www.autoscout24.de' + linkRedirect;
//       const km = car.querySelectorAll('.VehicleDetailTable_item__koEV4')[0]?.textContent || '';
//       const year = car.querySelectorAll('.VehicleDetailTable_item__koEV4')[1]?.textContent || '';
//       const imgSrcRaw = car.querySelector('.NewGallery_img__bi92g')?.getAttribute('src') || '';
//       const imgSrc = imgSrcRaw.replace(/\/\d+x\d+\.webp$/, '');

//       results.push({ title, price, km, year, link, imgSrc });
//     });

//     return results;
//   });
// } catch (err) {
//   console.error('Error inside page.evaluate():', err);
// }


//     // console.log(data);


//     await browser.close();
//     return data;
// }

// Function to mock sample data for testing purposes
export function scrapeAutoscout24Data(make: string, model: string): any[] {
    return [
        {         
            title: 'Toyota Yaris 1.5 Hybrid',
            price: '15.000 €',
            km: '50.000 km',
            year: '2019',
            link: 'https://www.autoscout24.de/angebote/toyota-yaris-1-5-hybrid-2019',
            imgSrc: 'https://example.com/toyota-yaris.jpg'
        },
        {
            title: 'Toyota Yaris 1.0',
            price: '10.000 €',
            km: '30.000 km',
            year: '2020',
            link: 'https://www.autoscout24.de/angebote/toyota-yaris-1-0-2020',
            imgSrc: 'https://example.com/toyota-yaris-1-0.jpg'
        },
        {
            title: 'Toyota Yaris 1.5 Hybrid',
            price: '14.000 €',
            km: '40.000 km',
            year: '2018',
            link: 'https://www.autoscout24.de/angebote/toyota-yaris-1-5-hybrid-2018',
            imgSrc: 'https://example.com/toyota-yaris-1-5-hybrid.jpg'
        },
        {
            title: 'Toyota Yaris 1.0',
            price: '12.000 €',
            km: '20.000 km',
            year: '2021',
            link: 'https://www.autoscout24.de/angebote/toyota-yaris-1-0-2021',
            imgSrc: 'https://example.com/toyota-yaris-1-0-2021.jpg'
        }
    ];
}

function transformModelString(model: string) {
    return model.replace(/\s/g, '-').toLowerCase();
}
/* 
scrapeAutoscout24("toyota", "yaris"); */