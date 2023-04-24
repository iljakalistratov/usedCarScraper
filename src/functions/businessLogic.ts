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

export async function mainLogicSpecificUser(chatID: number){
    const fs = require('fs');
    const path = require('path');
    const preferences = JSON.parse(fs.readFileSync(path.join(__dirname, '../databases/preferences.json')));

    //search for obejct with given chatID in preferences
    //if object found, get time_period_in_sec and cars
    //if not found create new object with chatID and time_period_in_sec and cars
    const userPreferences = preferences.find((preference: { chat_id: number; }) => preference.chat_id === chatID);

    if (userPreferences) {
        const timePeriod = userPreferences.time_period_in_sec;
        const cars = userPreferences.cars;

        for (const car of cars) {
            const allNewCarAds = await getAllNewCarAds(car.make, car.model);
            sendAds(chatID, allNewCarAds);
        }

        setTimeout(mainLogicSpecificUser, timePeriod * 1000, chatID)
    }
    else {
        
        const newPreference = {
            chat_id: chatID,
            time_period_in_sec: 60,
            cars: [
            ]
        }

        preferences.push(newPreference);
        const json = JSON.stringify(preferences, null, 2);
        fs.writeFileSync(path.join(__dirname, '../databases/preferences.json'), json);

        setTimeout(mainLogicSpecificUser, 60 * 1000, chatID)
    }

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


