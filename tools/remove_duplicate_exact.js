const fs = require('fs');
const path = 'Portfolio-page/index.html';
let html = fs.readFileSync(path, 'utf8');

const targetStr = `                "Modern Streetscape with Organic Archway.jpg",
                "Modern Streetscape with Organic Archway (1).jpg",
                "Masterplan Top View with Floral Canopy.jpg",`;
                
const replaceStr = `                "Modern Streetscape with Organic Archway.jpg",
                "Masterplan Top View with Floral Canopy.jpg",`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, replaceStr);
    fs.writeFileSync(path, html);
    console.log("Successfully removed duplicate image!");
} else {
    console.log("Could not find the target string.");
}
