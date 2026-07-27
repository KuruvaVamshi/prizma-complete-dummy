const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/91900/Desktop/vamshi/prizma-main/assets/Renders';
const htmlFile = 'c:/Users/91900/Desktop/vamshi/prizma-main/Portfolio-page/index.html';

const renames = {
    "Aerial View of Community Layout.jpg": "Traditional Villa with Terracotta Roof.jpg",
    "Aerial View of Modern Housing Community.jpg": "Modern Walkway with Bamboo.jpg",
    "Community Park with Thatched Gazebos.jpg": "Top Down Road with Flower Arches.jpg",
    "Contemporary Two-Story Villa with Balcony.jpg": "Community Masterplan with Sports Courts.jpg",
    "Curved Walkway and Gardens.jpg": "Waterway with Floral Arches.jpg",
    "Elegant Banquet Hall Setup with Chandelier.jpg": "Circular Banquet Hall with Golden Deer.jpg",
    "Exterior View of the Community.jpg": "Modern Two-Story Villa with Red Car.jpg",
    "Grand Resort Pool with Decorative Bridge.jpg": "Multi-Sports Complex.jpg",
    "Open Air Amphitheater & Event Space.jpg": "Amphitheater with Large Screen.jpg",
    "Perspective View of Villa.jpg": "High Rise Apartment Building.jpg",
    "Recreational Park Masterplan.jpg": "Rooftop Terrace with Pool.jpg",
    "Sidewalk & Flower Beds with Architectural Arches.jpg": "Streetscape with Organic Archway.jpg",
    "Traditional Style Villa with Sloped Roof.jpg": "Single Story Traditional House.jpg",
    "View from Inside Car Looking at Villas.jpg": "View from Inside Car.jpg",
    "Villa Community Masterplan.jpg": "Grand Resort Pool.jpg",
    "Water Feature and Archways.jpg": "A-Frame Glamping Cabins.jpg",
    "Luxury Villa Exterior.jpg": "Villa with Outdoor Seating Pergola.jpg",
    "Main Entrance Gateway.jpg": "Paved Walkway with Potted Lavender.jpg",
    "Masterplan Top View with Floral Canopy.jpg": "Entrance Gate Top View.jpg",
    "Masterplan with Sports Courts & Deer Statue.jpg": "Masterplan Overview.jpg",
    "Modern Streetscape with Organic Archway.jpg": "Water Road with Archway.jpg",
    "Modern Twin Villas.jpg": "Circular Building with Central Pond.jpg",
    "Modern Villa Exterior at Twilight.jpg": "Modern Villa at Twilight.jpg",
    "Multi-Sports Complex with Basketball & Tennis.jpg": "Sports Courts and Gazebos.jpg"
};

// 1. Rename files
for (const [oldName, newName] of Object.entries(renames)) {
    const oldPath = path.join(dir, oldName);
    const newPath = path.join(dir, newName);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed ${oldName} to ${newName}`);
    } else {
        console.log(`Not found: ${oldName}`);
    }
}

// 2. Update HTML
let html = fs.readFileSync(htmlFile, 'utf8');

for (const [oldName, newName] of Object.entries(renames)) {
    // replace in src
    html = html.split(`../assets/Renders/${oldName}`).join(`../assets/Renders/${newName}`);
    
    html = html.split(`"${oldName}"`).join(`"${newName}"`);
    
    const titleWithoutExt = newName.replace('.jpg', '');
    const titleRegex = new RegExp(`"${newName}":\\s*"[^"]*"`, 'g');
    html = html.replace(titleRegex, `"${newName}": "${titleWithoutExt}"`);
}

for (const [oldName, newName] of Object.entries(renames)) {
    const newTitle = newName.replace('.jpg', '');
    const imgRegex = new RegExp(`(<img\\s+src="\\.\\.\\/assets\\/Renders\\/${newName.replace(/\\./g, '\\.')}"\\s+alt=")([^"]*)(")`, 'g');
    
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
        const oldTitle = match[2];
        html = html.replace(match[0], `${match[1]}${newTitle}${match[3]}`);
        
        html = html.replace(new RegExp(`<h4 class="rc-hud-title">${oldTitle}</h4>`, 'g'), `<h4 class="rc-hud-title">${newTitle}</h4>`);
    }
}

fs.writeFileSync(htmlFile, html);
console.log('HTML updated.');
