import axios from 'axios';
import cheerio from 'cheerio';

export async function scrapeWillhaben(make: string, model: string) {
  const baseUrl = 'https://www.willhaben.at';
  // e.g. https://www.willhaben.at/iad/gebrauchtwagen/auto/mercedes-benz-gebrauchtwagen/c-klasse
  const searchUrl = `${baseUrl}/iad/gebrauchtwagen/auto/${make}-gebrauchtwagen/${model}`;

  try {
    // Use a browser-like User-Agent to avoid being blocked
    const response = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    const $ = cheerio.load(response.data);
    const results: Array<{
      title: string;
      price: string;
      km: string;
      year: string;
      link: string;
      imgSrc: string;
    }> = [];

    // Each car listing is wrapped in an <a> whose data-testid starts with "search-result-entry-header-"
    $('a[data-testid^="search-result-entry-header-"]').each((_, el) => {
      const elem = $(el);

      // 1) TITLE: inside the <h3> tag
      const title = elem.find('h3').text().trim();

      // 2) LINK: href on that <a>; prepend baseUrl
      const href = elem.attr('href') || '';
      const link = baseUrl + href;

      // 3) IMAGE: the very first <img> inside this <a>
      //    (that is the "cover" image for the listing)
      let imgSrc = elem.find('img').first().attr('src') || '';
      imgSrc = imgSrc.replace('_hoved', '');

      // 4) PRICE: the <span> whose data-testid begins with "search-result-entry-price-"
      const price = elem
        .find('span[data-testid^="search-result-entry-price-"]')
        .text()
        .trim();

      // 5) YEAR and KM:
      //    There is a container <div data-testid="search-result-entry-teaser-attributes-<N>-0">
      //    whose child <span class="... wNMfA"> contains the year.
      //    Then <div data-testid="...-1"> → <span class="... wNMfA"> contains km.
      //    We can grab both by selecting every 
      //      'span.Text-sc-10o2fdq-0.wNMfA' under any 
      //      'div[data-testid^="search-result-entry-teaser-attributes-"]'.
      const teaserValues = elem
        .find('div[data-testid^="search-result-entry-teaser-attributes-"] span.Text-sc-10o2fdq-0.wNMfA');
      const year = teaserValues.eq(0).text().trim();
      const km = teaserValues.eq(1).text().trim();

      results.push({ title, price, km, year, link, imgSrc });
    });
    console.log(results);
    return results;
  } catch (err) {
    console.error(err);
    return [];
  }
}