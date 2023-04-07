import { CarAd } from '../models/CarAd';
import { scrapeAutoscout24 } from '../scraper/autoscout24';
import { scrapeEbayKl } from '../scraper/ebayKl';
import { sendAds } from '../functions/telegramNotificator'



export async function mainLogic(){

    const fs = require('fs');
    const path = require('path');
    const preferences = JSON.parse(fs.readFileSync(path.join(__dirname, '../databases/preferences.json')));
    const timePeriod = preferences.time_period_in_sec;

    const scrapedCarAds = await scrapeAutoscout24('toyota', 'celica');
    const scrapedCarAds2 = await scrapeEbayKl('celica')
    const carAds = mapToCarAds(scrapedCarAds);
    const carAds2 = mapToCarAds(scrapedCarAds2);
    const newCarAds = getNewAds(carAds);
    const newCarAds2 = getNewAds(carAds2);
    const allNewCarAds = [...newCarAds, ...newCarAds2];

    sendAds(allNewCarAds);


    setTimeout(mainLogic, timePeriod * 1000);

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

function saveToCsvDatabase(carAds: CarAd[]): void { 
    
        const csv = require('csv-parser');
        const fs = require('fs');
        const results: any[] = [];
        const path = require('path');

        const csvFilePath = path.join(__dirname, '../databases/carAdDatabase.csv');
    
        fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', () => {
            console.log(results);
            const newCarAds = carAds.filter((carAd) => {
                return !results.some((result) => {
                    return result.link === carAd.link;
                });
            });
    
            console.log(newCarAds);
    
            const createCsvWriter = require('csv-writer').createObjectCsvWriter;
            const csvWriter = createCsvWriter({
                path: csvFilePath,
                header: [
                    {id: 'title', title: 'title'},
                    {id: 'price', title: 'price'},
                    {id: 'km', title: 'km'},
                    {id: 'year', title: 'year'},
                    {id: 'link', title: 'link'},
                    {id: 'imgSrc', title: 'imgSrc'},
                ]
            });
    
            csvWriter.writeRecords([...results, ...newCarAds])
            .then(() => console.log('The CSV file was written successfully'));
        });
    

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

function sendNewAds(carAds: CarAd[]): void {
    
    sendAds(carAds);
}

