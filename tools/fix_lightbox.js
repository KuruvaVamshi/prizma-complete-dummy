const fs = require('fs');
const path = 'Portfolio-page/index.html';
let html = fs.readFileSync(path, 'utf8');

// Find start and end of the block to replace
const startMarker = '// Image definitions matching the HTML';
const endMarker = '// 4. Parallax';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `// Lightbox state
            let activeLightboxIndex = 0;
            const lightbox = document.getElementById('photoLightbox');
            const lightboxImg = document.getElementById('lightboxImg');
            const lightboxClose = document.getElementById('lightboxClose');
            const lightboxPrev = document.getElementById('lightboxPrev');
            const lightboxNext = document.getElementById('lightboxNext');

            function openLightbox(index) {
                activeLightboxIndex = (index + allRenderImages.length) % allRenderImages.length;
                const filename = allRenderImages[activeLightboxIndex];
                const title = getRenderTitle(filename);

                lightboxImg.src = '../assets/Renders/' + filename;
                document.getElementById('lightboxCaption').textContent = title;

                // Clear meta and counter as per user request
                document.getElementById('lightboxMeta').textContent = '';
                document.getElementById('lightboxCounter').textContent = '';

                // Set initial animated states
                gsap.set(lightbox, { display: "flex", opacity: 0 });
                gsap.set(lightboxImg, { scale: 0.92, opacity: 0 });
                gsap.set('.lightbox-caption-wrapper', { y: 15, opacity: 0 });
                gsap.set([lightboxClose, lightboxPrev, lightboxNext], { opacity: 0, scale: 0.8 });

                // GSAP smooth entrance timeline
                const tl = gsap.timeline();
                tl.to(lightbox, { opacity: 1, duration: 0.4, ease: "power2.out" })
                    .to(lightboxImg, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.2)" }, "-=0.2")
                    .to('.lightbox-caption-wrapper', { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.3")
                    .to([lightboxClose, lightboxPrev, lightboxNext], { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }, "-=0.3");

                // Pause page scrolling
                document.body.style.overflow = "hidden";
            }

            function closeLightbox() {
                const tl = gsap.timeline({
                    onComplete: () => {
                        lightbox.style.display = "none";
                        document.body.style.overflow = "";
                    }
                });
                tl.to([lightboxClose, lightboxPrev, lightboxNext], { opacity: 0, scale: 0.8, duration: 0.25, ease: "power2.in" })
                    .to('.lightbox-caption-wrapper', { y: 15, opacity: 0, duration: 0.25, ease: "power2.in" }, "-=0.2")
                    .to(lightboxImg, { scale: 0.92, opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.25")
                    .to(lightbox, { opacity: 0, duration: 0.35, ease: "power2.inOut" }, "-=0.2");
            }

            function navigateLightbox(dir) {
                const totalImages = allRenderImages.length;
                const nextIndex = (activeLightboxIndex + dir + totalImages) % totalImages;
                const filename = allRenderImages[nextIndex];
                const title = getRenderTitle(filename);

                // Smooth slide-out / fade-out transition based on direction
                const slideDist = 35;
                gsap.to([lightboxImg, '.lightbox-caption-wrapper'], {
                    opacity: 0,
                    x: dir > 0 ? -slideDist : slideDist,
                    duration: 0.25,
                    ease: "power2.in",
                    onComplete: () => {
                        activeLightboxIndex = nextIndex;
                        lightboxImg.src = '../assets/Renders/' + filename;
                        document.getElementById('lightboxCaption').textContent = title;

                        document.getElementById('lightboxMeta').textContent = '';
                        document.getElementById('lightboxCounter').textContent = '';

                        // Set start position of slide-in animation
                        gsap.set([lightboxImg, '.lightbox-caption-wrapper'], {
                            x: dir > 0 ? slideDist : -slideDist
                        });

                        // Animate in
                        gsap.to([lightboxImg, '.lightbox-caption-wrapper'], {
                            opacity: 1,
                            x: 0,
                            duration: 0.45,
                            ease: "power2.out"
                        });
                    }
                });
            }

            // Add click listeners to ring cards to trigger Lightbox or rotate to them
            ringCards.forEach((card, idx) => {
                card.addEventListener('click', (e) => {
                    if (card.classList.contains('middle-card')) {
                        const totalImages = allRenderImages.length;
                        let wrappedActive = ((currentAbsoluteStep % totalCards) + totalCards) % totalCards;
                        let diff = idx - wrappedActive;
                        if (diff < -5) diff += 10;
                        if (diff > 4) diff -= 10;
                        let imageIndex = ((currentAbsoluteStep + diff) % totalImages + totalImages) % totalImages;
                        
                        openLightbox(imageIndex);
                    } else {
                        rotateCarouselToCard(idx);
                    }
                });
            });

            if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
            if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
            if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

            // Close when clicking outside the content image
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            // Keyboard navigation
            window.addEventListener('keydown', (e) => {
                if (lightbox.style.display === "flex") {
                    if (e.key === "Escape") closeLightbox();
                    if (e.key === "ArrowLeft") navigateLightbox(-1);
                    if (e.key === "ArrowRight") navigateLightbox(1);
                }
            });

            `;

    const newHtml = html.substring(0, startIndex) + replacement + html.substring(endIndex);
    fs.writeFileSync(path, newHtml);
    console.log("Lightbox logic replaced successfully!");
} else {
    console.log("Could not find markers!");
}
