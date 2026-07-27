const fs = require('fs');
let html = fs.readFileSync('Portfolio-page/index.html', 'utf8');

const titleLogic = `
                    const titleMap = {
                        '1_1 - Photo.jpg': 'Scenic Walkway & Tropical Villas',
                        '1_5 - Photo.jpg': 'Golden Deer Statue & Modern Pavilion',
                        '1_4 - Photo.jpg': 'Rooftop Pool & Lounge Deck',
                        'exterior.jpg': 'Modern Residential Apartment Complex',
                        '1_6 - Photo.jpg': 'A-Frame Cabins & Fire Pit Lawn',
                        '1_7 - Photo.jpg': 'Luxury Resort Swimming Pool Oasis',
                        '1_8 - Photo.jpg': 'Circular Courtyard Garden & Green Roof',
                        'Cam01_Perspective.jpg': 'High-Rise Tower Perspective',
                        '10.jpg': 'Forest Village Aerial Masterplan',
                        '11.jpg': 'Private Villa & Backyard Pergola'
                    };
                    
                    let newTitle = titleMap[filename];
                    if (!newTitle) {
                        newTitle = filename.replace(/\\.[^/.]+$/, '').replace(/[-_]/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
                    }
`;

html = html.replace(/let newTitle = filename\.replace[^;]+;/, titleLogic);
fs.writeFileSync('Portfolio-page/index.html', html);
console.log('Titles updated!');
