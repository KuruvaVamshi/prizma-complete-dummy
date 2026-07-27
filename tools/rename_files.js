const fs = require('fs');
const path = require('path');
const dir = 'assets/Renders';

const titleMap = {
    '10.jpg': 'Aerial View of Community Layout',
    '11.jpg': 'Luxury Villa Exterior',
    '1_1 - Photo.jpg': 'Main Entrance Gateway',
    '1_13 - Photo.jpg': 'Sidewalk & Flower Beds with Architectural Arches',
    '1_16 - Photo (1).jpg': 'Modern Streetscape with Organic Archway',
    '1_16 - Photo.jpg': 'Modern Streetscape with Organic Archway',
    '1_3 - Photo.jpg': 'Masterplan Top View with Floral Canopy',
    '1_4 - Photo.jpg': 'Recreational Park Masterplan',
    '1_5 - Photo.jpg': 'Curved Walkway and Gardens',
    '1_6 - Photo.jpg': 'Water Feature and Archways',
    '1_7 - Photo.jpg': 'Villa Community Masterplan',
    '1_8 - Photo.jpg': 'Modern Twin Villas',
    '4_11 - Photo.jpg': 'Aerial View of Modern Housing Community',
    '4_9 - Photo.jpg': 'View from Inside Car Looking at Villas',
    '8_5 - Photo.jpg': 'Community Park with Thatched Gazebos',
    '8_6 - Photo.jpg': 'Open Air Amphitheater & Event Space',
    '8_7 - Photo.jpg': 'Masterplan with Sports Courts & Deer Statue',
    '8_8 - Photo.jpg': 'Grand Resort Pool with Decorative Bridge',
    '8_9 - Photo.jpg': 'Multi-Sports Complex with Basketball & Tennis',
    '9.jpg': 'Traditional Style Villa with Sloped Roof',
    'Cam01_Perspective.jpg': 'Perspective View of Villa',
    'FINAL TEST2.jpg': 'Contemporary Two-Story Villa with Balcony',
    'exterior.jpg': 'Exterior View of the Community',
    'test 1.jpg': 'Elegant Banquet Hall Setup with Chandelier',
    'white test_1 - Photo.jpg': 'Modern Villa Exterior at Twilight'
};

const newFiles = [];
for (const [oldName, title] of Object.entries(titleMap)) {
    const oldPath = path.join(dir, oldName);
    if (fs.existsSync(oldPath)) {
        let safeTitle = title.replace(/[<>:"/\\|?*]/g, '');
        let newName = safeTitle + '.jpg';
        let count = 1;
        while (fs.existsSync(path.join(dir, newName)) && oldName !== newName) {
            newName = safeTitle + ' (' + count + ').jpg';
            count++;
        }
        const newPath = path.join(dir, newName);
        if (oldPath !== newPath) {
            fs.renameSync(oldPath, newPath);
        }
        newFiles.push(newName);
    }
}
console.log(JSON.stringify(newFiles));
