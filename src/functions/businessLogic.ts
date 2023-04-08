import { CarAd } from '../models/CarAd';
import { scrapeAutoscout24 } from '../scraper/autoscout24';
import { scrapeEbayKl } from '../scraper/ebayKl';
import { sendAds } from '../functions/telegramNotificator'



export async function mainLogic(){

    const fs = require('fs');
    const path = require('path');
    const preferences = JSON.parse(fs.readFileSync(path.join(__dirname, '../databases/preferences.json')));
    const timePeriod = preferences[0].time_period_in_sec;
    const chatId = preferences[0].chat_id;
    const cars = preferences[0].cars;

    for (const car of cars) {
        const allNewCarAds = await getAllNewCarAds(car.make, car.model);
        sendAds(chatId, allNewCarAds);
    }

    // const scrapedCarAds = await scrapeAutoscout24('toyota', 'celica');
    // const scrapedCarAds2 = await scrapeEbayKl('celica')
    // const carAds = mapToCarAds(scrapedCarAds);
    // const carAds2 = mapToCarAds(scrapedCarAds2);
    // const newCarAds = getNewAds(carAds);
    // const newCarAds2 = getNewAds(carAds2);
    // const allNewCarAds = [...newCarAds, ...newCarAds2];

    // sendAds(allNewCarAds);

    // const allNewCarAds = await getAllNewCarAds('toyota', 'celica');
    // sendAds(chatId, allNewCarAds);


    setTimeout(mainLogic, timePeriod * 1000)

}

async function getAllNewCarAds(make: string, model:string): Promise<CarAd[]> {

    const scrapedCarAds = await scrapeAutoscout24(make, model);
    const scrapedCarAds2 = await scrapeEbayKl(model)
    const carAds = mapToCarAds(scrapedCarAds);
    const carAds2 = mapToCarAds(scrapedCarAds2);
    const newCarAds = getNewAds(carAds);
    const newCarAds2 = getNewAds(carAds2);
    const allNewCarAds = [...newCarAds, ...newCarAds2];

    return allNewCarAds;

}


function mapToCarAds(scrapedCarAds: any[]): CarAd[] { 

    return scrapedCarAds.map((carAd) => {
        return {
            title: carAd.title,
            price: carAd.price,
            km: carAd.km,
            year: carAd.year,
            link: carAd.link,
            imgSrc: carAd.imgSrc
        }
    })

}

function getNewAds(carAds: CarAd[]): CarAd[] {

    const fs = require('fs');
    const path = require('path');

    const filePath = path.join(__dirname, '../databases/carAdDatabase.json');

    let jsonData: CarAd[] = [];
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      jsonData = JSON.parse(fileData);
    } catch (err) {
      // ignore error if file does not exist yet
    }
  
    const existingLinks = new Set(jsonData.map(ad => ad.link));
    const newCarAds = carAds.filter(ad => !existingLinks.has(ad.link));
    if (newCarAds.length === 0) {
      // nothing to add, return early
      return [];
    }
    else {
        jsonData = [...jsonData, ...newCarAds];
        const json = JSON.stringify(jsonData, null, 2);
        fs.writeFileSync(filePath, json);

        return newCarAds;
    }
  
}


