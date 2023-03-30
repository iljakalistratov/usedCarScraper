import { CarAd } from '../models/CarAd';
import { scrapeAutoscout24 } from '../scraper/autoscout24';
import { scrapeEbayKl } from '../scraper/ebayKl';

export async function mainLogic(){
    const scrapedCarAds = await scrapeAutoscout24('toyota', 'celica');
    const scrapedCarAds2 = await scrapeEbayKl('celica')
    const carAds = mapToCarAds(scrapedCarAds);
    const carAds2 = mapToCarAds(scrapedCarAds2);
    saveToCsvDatabase(carAds);
    saveToCsvDatabase(carAds2);
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