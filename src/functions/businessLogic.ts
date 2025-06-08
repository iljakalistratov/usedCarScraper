import { CarAd } from '../models/CarAd';
import { scrapeEbayKl } from '../scraper/ebayKl';
import { sendAds } from '../functions/telegramNotificator'
import { findUserByChatId, CarAdModel } from '../databases/mongodb';
import e from 'express';
import cron from 'node-cron';
import { scrapeWillhaben } from '../scraper/willhaben';



/* export async function mainLogic(){

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

} */

export async function mainLogicSpecificUser(chatID: number){
    
    //get user by chatID from mongodb
    const user = await findUserByChatId(chatID);

    if (!user) {
        console.error(`User with chatID ${chatID} not found.`);     
        return;
    } else {
        console.log(`Found user with chatID ${chatID}:`, user);
    //get cars array (preferneces) from user
    const cars = user?.cars || [];
    const timePeriodInSec = user?.timePeriod || 60;

    // Schedule a cron job based on the user's time period
    const cronExpression = `*/${Math.max(timePeriodInSec / 60, 1)} * * * *`;

    cron.schedule(cronExpression, async () => {
        for (const car of cars) {
            const allNewCarAds = await getAllNewCarAds(car.make, car.model, chatID);
            sendAds(chatID, allNewCarAds);
        }
    });

    console.log(`Cron job scheduled for chatID ${chatID} with interval ${timePeriodInSec} seconds.`);

    }
}

async function getAllNewCarAds(make: string, model: string, chatId: number): Promise<CarAd[]> {

    const scrapedCarAds = await scrapeWillhaben(make, model);
    const scrapedCarAds2 = await scrapeEbayKl(make + ' ' + model);
    const carAds = mapToCarAds(scrapedCarAds);
    const carAds2 = mapToCarAds(scrapedCarAds2);
    const newCarAds2 = await getNewAds(carAds2, chatId);
    const newCarAds = await getNewAds(carAds, chatId);

    // Combine both arrays of new car ads
    const newCarAdsCombined = [...newCarAds, ...newCarAds2];

    return newCarAdsCombined;
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

async function getNewAds(carAds: CarAd[], chatId: number): Promise<CarAd[]> {

    const newCarAds: CarAd[] = [];

    for (const ad of carAds) {
        const existingAd = await CarAdModel.findOne({ link: ad.link });
        if (!existingAd) {
            newCarAds.push(ad);
            await CarAdModel.create({ ...ad, chatId });
        }
    }

    return newCarAds;
}


