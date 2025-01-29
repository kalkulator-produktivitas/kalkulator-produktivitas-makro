import { writeFileSync } from 'fs';

function restructureData(originalData) {
    // Create metadata object
    const metadata = {
        provinsi: "DKI Jakarta",
        tahun: [2018, 2019, 2020, 2021, 2022]
    };

    // Create new object with metadata
    const newData = {
        metadata: metadata,
        data: {}
    };

    // Iterate through each region in the data
    Object.keys(originalData).forEach(region => {
        newData.data[region] = {};
        
        // Iterate through each sector in the region
        originalData[region].forEach(sector => {
            const sectorCode = sector["Kode Lapangan Usaha"];
            
            // Create sector object with transformed data
            newData.data[region][sectorCode] = {
                nama: sector["Lapangan Usaha"],
                produktivitas: [
                    sector["Tahun 2018"],
                    sector["Tahun 2019"],
                    sector["Tahun 2020"],
                    sector["Tahun 2021"],
                    sector["Tahun 2022"]
                ],
                growth_produktivitas: [
                    null,
                    sector["Growth Produktivitas TK 2019"],
                    sector["Growth Produktivitas TK 2020"],
                    sector["Growth Produktivitas TK 2021"],
                    sector["Growth Produktivitas TK 2022"]
                ],
                upah: [
                    sector["Upah 2018"],
                    sector["Upah 2019"],
                    sector["Upah 2020"],
                    sector["Upah 2021"],
                    sector["Upah 2022"]
                ],
                jam_kerja: [
                    sector["Jam Kerja 2018"],
                    sector["Jam Kerja 2019"],
                    sector["Jam Kerja 2020"],
                    sector["Jam Kerja 2021"],
                    sector["Jam Kerja 2022"]
                ],
                growth_upah: [
                    null,
                    sector["Gr Upah 2019"],
                    sector["Gr Upah 2020"],
                    sector["Gr Upah 2021"],
                    sector["Gr Upah 2022"]
                ],
                growth_jam_kerja: [
                    null,
                    sector["Gr Jam Kerja 2019"],
                    sector["Gr Jam Kerja 2020"],
                    sector["Gr Jam Kerja 2021"],
                    sector["Gr Jam Kerja 2022"]
                ]
            };
        });
    });

    // Write the restructured data to a new JSON file
    writeFileSync('assets/macro_2_restructured.json', JSON.stringify(newData, null, 2));

    return newData;
}

// Example usage:
// const originalData = require('./assets/macro_2.json');
// const newStructure = restructureData(originalData);

// Import JSON with assertion
import originalData from './macro_2.json' assert { type: "json" };
restructureData(originalData);
