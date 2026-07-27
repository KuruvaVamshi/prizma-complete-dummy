const fs = require('fs');
const path = 'Portfolio-page/index.html';
let html = fs.readFileSync(path, 'utf8');

const startMarker = '// 3. Render Lightbox Modal Logic';
const endMarker = 'function openLightbox(index)';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `// 3. Render Lightbox Modal Logic
            let activeLightboxIndex = 0;
            const lightbox = document.getElementById('photoLightbox');
            const lightboxImg = document.getElementById('lightboxImg');
            const lightboxCaption = document.getElementById('lightboxCaption');
            const lightboxClose = document.getElementById('lightboxClose');
            const lightboxPrev = document.getElementById('lightboxPrev');
            const lightboxNext = document.getElementById('lightboxNext');

            `;

    const newHtml = html.substring(0, startIndex) + replacement + html.substring(endIndex);
    fs.writeFileSync(path, newHtml);
    console.log("Lightbox duplicate declarations fixed successfully!");
} else {
    console.log("Could not find markers!");
}
