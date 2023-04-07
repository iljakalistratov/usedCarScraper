import { scrapeEbayKl } from "../src/scraper/ebayKl";

test("Test scrapeEbayKl with valid Data", async() => {
        
    const result = await scrapeEbayKl("celica");
    expect(result.length).toBeGreaterThan(0);
});

test("Test scrapeEbayKl with invalid Data", async() => {
        
    const result = await scrapeEbayKl("x_X_X_245_wdq");
    expect(result.length).toBe(0);
});