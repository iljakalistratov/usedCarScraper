import axios from 'axios';
import cheerio from 'cheerio';

export async function scrapeAutoscout24() {

    const baseUrl = 'https://www.autoscout24.de';
    const searchUrl = baseUrl + `/lst/toyota/celica?atype=C&cy=D&damaged_listing=exclude&desc=1&ocs_listing=include&powertype=kw&search_id=27ose429ogr&sort=age&ustate=N%2CU`;
    try {
        const response = await axios.get(searchUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        let results: any[] = [];

        $('.list-page-item').each((index, element) => {
        // const title = $(element).find('.ListItem_title__znV2I.h2').text().trim();
        const title1 = $(element).find('a.ListItem_title__znV2I h2').text().trim();
        const title2 = " " + $(element).find('span.ListItem_version__jNjur').text().trim();
        const title = title1 + title2;
        const price = $(element).find('.Price_price__WZayw').text().trim();
        const link = $(element).find('ListItem_title__znV2I').attr('href');
        const km = $(element).find('.span.VehicleDetailTable_item__koEV4').eq(0).text();
        const year = $(element).find('.span.VehicleDetailTable_item__koEV4').eq(1).text();
        const imgSrc = $(element).find('.NewGallery_img__bi92g').attr('src');

        // console.log({ title, price, link })
        results.push({title , price, km, year, link, imgSrc });
        });

        console.log(results)
        
        return results;

    } catch (error) {
        console.error(error);
        return [];
    }
}