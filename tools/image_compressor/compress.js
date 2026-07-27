const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../../assets/Renders');
const outputDir = path.join(__dirname, '../../assets/Renders/compressed');

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

async function compressImages() {
    const files = fs.readdirSync(inputDir);
    for (const file of files) {
        if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.png')) {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, file);
            console.log(`Compressing ${file}...`);
            
            try {
                let info = await sharp(inputPath)
                    .resize({ width: 2560, withoutEnlargement: true }) // resize to a sensible max width for 4k/2k
                    .jpeg({ quality: 75, progressive: true, mozjpeg: true })
                    .toFile(outputPath);
                    
                console.log(`Done ${file}: ${(info.size / 1024 / 1024).toFixed(2)} MB`);
            } catch (err) {
                console.error(`Error compressing ${file}:`, err);
            }
        }
    }
}

compressImages().then(() => console.log('Compression complete.'));
