const fs = require('fs');
const path = 'Portfolio-page/index.html';
let html = fs.readFileSync(path, 'utf8');

const strToRemove = '          "Modern Streetscape with Organic Archway (1).jpg",\n';
if (html.includes(strToRemove)) {
    html = html.replace(strToRemove, '');
    fs.writeFileSync(path, html);
    console.log("Removed duplicate image using exact spacing!");
} else {
    // Try regex
    const regex = /[ \t]*"Modern Streetscape with Organic Archway \(1\)\.jpg",[ \t]*\n/;
    if (regex.test(html)) {
        html = html.replace(regex, '');
        fs.writeFileSync(path, html);
        console.log("Removed duplicate image using regex!");
    } else {
        console.log("Could not find the duplicate string to remove.");
    }
}
