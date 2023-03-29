import * as fs from 'fs';
import * as path from 'path';

export function getMakeByModel(model: string): string | null {
    //import car_databse.csv
    const csvFilePath = path.join(__dirname, '../databases/car_database.csv');
    const fileData = fs.readFileSync(csvFilePath, 'utf8');
    const rows = fileData.trim().split('\n').map(row => row.split(';'));
    const makeIndex = 0;
    const modelIndex = 1;

    for (const row of rows) {
        if (row[modelIndex].toLowerCase().includes(model.toLowerCase())) {
            return row[makeIndex];
        }
    }

    return null;
}