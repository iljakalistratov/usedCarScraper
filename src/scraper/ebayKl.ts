import axios from 'axios';
import cheerio from 'cheerio';

export default scrapeEbayKl;

async function scrapeEbayKl(keyword: string) {
    const baseUrl = 'https://www.ebay-kleinanzeigen.de';
//   const searchUrl = `${baseUrl}/s-suchanfrage.html?keywords=${encodeURIComponent(keyword)}&categoryId=${encodeURIComponent(category)}`;
    const searchUrl = baseUrl + '/s-autos/' + keyword +'/k0c216';

  try {
    const response = await axios.get(searchUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    const results: any[] = [];

    $('.aditem').each((index, element) => {
      const title = $(element).find('.ellipsis').text().trim();
      const price = $(element).find('.aditem-main--middle--price-shipping--price').text().trim();
      const link = `${baseUrl}${$(element).find('.ellipsis a').attr('href')}`;

      results.push({ title, price, link });
    });

    return results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

