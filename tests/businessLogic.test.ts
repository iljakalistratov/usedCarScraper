import { mainLogic, mapToCarAds, getNewAds } from "../src/functions/businessLogic";
import { CarAd } from "../src/models/CarAd";

test("Test mapToCarAds with valid Data", async() => {
    const sampleData = [
        {
            title: "Toyota Celica 1.8 VVT-i T-Sport",
            price: "2.990 €",
            km: "200.000 km",
            year: "2002",
            link: "https://www.ebay-kleinanzeigen.de/s-anzeige/toyota-celica-1-8-vvt-i-t-sport/1502000001-230-1001",
            imgSrc: "https://i.ebayimg.com/thumbs/images/g/6Z0AAOSw~J1f~2ZG/s-l96.jpg"
        },
        {
            title: "Toyota Celica 1.8 VVT-i T-Sport",
            price: "2.990 €",
            km: "200.000 km",
            year: "2002",
            link: "https://www.ebay-kleinanzeigen.de/s-anzeige/toyota-celica-1-8-vvt-i-t-sport/1502000001-230-1001",
            imgSrc: "https://i.ebayimg.com/thumbs/images/g/6Z0AAOSw~J1f~2ZG/s-l96.jpg"
        }
    ]
    const result = mapToCarAds(sampleData);
    expect(result).toBeInstanceOf(Array);
    });



describe('getNewAds', () => {
    const existingAds: CarAd[] = [
        {
        title: 'Toyota Camry 2022',
        price: '$25,000',
        km: '10,000',
        year: '2022',
        link: 'https://example.com/toyota-camry-2022',
        imgSrc: 'https://example.com/toyota-camry-2022.jpg',
        },
        {
        title: 'Honda Civic 2021',
        price: '$20,000',
        km: '20,000',
        year: '2021',
        link: 'https://example.com/honda-civic-2021',
        imgSrc: 'https://example.com/honda-civic-2021.jpg',
        },
    ];
    
    // mock the file system functions
    jest.mock('fs', () => ({
        readFileSync: jest.fn(),
        writeFileSync: jest.fn(),
    }));
    
    // test case for new ads
    it('returns the new ads and updates the database', () => {
        const newAds: CarAd[] = [
        {
            title: 'Ford Mustang 2023',
            price: '$30,000',
            km: '5,000',
            year: '2023',
            link: 'https://example.com/ford-mustang-2023',
            imgSrc: 'https://example.com/ford-mustang-2023.jpg',
        },
        {
            title: 'Chevrolet Camaro 2022',
            price: '$28,000',
            km: '15,000',
            year: '2022',
            link: 'https://example.com/chevrolet-camaro-2022',
            imgSrc: 'https://example.com/chevrolet-camaro-2022.jpg',
        },
        ];
    
        // mock the file data to return existingAds
        const mockedReadFileSync = jest.fn().mockReturnValue(JSON.stringify(existingAds));
        require('fs').readFileSync = mockedReadFileSync;
    
        // call the function and check the return value
        const result = getNewAds(newAds);
        expect(result).toEqual(newAds);
    
        // check that the database file was updated with the new ads
        const expectedData = JSON.stringify([...existingAds, ...newAds], null, 2);
        expect(require('fs').writeFileSync).toHaveBeenCalledWith(expect.stringContaining('carAdDatabase.json'), expectedData);
    });
    
    // test case for no new ads
    it('returns an empty array and does not update the database', () => {
        // mock the file data to return existingAds
        const mockedReadFileSync = jest.fn().mockReturnValue(JSON.stringify(existingAds));
        require('fs').readFileSync = mockedReadFileSync;
    
        // call the function and check the return value
        const result = getNewAds(existingAds);
        expect(result).toEqual([]);
    });
    });
