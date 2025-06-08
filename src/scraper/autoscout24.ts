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
    await page.goto(searchUrl)
    await page.screenshot({path: 'screenshot.png'});

    //get Data
    let data = [];
    try {
    await page.waitForSelector('.list-page-item', { timeout: 10000 });

    data = await page.evaluate(() => {
    const carList = document.querySelectorAll('.list-page-item');
    const results: any[] = [];

    carList.forEach((car) => {
      const title1 = car.querySelector('a.ListItem_title__znV2I h2')?.textContent || '';
      const title2 = car.querySelector('span.ListItem_version__jNjur')?.textContent || '';
      const title = title1 + ' ' + title2;
      const price = car.querySelector('.Price_price__WZayw')?.textContent || '';
      const linkRedirect = car.querySelector('a.ListItem_title__znV2I')?.getAttribute('href') || '';
      const link = 'https://www.autoscout24.de' + linkRedirect;
      const km = car.querySelectorAll('.VehicleDetailTable_item__koEV4')[0]?.textContent || '';
      const year = car.querySelectorAll('.VehicleDetailTable_item__koEV4')[1]?.textContent || '';
      const imgSrcRaw = car.querySelector('.NewGallery_img__bi92g')?.getAttribute('src') || '';
      const imgSrc = imgSrcRaw.replace(/\/\d+x\d+\.webp$/, '');

      results.push({ title, price, km, year, link, imgSrc });
    });

    return results;
  });
} catch (err) {
  console.error('Error inside page.evaluate():', err);
}


    // console.log(data);


    await browser.close();
    return data;
}

// Function to mock sample data for testing purposes
export function scrapeAutoscout24Data(make: string, model: string): any[] {
    return [
        {         
            title: 'Toyota Yaris 1.5 Hybrid',
            price: '15.000 €',
            km: '50.000 km',
            year: '2019',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/ce513215-e90b-4399-9076-4b462b9725da_23f05848-02e2-4fe3-ae22-daf7448dbe1f.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/toyota-yaris-1-5-hybrid-city-cvt-116ps-kamera-klimaaut-elektro-benzin-gruen-93bde3d1-1dad-437d-91e2-dd079b7eca65?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=3&position=3&search_id=rzeps22o2f&source_otp=t50&ap_tier=t50&source=listpage_search-results&order_bucket=5&new_taxonomy_available=false&boosting_product=mia&relevance_adjustment=boost&applied_boost_level=t50&boost_level=t50'
        },
        {
            title: 'Toyota Yaris 1.0',
            price: '10.000 €',
            km: '30.000 km',
            year: '2020',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/15daf6c4-53ee-4686-bf8b-2343adc4eca6_22ac28d8-445e-4b29-a06b-f4f2bff80f9f.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/toyota-yaris-yaris-1-6-turbo-gr-high-performance-benzin-schwarz-15daf6c4-53ee-4686-bf8b-2343adc4eca6?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=5&position=5&search_id=rzeps22o2f&source_otp=t30&ap_tier=t30&source=listpage_search-results&order_bucket=4&new_taxonomy_available=false&boosting_product=ppp&relevance_adjustment=boost&applied_boost_level=t30&boost_level=t30'
        },
        {
            title: 'Toyota Yaris 1.5 Hybrid',
            price: '14.000 €',
            km: '40.000 km',
            year: '2018',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/b8b500be-549f-4b4f-96cd-81241dabb7b9_8791da86-7c75-4dc0-80ee-ff7efc6305fd.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/toyota-yaris-1-0-vvt-i-benzin-grau-b8b500be-549f-4b4f-96cd-81241dabb7b9?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=7&position=7&search_id=rzeps22o2f&source_otp=t10&ap_tier=t10&source=listpage_search-results&order_bucket=2&new_taxonomy_available=false&boosting_product=none&relevance_adjustment=organic&applied_boost_level=t10&boost_level=t10'
        },
        {
            title: 'Toyota Yaris 1.0',
            price: '12.000 €',
            km: '20.000 km',
            year: '2021',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/848e7493-40b9-48ba-a794-eb7ad5ffebf7_15c63c1b-c9bf-4a2b-b1c2-57d1651a9eb4.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/toyota-yaris-1-0-vvt-i-active-benzin-rot-848e7493-40b9-48ba-a794-eb7ad5ffebf7?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=9&position=9&search_id=rzeps22o2f&source_otp=t10&ap_tier=t10&source=listpage_search-results&order_bucket=2&new_taxonomy_available=false&boosting_product=none&relevance_adjustment=organic&applied_boost_level=t10&boost_level=t10'
        },
        {
            title: 'Audi A4 2.0 TDI S tronic',
            price: '18.500 €',
            km: '60.000 km',
            year: '2018',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/a9837a5b-b8fc-4c71-b792-88d338efc9c8_2e24e388-6a58-431c-a55f-a24a3df3a7b2.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/audi-a4-2-0-tdi-quattro-s-line-sport-diesel-schwarz-a9837a5b-b8fc-4c71-b792-88d338efc9c8?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=3&position=3&search_id=151hpr42ib&source_otp=t50&ap_tier=t50&source=listpage_search-results&order_bucket=5&new_taxonomy_available=true&boosting_product=mia&relevance_adjustment=boost&applied_boost_level=t50&boost_level=t50'
        },
        {
            title: 'Audi A4 1.4 TFSI',
            price: '16.000 €',
            km: '70.000 km',
            year: '2017',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/cf469175-0266-4d5f-b2c0-ca66d71db3aa_c9333a85-619e-4c2e-8396-96f96afa0be4.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/audi-a4-40-tdi-quattro-diesel-weiss-cf469175-0266-4d5f-b2c0-ca66d71db3aa?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=5&position=5&search_id=151hpr42ib&source_otp=t50&ap_tier=t50&source=listpage_search-results&order_bucket=5&new_taxonomy_available=true&boosting_product=mia&relevance_adjustment=boost&applied_boost_level=t50&boost_level=t50'
        },
        {
            title: 'Audi A4 Avant 2.0 TDI quattro',
            price: '21.900 €',
            km: '50.000 km',
            year: '2019',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/a8031d85-f638-4b00-b409-b017b6e8e464_1fedd4a4-dfc6-4f4c-8c6f-9bf77b8de74f.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/audi-a4-av-35-tdi-s-tr-s-line-ahk-navi-sitzh-phonebo-diesel-schwarz-a8031d85-f638-4b00-b409-b017b6e8e464?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=7&position=7&search_id=151hpr42ib&source_otp=t50&ap_tier=t50&source=listpage_search-results&order_bucket=5&new_taxonomy_available=true&boosting_product=mia&relevance_adjustment=boost&applied_boost_level=t50&boost_level=t50'
        },
        {
            title: 'Audi A4 2.0 TFSI S line',
            price: '19.500 €',
            km: '55.000 km',
            year: '2018',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/e15e4027-6a42-4d76-b3e0-f511382c3ef4_4049cc65-ffec-484e-ad52-f2366e58f169.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/audi-a4-avant-35-tdi-s-tronic-dab-led-klimaaut-pdc-diesel-schwarz-e15e4027-6a42-4d76-b3e0-f511382c3ef4?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=11&position=11&search_id=151hpr42ib&source_otp=t50&ap_tier=t50&source=listpage_search-results&order_bucket=5&new_taxonomy_available=true&boosting_product=mia&relevance_adjustment=boost&applied_boost_level=t50&boost_level=t50'
        },
        {
            title: 'BMW X3 xDrive20d',
            price: '25.000 €',
            km: '80.000 km',
            year: '2018',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/c49a339f-04f9-4509-baf9-5cb145e48b65_e635f759-272c-4b03-a4f8-43a1f736bf26.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/bmw-x3-xdrive-20d-48v-aut-m-sport-lci-facelift-diesel-grau-c49a339f-04f9-4509-baf9-5cb145e48b65?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=3&position=3&search_id=d3sqhbxdsc&source_otp=t50&ap_tier=t50&source=listpage_search-results&order_bucket=5&new_taxonomy_available=true&boosting_product=mia&relevance_adjustment=boost&applied_boost_level=t50&boost_level=t50'
        },
        {
            title: 'BMW X3 sDrive18d',
            price: '22.500 €',
            km: '70.000 km',
            year: '2017',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/fdd1c3d3-a55b-45d0-9694-9f74ada57354_c5741c41-70fc-41d6-9e83-fda892f164f6.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/bmw-x3-xdrive30d-m-sport-mwst-diesel-schwarz-fdd1c3d3-a55b-45d0-9694-9f74ada57354?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=4&position=4&search_id=d3sqhbxdsc&source_otp=t50&ap_tier=t50&source=listpage_search-results&order_bucket=5&new_taxonomy_available=true&boosting_product=mia&relevance_adjustment=boost&applied_boost_level=t50&boost_level=t50'
        },
        {
            title: 'BMW X3 xDrive30i M Sport',
            price: '32.000 €',
            km: '40.000 km',
            year: '2020',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/e961c284-edfd-454a-b592-15fbebff88af_a065395f-e3c4-4b0e-814f-5dadfb81fe0b.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/bmw-x3-x3-xdrive-20d-diesel-schwarz-e961c284-edfd-454a-b592-15fbebff88af?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=6&position=6&search_id=d3sqhbxdsc&source_otp=t50&ap_tier=t50&source=listpage_search-results&order_bucket=5&new_taxonomy_available=true&boosting_product=mia&relevance_adjustment=boost&applied_boost_level=t50&boost_level=t50'
        },
        {
            title: 'BMW X3 xDrive20i',
            price: '28.000 €',
            km: '45.000 km',
            year: '2019',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/fd632bd8-6888-499c-84a4-547c69ff3ef9_1042c3db-480b-495c-8419-e0addb8aa735.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/bmw-x3-xdrive25d-aut-m-sport-navipro-head-up-kamera-ke-diesel-schwarz-fd632bd8-6888-499c-84a4-547c69ff3ef9?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=17&position=17&search_id=d3sqhbxdsc&source_otp=t30&ap_tier=t30&source=listpage_search-results&order_bucket=5&new_taxonomy_available=true&boosting_product=mia&relevance_adjustment=boost&applied_boost_level=t30&boost_level=t30'
        },
        {
            title: 'Toyota Supra 3.0 GR',
            price: '45.000 €',
            km: '25.000 km',
            year: '2020',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/c236ed00-e401-48df-b9ae-95d831e2cfc9_2ab9b974-c762-4f88-8e5e-2cf19bca379f.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/toyota-supra-gr-3-0-aut-benzin-schwarz-c236ed00-e401-48df-b9ae-95d831e2cfc9?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=2&position=2&search_id=w9rdkfc9r6&source_otp=t10&ap_tier=t10&source=listpage_search-results&order_bucket=2&new_taxonomy_available=false&boosting_product=none&relevance_adjustment=organic&applied_boost_level=t10&boost_level=t10'
        },
        {
            title: 'Toyota Supra 2.0 Turbo',
            price: '39.000 €',
            km: '15.000 km',
            year: '2021',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/8309d5c6-c025-47f2-9692-ab567af54135_5e587bfa-3509-4311-a3a4-32ea9783e74e.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/toyota-supra-gr-3-0-lightweight-fittipaldi-champion-edition-benzin-gelb-8309d5c6-c025-47f2-9692-ab567af54135?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=3&position=3&search_id=w9rdkfc9r6&source_otp=t10&ap_tier=t10&source=listpage_search-results&order_bucket=2&new_taxonomy_available=false&boosting_product=none&relevance_adjustment=organic&applied_boost_level=t10&boost_level=t10'
        },
        {
            title: 'Toyota Supra 3.0 Premium',
            price: '48.500 €',
            km: '10.000 km',
            year: '2022',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/a826e67d-6b46-403e-ac41-41cb62721f97_a54980dc-1715-4e6a-8d5d-47c0e695bd10.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/toyota-supra-gr-3-0-legend-benzin-grau-a826e67d-6b46-403e-ac41-41cb62721f97?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=5&position=5&search_id=w9rdkfc9r6&source_otp=t10&ap_tier=t10&source=listpage_search-results&order_bucket=2&new_taxonomy_available=false&boosting_product=none&relevance_adjustment=organic&applied_boost_level=t10&boost_level=t10'
        },
        {
            title: 'Toyota Supra Launch Edition',
            price: '50.000 €',
            km: '5.000 km',
            year: '2019',
            imgSrc: 'https://prod.pictures.autoscout24.net/listing-images/02ae9957-68fc-4e1d-be06-211fcda132ba_7a537f33-ea5b-419a-b0fe-91c994a5a5e9.jpg/480x360.webp',
            link: 'https://www.autoscout24.at/angebote/toyota-supra-mk4-3-0-benzin-weiss-02ae9957-68fc-4e1d-be06-211fcda132ba?sort=standard&desc=0&lastSeenGuidPresent=true&cldtidx=7&position=7&search_id=w9rdkfc9r6&source_otp=t10&ap_tier=t10&source=listpage_search-results&order_bucket=2&new_taxonomy_available=false&boosting_product=none&relevance_adjustment=organic&applied_boost_level=t10&boost_level=t10'
        }
    ];
}

function transformModelString(model: string) {
    return model.replace(/\s/g, '-').toLowerCase();
}
/* 
scrapeAutoscout24("toyota", "yaris"); */