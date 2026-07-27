const fs = require('fs');
let html = fs.readFileSync('Portfolio-page/index.html', 'utf8');

// 1. Remove the rc-hud-tag elements from the ring-cards
html = html.replace(/<span class="rc-hud-tag">.*?<\/span>\s*/g, '');

// 2. Add the virtualization JS
const jsToInject = `
            const allRenderImages = [
                '10.jpg', '11.jpg', '1_1 - Photo.jpg', '1_13 - Photo.jpg', '1_16 - Photo (1).jpg',
                '1_16 - Photo.jpg', '1_3 - Photo.jpg', '1_4 - Photo.jpg', '1_5 - Photo.jpg', '1_6 - Photo.jpg',
                '1_7 - Photo.jpg', '1_8 - Photo.jpg', '4_11 - Photo.jpg', '4_9 - Photo.jpg', '8_5 - Photo.jpg',
                '8_6 - Photo.jpg', '8_7 - Photo.jpg', '8_8 - Photo.jpg', '8_9 - Photo.jpg', '9.jpg',
                'Cam01_Perspective.jpg', 'exterior.jpg', 'FINAL TEST2.jpg', 'test 1.jpg', 'white test_1 - Photo.jpg'
            ];
            
            let currentAbsoluteStep = null;
            
            function updateVirtualCards(absoluteStep) {
                if(absoluteStep === currentAbsoluteStep) return;
                currentAbsoluteStep = absoluteStep;
                
                const totalImages = allRenderImages.length;
                let wrappedActive = ((absoluteStep % totalCards) + totalCards) % totalCards;
                
                ringCards.forEach((card, domIndex) => {
                    let diff = domIndex - wrappedActive;
                    if (diff < -5) diff += 10;
                    if (diff > 4) diff -= 10;
                    
                    let imageIndex = ((absoluteStep + diff) % totalImages + totalImages) % totalImages;
                    let img = card.querySelector('.rc-image');
                    let title = card.querySelector('.rc-hud-title');
                    
                    let filename = allRenderImages[imageIndex];
                    let newSrc = '../assets/Renders/' + filename;
                    let newTitle = filename.replace(/\\.[^/.]+$/, '');
                    
                    if (img && img.getAttribute('src') !== newSrc) {
                        img.src = newSrc;
                        img.alt = newTitle;
                    }
                    if (title && title.innerText !== newTitle) {
                        title.innerText = newTitle;
                    }
                });
            }
`;

// Insert the JS into the init section
html = html.replace('updateMiddleCardClass();', 'updateMiddleCardClass();\n' + jsToInject + '\n            updateVirtualCards(0);');

const loopJs = `
            function carouselLoop() {
                let absoluteStep = Math.round(-carouselState.angle / stepAngle);
                updateVirtualCards(absoluteStep);
                requestAnimationFrame(carouselLoop);
            }
            carouselLoop();
`;

html = html.replace('// Calculate the closest target angle', loopJs + '\n            // Calculate the closest target angle');

fs.writeFileSync('Portfolio-page/index.html', html);
console.log('HTML updated successfully!');
