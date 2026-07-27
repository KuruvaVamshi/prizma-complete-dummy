const fs = require('fs');

const htmlPath = 'Portfolio-page/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// The new files array based on previous execution
const newFiles = [
    "Aerial View of Community Layout.jpg",
    "Luxury Villa Exterior.jpg",
    "Main Entrance Gateway.jpg",
    "Sidewalk & Flower Beds with Architectural Arches.jpg",
    "Modern Streetscape with Organic Archway.jpg",
    "Modern Streetscape with Organic Archway (1).jpg",
    "Masterplan Top View with Floral Canopy.jpg",
    "Recreational Park Masterplan.jpg",
    "Curved Walkway and Gardens.jpg",
    "Water Feature and Archways.jpg",
    "Villa Community Masterplan.jpg",
    "Modern Twin Villas.jpg",
    "Aerial View of Modern Housing Community.jpg",
    "View from Inside Car Looking at Villas.jpg",
    "Community Park with Thatched Gazebos.jpg",
    "Open Air Amphitheater & Event Space.jpg",
    "Masterplan with Sports Courts & Deer Statue.jpg",
    "Grand Resort Pool with Decorative Bridge.jpg",
    "Multi-Sports Complex with Basketball & Tennis.jpg",
    "Traditional Style Villa with Sloped Roof.jpg",
    "Perspective View of Villa.jpg",
    "Contemporary Two-Story Villa with Balcony.jpg",
    "Exterior View of the Community.jpg",
    "Elegant Banquet Hall Setup with Chandelier.jpg",
    "Modern Villa Exterior at Twilight.jpg"
];

// Replace allRenderImages array in JS
const arrayRegex = /const allRenderImages = \[[\s\S]*?\];/;
html = html.replace(arrayRegex, 'const allRenderImages = ' + JSON.stringify(newFiles, null, 16).replace(/\]/g, '            ]') + ';');

// Replace titleMap logic
const titleMapRegex = /const titleMap = \{[\s\S]*?\};\s*let newTitle = titleMap\[filename\];\s*if \(\!newTitle\) \{\s*newTitle = filename\.replace\(.*?\}\s*/;
const replacementJS = `let newTitle = filename.replace(/\\.[^/.]+$/, '').replace(/ \\(\\d+\\)$/, '');\n                    `;
html = html.replace(titleMapRegex, replacementJS);

// Optional: fix up the initial hardcoded images in HTML so they don't 404
const oldToNew = {
    '1_1 - Photo.jpg': 'Main Entrance Gateway.jpg',
    '1_5 - Photo.jpg': 'Curved Walkway and Gardens.jpg',
    '1_4 - Photo.jpg': 'Recreational Park Masterplan.jpg',
    'exterior.jpg': 'Exterior View of the Community.jpg',
    '1_6 - Photo.jpg': 'Water Feature and Archways.jpg',
    '1_7 - Photo.jpg': 'Villa Community Masterplan.jpg',
    '1_8 - Photo.jpg': 'Modern Twin Villas.jpg',
    'Cam01_Perspective.jpg': 'Perspective View of Villa.jpg',
    '10.jpg': 'Aerial View of Community Layout.jpg',
    '11.jpg': 'Luxury Villa Exterior.jpg'
};
for (const [oldName, newName] of Object.entries(oldToNew)) {
    html = html.replace(new RegExp(`src="../assets/Renders/${oldName.replace(/\\./g, '\\\\.')}"`, 'g'), `src="../assets/Renders/${newName}"`);
}

fs.writeFileSync(htmlPath, html);
console.log("Updated index.html");
