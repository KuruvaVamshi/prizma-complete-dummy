const fs = require('fs');
const path = require('path');
const { exportImages } = require('pdf-export-images');

const directoryPath = __dirname;
const thumbDir = path.join(directoryPath, 'thumbnails');

if (!fs.existsSync(thumbDir)) {
    fs.mkdirSync(thumbDir);
}

async function extractFirstImage() {
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
        if (file.toLowerCase().endsWith('.pdf')) {
            const pdfPath = path.join(directoryPath, file);
            console.log(`Processing: ${file}`);
            try {
                const images = await exportImages(pdfPath, thumbDir);
                if (images && images.length > 0) {
                    // Just rename the first image to match the PDF name
                    const firstImage = images[0];
                    const firstImagePath = path.join(thumbDir, firstImage.name);
                    const newImagePath = path.join(thumbDir, file.replace(/\.pdf\.pdf$/i, '.jpg').replace(/\.pdf$/i, '.jpg'));
                    
                    // Cleanup other extracted images
                    for (let i = 0; i < images.length; i++) {
                        const imgPath = path.join(thumbDir, images[i].name);
                        if (i === 0) {
                            if (fs.existsSync(imgPath)) {
                                fs.renameSync(imgPath, newImagePath);
                                console.log(`Saved thumbnail for ${file}`);
                            }
                        } else {
                            if (fs.existsSync(imgPath)) {
                                fs.unlinkSync(imgPath);
                            }
                        }
                    }
                } else {
                    console.log(`No images found in ${file}`);
                }
            } catch (err) {
                console.error(`Error processing ${file}: ${err.message}`);
            }
        }
    }
}

extractFirstImage().then(() => console.log('Done!'));
