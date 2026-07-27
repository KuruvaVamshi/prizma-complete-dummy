const fs = require('fs');
const path = 'Portfolio-page/index.html';
let html = fs.readFileSync(path, 'utf8');

const lines = html.split('\n');
const newLines = lines.filter(line => !line.includes('Modern Streetscape with Organic Archway (1).jpg'));

if (lines.length !== newLines.length) {
    fs.writeFileSync(path, newLines.join('\n'));
    console.log("Successfully removed duplicate image using filter!");
} else {
    console.log("Could not find the target string to filter.");
}
