document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('lightbox-gallery');
  if (!gallery) return;

  const links = Array.from(gallery.querySelectorAll('.gallery-item'));
  if (links.length === 0) return;

  // Create overlay elements
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
    <img class="lightbox-img" src="" alt="Lightbox Image" />
    <button class="lightbox-next" aria-label="Next">&#10095;</button>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('.lightbox-img');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');

  let currentIndex = 0;

  const showImage = (index) => {
    if (index < 0) index = links.length - 1;
    if (index >= links.length) index = 0;
    currentIndex = index;
    const src = links[currentIndex].getAttribute('href');
    imgEl.src = src;
  };

  const openLightbox = (index) => {
    showImage(index);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  links.forEach((link, idx) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(idx);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
});
