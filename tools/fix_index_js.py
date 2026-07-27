import re

file_path = r'c:\Users\91900\Desktop\vamshi\prizma-main\Portfolio-page\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find the video modal setup block and the carouselLoop part, and replace the whole thing in between.
start_marker = r'// Video Modal Setup'
end_marker = r'function carouselLoop\(\)'

match = re.search(f'({start_marker}.*?){end_marker}', content, flags=re.DOTALL)
if not match:
    print('Could not find markers')
else:
    new_middle = '''// Video Modal Setup
            const videoTriggers = document.querySelectorAll('.video-trigger');
            const videoModal = document.getElementById('videoModal');
            const videoModalClose = document.getElementById('videoModalClose');
            const prizmaVideo = document.getElementById('prizmaVideo');

            if (videoModal && prizmaVideo) {
                videoTriggers.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        videoModal.classList.add('active');
                        prizmaVideo.play().catch(err => console.log('Video play error:', err));
                    });
                });

                const closeVideoModal = () => {
                    videoModal.classList.remove('active');
                    prizmaVideo.pause();
                    prizmaVideo.currentTime = 0;
                };

                if (videoModalClose) {
                    videoModalClose.addEventListener('click', closeVideoModal);
                }

                videoModal.addEventListener('click', (e) => {
                    if (e.target === videoModal) closeVideoModal();
                });
            }

            // Ensure hero video plays (safeguard for low power mode on mobile)
            const video = document.querySelector('.hero-video');
            if (video) {
                const startPlay = () => {
                    video.play().catch(() => { });
                };

                if (video.readyState >= 1) {
                    startPlay();
                } else {
                    video.addEventListener('loadedmetadata', startPlay);
                }

                // Autoplay recovery
                video.play().catch(e => {
                    const playOnAction = () => {
                        video.play().catch(() => { });
                        document.removeEventListener('click', playOnAction);
                        document.removeEventListener('touchstart', playOnAction);
                    };
                    document.addEventListener('click', playOnAction);
                    document.addEventListener('touchstart', playOnAction, { passive: true });
                });
            }

            // 2. 3D Rotating Photo Carousel (Section 03.A)
            const photoCarousel = document.getElementById('photoCarousel');
            const photoScene = document.getElementById('photoScene');
            const ringCards = document.querySelectorAll('#photoCarousel .ring-card');
            const ringPrevBtn = document.getElementById('photoPrevBtn');
            const ringNextBtn = document.getElementById('photoNextBtn');

            const totalCards = 10;
            const stepAngle = 360 / totalCards; // 36 degrees

            let carouselState = { angle: 0 };
            let currentActiveIndex = 0;

            function updateMiddleCardClass() {
                ringCards.forEach((card, idx) => {
                    if (idx === currentActiveIndex) {
                        card.classList.add("middle-card");
                    } else {
                        card.classList.remove("middle-card");
                    }
                });
            }

            // Initialize middle card class
            updateMiddleCardClass();

            const renderTitlesMap = {
                "Aerial View of Community Layout.jpg": "Modern Townhomes Community",
                "Luxury Villa Exterior.jpg": "Cozy Cottage with Terracotta Roof",
                "Main Entrance Gateway.jpg": "Scenic Garden Pathway",
                "Sidewalk & Flower Beds with Architectural Arches.jpg": "Modern Streetscape with Arches",
                "Modern Streetscape with Organic Archway.jpg": "Modern Twin Villas Exterior",
                "Masterplan Top View with Floral Canopy.jpg": "Floral Canopy Community Plan",
                "Recreational Park Masterplan.jpg": "Recreational Park Layout",
                "Curved Walkway and Gardens.jpg": "Curved Walkway and Gardens",
                "Water Feature and Archways.jpg": "A-Frame Cabins in Forest",
                "Villa Community Masterplan.jpg": "Grand Resort Swimming Pool",
                "Modern Twin Villas.jpg": "Deer Statue Roundabout",
                "Aerial View of Modern Housing Community.jpg": "Aerial View of Modern Community",
                "View from Inside Car Looking at Villas.jpg": "Car View of Villas",
                "Community Park with Thatched Gazebos.jpg": "Community Park Gazebos",
                "Open Air Amphitheater & Event Space.jpg": "Open Air Amphitheater",
                "Masterplan with Sports Courts & Deer Statue.jpg": "Community Masterplan",
                "Grand Resort Pool with Decorative Bridge.jpg": "Grand Resort Pool with Bridge",
                "Multi-Sports Complex with Basketball & Tennis.jpg": "Multi-Sports Complex",
                "Traditional Style Villa with Sloped Roof.jpg": "Traditional Tiled Roof Villa",
                "Perspective View of Villa.jpg": "High-Rise Apartment Building",
                "Contemporary Two-Story Villa with Balcony.jpg": "Contemporary Two-Story Villa",
                "Exterior View of the Community.jpg": "Modern Apartment Complex",
                "Elegant Banquet Hall Setup with Chandelier.jpg": "Elegant Banquet Hall",
                "Modern Villa Exterior at Twilight.jpg": "Modern Villa Exterior at Twilight"
            };

            const allRenderImages = Object.keys(renderTitlesMap);

            let currentAbsoluteStep = null;

            function updateVirtualCards(absoluteStep) {
                if (absoluteStep === currentAbsoluteStep) return;
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
                    let newTitle = renderTitlesMap[filename] || filename.replace(/\.[^/.]+$/, '').replace(/ \(\d+\)$/, '');

                    if (img && img.getAttribute('src') !== newSrc) {
                        img.src = newSrc;
                        img.alt = newTitle;
                    }
                    if (title && title.innerText !== newTitle) {
                        title.innerText = newTitle;
                    }
                });
            }

            updateVirtualCards(0);


            function carouselLoop()'''

    # Ensure the length offset is correct for exactly `function carouselLoop()`
    end_index = content.find('function carouselLoop()', match.start())
    if end_index == -1:
        print("Couldn't find carouselLoop()")
    else:
        content = content[:match.start()] + new_middle + content[end_index+21:]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Successfully applied fix.')
