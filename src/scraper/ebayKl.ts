import axios from 'axios';
import cheerio from 'cheerio';

export async function scrapeEbayKl(keyword: string) {
    const baseUrl = 'https://www.ebay-kleinanzeigen.de';
//   const searchUrl = `${baseUrl}/s-suchanfrage.html?keywords=${encodeURIComponent(keyword)}&categoryId=${encodeURIComponent(category)}`;
    // const searchUrl = baseUrl + '/s-autos/' + keyword +'/k0c216';
    const searchUrl = baseUrl + '/s-autos/c216?keywords=' + keyword;

  try {
    const response = await axios.get(searchUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    let results: any[] = [];

    $('.aditem').each((index, element) => {
      const title = $(element).find('.ellipsis').text().trim();
      const price = $(element).find('.aditem-main--middle--price-shipping--price').text().trim();
      const link = `${baseUrl}${$(element).find('a.ellipsis').attr('href')}`;
      const km = $(element).find('span.simpletag').eq(0).text();
      const year = $(element).find('span.simpletag').eq(1).text();
      const imgSrc = $(element).find('.imagebox').attr('data-imgsrc')?.replace(/\$_2/, '$_3');

      // console.log({ title, price, link })
      results.push({ title, price, km, year, link, imgSrc });
    });
    
    return results;

  } catch (error) {
    console.error(error);
    return [];
  }
}

