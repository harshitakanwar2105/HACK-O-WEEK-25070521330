// 9 High-Quality Built-In Images Stored Locally (No broken links ever)
const imagesData = [
  {
    title: "Diwali Lights",
    src: "./images/diwali_lights.png"
  },
  {
    title: "Masala Chai",
    src: "./images/masala_chai.png"
  },
  {
    title: "Sunset over Taj Mahal",
    src: "./images/taj_mahal.png"
  },
  {
    title: "Colors of Holi",
    src: "./images/holi_colors.png"
  },
  {
    title: "North Indian Thali",
    src: "./images/indian_thali.png"
  },
  {
    title: "Varanasi Ghats at Night",
    src: "./images/varanasi_ghats.png"
  },
  {
    title: "Lotus Temple",
    src: "./images/lotus_temple.png"
  },
  {
    title: "Mysore Palace",
    src: "./images/mysore_palace.png"
  },
  {
    title: "Gateway of India",
    src: "./images/gateway_of_india.png"
  }
];

let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById('gallery-container');
  
  // Lightbox elements
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCount = document.getElementById('lightbox-count');
  
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  // Render Gallery
  const renderGallery = () => {
    galleryContainer.classList.add('loaded');

    imagesData.forEach((imgData, index) => {
      const item = document.createElement('div');
      item.classList.add('gallery-item');
      
      const img = document.createElement('img');
      img.src = imgData.src; 
      img.alt = imgData.title;
      img.loading = "lazy";
      
      const overlay = document.createElement('div');
      overlay.classList.add('gallery-item-overlay');
      
      const title = document.createElement('h3');
      title.textContent = imgData.title;
      
      overlay.appendChild(title);
      item.appendChild(img);
      item.appendChild(overlay);
      
      galleryContainer.appendChild(item);

      // Add simple slide-up animation effect staggered based on load order
      setTimeout(() => {
        item.classList.add('visible');
      }, index * 100);

      // Lightbox click event
      item.addEventListener('click', () => openLightbox(index));
    });
  };

  renderGallery();

  // Lightbox Functions
  const openLightbox = (index) => {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
  };

  const closeLightbox = () => {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  };

  const updateLightbox = () => {
    const data = imagesData[currentIndex];
    
    // Setting src directly
    lightboxImg.src = data.src;
    lightboxImg.alt = data.title;
    
    lightboxTitle.textContent = data.title;
    lightboxCount.textContent = `${currentIndex + 1} / ${imagesData.length}`;
  };

  const nextImage = () => {
    currentIndex = (currentIndex === imagesData.length - 1) ? 0 : currentIndex + 1;
    updateLightbox();
  };

  const prevImage = () => {
    currentIndex = (currentIndex === 0) ? imagesData.length - 1 : currentIndex - 1;
    updateLightbox();
  };

  // Event Listeners for Lightbox
  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', nextImage);
  prevBtn.addEventListener('click', prevImage);
  
  // Close if clicking outside content
  lightbox.addEventListener('click', (e) => {
    if (e.target.classList.contains('lightbox-overlay') || e.target.classList.contains('lightbox-content-wrapper')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    }
  });
});
